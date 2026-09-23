// app/api/tests/roles/[role]/start/route.ts — starts a new TestAttempt for
// a role (ticket 9). Nested under a static "roles" segment rather than
// app/api/tests/[role]/start (as the ticket literally spells the path)
// because Next.js requires every dynamic segment at the same tree depth to
// share one slug name — and app/api/tests/[attemptId]/{answer,complete}
// already claims that depth with a different name. This is the smallest
// change that keeps both route families working; only the client fetch
// call site (app/roles/[role]/test/page.tsx) needed updating to match.
// Handles:
//   1. Lazily populating TestQuestionPool for this role from
//      Article.primaryRoles if the pool is empty (see populatePoolForRole).
//   2. Resolving/creating the Test row for the CURRENT provider-availability
//      mode (see the mode-selection design decision documented in
//      lib/grading.ts's resolveTestMode / this route's comment below).
//   3. Randomly sampling up to Test.questionCount distinct questions from
//      the eligible pool, with no duplicates.
//   4. Creating the TestAttempt and returning the question list — WITHOUT
//      referenceAnswer in graded mode (revealing it would undermine an
//      honest free-text attempt), but WITH referenceAnswer in
//      self-assessed mode (needed client-side for the reveal+self-rate
//      flow, per the plan's SM-2-style UX).
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getActiveProvider } from "@/lib/llm/factory";
import { resolveTestMode } from "@/lib/grading";

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) throw new Error("No default user found — run `npm run db:seed` first.");
  return user;
}

/**
 * Populates TestQuestionPool for `roleId` from Article.primaryRoles if (and
 * only if) it's currently empty for that role — lazy/on-demand population
 * rather than a separate seed script, per the ticket's explicit "your call"
 * on this. Idempotent: skips entirely once a pool row exists for the role.
 */
async function ensurePoolPopulated(roleId: string) {
  const existing = await db.testQuestionPool.count({ where: { roleId } });
  if (existing > 0) return;

  const eligibleArticles = await db.article.findMany({
    where: { primaryRoles: { has: roleId } },
    select: { id: true },
  });

  if (eligibleArticles.length === 0) return;

  await db.testQuestionPool.createMany({
    data: eligibleArticles.map((a) => ({ articleId: a.id, roleId })),
  });
}

function sampleWithoutReplacement<T>(items: T[], count: number): T[] {
  const pool = [...items];
  const result: T[] = [];
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

export async function POST(_request: Request, { params }: { params: Promise<{ role: string }> }) {
  const { role: roleId } = await params;

  // Wrapped in try/catch (unlike the sibling [attemptId]/{answer,complete}
  // routes, which is a deliberate, separately-noted inconsistency): this is
  // the FIRST network round-trip of a test attempt, so it's the one most
  // likely to land on a still-reconnecting Prisma pool right after a DB
  // restart/outage (observed live: Docker Desktop, hosting keystone-postgres,
  // was restarted mid-session and a `start` call during that window failed
  // with no server-side trace at all — the exception just fell through to
  // Next's default 500 handler, and the client's catch-all mapped it to the
  // generic "Test konnte nicht gestartet werden" with zero diagnostic
  // signal). By the time this was investigated, Prisma's pool had already
  // self-healed (it retries transient connection errors on the next query
  // by design) and every live repro — this route directly, and the real
  // "Test starten" UI flow — succeeded for CLOUD and every other role
  // checked. So there is no data/logic bug to fix in pool population, mode
  // resolution, or role lookup below; all of that is confirmed correct.
  // What was actually missing is server-side visibility: log the real
  // error with enough context to diagnose a recurrence immediately instead
  // of re-deriving it from scratch, and return a status distinguishable
  // from the route's other error branches.
  try {
    return await startTest(roleId);
  } catch (err) {
    console.error(`[tests/roles/${roleId}/start] failed:`, err);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}

async function startTest(roleId: string) {
  const user = await getDefaultUser();

  const role = await db.role.findUnique({ where: { id: roleId } });
  if (!role) {
    return NextResponse.json({ error: "unknown-role" }, { status: 404 });
  }

  await ensurePoolPopulated(roleId);

  const provider = await getActiveProvider(user.id);
  const mode = resolveTestMode(provider);

  // Mode-selection design decision (documented again here, at the actual
  // decision point, not just in lib/grading.ts): Test.mode is a column on
  // Test, not TestAttempt, and the schema has no unique constraint on
  // Test.roleId — multiple Test rows per role are allowed by design. We
  // treat this as: "the Test row IS the mode configuration," and always
  // look up (or create) the Test row matching the role + the CURRENT live
  // provider-availability mode, rather than reusing whatever Test row
  // happens to exist first regardless of its stored mode. Net effect: if
  // the user configures a provider after previously taking a
  // self-assessed test (or removes one after taking a graded test), the
  // NEXT attempt correctly gets the mode matching their current setup,
  // because it resolves/creates the Test row for that mode specifically —
  // while past attempts/certificates keep referencing the Test row (and
  // therefore mode) that was actually active when they were taken, which
  // is exactly what TestAttempt.testId already models. This avoids ever
  // silently reusing a stale mode AND avoids mutating a historical Test
  // row's mode out from under prior attempts.
  let test = await db.test.findFirst({ where: { roleId, mode } });
  if (!test) {
    test = await db.test.create({
      data: { roleId, mode, questionCount: 20, passThreshold: 70 },
    });
  }

  const poolArticles = await db.testQuestionPool.findMany({
    where: { roleId },
    select: { articleId: true },
  });
  const eligibleArticleIds = poolArticles.map((p) => p.articleId);

  const eligibleQuestions = await db.interviewQuestion.findMany({
    where: { articleId: { in: eligibleArticleIds } },
    select: { id: true, question: true, referenceAnswer: true, articleId: true },
  });

  if (eligibleQuestions.length === 0) {
    return NextResponse.json({ error: "no-eligible-questions" }, { status: 409 });
  }

  // Sample as many as available, adjusting questionCount for THIS attempt
  // rather than crashing if the role has fewer eligible questions than
  // Test.questionCount (verified live: all 8 roles have 800+, so this is a
  // defensive path, not the common case).
  const sampled = sampleWithoutReplacement(eligibleQuestions, test.questionCount);

  const attempt = await db.testAttempt.create({
    data: {
      testId: test.id,
      userId: user.id,
      answers: {
        create: sampled.map((q) => ({
          interviewQuestionId: q.id,
          userAnswer: "",
        })),
      },
    },
    include: { answers: true },
  });

  const answerIdByQuestionId = new Map(attempt.answers.map((a) => [a.interviewQuestionId, a.id]));

  return NextResponse.json({
    attemptId: attempt.id,
    testId: test.id,
    mode,
    roleId,
    roleLabel: role.label,
    passThreshold: test.passThreshold,
    questions: sampled.map((q) => ({
      testAttemptAnswerId: answerIdByQuestionId.get(q.id),
      interviewQuestionId: q.id,
      question: q.question,
      // Self-assessed mode needs the reference answer client-side for the
      // reveal-after-attempt UX; graded mode withholds it so a free-text
      // attempt stays honest.
      referenceAnswer: mode === "self-assessed" ? q.referenceAnswer : null,
    })),
  });
}
