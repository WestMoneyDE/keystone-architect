"use client";

// components/test/TestRunner.tsx — the in-progress test flow (ticket 9).
// One question at a time (matches the per-question `answer` API route
// naturally), progress indicator, mode-specific UI:
//   - graded: free-text textarea -> submit -> shows LLM
//     score/verdict/feedback inline before advancing.
//   - self-assessed: shows the question, a "Antwort anzeigen" reveal
//     button, then 1-4 self-rating buttons (only after reveal).
// Ends on a results screen (pass/fail, score, certificate link if passed).

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Award, ArrowRight, Eye } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export interface TestQuestion {
  testAttemptAnswerId: string;
  interviewQuestionId: string;
  question: string;
  referenceAnswer: string | null;
}

export interface TestRunnerProps {
  attemptId: string;
  roleId: string;
  roleLabel: string;
  mode: "graded" | "self-assessed";
  passThreshold: number;
  questions: TestQuestion[];
}

interface GradedFeedback {
  score: number;
  verdict: "correct" | "partial" | "incorrect";
  feedback: string;
}

type CompletionResult = { score: number; passed: boolean; certificateId: string | null } | null;

const verdictBadge: Record<GradedFeedback["verdict"], { variant: "success" | "warning" | "danger"; label: string }> = {
  correct: { variant: "success", label: "Richtig" },
  partial: { variant: "warning", label: "Teilweise richtig" },
  incorrect: { variant: "danger", label: "Falsch" },
};

