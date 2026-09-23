"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Settings } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";

// ── Extensibility point for ticket 7 ────────────────────────────────────
// The dock's internal scope is modeled as a single `DockScope` union rather
// than separate booleans, specifically so ticket 7 ("highlight → ask" flow)
// can add `mode: 'highlight'` (plus `highlightQuote`, and reuse `articleId`)
// without restructuring this component. Per the plan: "Dock chat and
// highlight chat are the same FloatingDock component in three modes
// (scope: 'document' | 'platform' | 'highlight')." This ticket only ever
// sets `mode` to 'platform' or 'document' — 'highlight' is listed here so
// the type and the rendering branches below are ready for it.
export type DockMode = "platform" | "document" | "highlight";

export interface DockScope {
  mode: DockMode;
  articleId?: string;
  /** Only used once ticket 7 wires up highlight mode. */
  highlightQuote?: string;
}

// ── Ticket 8: two size variants ─────────────────────────────────────────
// "compact" is the original ticket 6/7 quick-ask size (unchanged: 40rem cap,
// 28rem tall, text-sm). "large" is new — opened when the sidebar reopens an
// existing conversation or a note's link button injects context (per the
// plan's revised item 2): roughly the article reading column's width. The
// reading column is `minmax(0,1fr)` inside a `max-w-6xl` (1152px) grid
// alongside a `20rem` sidebar + `gap-8` (2rem) — 1152 - 320 - 32 = 800px, so
// 50rem (800px) is used here rather than a guessed number. Message/input
// text scales up proportionally (text-sm -> text-base), not just the box.
export type DockSize = "compact" | "large";

