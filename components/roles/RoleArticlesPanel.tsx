"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, GraduationCap, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Slide-in panel triggered by clicking a role in the sidebar's ROLES
 * section (AppShell), instead of a full navigation to /roles/[role].
 * Portal-rendered onto document.body, same structural reasoning as
 * FloatingDock (components/dock/FloatingDock.tsx): `position: fixed` alone
 * shouldn't have to also survive being nested inside AppShell's flex
 * layout. Unlike the dock's bottom-center bubble, this needs a pinned
 * header (role name + "Test starten") above a scrollable list, so a
 * right-edge slide-in drawer fits the content shape better than a
 * centered/bottom modal — closer to a standard side-panel pattern, while
 * still reusing the app's established dock-panel glass styling and
 * AnimatePresence-based open/close choreography.
 *
 * Opened via a global CustomEvent ("keystone:open-role-panel") the same
 * way FloatingDock listens for "keystone:open-dock" — AppShell's role
 * links dispatch it (with e.preventDefault()) instead of navigating away.
 */

export interface RoleArticlesPanelRole {
  id: string;
  label: string;
}

interface ApiArticle {
  id: string;
  title: string;
  domainTitle: string;
}

interface ApiResponse {
  role: { id: string; label: string };
  articles: ApiArticle[];
}

export function RoleArticlesPanel() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<RoleArticlesPanelRole | null>(null);
  const [articles, setArticles] = useState<ApiArticle[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleOpen(e: Event) {
      const detail = (e as CustomEvent).detail as { roleId?: string; roleLabel?: string } | undefined;
      if (!detail?.roleId) return;
      setRole({ id: detail.roleId, label: detail.roleLabel ?? detail.roleId });
      setArticles(null);
      setError(null);
      setOpen(true);
    }
    window.addEventListener("keystone:open-role-panel", handleOpen);
    return () => window.removeEventListener("keystone:open-role-panel", handleOpen);
  }, []);

  useEffect(() => {
    if (!open || !role) return;
    let cancelled = false;
    fetch(`/api/roles/${encodeURIComponent(role.id)}/articles`)
      .then((res) => {
        if (!res.ok) throw new Error("Rolle nicht gefunden");
        return res.json();
      })
      .then((data: ApiResponse) => {
        if (cancelled) return;
        setArticles(data.articles);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Fehler beim Laden.");
      });
    return () => {
      cancelled = true;
    };
  }, [open, role]);

  function close() {
    setOpen(false);
  }

  if (!mounted) return null;

  const panel = (
    <AnimatePresence>
      {open && role && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/30"
            onClick={close}
          />
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            // top/right/bottom set inline (not via Tailwind inset-y-0/right-0
            // utilities) — those two specific utility classes aren't used
            // anywhere else in this codebase and were observed to not get
            // picked up by the dev server's on-demand CSS generation,
            // leaving the panel unpositioned (full document height instead
            // of clipped to the viewport). Inline styles sidestep that
            // class-discovery timing issue entirely, in dev and in prod.
            style={{ top: 0, right: 0, bottom: 0 }}
            className="dock-panel fixed z-50 flex w-[min(92vw,26rem)] flex-col rounded-none border-l border-border shadow-2xl"
          >
            {/* Pinned header — role name + "Test starten" always visible,
                never scrolls away with the article list below. */}
            <div className="flex shrink-0 flex-col gap-3 border-b border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rolle</p>
                  <h2 className="truncate text-lg font-semibold text-foreground">{role.label}</h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Panel schließen"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-background"
                >
                  <X size={16} />
                </button>
              </div>

              <Link href={`/roles/${role.id}/test`} onClick={close}>
                <Button variant="primary" className="w-full">
                  <GraduationCap size={15} /> Test starten
                </Button>
              </Link>

              <Link
                href={`/roles/${role.id}`}
                onClick={close}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Vollständige Rollenseite öffnen →
              </Link>
            </div>

            {/* Scrollable article list. */}
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {articles === null && !error && (
                <div className="flex flex-col gap-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-14 animate-pulse rounded-xl bg-border/40" />
                  ))}
                </div>
              )}

              {error && <p className="px-1 py-4 text-center text-sm text-danger">{error}</p>}

              {articles !== null && articles.length === 0 && (
                <p className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                  Für diese Rolle sind noch keine Artikel hinterlegt.
                </p>
              )}

              {articles !== null && articles.length > 0 && (
                <>
                  <p className="mb-2 px-1 text-xs text-muted-foreground">
                    {articles.length} passende{articles.length === 1 ? "r Artikel" : " Artikel"}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {articles.map((a) => (
                      <li key={a.id}>
                        <Link
                          href={`/articles/${a.id}`}
                          onClick={close}
                          className="flex items-start gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm hover:border-accent/40 hover:bg-accent/5"
                        >
                          <FileText size={14} className="mt-0.5 shrink-0 text-muted-foreground" />
                          <span className="min-w-0">
                            <span className="block truncate font-medium text-foreground">{a.title}</span>
                            <span className="block truncate text-xs text-muted-foreground">{a.domainTitle}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(panel, document.body);
}
