"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, FileText, Search, Settings, MessageCircle, Sparkles } from "lucide-react";

interface ArticleResult {
  id: string;
  title: string;
  domainTitle: string;
}

interface SmartResult {
  articleId: string;
  title: string;
  domainTitle: string;
  matchPercent: number;
  reason: string;
}

interface SmartSearchResponse {
  mode: "smart" | "keyword-fallback";
  results?: SmartResult[];
  suggestExternalSearch?: boolean;
  externalSearchUrl?: string;
}

const SMART_SEARCH_MIN_LENGTH = 12;
const SMART_SEARCH_IDLE_DEBOUNCE_MS = 900;

interface StaticAction {
  id: string;
  label: string;
  hint?: string;
  icon: typeof Settings;
  run: (router: ReturnType<typeof useRouter>) => void;
}

// Minimal static actions for now, per the plan: keep this list small and
// only add actions for features that actually exist. Later tickets (tests,
// summaries, etc.) can extend this array once those features land.
const STATIC_ACTIONS: StaticAction[] = [
  {
    id: "settings",
    label: "Zu Einstellungen",
    hint: "Setup / LLM-Anbieter",
    icon: Settings,
    run: (router) => router.push("/settings"),
  },
  {
    id: "new-chat",
    label: "Neuer Chat",
    hint: "Öffnet den Assistenten",
    icon: MessageCircle,
    run: () => {
      // Dispatches a global event the FloatingDock listens for, rather than
      // importing dock internals here — keeps the palette and the dock
      // decoupled (two distinct, non-redundant entry points per the plan).
      window.dispatchEvent(new CustomEvent("keystone:open-dock"));
    },
  },
];

