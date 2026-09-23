"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircleQuestion } from "lucide-react";
import { buildAnchor, reanchor, renderHighlightOverlay, clearHighlightOverlay } from "@/lib/annotation/anchor";
import { useToast } from "@/components/ui/Toast";

export interface SelectionPopupProps {
  articleId: string;
}

interface StoredHighlight {
  id: string;
  quote: string;
  prefixContext: string;
  suffixContext: string;
  startOffset: number;
  endOffset: number;
  orphaned: boolean;
}

interface ButtonPosition {
  top: number;
  left: number;
}

/**
 * Mounted once inside the article page alongside <ArticleBody>. Two jobs:
 *
 * 1. On mount: load this article's persisted highlights (GET
 *    /api/highlights) and re-anchor + visually render each one against the
 *    freshly-rendered DOM (per ticket 7's spec — no dedicated sidebar list
 *    yet, that's ticket 8; this just needs highlights to persist and
 *    re-render on page load).
 * 2. On text selection inside `.article-body`: show a floating "Frage
 *    stellen" button above the selection. Clicking it persists a Highlight,
 *    marks it in the DOM, and opens FloatingDock in highlight mode via the
 *    same `keystone:open-dock` CustomEvent the CommandPalette already uses
 *    (see components/palette/CommandPalette.tsx) — extended here with a
 *    `detail` payload FloatingDock reads to switch into `mode: 'highlight'`.
 *
 * Also wires a small hover "×" control onto rendered highlight marks so
 * highlights can be removed via the undo-toast pattern (no confirm dialog).
 */
