// lib/grading.ts — hybrid test-grading logic (ticket 9).
//
// Implements "Resolved product design" item 9 from the build plan EXACTLY:
//
//   - Graded mode (LLM provider active): free-text answer -> one
//     `completeJSON` call per question with a fixed rubric prompt taking
//     {question, referenceAnswer, userAnswer} and returning
//     {score: 0-100, verdict: 'correct'|'partial'|'incorrect', feedback}.
//     The full grading result is stored per TestAttemptAnswer for auditability.
//   - Self-assessed mode (no provider configured): the question is shown,
//     the user reveals the reference answer, then self-rates 1-4.
//   - Aggregate scoring: graded mode averages the 0-100 per-question scores;
//     self-assessed mode computes the percentage of questions rated 3 or 4.
//   - Pass threshold: Test.passThreshold (default 70), applies identically
//     to both modes since both produce a 0-100 aggregate.
//
// Determinism note: the LLMProvider interface's `completeJSON<T>(messages,
// schema)` (lib/llm/types.ts) intentionally has NO `options`/temperature
// parameter — that shape is durable/frozen per the plan's "Core interfaces"
// section and this ticket must match it exactly, not reinterpret it. There
// is therefore no code-level lever to force temperature:0 through this
// call. The rubric prompt below compensates the only way available at this
// layer: it explicitly instructs the model to grade deterministically and
// consistently, and keeps the rubric compact/objective so repeated calls
// with the same input are as stable as the underlying provider allows. This
// is a known, documented limitation — see the ticket 9 report.

import type { LLMProvider } from "./llm/types";

export type TestMode = "graded" | "self-assessed";

export interface GradedResult {
  score: number; // 0-100
  verdict: "correct" | "partial" | "incorrect";
  feedback: string;
}

/**
 * JSON Schema passed to `completeJSON` — the fixed rubric response shape.
 * Kept as a plain object (not a class) so it can be embedded directly in
 * the "respond with ONLY a JSON object conforming to this schema" prompt
 * every provider implementation already builds (see lib/llm/providers/*).
 */
export const GRADING_RESULT_SCHEMA = {
  type: "object",
  properties: {
    score: { type: "number", minimum: 0, maximum: 100 },
    verdict: { type: "string", enum: ["correct", "partial", "incorrect"] },
    feedback: { type: "string" },
  },
  required: ["score", "verdict", "feedback"],
  additionalProperties: false,
} as const;

/**
 * Selects the test mode for the CURRENT attempt based on whether an
 * LLMProvider is presently active for this user. See the ticket 9 report
 * for the mode-selection design decision this function embodies: `Test.mode`
 * is treated as the mode a given `Test` row was created/reused with at
 * `start` time, re-derived fresh from live provider state on every attempt
 * start rather than trusted as a frozen historical fact — so a `Test` row
 * naturally "follows" the user's current provider configuration over time.
 */
export function resolveTestMode(provider: LLMProvider | null): TestMode {
  return provider ? "graded" : "self-assessed";
}

const GRADING_SYSTEM_PROMPT =
  "You are a strict, fair, and CONSISTENT technical interviewer grading a candidate's free-text " +
  "answer to an enterprise-architecture / IT-leadership interview question, against a reference " +
  "answer. Grade deterministically: given the same question, reference answer, and candidate " +
  "answer, you must always return the same score and verdict — do not vary your grading style " +
  "between calls. Be objective and rubric-driven, not lenient or harsh out of politeness.\n\n" +
  "Scoring rubric:\n" +
  "- 90-100: candidate's answer covers essentially all key points of the reference answer, " +
  "technically accurate, no material omissions.\n" +
  "- 70-89: candidate covers the core idea correctly with only minor gaps or imprecision.\n" +
  "- 40-69: candidate is partially correct — grasps part of the concept but misses significant " +
  "elements or contains a notable inaccuracy.\n" +
  "- 1-39: candidate's answer is largely incorrect, off-topic, or missing.\n" +
  "- 0: no meaningful answer given.\n\n" +
  "verdict mapping: score >= 70 => 'correct', score 40-69 => 'partial', score < 40 => 'incorrect'.\n" +
  "feedback: 1-3 concise sentences explaining WHY the candidate received this score, referencing " +
  "specifically what was right or missing, so the candidate can inspect why they were marked as " +
  "they were. Write feedback in the same language as the candidate's answer (default to German " +
  "if unclear).";

/**
 * Grades one free-text answer against its reference answer via a single
 * `completeJSON` call, per the plan's "one call per question" requirement.
 */
export async function gradeAnswer(
  provider: LLMProvider,
  input: { question: string; referenceAnswer: string; userAnswer: string }
): Promise<GradedResult> {
  const { question, referenceAnswer, userAnswer } = input;

  const raw = await provider.completeJSON<GradedResult>(
    [
      { role: "system", content: GRADING_SYSTEM_PROMPT },
      {
        role: "user",
        content:
          `Question:\n${question}\n\n` +
          `Reference answer:\n${referenceAnswer}\n\n` +
          `Candidate's answer:\n${userAnswer.trim().length > 0 ? userAnswer : "(no answer given)"}`,
      },
    ],
    GRADING_RESULT_SCHEMA
  );

  // Defensive clamping/normalization — never trust the model's numeric range
  // or verdict spelling blindly, even though the schema/prompt constrain it.
  const score = Math.max(0, Math.min(100, Math.round(Number(raw.score) || 0)));
  const verdict: GradedResult["verdict"] =
    raw.verdict === "correct" || raw.verdict === "partial" || raw.verdict === "incorrect"
      ? raw.verdict
      : score >= 70
        ? "correct"
        : score >= 40
          ? "partial"
          : "incorrect";

  return { score, verdict, feedback: raw.feedback ?? "" };
}

/** Aggregate scoring for graded mode: simple average of per-question 0-100 scores. */
export function aggregateGradedScore(scores: number[]): number {
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, s) => acc + s, 0);
  return Math.round((sum / scores.length) * 100) / 100;
}

/**
 * Aggregate scoring for self-assessed mode: percentage of questions the
 * user rated 3 or 4 (per the plan: "1-2 = fail-ish / 3-4 = pass-ish per
 * question", aggregated as "% of questions rated 3 or 4").
 */
export function aggregateSelfAssessedScore(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const passing = ratings.filter((r) => r >= 3).length;
  return Math.round((passing / ratings.length) * 10000) / 100;
}

/** Pass/fail against Test.passThreshold — identical logic for both modes. */
export function isPassing(aggregateScore: number, passThreshold: number): boolean {
  return aggregateScore >= passThreshold;
}
