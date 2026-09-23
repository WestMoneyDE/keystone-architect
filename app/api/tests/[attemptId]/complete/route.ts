// app/api/tests/[attemptId]/complete/route.ts — finalizes a TestAttempt:
// computes the aggregate score (mode-appropriate formula from
// lib/grading.ts), sets completedAt/score/passed, and — if passed —
// generates the certificate (PDF + social card) via lib/certificate/generate.ts.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aggregateGradedScore, aggregateSelfAssessedScore, isPassing } from "@/lib/grading";
import { generateCertificate } from "@/lib/certificate/generate";

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) throw new Error("No default user found — run `npm run db:seed` first.");
  return user;
}

export async function POST(_request: Request, { params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  const user = await getDefaultUser();

  const attempt = await db.testAttempt.findFirst({
    where: { id: attemptId, userId: user.id },
    include: { test: true, answers: true },
  });
  if (!attempt) {
    return NextResponse.json({ error: "attempt-not-found" }, { status: 404 });
  }

  // Idempotent: completing an already-completed attempt just returns its
  // existing result (plus certificate id if one exists) rather than
  // re-scoring or erroring.
  if (attempt.completedAt) {
    const existingCert = await db.certificate.findUnique({ where: { attemptId } });
    return NextResponse.json({
      attemptId,
      score: attempt.score,
      passed: attempt.passed,
      certificateId: existingCert?.id ?? null,
    });
  }

  let aggregateScore: number;
  if (attempt.test.mode === "graded") {
    const answered = attempt.answers.filter((a) => a.score != null);
    if (answered.length < attempt.answers.length) {
      return NextResponse.json(
        { error: "incomplete", detail: `${attempt.answers.length - answered.length} question(s) not yet answered/graded` },
        { status: 409 }
      );
    }
    aggregateScore = aggregateGradedScore(answered.map((a) => a.score as number));
  } else {
    const answered = attempt.answers.filter((a) => a.selfRating != null);
    if (answered.length < attempt.answers.length) {
      return NextResponse.json(
        { error: "incomplete", detail: `${attempt.answers.length - answered.length} question(s) not yet self-rated` },
        { status: 409 }
      );
    }
    aggregateScore = aggregateSelfAssessedScore(answered.map((a) => a.selfRating as number));
  }

  const passed = isPassing(aggregateScore, attempt.test.passThreshold);

  await db.testAttempt.update({
    where: { id: attemptId },
    data: { completedAt: new Date(), score: aggregateScore, passed },
  });

  let certificateId: string | null = null;
  if (passed) {
    const cert = await generateCertificate(attemptId);
    certificateId = cert.certificateId;
  }

  return NextResponse.json({
    attemptId,
    score: aggregateScore,
    passed,
    passThreshold: attempt.test.passThreshold,
    certificateId,
  });
}
