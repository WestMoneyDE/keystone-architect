"use client";

// Fast-follow on top of ticket 4's manual /setup wizard: startup
// auto-detection (lib/llm/autodetect.ts) now handles the common case (an
// already-authenticated claude-cli, or ANTHROPIC_API_KEY/OPENAI_API_KEY set
// as an env var). When NEITHER of those apply, the user is left with no
// active LLM provider and would otherwise only discover /setup by noticing
// scattered "kein Anbieter konfiguriert" states across AI-powered features.
//
// Decision: a dismissible banner, not a hard redirect. The user explicitly
// framed the desired behavior as "wenn er nichts findet kommt das fenster
// für die einrichtung" (the setup window/guidance appears) — read as "make
// it discoverable," not "block the person who just wants to read articles."
// A forced redirect on every load of a book-reading app would be hostile
// for a no-AI browsing session. Dismissal is remembered in localStorage
// (same pattern as the sidebar-collapsed/theme state elsewhere in AppShell)
// so it doesn't nag on every visit — it reappears only after a fresh
// deployment/localStorage clear, which is an acceptable trade-off given how
// cheap it is to re-dismiss once.
import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const DISMISS_KEY = "keystone:no-provider-banner-dismissed";

export function NoProviderBanner({ show }: { show: boolean }) {
  const [dismissed, setDismissed] = useState(true); // default hidden until we know localStorage state, avoids a flash

  useEffect(() => {
    if (!show) return;
    try {
      // Syncing from localStorage (an external system, unavailable during
      // SSR) — the same documented exception AppShell.tsx uses for its own
      // persisted state.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, [show]);

  if (!show || dismissed) return null;

  function dismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore — non-critical persistence
    }
  }

  return (
    <GlassCard className="flex items-center justify-between gap-3 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <Sparkles size={18} className="mt-0.5 shrink-0 text-accent" />
        <div>
          <p className="text-sm font-medium text-foreground">Noch kein KI-Anbieter eingerichtet</p>
          <p className="text-xs text-muted-foreground">
            Wir haben weder eine eingeloggte Claude Code CLI noch einen API-Key als Umgebungsvariable gefunden. Du
            kannst die Wissensbasis ganz normal lesen — Chat, smarte Suche und Tests brauchen aber einen Anbieter.
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/setup"
          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:opacity-90"
        >
          Einrichten
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Hinweis ausblenden"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-background"
        >
          <X size={14} />
        </button>
      </div>
    </GlassCard>
  );
}
