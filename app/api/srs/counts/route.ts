// app/api/srs/counts/route.ts — GET queue-size counts for both SRS modes,
// used by the mode-selection screen in app/srs/page.tsx so "Gelerntes
// (42 Karten)" can show a real number instead of a guess. Deliberately
// cheap: db.count() calls only (no card payloads), capping the "new cards"
// side at the same NEW_CARDS_PER_SESSION used by /api/srs/due so the
// number shown here matches what a session would actually contain.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTouchedArticleIds } from "@/lib/engagement";

const NEW_CARDS_PER_SESSION = 20;

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) throw new Error("No default user found — run `npm run db:seed` first.");
  return user;
}

async function countForMode(userId: string, articleIdFilter: string[] | null) {
  const now = new Date();
  const articleWhere = articleIdFilter ? { id: { in: articleIdFilter } } : undefined;

  const [dueCount, reviewedIds] = await Promise.all([
    db.srsState.count({
      where: {
        userId,
        dueAt: { lte: now },
        ...(articleWhere ? { interviewQuestion: { article: articleWhere } } : {}),
      },
    }),
    db.srsState.findMany({ where: { userId }, select: { interviewQuestionId: true } }),
  ]);

  const newAvailable = await db.interviewQuestion.count({
    where: {
      id: { notIn: reviewedIds.map((r) => r.interviewQuestionId) },
      ...(articleWhere ? { article: articleWhere } : {}),
    },
  });

  return dueCount + Math.min(newAvailable, NEW_CARDS_PER_SESSION);
}

export async function GET() {
  const user = await getDefaultUser();
  const touchedArticleIds = await getTouchedArticleIds(user.id);

  const [randomCount, learnedCount] = await Promise.all([
    countForMode(user.id, null),
    countForMode(user.id, Array.from(touchedArticleIds)),
  ]);

  return NextResponse.json({ randomCount, learnedCount });
}
