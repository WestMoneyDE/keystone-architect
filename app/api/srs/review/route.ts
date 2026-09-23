// app/api/srs/review/route.ts — POST a single SM-2 self-rating for one
// InterviewQuestion (ticket 10). Loads the existing SrsState row (or
// starts a fresh one via lib/srs.ts's newCardState() if this is the
// user's first review of that question), applies reviewCard(), and
// upserts the persisted state.
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { newCardState, reviewCard, type SrsRating } from "@/lib/srs";

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) throw new Error("No default user found — run `npm run db:seed` first.");
  return user;
}

const reviewSchema = z.object({
  interviewQuestionId: z.string(),
  rating: z.enum(["again", "hard", "good", "easy"]),
});

export async function POST(request: Request) {
  const user = await getDefaultUser();

  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { interviewQuestionId, rating } = parsed.data;

  const question = await db.interviewQuestion.findUnique({ where: { id: interviewQuestionId } });
  if (!question) {
    return NextResponse.json({ error: "question-not-found" }, { status: 404 });
  }

  const existing = await db.srsState.findUnique({
    where: { userId_interviewQuestionId: { userId: user.id, interviewQuestionId } },
  });

  const priorState = existing
    ? {
        easeFactor: existing.easeFactor,
        intervalDays: existing.intervalDays,
        repetitions: existing.repetitions,
        dueAt: existing.dueAt,
      }
    : newCardState();

  const nextState = reviewCard(priorState, rating as SrsRating);

  const saved = await db.srsState.upsert({
    where: { userId_interviewQuestionId: { userId: user.id, interviewQuestionId } },
    create: {
      userId: user.id,
      interviewQuestionId,
      easeFactor: nextState.easeFactor,
      intervalDays: nextState.intervalDays,
      repetitions: nextState.repetitions,
      dueAt: nextState.dueAt,
    },
    update: {
      easeFactor: nextState.easeFactor,
      intervalDays: nextState.intervalDays,
      repetitions: nextState.repetitions,
      dueAt: nextState.dueAt,
    },
  });

  return NextResponse.json({
    interviewQuestionId,
    easeFactor: saved.easeFactor,
    intervalDays: saved.intervalDays,
    repetitions: saved.repetitions,
    dueAt: saved.dueAt,
  });
}
