// app/api/tests/[attemptId]/answer/route.ts — submits and grades ONE
// question's answer within an in-progress TestAttempt (ticket 9).
//   - Graded mode: real free-text answer -> single completeJSON grading
//     call (lib/grading.ts), persists score/verdict/feedback/provider.
//   - Self-assessed mode: records the user's 1-4 self-rating after they
//     reveal the reference answer client-side; no LLM call.
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getActiveProvider } from "@/lib/llm/factory";
import { gradeAnswer } from "@/lib/grading";

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) throw new Error("No default user found — run `npm run db:seed` first.");
  return user;
}

const answerSchema = z.union([
  z.object({
    testAttemptAnswerId: z.string(),
    userAnswer: z.string().min(0).max(8000),
  }),
  z.object({
    testAttemptAnswerId: z.string(),
    selfRating: z.number().int().min(1).max(4),
  }),
]);

export async function POST(request: Request, { params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  const user = await getDefaultUser();

  const body = await request.json();
  const parsed = answerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const attempt = await db.testAttempt.findFirst({
    where: { id: attemptId, userId: user.id },
    include: { test: true },
  });
  if (!attempt) {
    return NextResponse.json({ error: "attempt-not-found" }, { status: 404 });
  }
  if (attempt.completedAt) {
    return NextResponse.json({ error: "attempt-already-completed" }, { status: 409 });
  }

  const answerRow = await db.testAttemptAnswer.findFirst({
    where: { id: parsed.data.testAttemptAnswerId, attemptId },
    include: { interviewQuestion: true },
  });
  if (!answerRow) {
    return NextResponse.json({ error: "answer-not-found" }, { status: 404 });
  }

  if (attempt.test.mode === "self-assessed") {
    if (!("selfRating" in parsed.data)) {
      return NextResponse.json({ error: "self-assessed test requires selfRating" }, { status: 400 });
    }
    const updated = await db.testAttemptAnswer.update({
      where: { id: answerRow.id },
      data: { selfRating: parsed.data.selfRating },
    });
    return NextResponse.json({
      testAttemptAnswerId: updated.id,
      mode: "self-assessed",
      selfRating: updated.selfRating,
    });
  }

  // Graded mode.
  if (!("userAnswer" in parsed.data)) {
    return NextResponse.json({ error: "graded test requires userAnswer" }, { status: 400 });
  }

  const provider = await getActiveProvider(user.id);
  if (!provider) {
    // Provider was deactivated mid-attempt — surface distinctly rather than
    // pretending the grading call happened.
    return NextResponse.json({ error: "no-provider" }, { status: 409 });
  }

  const result = await gradeAnswer(provider, {
    question: answerRow.interviewQuestion.question,
    referenceAnswer: answerRow.interviewQuestion.referenceAnswer,
    userAnswer: parsed.data.userAnswer,
  });

  const updated = await db.testAttemptAnswer.update({
    where: { id: answerRow.id },
    data: {
      userAnswer: parsed.data.userAnswer,
      score: result.score,
      verdict: result.verdict,
      llmFeedback: result.feedback,
      gradedByProvider: provider.id,
    },
  });

  return NextResponse.json({
    testAttemptAnswerId: updated.id,
    mode: "graded",
    score: updated.score,
    verdict: updated.verdict,
    feedback: updated.llmFeedback,
    referenceAnswer: answerRow.interviewQuestion.referenceAnswer,
  });
}
