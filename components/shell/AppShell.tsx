"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, FileText, Home, Layers, Loader2, Moon, Search, Settings, Sparkles, Sun } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { KeystoneMark } from "@/components/brand/KeystoneMark";
import { FloatingDock } from "@/components/dock/FloatingDock";
import { CommandPalette } from "@/components/palette/CommandPalette";
import { RoleArticlesPanel } from "@/components/roles/RoleArticlesPanel";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { getDomainShortLabel } from "@/lib/domainShortLabels";

const SIDEBAR_COLLAPSED_KEY = "keystone:sidebar-collapsed";
const THEME_KEY = "keystone:theme";

type Theme = "light" | "dark";

function readStoredCollapsed(): boolean {
  try {
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
  } catch {
    // localStorage may be unavailable (private browsing, blocked storage, etc.)
    return false;
  }
}

function writeStoredCollapsed(collapsed: boolean) {
  try {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, collapsed ? "1" : "0");
  } catch {
    // ignore — non-critical persistence
  }
}

function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_KEY);
    return stored === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function writeStoredTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore — non-critical persistence
  }
}

interface DomainNavItem {
  id: string;
  slug: string;
  title: string;
}

interface RoleNavItem {
  id: string;
  label: string;
}

interface SearchResult {
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

// Full natural-language questions shouldn't fire the smart (LLM) search on
// every keystroke like the fast keyword dropdown does — only on explicit
// submit (Enter) or once the user pauses after typing a longer query.
const SMART_SEARCH_MIN_LENGTH = 12;
const SMART_SEARCH_IDLE_DEBOUNCE_MS = 900;

export interface AppShellProps {
  children?: ReactNode;
  domains?: DomainNavItem[];
  roles?: RoleNavItem[];
  displayName?: string | null;
  /**
   * Live count of SrsState rows currently due for the default user
   * (ticket 10), fetched server-side in app/layout.tsx via a cheap count
   * query. A real, honest live count — not faked — so it's undefined/0
   * simply renders no badge rather than showing a stale number.
   */
  srsDueCount?: number;
  /**
   * Set (only on the exact page load where it happened) when startup
   * auto-detection (lib/llm/autodetect.ts) just created + activated a
   * ProviderConfig, e.g. "Claude Code CLI". Renders a one-time confirmation
   * toast — auto-activating a provider without ANY visibility would be
   * confusing, per the plan's honesty requirement. `null`/undefined on
   * every subsequent load once a provider is active, since
   * autoDetectAndActivateProvider() short-circuits once one exists.
   */
  autoDetectedProviderLabel?: string | null;
}

const DISPLAY_NAME_FALLBACK = "Architect";

// Rendered as a ToastProvider child (useToast() only works inside the
// provider) purely so the one-time auto-detect confirmation toast can fire
// on mount without AppShell itself needing to live inside its own provider.
function AutoDetectToast({ label }: { label: string | null | undefined }) {
  const { show } = useToast();
  const shownRef = useRef(false);

  useEffect(() => {
    if (!label || shownRef.current) return;
    shownRef.current = true;
    show({ message: `${label} automatisch erkannt und aktiviert.` });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  return null;
}

export function AppShell({
  children,
  domains = [],
  roles = [],
  displayName,
  srsDueCount = 0,
  autoDetectedProviderLabel = null,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchAbortRef = useRef<AbortController | null>(null);

  // Smart (LLM-ranked) search — separate from the fast keyword dropdown
  // above. `smartActive` tracks whether the dropdown should show smart
  // results instead of the plain keyword list for the current query.
  const [smartActive, setSmartActive] = useState(false);
  const [smartLoading, setSmartLoading] = useState(false);
  const [smartResults, setSmartResults] = useState<SmartResult[]>([]);
  const [smartSuggestExternal, setSmartSuggestExternal] = useState(false);
  const [smartExternalUrl, setSmartExternalUrl] = useState<string | null>(null);
  const [smartUnavailable, setSmartUnavailable] = useState(false);
  const smartAbortRef = useRef<AbortController | null>(null);

  async function runSmartSearch(q: string) {
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
        // No LLM provider configured — silently keep using the existing
        // plain keyword search, no error shown to the user.
        setSmartActive(false);
        setSmartUnavailable(true);
        return;
      }

      setSmartResults(data.results ?? []);
      setSmartSuggestExternal(Boolean(data.suggestExternalSearch));
      setSmartExternalUrl(data.externalSearchUrl ?? null);
    } catch (err) {
      if ((err as { name?: string })?.name !== "AbortError") {
        // Smart search failed (e.g. llm-error) — fall back silently to the
        // plain keyword results already shown, don't surface an error.
        setSmartActive(false);
      }
    } finally {
      setSmartLoading(false);
    }
  }

  // Read persisted state on mount only (avoids SSR/client mismatch; the
  // anti-flash inline script in app/layout.tsx already sets data-theme
  // before hydration so there is no visible flash). This intentionally
  // syncs from an external system (localStorage, unavailable during SSR)
  // once after mount, which is the documented exception to the
  // set-state-in-effect rule.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCollapsed(readStoredCollapsed());
    setTheme(readStoredTheme());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    writeStoredCollapsed(collapsed);
  }, [collapsed, mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.dataset.theme = theme;
    writeStoredTheme(theme);
  }, [theme, mounted]);