type Row =
  | { kind: "action"; action: StaticAction }
  | { kind: "article"; article: ArticleResult };

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ArticleResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [smartActive, setSmartActive] = useState(false);
  const [smartLoading, setSmartLoading] = useState(false);
  const [smartResults, setSmartResults] = useState<SmartResult[]>([]);
  const [smartSuggestExternal, setSmartSuggestExternal] = useState(false);
  const [smartExternalUrl, setSmartExternalUrl] = useState<string | null>(null);
  const smartAbortRef = useRef<AbortController | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(0);
    setSmartActive(false);
    setSmartResults([]);
    setSmartSuggestExternal(false);
    setSmartExternalUrl(null);
  }, []);

  const runSmartSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length === 0) return;

    smartAbortRef.current?.abort();
    const controller = new AbortController();
    smartAbortRef.current = controller;

    setSmartLoading(true);
    setSmartActive(true);
    setSmartSuggestExternal(false);
    setSmartExternalUrl(null);

    try {
      const res = await fetch("/api/search/smart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
        signal: controller.signal,
      });
      const data: SmartSearchResponse = await res.json();

      if (data.mode === "keyword-fallback") {
        setSmartActive(false);
        return;
      }

      setSmartResults(data.results ?? []);
      setActiveIndex(0);
      setSmartSuggestExternal(Boolean(data.suggestExternalSearch));
      setSmartExternalUrl(data.externalSearchUrl ?? null);
    } catch (err) {
      if ((err as { name?: string })?.name !== "AbortError") {
        setSmartActive(false);
      }
    } finally {
      setSmartLoading(false);
    }
  }, []);

  // Global Cmd+K / Ctrl+K to open, Esc to close.
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  useEffect(() => {
    if (open) {
      // Focus after the mount/animation frame.
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Reuses the same /api/search endpoint ticket 3 built for AppShell's
  // sidebar search box, rather than duplicating the query logic.
  // Note: intentionally does nothing (no setState) for the blank-query case
  // — stale results just stay unused because `rows` below only includes
  // article results when the query is non-empty. Mirrors the same pattern
  // already used in AppShell's sidebar search effect.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      return;
    }
    const timeout = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data: { results: ArticleResult[] }) => {
          setResults(data.results ?? []);
          setActiveIndex(0);
        })
        .catch((err) => {
          if (err?.name !== "AbortError") setResults([]);
        });
    }, 150);
    return () => clearTimeout(timeout);
  }, [query]);

  // Smart-search idle debounce, mirroring AppShell's sidebar search: a
  // longer (likely natural-language) query auto-triggers the LLM-ranked
  // search after a pause. Short/incremental typing never triggers it —
  // only this pause or explicit Enter (see handleKeyDown) does.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < SMART_SEARCH_MIN_LENGTH) {
      // Intentionally no setState here (mirrors AppShell's search effect
      // convention) — `showSmart` below derives the "short query" case
      // straight from `query`, so stale smart state just stays unused.
      return;
    }
    const timeout = setTimeout(() => {
      runSmartSearch(trimmed);
    }, SMART_SEARCH_IDLE_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [query, runSmartSearch]);

  const showSmart = smartActive && query.trim().length >= SMART_SEARCH_MIN_LENGTH;
  const articleResults = query.trim().length > 0 && !showSmart ? results : [];
  const rows: Row[] = [
    ...STATIC_ACTIONS.map((action) => ({ kind: "action" as const, action })),
    ...articleResults.map((article) => ({ kind: "article" as const, article })),
  ];

  function selectRow(row: Row) {
    if (row.kind === "action") {
      row.action.run(router);
    } else {
      router.push(`/articles/${row.article.id}`);
    }
    close();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = query.trim();
      // Explicit submit: a long, question-like query with nothing
      // deliberately arrow-key-selected (activeIndex still at its default)
      // triggers the smart search immediately rather than waiting for the
      // idle debounce. Arrowing onto a specific action/article and hitting
      // Enter still selects that row as before.
      if (trimmed.length >= SMART_SEARCH_MIN_LENGTH && activeIndex === 0) {
        runSmartSearch(trimmed);
        return;
      }
      const row = rows[activeIndex];
      if (row) selectRow(row);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[15vh]"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="dock-panel w-full max-w-xl overflow-hidden rounded-2xl"
          >
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Search size={16} className="text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Artikel suchen oder Aktion ausführen…"
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                Esc
              </kbd>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {rows.length === 0 && (
                <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                  Keine Ergebnisse.
                </p>
              )}

              {STATIC_ACTIONS.length > 0 && (
                <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Aktionen
                </p>
              )}
              {rows.map((row, idx) => {
                const isAction = row.kind === "action";
                const key = isAction ? `action-${row.action.id}` : `article-${row.article.id}`;
                const isFirstArticle =
                  !isAction && idx === STATIC_ACTIONS.length && articleResults.length > 0;
                return (
                  <div key={key}>
                    {isFirstArticle && (
                      <p className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Artikel
                      </p>
                    )}
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => selectRow(row)}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm ${
                        idx === activeIndex ? "bg-accent/15 text-foreground" : "text-foreground/90"
                      }`}
                    >
                      {isAction ? (
                        <row.action.icon size={15} className="shrink-0 text-muted-foreground" />
                      ) : (
                        <FileText size={15} className="shrink-0 text-muted-foreground" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">
                          {isAction ? row.action.label : row.article.title}
                        </span>
                        {isAction ? (
                          row.action.hint && (
                            <span className="block truncate text-xs text-muted-foreground">
                              {row.action.hint}
                            </span>
                          )
                        ) : (
                          <span className="block truncate text-xs text-muted-foreground">
                            {row.article.domainTitle}
                          </span>
                        )}
                      </span>
                    </button>
                  </div>
                );
              })}

              {showSmart && (
                <div>
                  <p className="flex items-center gap-1 px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <Sparkles size={11} /> Smarte Suche
                  </p>
                  {smartLoading && (
                    <p className="px-2 py-2 text-xs text-muted-foreground">Suche läuft…</p>
                  )}
                  {!smartLoading && smartResults.length === 0 && !smartSuggestExternal && (
                    <p className="px-2 py-2 text-xs text-muted-foreground">Keine Ergebnisse.</p>
                  )}
                  {!smartLoading && smartResults.length > 0 && (
                    <ul className="flex flex-col gap-0.5">
                      {smartResults.map((result) => (
                        <li key={result.articleId}>
                          <button
                            type="button"
                            onClick={() => {
                              router.push(`/articles/${result.articleId}`);
                              close();
                            }}
                            className="flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-foreground/90 hover:bg-accent/10"
                          >
                            <FileText size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center justify-between gap-2">
                                <span className="block truncate">{result.title}</span>
                                <span className="shrink-0 rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                                  {result.matchPercent}% Treffer
                                </span>
                              </span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {result.domainTitle}
                              </span>
                              {result.reason && (
                                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground/80">
                                  {result.reason}
                                </span>
                              )}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!smartLoading && smartSuggestExternal && (
                    <div className="px-2 py-2">
                      <p className="text-xs text-muted-foreground">
                        Keine gute Übereinstimmung in der Wissensbasis gefunden.
                      </p>
                      {smartExternalUrl && (
                        <a
                          href={smartExternalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
                        >
                          Im Web suchen <ExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
