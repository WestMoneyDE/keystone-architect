"use client";

// components/srs/ReviewQueue.tsx — the SRS flashcard review flow (ticket
// 10). Deliberately simpler than components/test/TestRunner.tsx: no LLM
// grading at all, just a deterministic SM-2 self-rating flow — "Antwort
// anzeigen" reveal, then four German rating buttons (Nochmal/Schwer/
// Gut/Leicht, matching the old flat-file app's established convention)
// that POST to /api/srs/review and advance to the next card.

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Eye, PartyPopper, RotateCcw, Shuffle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { SrsMode } from "./ModeSelector";

interface SrsCard {
  interviewQuestionId: string;
  question: string;
  referenceAnswer: string;
  articleId: string;
  articleTitle: string;
  isNew: boolean;
}

interface DueResponse {
  cards: SrsCard[];
  dueCount: number;
  newCount: number;
}

export interface ReviewQueueProps {
  roleId?: string;
  domainId?: string;
  mode: SrsMode;
  // Learned-mode candidate pool size, as known from the mode-selection
  // screen's /api/srs/counts fetch — used only to tell "you have zero
  // touched articles at all" apart from "you're just caught up right now"
  // in the empty state below (learned mode, honest messaging).
  learnedPoolSize?: number;
  onChangeMode: () => void;
}

const RATING_BUTTONS: { key: "again" | "hard" | "good" | "easy"; label: string; variant: "secondary" | "primary" }[] = [
  { key: "again", label: "Nochmal", variant: "secondary" },
  { key: "hard", label: "Schwer", variant: "secondary" },
  { key: "good", label: "Gut", variant: "primary" },
  { key: "easy", label: "Leicht", variant: "primary" },
];

export function ReviewQueue({ roleId, domainId, mode, learnedPoolSize, onChangeMode }: ReviewQueueProps) {
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<SrsCard[]>([]);
  const [total, setTotal] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (roleId) params.set("roleId", roleId);
    if (domainId) params.set("domainId", domainId);
    params.set("mode", mode);
    const qs = params.toString();

    fetch(`/api/srs/due${qs ? `?${qs}` : ""}`)
      .then((res) => res.json())
      .then((data: DueResponse) => {
        setCards(data.cards);
        setTotal(data.cards.length);
      })
      .catch(() => setError("Warteschlange konnte nicht geladen werden."))
      .finally(() => setLoading(false));
  }, [roleId, domainId, mode]);

  const current = cards[0];

  async function submitRating(rating: "again" | "hard" | "good" | "easy") {
    if (!current) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/srs/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewQuestionId: current.interviewQuestionId, rating }),
      });
      if (!res.ok) {
        setError("Bewertung konnte nicht gespeichert werden.");
        return;
      }
      setCards((prev) => prev.slice(1));
      setReviewedCount((c) => c + 1);
      setRevealed(false);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center p-12 text-sm text-muted-foreground">
        Lade Karten…
      </div>
    );
  }

  // "Gelerntes" mode with zero eligible cards because the user hasn't
  // touched anything yet (a genuine, likely new-user case) — distinct from
  // "you're just caught up right now", which gets the generic empty state
  // below.
  const learnedModeNoInventory = mode === "learned" && learnedPoolSize === 0 && reviewedCount === 0;

  if (!current) {
    // Empty state — per the plan's "considered empty states" delight
    // principle, don't just show a blank page.
    return (
      <GlassCard className="mx-auto flex max-w-xl flex-col items-center gap-3 p-10 text-center rounded-2xl">
        <PartyPopper className="text-accent" size={40} />
        <h2 className="text-xl font-bold text-foreground">
          {learnedModeNoInventory
            ? "Noch nichts zum Wiederholen"
            : reviewedCount > 0
              ? "Alles erledigt!"
              : "Keine Karten fällig"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {learnedModeNoInventory
            ? "Du hast noch keine Dokumente bearbeitet — lies oder markiere zuerst ein paar Artikel, dann stehen hier Karten aus dem \"Gelerntes\"-Modus zur Verfügung."
            : reviewedCount > 0
              ? `Du hast ${reviewedCount} Karte${reviewedCount === 1 ? "" : "n"} in dieser Sitzung wiederholt. Komm später wieder, wenn neue Karten fällig sind.`
              : "Keine Karten fällig — komm später wieder, oder stöbere in den Artikeln."}
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <Link href="/domains">
            <Button variant="secondary" className="gap-1.5">
              <BookOpen size={14} /> Artikel durchsuchen
            </Button>
          </Link>
          <Button variant="ghost" className="gap-1.5" onClick={onChangeMode}>
            <Shuffle size={14} /> Modus wechseln
          </Button>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            SRS-Wiederholung · {mode === "learned" ? "Gelerntes" : "Zufällig"}
          </p>
          <p className="text-xs text-muted-foreground">{current.articleTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="accent">{cards.length} verbleibend</Badge>
          <button
            type="button"
            onClick={onChangeMode}
            className="text-xs text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-foreground"
          >
            Modus wechseln
          </button>
        </div>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
        <motion.div
          className="h-full bg-accent"
          animate={{ width: total > 0 ? `${((total - cards.length) / total) * 100}%` : "0%" }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <AnimatePresence mode="wait">
        <motion.div
          key={current.interviewQuestionId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <GlassCard className="flex flex-col gap-4 p-6 rounded-2xl">
            {current.isNew && <Badge variant="neutral">Neue Karte</Badge>}
            <p className="text-lg font-medium text-foreground">{current.question}</p>

            {!revealed ? (
              <Button variant="secondary" onClick={() => setRevealed(true)} className="w-fit gap-1.5">
                <Eye size={14} /> Antwort anzeigen
              </Button>
            ) : (
              <>
                <div className="rounded-xl border border-border bg-background p-4 text-sm text-foreground/90">
                  {current.referenceAnswer}
                </div>
                <div className="flex flex-wrap gap-2">
                  {RATING_BUTTONS.map((b) => (
                    <Button
                      key={b.key}
                      variant={b.variant}
                      disabled={submitting}
                      onClick={() => submitRating(b.key)}
                      className="gap-1.5"
                    >
                      {b.key === "again" && <RotateCcw size={14} />}
                      {b.label}
                    </Button>
                  ))}
                </div>
              </>
            )}
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