export function TestRunner({ attemptId, roleId, roleLabel, mode, passThreshold, questions }: TestRunnerProps) {
  const [index, setIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [gradedFeedback, setGradedFeedback] = useState<GradedFeedback | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [selfRating, setSelfRating] = useState<number | null>(null);
  const [completing, setCompleting] = useState(false);
  const [result, setResult] = useState<CompletionResult>(null);
  const [error, setError] = useState<string | null>(null);

  const current = questions[index];
  const isLast = index === questions.length - 1;

  async function submitGraded() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/tests/${attemptId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testAttemptAnswerId: current.testAttemptAnswerId, userAnswer: answerText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error === "no-provider" ? "Der LLM-Anbieter wurde deaktiviert. Bitte Seite neu laden." : "Fehler beim Bewerten der Antwort.");
        return;
      }
      setGradedFeedback({ score: data.score, verdict: data.verdict, feedback: data.feedback });
    } finally {
      setSubmitting(false);
    }
  }

  async function submitSelfRating(rating: number) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/tests/${attemptId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testAttemptAnswerId: current.testAttemptAnswerId, selfRating: rating }),
      });
      if (!res.ok) {
        setError("Fehler beim Speichern der Selbsteinschätzung.");
        return;
      }
      setSelfRating(rating);
    } finally {
      setSubmitting(false);
    }
  }

  async function goNextOrFinish() {
    if (isLast) {
      setCompleting(true);
      setError(null);
      try {
        const res = await fetch(`/api/tests/${attemptId}/complete`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) {
          setError("Test konnte nicht abgeschlossen werden.");
          return;
        }
        setResult({ score: data.score, passed: data.passed, certificateId: data.certificateId ?? null });
      } finally {
        setCompleting(false);
      }
      return;
    }
    setIndex((i) => i + 1);
    setAnswerText("");
    setGradedFeedback(null);
    setRevealed(false);
    setSelfRating(null);
  }

  if (result) {
    return (
      <GlassCard className="mx-auto flex max-w-xl flex-col items-center gap-4 p-10 text-center rounded-2xl">
        {result.passed ? (
          <Award className="text-success" size={48} />
        ) : (
          <XCircle className="text-danger" size={48} />
        )}
        <h2 className="text-2xl font-bold text-foreground">
          {result.passed ? "Bestanden!" : "Nicht bestanden"}
        </h2>
        <p className="text-muted-foreground">
          {roleLabel} · Ergebnis: <span className="font-semibold text-foreground">{result.score.toFixed(1)}%</span>{" "}
          (Bestehensgrenze: {passThreshold}%)
        </p>
        <div className="mt-2 flex gap-3">
          {result.passed && result.certificateId && (
            <Link href={`/roles/${roleId}/certificate/${attemptId}`}>
              <Button variant="primary">Zertifikat ansehen</Button>
            </Link>
          )}
          <Link href={`/roles/${roleId}`}>
            <Button variant="secondary">Zurück zur Rolle</Button>
          </Link>
        </div>
      </GlassCard>
    );
  }

  const canAdvanceGraded = gradedFeedback !== null;
  const canAdvanceSelf = selfRating !== null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{roleLabel} — Zertifizierungstest</p>
          <p className="text-xs text-muted-foreground">
            Modus: {mode === "graded" ? "LLM-bewertet" : "Selbsteinschätzung"}
          </p>
        </div>
        <Badge variant="accent">
          {index + 1}/{questions.length}
        </Badge>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/60">
        <motion.div
          className="h-full bg-accent"
          animate={{ width: `${((index + 1) / questions.length) * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.testAttemptAnswerId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          <GlassCard className="flex flex-col gap-4 p-6 rounded-2xl">
            <p className="text-lg font-medium text-foreground">{current.question}</p>

            {mode === "graded" ? (
              <>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  disabled={canAdvanceGraded || submitting}
                  rows={6}
                  placeholder="Deine Antwort…"
                  className="w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm text-foreground outline-none focus:border-accent disabled:opacity-70"
                />

                {gradedFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex flex-col gap-2 rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant={verdictBadge[gradedFeedback.verdict].variant}>
                        {verdictBadge[gradedFeedback.verdict].label}
                      </Badge>
                      <span className="text-sm font-semibold text-foreground">{gradedFeedback.score}/100</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{gradedFeedback.feedback}</p>
                  </motion.div>
                )}

                {!canAdvanceGraded ? (
                  <Button
                    variant="primary"
                    onClick={submitGraded}
                    disabled={submitting || answerText.trim().length === 0}
                    className="self-end"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : "Antwort einreichen"}
                  </Button>
                ) : (
                  <Button variant="primary" onClick={goNextOrFinish} disabled={completing} className="self-end gap-1.5">
                    {completing ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        {isLast ? "Test abschließen" : "Nächste Frage"} <ArrowRight size={16} />
                      </>
                    )}
                  </Button>
                )}
              </>
            ) : (
              <>
                {!revealed ? (
                  <Button variant="secondary" onClick={() => setRevealed(true)} className="gap-1.5 self-start">
                    <Eye size={16} /> Antwort anzeigen
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="rounded-xl border border-border bg-background p-4 text-sm text-foreground">
                      {current.referenceAnswer}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Wie gut kanntest du die Antwort? (1 = kaum, 4 = sehr gut)
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          type="button"
                          disabled={submitting || selfRating !== null}
                          onClick={() => submitSelfRating(n)}
                          className={`flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-semibold transition-colors ${
                            selfRating === n
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-border bg-surface text-foreground hover:bg-background"
                          } disabled:opacity-60`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {canAdvanceSelf && (
                  <Button variant="primary" onClick={goNextOrFinish} disabled={completing} className="self-end gap-1.5">
                    {completing ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        {isLast ? "Test abschließen" : "Nächste Frage"} <ArrowRight size={16} />
                      </>
                    )}
                  </Button>
                )}
              </>
            )}

            {error && (
              <p className="flex items-center gap-1.5 text-sm text-danger">
                <XCircle size={14} /> {error}
              </p>
            )}
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      {mode === "graded" && gradedFeedback?.verdict === "correct" && (
        <p className="flex items-center gap-1.5 text-xs text-success">
          <CheckCircle2 size={13} /> Gut gemacht.
        </p>
      )}
    </div>
  );
}