export function SelectionPopup({ articleId }: SelectionPopupProps) {
  const [buttonPos, setButtonPos] = useState<ButtonPosition | null>(null);
  const pendingRangeRef = useRef<Range | null>(null);
  const highlightsRef = useRef<Map<string, StoredHighlight>>(new Map());
  const { show: showToast } = useToast();

  const getArticleEl = useCallback((): HTMLElement | null => {
    return document.querySelector<HTMLElement>(".article-body");
  }, []);

  // deleteHighlight and attachRemoveHandler are mutually referential (the
  // mark's onclick calls deleteHighlight; deleteHighlight's undo path
  // re-attaches the handler to the restored mark). A ref breaks the cycle
  // without either callback needing the other in its dependency array.
  const deleteHighlightRef = useRef<(id: string) => void>(() => {});

  const attachRemoveHandler = useCallback((articleEl: HTMLElement, highlightId: string) => {
    const marks = articleEl.querySelectorAll<HTMLElement>(`[data-highlight-id="${highlightId}"]`);
    marks.forEach((mark) => {
      mark.title = "Klicken zum Entfernen der Markierung";
      mark.onclick = (e) => {
        e.stopPropagation();
        deleteHighlightRef.current(highlightId);
      };
    });
  }, []);

  const deleteHighlight = useCallback(
    async (id: string) => {
      const stored = highlightsRef.current.get(id);
      const articleEl = getArticleEl();
      if (articleEl) clearHighlightOverlay(articleEl, id);
      highlightsRef.current.delete(id);

      await fetch(`/api/highlights?id=${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});

      if (stored) {
        showToast({
          message: "Markierung entfernt.",
          onUndo: async () => {
            const res = await fetch("/api/highlights", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                articleId,
                quote: stored.quote,
                prefixContext: stored.prefixContext,
                suffixContext: stored.suffixContext,
                startOffset: stored.startOffset,
                endOffset: stored.endOffset,
              }),
            });
            if (!res.ok) return;
            const data = await res.json();
            const restored: StoredHighlight = { ...stored, id: data.highlight.id };
            highlightsRef.current.set(restored.id, restored);
            const el = getArticleEl();
            if (el) {
              renderHighlightOverlay(el, restored, restored.id);
              attachRemoveHandler(el, restored.id);
            }
          },
        });
      }
    },
    [articleId, getArticleEl, showToast, attachRemoveHandler],
  );

  useEffect(() => {
    deleteHighlightRef.current = deleteHighlight;
  }, [deleteHighlight]);

  // Load + reanchor persisted highlights on mount.
  useEffect(() => {
    let cancelled = false;

    async function loadHighlights() {
      const articleEl = getArticleEl();
      if (!articleEl) return;

      const res = await fetch(`/api/highlights?articleId=${encodeURIComponent(articleId)}`);
      if (!res.ok || cancelled) return;
      const data: { highlights: StoredHighlight[] } = await res.json();

      for (const h of data.highlights) {
        if (cancelled) return;
        const resolved = reanchor(articleEl, h);
        const nowOrphaned = resolved === null;

        if (nowOrphaned !== h.orphaned) {
          // Simple re-check-and-update-if-changed, per the ticket spec.
          fetch("/api/highlights", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: h.id,
              orphaned: nowOrphaned,
              ...(resolved ? { startOffset: resolved.startOffset, endOffset: resolved.endOffset } : {}),
            }),
          }).catch(() => {});
        }

        if (resolved) {
          const stored: StoredHighlight = { ...h, ...resolved, orphaned: false };
          highlightsRef.current.set(h.id, stored);
          renderHighlightOverlay(articleEl, resolved, h.id);
          attachRemoveHandler(articleEl, h.id);
        } else {
          highlightsRef.current.set(h.id, { ...h, orphaned: true });
        }
      }
    }

    loadHighlights();
    return () => {
      cancelled = true;
    };
  }, [articleId, getArticleEl, attachRemoveHandler]);

  // Text-selection watcher.
  useEffect(() => {
    function handleSelectionChange() {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setButtonPos(null);
        pendingRangeRef.current = null;
        return;
      }

      const text = selection.toString().trim();
      if (!text) {
        setButtonPos(null);
        pendingRangeRef.current = null;
        return;
      }

      const range = selection.getRangeAt(0);
      const articleEl = getArticleEl();
      if (!articleEl || !articleEl.contains(range.commonAncestorContainer)) {
        setButtonPos(null);
        pendingRangeRef.current = null;
        return;
      }

      pendingRangeRef.current = range.cloneRange();
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) {
        setButtonPos(null);
        return;
      }
      setButtonPos({
        top: rect.top - 44,
        left: rect.left + rect.width / 2,
      });
    }

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [getArticleEl]);

  const handleAskClick = useCallback(async () => {
    const range = pendingRangeRef.current;
    const articleEl = getArticleEl();
    if (!range || !articleEl) return;

    const anchor = buildAnchor(articleEl, range);
    setButtonPos(null);
    window.getSelection()?.removeAllRanges();
    if (!anchor) return;

    // Persist immediately (optimistic — before any LLM call), per the plan.
    const res = await fetch("/api/highlights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId, ...anchor }),
    });
    if (!res.ok) return;
    const data: { highlight: { id: string } } = await res.json();
    const highlightId = data.highlight.id;

    const stored: StoredHighlight = { id: highlightId, orphaned: false, ...anchor };
    highlightsRef.current.set(highlightId, stored);
    renderHighlightOverlay(articleEl, anchor, highlightId);
    attachRemoveHandler(articleEl, highlightId);

    // Opens FloatingDock in highlight mode — same event CommandPalette uses
    // to open the dock, extended with a `detail` payload FloatingDock reads.
    window.dispatchEvent(
      new CustomEvent("keystone:open-dock", {
        detail: {
          mode: "highlight",
          articleId,
          highlightId,
          highlightQuote: anchor.quote,
        },
      }),
    );
  }, [articleId, getArticleEl, attachRemoveHandler]);

  if (!buttonPos) return null;

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // don't steal focus / collapse the selection
      onClick={handleAskClick}
      style={{ position: "fixed", top: buttonPos.top, left: buttonPos.left, transform: "translateX(-50%)" }}
      className="glass-card z-30 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-foreground shadow-lg hover:opacity-90"
    >
      <MessageCircleQuestion size={13} className="text-accent" />
      Frage stellen
    </button>
  );
}
