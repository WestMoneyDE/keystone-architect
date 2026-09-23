// app/api/srs/due/route.ts — GET the current user's SRS review queue
// (ticket 10). Returns cards that are genuinely due (an existing SrsState
// row with dueAt <= now) mixed with a capped batch of brand-new cards
// (InterviewQuestion rows the user has never reviewed, i.e. no SrsState
// row at all).
//
// New-cards-mixing policy (documented here, the actual decision point):
// a pure "only show SrsState rows that are due" queue would stay
// PERMANENTLY EMPTY for a brand-new install, because no SrsState rows
// exist until the user reviews something — chicken-and-egg. So this route
// always tops up the queue with new cards, capped at NEW_CARDS_PER_SESSION
// (20, a common SRS-app default — enough to make real progress on a
// session without front-loading so many that a new user never reaches
// "genuinely due" reviews). Due reviews are NOT capped — if the user has
// 200 due reviews, all 200 come back; only the *new* portion is capped.
// Due reviews are listed first, new cards appended after, matching how
// most SRS apps prioritize lapsed/scheduled reviews over fresh material.
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTouchedArticleIds } from "@/lib/engagement";

const NEW_CARDS_PER_SESSION = 20;

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) throw new Error("No default user found — run `npm run db:seed` first.");
  return user;
}

export async function GET(request: Request) {
  const user = await getDefaultUser();
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get("roleId");
  const domainId = searchParams.get("domainId");
  // ?mode=learned|random — fast-follow to ticket 10. "random" (default,
  // preserves the exact pre-existing behavior for any direct API callers)
  // mixes due + new cards from the whole pool, unfiltered. "learned" scopes
  // the same due+new candidate set down to articles the user has actually
  // engaged with (per lib/engagement.ts's shared "touched" definition —
  // same one ticket 12's home dashboard uses), so cold-start articles never
  // show up for reinforcement review.
  const modeParam = searchParams.get("mode");
  const mode: "learned" | "random" = modeParam === "learned" ? "learned" : "random";

  // Article-level scope filter, applied to both the due and new-card
  // queries via their InterviewQuestion -> Article relation.
  const articleWhere: Record<string, unknown> = {};
  if (roleId) articleWhere.primaryRoles = { has: roleId };
  if (domainId) articleWhere.domainId = domainId;
  if (mode === "learned") {
    const touchedArticleIds = await getTouchedArticleIds(user.id);
    articleWhere.id = { in: Array.from(touchedArticleIds) };
  }
  const hasScope = roleId || domainId || mode === "learned";

  const now = new Date();

  const dueStates = await db.srsState.findMany({
    where: {
      userId: user.id,
      dueAt: { lte: now },
      ...(hasScope ? { interviewQuestion: { article: articleWhere } } : {}),
    },
    include: {
      interviewQuestion: {
        include: { article: { select: { id: true, title: true } } },
      },
    },
    orderBy: { dueAt: "asc" },
  });

  // New cards: InterviewQuestion rows with no SrsState row for this user
  // yet. Prisma has no direct "relation doesn't exist" filter across a
  // non-relation-owning side for a composite unique, so this is done as
  // an explicit exclude-by-id pass: fetch the id set already reviewed by
  // this user (cheap — SrsState is far smaller than InterviewQuestion),
  // then query InterviewQuestion excluding those ids, capped and scoped.
  const reviewedIds = await db.srsState.findMany({
    where: { userId: user.id },
    select: { interviewQuestionId: true },
  });
  const reviewedIdSet = reviewedIds.map((r) => r.interviewQuestionId);

  const newQuestions = await db.interviewQuestion.findMany({
    where: {
      id: { notIn: reviewedIdSet },
      ...(hasScope ? { article: articleWhere } : {}),
    },
    include: { article: { select: { id: true, title: true } } },
    take: NEW_CARDS_PER_SESSION,
  });

  const dueCards = dueStates.map((s) => ({
    interviewQuestionId: s.interviewQuestionId,
    question: s.interviewQuestion.question,
    referenceAnswer: s.interviewQuestion.referenceAnswer,
    articleId: s.interviewQuestion.article.id,
    articleTitle: s.interviewQuestion.article.title,
    isNew: false,
    srsState: {
      easeFactor: s.easeFactor,
      intervalDays: s.intervalDays,
      repetitions: s.repetitions,
      dueAt: s.dueAt,
    },
  }));

  const newCards = newQuestions.map((q) => ({
    interviewQuestionId: q.id,
    question: q.question,
    referenceAnswer: q.referenceAnswer,
    articleId: q.article.id,
    articleTitle: q.article.title,
    isNew: true,
    srsState: null,
  }));

  return NextResponse.json({
    cards: [...dueCards, ...newCards],
    dueCount: dueCards.length,
    newCount: newCards.length,
  });
}