const DOCK_SIZE_CLASSES: Record<DockSize, string> = {
  compact: "h-[28rem] w-[min(90vw,40rem)] text-sm",
  large: "h-[36rem] w-[min(94vw,50rem)] text-base",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const ARTICLE_ROUTE = /^\/articles\/([^/]+)/;

function useCurrentScope(): DockScope {
  const pathname = usePathname();
  const match = pathname?.match(ARTICLE_ROUTE);
  if (match) {
    return { mode: "document", articleId: match[1] };
  }
  return { mode: "platform" };
}

interface HighlightOverride {
  highlightId: string;
  articleId: string;
  quote: string;
}

export function FloatingDock() {
  const baseScope = useCurrentScope();
  const [highlightOverride, setHighlightOverride] = useState<HighlightOverride | null>(null);
  // Highlight mode (ticket 7) takes precedence over the pathname-derived
  // scope until cleared (dock closed, or navigation changes the article).
  const scope: DockScope = highlightOverride
    ? { mode: "highlight", articleId: highlightOverride.articleId, highlightQuote: highlightOverride.quote }
    : baseScope;
  const [open, setOpen] = useState(false);
  const [dockSize, setDockSize] = useState<DockSize>("compact");
  // The dock is rendered via a portal straight onto `document.body` (see the
  // return statement below) rather than as an inline child of AppShell's
  // layout tree. `position: fixed` alone was already supposed to keep it
  // out of document flow, but portaling it makes that structural — the dock
  // can never accidentally participate in AppShell's flex/grid sizing (e.g.
  // if a future change wraps it in something that establishes a new
  // containing block) and can never cause the article/sidebar layout to
  // reflow when it opens. `mounted` guards against SSR, where `document`
  // doesn't exist.
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [noProvider, setNoProvider] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active conversation id kept in component state only (not URL, not
  // localStorage) — a fresh mount always starts a fresh conversation, unless
  // seeded by a "reopen" event (see the keystone:open-dock listener below,
  // ticket 8's wiring).
  const conversationIdRef = useRef<string | undefined>(undefined);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    // Portal target (`document.body`) only exists on the client; this mirrors
    // the same mount-detection pattern AppShell uses for localStorage reads.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // AppShell (and therefore this dock) doesn't remount on client-side route
  // changes, so navigating from one article to another would otherwise keep
  // replying into the previous article's conversation. Start a fresh
  // conversation whenever the document-scope article id changes (matches
  // "a fresh mount starts a fresh conversation" from the ticket spec,
  // extended to "a fresh document scope starts a fresh conversation").
  const scopeArticleId = baseScope.mode === "document" ? baseScope.articleId : undefined;
  const prevScopeArticleIdRef = useRef(scopeArticleId);
  useEffect(() => {
    if (prevScopeArticleIdRef.current !== scopeArticleId) {
      prevScopeArticleIdRef.current = scopeArticleId;
      conversationIdRef.current = undefined;
      setMessages([]);
      setErrorMsg(null);
      // Navigating to a different article (or away from one) invalidates any
      // highlight-mode override anchored to the previous article.
      setHighlightOverride(null);
    }
  }, [scopeArticleId]);

  // The CommandPalette's "Neuer Chat" action dispatches this instead of
  // importing dock internals directly, keeping the two entry points
  // decoupled (per the plan: complementary, non-redundant, distinct visual
  // positions — dock stays bottom-center, palette stays a centered overlay).
  // Ticket 7 extended this same event with an optional `detail` payload: when
  // `detail.mode === "highlight"`, the dock switches into highlight mode
  // (context chip + Highlight-linked conversation) instead of just opening.
  //
  // Ticket 8 extends it again with `detail.mode === "reopen"`: the sidebar
  // (components/sidebar/ConversationSidebar.tsx) dispatches this when the
  // user clicks a past conversation, carrying the conversation's id and its
  // full fetched message history (from GET /api/conversations) so the dock
  // opens straight into that history instead of starting fresh — no second
  // fetch needed here, the sidebar already has the messages from its own
  // list fetch. If the conversation was highlight-anchored, the payload also
  // carries `highlightId`/`highlightQuote` so the highlight context chip
  // renders exactly as it would have when the conversation was first
  // created. This reuses the *same* CustomEvent name/mechanism as the
  // highlight-mode extension rather than inventing a second channel — one
  // event, a growing discriminated `detail.mode`.
  useEffect(() => {
    function handleOpen(e: Event) {
      const detail = (e as CustomEvent).detail as
        | {
            mode?: string;
            articleId?: string;
            highlightId?: string;
            highlightQuote?: string;
            conversationId?: string;
            messages?: ChatMessage[];
            size?: DockSize;
          }
        | undefined;

      // Ticket 8: the sidebar's "reopen an existing conversation" and its
      // notes' link/chain button both open the LARGE, document-width
      // variant; the quick "Frage stellen" flow from a fresh text selection
      // (mode: "highlight", no `size`) keeps the small quick-ask size.
      setDockSize(detail?.size === "large" ? "large" : "compact");

      if (detail?.mode === "reopen" && detail.conversationId) {
        conversationIdRef.current = detail.conversationId;
        setMessages(detail.messages ?? []);
        setErrorMsg(null);
        setNoProvider(false);
        if (detail.articleId && detail.highlightId && detail.highlightQuote) {
          setHighlightOverride({
            highlightId: detail.highlightId,
            articleId: detail.articleId,
            quote: detail.highlightQuote,
          });
        } else {
          setHighlightOverride(null);
        }
      } else if (
        detail?.mode === "highlight" &&
        detail.articleId &&
        detail.highlightId &&
        detail.highlightQuote
      ) {
        conversationIdRef.current = undefined;
        setMessages([]);
        setErrorMsg(null);
        setNoProvider(false);
        setHighlightOverride({
          highlightId: detail.highlightId,
          articleId: detail.articleId,
          quote: detail.highlightQuote,
        });
      }
      setOpen(true);
    }
    window.addEventListener("keystone:open-dock", handleOpen);
    return () => window.removeEventListener("keystone:open-dock", handleOpen);
  }, []);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;

    setInput("");
    setErrorMsg(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setSending(true);

    // Placeholder assistant message we fill in incrementally as tokens arrive.
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversationIdRef.current,
          articleId: scope.mode === "document" ? scope.articleId : scope.mode === "highlight" ? scope.articleId : null,
          highlightId: scope.mode === "highlight" ? highlightOverride?.highlightId : undefined,
          message: text,
        }),
      });

      const contentType = res.headers.get("Content-Type") ?? "";

      // The "no provider configured" case is returned as a plain JSON 200,
      // not a stream — detect and branch before attempting to read a body
      // as NDJSON.
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data?.error === "no-provider") {
          setNoProvider(true);
          setMessages((prev) => prev.slice(0, -1)); // drop the empty assistant placeholder
          setSending(false);
          return;
        }
      }

      if (!res.body) {
        throw new Error("No response stream");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const evt = JSON.parse(line) as
            | { type: "meta"; conversationId: string }
            | { type: "delta"; delta: string }
            | { type: "error"; message: string }
            | { type: "done" };

          if (evt.type === "meta") {
            conversationIdRef.current = evt.conversationId;
          } else if (evt.type === "delta") {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last && last.role === "assistant") {
                next[next.length - 1] = { ...last, content: last.content + evt.delta };
              }
              return next;
            });
          } else if (evt.type === "error") {
            setErrorMsg(evt.message);
          }
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Etwas ist schiefgelaufen.");
    } finally {
      setSending(false);
    }
  }

  // Proportionally larger message/input text in the large variant (not just
  // a bigger container) — see DOCK_SIZE_CLASSES doc comment above.
  const bubbleTextClass = dockSize === "large" ? "text-base" : "text-sm";

  const dock = (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className={`dock-panel pointer-events-auto flex flex-col overflow-hidden rounded-2xl ${DOCK_SIZE_CLASSES[dockSize]}`}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles size={16} className="text-accent" />
                {scope.mode === "highlight"
                  ? "Frage zur Markierung"
                  : scope.mode === "document"
                    ? "Frage zu diesem Artikel"
                    : "Keystone Assistent"}
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setHighlightOverride(null);
                }}
                aria-label="Chat schließen"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-background"
              >
                <X size={16} />
              </button>
            </div>

            {scope.mode === "highlight" && scope.highlightQuote && (
              <div className="border-b border-border bg-accent/10 px-4 py-2">
                <p className="line-clamp-2 border-l-2 border-accent pl-2 text-xs italic text-foreground/80">
                  &ldquo;{scope.highlightQuote}&rdquo;
                </p>
              </div>
            )}

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
              {messages.length === 0 && !noProvider && (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  {scope.mode === "highlight"
                    ? "Stell eine Frage zur markierten Textstelle."
                    : scope.mode === "document"
                      ? "Stell eine Frage zum aktuellen Artikel."
                      : "Frag mich etwas über Keystone oder die Wissensdatenbank."}
                </p>
              )}

              {noProvider && (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background px-4 py-6 text-center text-sm">
                  <p className="text-foreground">Kein LLM-Anbieter konfiguriert.</p>
                  <p className="text-muted-foreground">
                    Richte zuerst einen Anbieter ein, um den Chat zu nutzen.
                  </p>
                  <Link
                    href="/setup"
                    className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90"
                  >
                    <Settings size={14} /> Zu den Einstellungen
                  </Link>
                </div>
              )}

              {messages.map((m, idx) =>
                m.role === "user" ? (
                  <div key={idx} className="flex items-start justify-end gap-2">
                    <div className={`max-w-[80%] rounded-2xl rounded-tr-sm bg-accent px-3 py-2 text-accent-foreground ${bubbleTextClass}`}>
                      {m.content}
                    </div>
                    <Avatar name="user" size={24} className="mt-0.5 shrink-0 rounded-full" />
                  </div>
                ) : (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Sparkles size={13} />
                    </span>
                    <div className={`max-w-[80%] rounded-2xl rounded-tl-sm bg-surface px-3 py-2 text-foreground ${bubbleTextClass}`}>
                      {m.content || (sending && idx === messages.length - 1 ? "…" : "")}
                    </div>
                  </div>
                )
              )}

              {errorMsg && <p className="text-center text-xs text-danger">{errorMsg}</p>}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nachricht eingeben…"
                disabled={sending || noProvider}
                className={`flex-1 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground disabled:opacity-50 ${bubbleTextClass}`}
              />
              <button
                type="submit"
                disabled={sending || noProvider || !input.trim()}
                aria-label="Senden"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.button
            key="collapsed"
            type="button"
            onClick={() => {
              // Always the small quick-ask size when opened from the dock's
              // own bottom-center bubble (not via the sidebar/link button).
              setDockSize("compact");
              setOpen(true);
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            aria-label="Assistent öffnen"
            className="glass-card pointer-events-auto flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-foreground shadow-lg"
          >
            <Sparkles size={16} className="text-accent" />
            {scope.mode === "document" ? "Frage zum Artikel" : "Frag Keystone"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );

  if (!mounted) return null;
  return createPortal(dock, document.body);
}
