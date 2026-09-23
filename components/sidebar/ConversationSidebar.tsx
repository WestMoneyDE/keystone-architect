"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Pin,
  PinOff,
  Trash2,
  ChevronDown,
  ChevronUp,
  MessagesSquare,
  Link2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { computeRelevanceScore } from "@/lib/relevance";
import { SummaryEntry } from "@/components/sidebar/SummaryEntry";

export interface ConversationSidebarProps {
  articleId: string;
}

interface ApiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ApiHighlight {
  id: string;
  quote: string;
  note: string | null;
  orphaned: boolean;
  startOffset: number;
  endOffset: number;
}

interface ApiConversation {
  id: string;
  type: "chat" | "summary";
  title: string | null;
  isPinned: boolean;
  provider: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessageAt: string;
  messages: ApiMessage[];
  highlight: ApiHighlight | null;
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - then);
  const minutes = Math.round(diffMs / 60000);
  if (minutes < 1) return "gerade eben";
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.round(hours / 24);
  if (days < 7) return `vor ${days} Tag${days === 1 ? "" : "en"}`;
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}

function deriveEntryTitle(c: ApiConversation): string {
  if (c.title && c.title.trim().length > 0) return c.title;
  if (c.highlight) {
    const excerpt = c.highlight.quote.length > 48 ? `${c.highlight.quote.slice(0, 48)}…` : c.highlight.quote;
    return `Zu: "${excerpt}"`;
  }
  return "Gespräch";
}

/** Short excerpt of a plain (non-highlight) conversation's first user message, for the expanded view. */
function deriveExcerpt(c: ApiConversation): string {
  const firstUser = c.messages.find((m) => m.role === "user");
  const text = firstUser?.content ?? c.messages[0]?.content ?? "";
  return text.length > 400 ? `${text.slice(0, 400)}…` : text;
}

/**
 * Dispatches the same `keystone:open-dock` CustomEvent FloatingDock has
 * listened for since ticket 7/8's "reopen" wiring, forcing the LARGE size
 * variant (ticket 8's revised item 2 — opening from the sidebar/link button
 * should visibly grow the panel, not stay at the small quick-ask size).
 */
function openInLargeDock(articleId: string, c: ApiConversation) {
  window.dispatchEvent(
    new CustomEvent("keystone:open-dock", {
      detail: {
        mode: "reopen",
        size: "large",
        conversationId: c.id,
        articleId,
        messages: c.messages,
        ...(c.highlight
          ? { highlightId: c.highlight.id, highlightQuote: c.highlight.note || c.highlight.quote }
          : {}),
      },
    }),
  );
}

interface ConversationEntryProps {
  articleId: string;
  conversation: ApiConversation;
  expanded: boolean;
  onToggleExpand: () => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onSaved: (patch: Partial<ApiConversation> & { highlightNote?: string | null }) => void;
}

/**
 * A single Notion-style toggle block: collapsed by default (icon + title +
 * timestamp + pin), click anywhere on the row (except the pin/delete icon
 * buttons) expands it inline — a genuine Framer Motion height animation, not
 * a popup/navigation — revealing the full note/quote text, directly
 * editable, auto-saved on blur. The link/chain button (top-right of the
 * expanded body) opens the FloatingDock in its large size variant, injecting
 * this entry's context.
 */
