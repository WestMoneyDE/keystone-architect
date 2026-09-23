"use client";

import { useCallback, useState } from "react";
import { Sparkles, Loader2, RefreshCw, ChevronDown, ChevronUp, Settings } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";

interface ApiMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface SummaryConversation {
  id: string;
  title: string | null;
  createdAt: string;
  messages: ApiMessage[];
}

export interface SummaryEntryProps {
  articleId: string;
  /** All existing type:"summary" conversations for this article, newest first. */
  summaries: SummaryConversation[];
  /** Called after a new summary is successfully generated, to refresh the parent's list. */
  onCreated: () => void;
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const minutes = Math.round(Math.max(0, Date.now() - then) / 60000);
  if (minutes < 1) return "gerade eben";
  if (minutes < 60) return `vor ${minutes} Min.`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `vor ${hours} Std.`;
  const days = Math.round(hours / 24);
  return `vor ${days} Tag${days === 1 ? "" : "en"}`;
}

/**
 * Always the first row, visually distinct (accent tint, not just another
 * list row) and NOT part of the relevance-scored/sorted list below it — per
 * the plan: "not scored — pinned as a fixed first row." Generates (via
 * POST /api/chat/summarize) an LLM synthesis of every conversation on this
 * article. Previously generated summaries are never silently lost: the most
 * recent one stays one click away to reopen, and older ones are listable
 * via the small "frühere Zusammenfassungen" disclosure.
 */
export function SummaryEntry({ articleId, summaries, onCreated }: SummaryEntryProps) {
  const [loading, setLoading] = useState(false);
  const [noProvider, setNoProvider] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showOlder, setShowOlder] = useState(false);
  const { show: showToast } = useToast();

  const latest = summaries[0] ?? null;
  const older = summaries.slice(1);

  const reopen = useCallback(
    (s: SummaryConversation) => {
      // Ticket 8: summaries also open in the dock's large, document-width
      // size variant, consistent with reopening a conversation from the
      // sidebar or clicking a note's link button.
      window.dispatchEvent(
        new CustomEvent("keystone:open-dock", {
          detail: { mode: "reopen", size: "large", conversationId: s.id, articleId, messages: s.messages },
        }),
      );
    },
    [articleId],
  );

  const generate = useCallback(
    async (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (loading) return;
      setLoading(true);
      setNoProvider(false);
      setErrorMsg(null);
      try {
        const res = await fetch("/api/chat/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId }),
        });
        const data = await res.json();
        if (data?.error === "no-provider") {
          setNoProvider(true);
          return;
        }
        if (!res.ok || data?.error) {
          setErrorMsg(data?.message ?? "Zusammenfassung konnte nicht erstellt werden.");
          return;
        }
        onCreated();
        showToast({ message: "Zusammenfassung erstellt." });
        reopen(data.conversation);
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : "Etwas ist schiefgelaufen.");
      } finally {
        setLoading(false);
      }
    },
    [articleId, loading, onCreated, reopen, showToast],
  );

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        onClick={() => (latest ? reopen(latest) : generate())}
        disabled={loading}
        className="flex w-full flex-col gap-1 rounded-xl border border-accent/30 bg-accent/10 px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent/15 disabled:opacity-70"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1.5 font-medium text-foreground">
            <Sparkles size={14} className="shrink-0 text-accent" />
            <span className="truncate">Zusammenfassung aller Gespräche</span>
          </span>
          <span
            role="button"
            tabIndex={0}
            aria-label={latest ? "Neu generieren" : "Erstellen"}
            onClick={generate}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") generate(e as unknown as React.MouseEvent);
            }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-accent hover:bg-background"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {loading
            ? "Wird erstellt…"
            : latest
              ? `Zuletzt aktualisiert ${formatRelativeTime(latest.createdAt)} — klicken zum Öffnen`
              : "Noch keine Zusammenfassung — klicken zum Erstellen"}
        </p>
      </button>

      {noProvider && (
        <div className="flex flex-col items-start gap-1 rounded-lg border border-border bg-background px-3 py-2 text-xs">
          <p className="text-foreground">Kein LLM-Anbieter konfiguriert.</p>
          <Link href="/setup" className="inline-flex items-center gap-1 text-accent hover:underline">
            <Settings size={11} /> Zu den Einstellungen
          </Link>
        </div>
      )}
      {errorMsg && <p className="px-1 text-xs text-danger">{errorMsg}</p>}

      {older.length > 0 && (
        <div className="px-1">
          <button
            type="button"
            onClick={() => setShowOlder((v) => !v)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {showOlder ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {older.length} frühere Zusammenfassung{older.length === 1 ? "" : "en"}
          </button>
          {showOlder && (
            <ul className="mt-1 flex flex-col gap-1">
              {older.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => reopen(s)}
                    className="w-full truncate rounded-lg px-2 py-1 text-left text-xs text-muted-foreground hover:bg-surface hover:text-foreground"
                  >
                    {formatRelativeTime(s.createdAt)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