  // Debounced live search against /api/search, filtering article titles.
  // Note: intentionally does nothing (no setState) when the query is blank
  // — stale results just stay unused because the dropdown only renders when
  // query.trim().length > 0 (see JSX below), which avoids a synchronous
  // setState-in-effect for the "cleared" case entirely.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      return;
    }

    const timeout = setTimeout(() => {
      searchAbortRef.current?.abort();
      const controller = new AbortController();
      searchAbortRef.current = controller;
      setSearchLoading(true);

      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data: { results: SearchResult[] }) => {
          setSearchResults(data.results ?? []);
        })
        .catch((err) => {
          if (err?.name !== "AbortError") {
            setSearchResults([]);
          }
        })
        .finally(() => setSearchLoading(false));
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  // Smart-search idle debounce: once the user pauses on a sufficiently long
  // (likely natural-language) query, trigger the LLM-ranked search
  // automatically. Short/incremental typing (below the threshold) never
  // triggers this — only explicit Enter (see input's onKeyDown) or this
  // pause does.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < SMART_SEARCH_MIN_LENGTH) {
      // Intentionally no setState here (mirrors the plain keyword search
      // effect above) — `showSmart` below derives the "blank/short query"
      // case straight from `query`, so stale smart state just stays unused.
      return;
    }

    const timeout = setTimeout(() => {
      runSmartSearch(trimmed);
    }, SMART_SEARCH_IDLE_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  const showSmart = smartActive && query.trim().length >= SMART_SEARCH_MIN_LENGTH;

  return (
    <ToastProvider>
    <AutoDetectToast label={autoDetectedProviderLabel} />
    <div className="flex h-full w-full overflow-hidden bg-background text-foreground">
      <motion.aside
        animate={{ width: collapsed ? 64 : 260 }}
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex h-full shrink-0 flex-col overflow-hidden border-r border-border bg-surface"
      >
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border p-3">
          {!collapsed && (
            <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Keystone home">
              <KeystoneMark size={30} className="shrink-0 rounded-[8px] shadow-sm" />
              <span className="truncate text-[15px] font-semibold tracking-tight">Keystone</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              // Collapsing the sidebar must also close/clear any open
              // expandable content (the search results dropdown, in
              // particular) — otherwise `searchOpen`/`smartActive` stay
              // true in state even though the collapsed sidebar has no
              // room to show them, and they reappear orphaned the moment
              // the sidebar is expanded again (or, during the collapse
              // animation itself, before the width has finished shrinking).
              searchAbortRef.current?.abort();
              smartAbortRef.current?.abort();
              setSearchOpen(false);
              setSmartActive(false);
              setCollapsed((c) => !c);
            }}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-background"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/*
          min-h-0 is the actual fix for the reported profile-corner/domain-list
          overlap bug: a `flex-1` flex item defaults to `min-height: auto`,
          which means it refuses to shrink below its own content's intrinsic
          height even inside a fixed-height (`h-screen`) flex column. With a
          long domain list, that pushed this section's real height past what
          was actually available, and since the aside clips with
          `overflow-hidden`, the last domain rows rendered underneath the
          profile-corner footer below instead of being contained by this
          section's own `overflow-y-auto` scroll. `min-h-0` lets this flex
          item actually shrink to its allotted space so its own scrollbar
          takes over, as intended.
        */}
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          {/* Topic search: filters article titles via /api/search as the
              user types (debounced). Full Cmd+K palette lands in ticket 5;
              this is just the sidebar box working. */}
          <div className="relative mb-4">
            <Search
              size={14}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder={collapsed ? "" : "Search articles..."}
              aria-label="Search articles"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim().length > 0) {
                  e.preventDefault();
                  runSmartSearch(query);
                }
              }}
              className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-7 text-sm text-foreground placeholder:text-muted-foreground"
            />
            {(searchLoading || smartLoading) && (
              <Loader2
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground"
              />
            )}

            <AnimatePresence>
              {!collapsed && searchOpen && query.trim().length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="dock-panel absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded-lg p-1"
                >
                  {showSmart ? (
                    <>
                      <p className="flex items-center gap-1 px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                              <Link
                                href={`/articles/${result.articleId}`}
                                className="flex items-start gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-background"
                              >
                                <FileText size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-center justify-between gap-2">
                                    <span className="block truncate text-foreground">{result.title}</span>
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
                              </Link>
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
                    </>
                  ) : (
                    <>
                      {searchResults.length === 0 && !searchLoading && (
                        <p className="px-2 py-2 text-xs text-muted-foreground">No matching articles.</p>
                      )}
                      <ul className="flex flex-col gap-0.5">
                        {searchResults.map((result) => (
                          <li key={result.id}>
                            <Link
                              href={`/articles/${result.id}`}
                              className="flex items-start gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-background"
                            >
                              <FileText size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                              <span className="min-w-0">
                                <span className="block truncate text-foreground">{result.title}</span>
                                <span className="block truncate text-xs text-muted-foreground">
                                  {result.domainTitle}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {!smartUnavailable && query.trim().length >= SMART_SEARCH_MIN_LENGTH && !smartLoading && (
                        <p className="px-2 pb-1 pt-1.5 text-[11px] text-muted-foreground">
                          Enter drücken für smarte, relevanzsortierte Suche.
                        </p>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!collapsed && (
            <nav className="flex flex-col gap-6 text-sm">
              <div>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link
                      href="/"
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-medium text-foreground hover:bg-background"
                    >
                      <Home size={14} /> Home
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Roles
                </p>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link
                      href="/roles"
                      className="block truncate rounded-lg px-2 py-1.5 font-medium text-accent hover:bg-background"
                    >
                      Alle Rollen &amp; Zertifikate
                    </Link>
                  </li>
                  {roles.map((role) => (
                    <li key={role.id}>
                      <Link
                        href={`/roles/${role.id}`}
                        onClick={(e) => {
                          // Sidebar roles open the inline RoleArticlesPanel
                          // instead of navigating to the full /roles/[role]
                          // page (that route still works directly/deep-link,
                          // see app/roles/[role]/page.tsx) — intercept the
                          // click, dispatch the same
                          // CustomEvent-on-window pattern FloatingDock uses
                          // for "keystone:open-dock".
                          e.preventDefault();
                          window.dispatchEvent(
                            new CustomEvent("keystone:open-role-panel", {
                              detail: { roleId: role.id, roleLabel: role.label },
                            }),
                          );
                        }}
                        className="block truncate rounded-lg px-2 py-1.5 text-foreground/80 hover:bg-background hover:text-foreground"
                      >
                        {role.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Domains
                </p>
                <ul className="flex flex-col gap-1">
                  {domains.map((domain) => (
                    <li key={domain.id}>
                      <Link
                        href={`/domains/${domain.slug}`}
                        className="block truncate rounded-lg px-2 py-1.5 text-foreground/80 hover:bg-background hover:text-foreground"
                        title={domain.title}
                      >
                        {getDomainShortLabel(domain.id, domain.title)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Lernen
                </p>
                <ul className="flex flex-col gap-1">
                  <li>
                    <Link
                      href="/srs"
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 text-foreground/80 hover:bg-background hover:text-foreground"
                    >
                      <span className="flex items-center gap-2">
                        <Layers size={14} /> Karteikarten
                      </span>
                      {srsDueCount > 0 && (
                        <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                          {srsDueCount}
                        </span>
                      )}
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          )}
        </div>

        {/* Profile corner — same Avatar component reused in onboarding's
            live preview, Settings (ticket 12), the sidebar's conversation
            entries (ticket 8), and the certificate PDF (ticket 9). Links to
            /settings, which re-exposes the onboarding choices (provider,
            roles, news, display name) plus export/import and the PWA
            toggle. */}
        <Link
          href="/settings"
          className="flex shrink-0 items-center gap-2.5 border-t border-border bg-surface p-3 hover:bg-background"
        >
          <Avatar
            name={displayName ?? ""}
            size={32}
            className="shrink-0 rounded-full"
          />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                {displayName || DISPLAY_NAME_FALLBACK}
              </span>
              <Settings size={14} className="shrink-0 text-muted-foreground" />
            </>
          )}
        </Link>
      </motion.aside>

      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <header className="flex shrink-0 items-center justify-end border-b border-border bg-surface px-4 py-2.5">
          <button
            type="button"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-background"
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </header>

        {/*
          Main content area. Deliberately no fixed bottom-center content
          here — ticket 5 owns a floating dock anchored bottom-center of the
          viewport, and this shell must not place anything that would
          collide with it.

          min-h-0 is required here for the same reason as the sidebar's
          domain-list section above: this is a flex item inside a
          fixed-height (h-full) column, and flex items default to
          min-height: auto, which would let this grow past its allotted
          space instead of scrolling within it. Without it, the whole page
          (including the sidebar) would scroll together instead of the
          sidebar staying pinned with its own independent scroll.
        */}
        <main className="min-h-0 flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Global, always-present: bottom-center dock + centered Cmd+K palette
          + the sidebar roles' slide-in article panel. */}
      <FloatingDock />
      <CommandPalette />
      <RoleArticlesPanel />
    </div>
    </ToastProvider>
  );
}