function ConversationEntry({
  articleId,
  conversation: c,
  expanded,
  onToggleExpand,
  onTogglePin,
  onDelete,
  onSaved,
}: ConversationEntryProps) {
  const isHighlight = Boolean(c.highlight);
  const initialEditValue = isHighlight ? (c.highlight!.note ?? c.highlight!.quote) : (c.title ?? deriveEntryTitle(c));
  const [editValue, setEditValue] = useState(initialEditValue);
  const [saving, setSaving] = useState(false);

  // Re-sync the local edit buffer right before expanding (not in an effect —
  // this is a direct response to the user's click, not a reaction to
  // external state), so a stale buffer never shows if the underlying data
  // changed while this entry was collapsed (e.g. a reload after undo).
  const handleToggleExpand = useCallback(() => {
    if (!expanded) setEditValue(initialEditValue);
    onToggleExpand();
  }, [expanded, initialEditValue, onToggleExpand]);

  const save = useCallback(async () => {
    const trimmed = editValue.trim();
    if (trimmed === initialEditValue.trim()) return; // unchanged — skip the round-trip
    setSaving(true);
    try {
      if (isHighlight) {
        const res = await fetch("/api/conversations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: c.id, note: trimmed }),
        });
        if (res.ok) onSaved({ highlightNote: trimmed });
      } else {
        const res = await fetch("/api/conversations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: c.id, title: trimmed || undefined }),
        });
        if (res.ok) onSaved({ title: trimmed });
      }
    } finally {
      setSaving(false);
    }
  }, [c.id, editValue, initialEditValue, isHighlight, onSaved]);

  const handleLink = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!expanded) handleToggleExpand(); // expand first so the user sees what's being carried over
      openInLargeDock(articleId, c);
    },
    [articleId, c, expanded, handleToggleExpand],
  );

  return (
    <li className="overflow-hidden rounded-xl border border-border bg-surface">
      <button
        type="button"
        onClick={handleToggleExpand}
        aria-expanded={expanded}
        className="group flex w-full flex-col gap-1 px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent/5"
      >
        <div className="flex items-start justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 text-foreground">
            <MessageCircle size={14} className="shrink-0 text-accent" />
            <span className="truncate font-medium">{deriveEntryTitle(c)}</span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            <span
              role="button"
              tabIndex={0}
              onClick={onTogglePin}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onTogglePin(e as unknown as React.MouseEvent);
              }}
              aria-label={c.isPinned ? "Lösen" : "Anheften"}
              className={`flex h-6 w-6 items-center justify-center rounded-lg ${
                c.isPinned ? "text-accent" : "text-muted-foreground opacity-0 group-hover:opacity-100"
              } hover:bg-background`}
            >
              {c.isPinned ? <Pin size={13} /> : <PinOff size={13} />}
            </span>
            <span
              role="button"
              tabIndex={0}
              onClick={onDelete}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onDelete(e as unknown as React.MouseEvent);
              }}
              aria-label="Löschen"
              className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground opacity-0 hover:bg-background hover:text-danger group-hover:opacity-100"
            >
              <Trash2 size={13} />
            </span>
            <span className="flex h-6 w-6 items-center justify-center text-muted-foreground">
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatRelativeTime(c.lastMessageAt)}</span>
          <span>·</span>
          <span>{c.messageCount} Nachrichten</span>
          {c.highlight?.orphaned && (
            <>
              <span>·</span>
              <span className="text-warning">verwaiste Markierung</span>
            </>
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border"
          >
            <div className="flex flex-col gap-2 px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {isHighlight ? "Notiz zur Markierung" : "Titel"}
                </span>
                <button
                  type="button"
                  onClick={handleLink}
                  aria-label="Im Chat öffnen"
                  title="Im Chat öffnen"
                  className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-background hover:text-accent"
                >
                  <Link2 size={13} />
                </button>
              </div>

              {isHighlight && (
                <p className="line-clamp-2 border-l-2 border-accent/40 pl-2 text-xs italic text-muted-foreground">
                  &ldquo;{c.highlight!.quote}&rdquo;
                </p>
              )}

              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={save}
                onClick={(e) => e.stopPropagation()}
                rows={isHighlight ? 3 : 2}
                placeholder={isHighlight ? "Eigene Notiz hinzufügen…" : "Titel…"}
                className="w-full resize-none rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none"
              />
              {saving && <span className="text-[10px] text-muted-foreground">Speichern…</span>}

              {!isHighlight && c.messages.length > 0 && (
                <p className="whitespace-pre-wrap text-xs text-muted-foreground">{deriveExcerpt(c)}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function ConversationSidebar({ articleId }: ConversationSidebarProps) {
  const [conversations, setConversations] = useState<ApiConversation[] | null>(null);
  const [visibleHighlightIds, setVisibleHighlightIds] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const { show: showToast } = useToast();

  const reload = useCallback(async () => {
    const res = await fetch(`/api/conversations?articleId=${encodeURIComponent(articleId)}`);
    if (!res.ok) return;
    const data: { conversations: ApiConversation[] } = await res.json();
    setConversations(data.conversations);
  }, [articleId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount/articleId change
    reload();
  }, [reload]);

  // Auto-collapse on narrow viewports so the (potentially long) conversation
  // list doesn't push the whole article down below the fold on mobile — the
  // grid column itself also collapses to a stacked layout in the article
  // page, but this additionally starts the section closed there, with an
  // explicit toggle to open it, per the "responsive/collapsible" requirement.
  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only viewport check, mirrors FloatingDock's `mounted` pattern
    setCollapsed(window.matchMedia("(max-width: 1023px)").matches);
  }, []);

  // Track which highlight-anchored conversations' <mark> elements are
  // currently visible in the viewport — the relevance formula's
  // `anchorCurrentlyInViewport` bonus (ticket 7's renderHighlightOverlay
  // renders highlights as [data-highlight-id] elements, either <mark> or a
  // block-level fallback). Highlights render asynchronously (SelectionPopup
  // fetches then mutates the DOM), so a MutationObserver keeps re-attaching
  // the IntersectionObserver to newly-appended marks.
  useEffect(() => {
    const articleEl = document.querySelector<HTMLElement>(".article-body");
    if (!articleEl) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).dataset.highlightId;
          if (!id) continue;
          if (entry.isIntersecting) visible.add(id);
          else visible.delete(id);
        }
        setVisibleHighlightIds(new Set(visible));
      },
      { root: null, threshold: 0.1 },
    );

    function attachAll() {
      articleEl!.querySelectorAll<HTMLElement>("[data-highlight-id]").forEach((el) => observer.observe(el));
    }

    attachAll();
    const mutationObserver = new MutationObserver(attachAll);
    mutationObserver.observe(articleEl, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [conversations]);

  const scoredChats = useMemo(() => {
    if (!conversations) return [];
    const now = new Date();
    return conversations
      .filter((c) => c.type === "chat")
      .map((c) => {
        const anchorInViewport = c.highlight ? visibleHighlightIds.has(c.highlight.id) : false;
        const score = computeRelevanceScore({
          lastMessageAt: c.lastMessageAt,
          isPinned: c.isPinned,
          anchorCurrentlyInViewport: anchorInViewport,
          messageCount: c.messageCount,
          isOrphanedHighlight: c.highlight?.orphaned ?? false,
          now,
        });
        return { conversation: c, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [conversations, visibleHighlightIds]);

  const summaryConversations = useMemo(
    () => (conversations ?? []).filter((c) => c.type === "summary").sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [conversations],
  );

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const togglePin = useCallback(
    async (c: ApiConversation, e: React.MouseEvent) => {
      e.stopPropagation();
      setConversations((prev) =>
        prev ? prev.map((x) => (x.id === c.id ? { ...x, isPinned: !x.isPinned } : x)) : prev,
      );
      const res = await fetch("/api/conversations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, isPinned: !c.isPinned }),
      });
      if (!res.ok) {
        // Revert on failure.
        setConversations((prev) =>
          prev ? prev.map((x) => (x.id === c.id ? { ...x, isPinned: c.isPinned } : x)) : prev,
        );
      }
    },
    [],
  );

  const handleSaved = useCallback(
    (id: string, patch: Partial<ApiConversation> & { highlightNote?: string | null }) => {
      setConversations((prev) =>
        prev
          ? prev.map((x) => {
              if (x.id !== id) return x;
              const next = { ...x };
              if (patch.title !== undefined) next.title = patch.title;
              if (patch.highlightNote !== undefined && x.highlight) {
                next.highlight = { ...x.highlight, note: patch.highlightNote };
              }
              return next;
            })
          : prev,
      );
    },
    [],
  );

  const deleteConversation = useCallback(
    async (c: ApiConversation, e: React.MouseEvent) => {
      e.stopPropagation();
      setConversations((prev) => (prev ? prev.filter((x) => x.id !== c.id) : prev));

      await fetch(`/api/conversations?id=${encodeURIComponent(c.id)}`, { method: "DELETE" }).catch(() => {});

      showToast({
        message: "Gespräch gelöscht.",
        onUndo: async () => {
          const res = await fetch("/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              articleId: c.highlight ? null : articleId,
              type: c.type,
              title: c.title,
              isPinned: c.isPinned,
              provider: c.provider,
              messages: c.messages,
            }),
          });
          if (!res.ok) return;
          // Undo of a highlight-anchored conversation restores it as a plain
          // document-scope conversation (the Highlight link itself isn't
          // recreated) — acceptable trade-off for the undo-toast pattern,
          // consistent with how app/api/highlights/route.ts's own undo path
          // recreates a fresh row rather than reconstructing every relation.
          reload();
        },
      });
    },
    [articleId, showToast, reload],
  );

  const totalCount = (conversations ?? []).length;

  return (
    <aside className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground lg:cursor-default"
      >
        <span className="flex items-center gap-1.5">
          <MessagesSquare size={15} className="text-accent" />
          Gespräche & Notizen{totalCount > 0 ? ` (${totalCount})` : ""}
        </span>
        <span className="lg:hidden">{collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}</span>
      </button>

      <AnimatePresence initial={false}>
        {(!collapsed || typeof window === "undefined") && (
          <motion.div
            key="sidebar-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-3 overflow-hidden lg:!h-auto lg:!opacity-100"
          >
            <SummaryEntry articleId={articleId} summaries={summaryConversations} onCreated={reload} />

            {conversations === null && (
              <p className="px-1 text-xs text-muted-foreground">Lade Gespräche…</p>
            )}

            {conversations !== null && scoredChats.length === 0 && (
              <p className="rounded-xl border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                Noch keine Gespräche zu diesem Artikel. Markiere Text oder öffne den Assistenten, um eines zu
                starten.
              </p>
            )}

            <ul className="flex flex-col gap-2">
              {scoredChats.map(({ conversation: c }) => (
                <ConversationEntry
                  key={c.id}
                  articleId={articleId}
                  conversation={c}
                  expanded={expandedIds.has(c.id)}
                  onToggleExpand={() => toggleExpand(c.id)}
                  onTogglePin={(e) => togglePin(c, e)}
                  onDelete={(e) => deleteConversation(c, e)}
                  onSaved={(patch) => handleSaved(c.id, patch)}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
