import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) throw new Error("No default user found — run `npm run db:seed` first.");
  return user;
}

const messageSchema = z.object({
  role: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

const importSchema = z.object({
  version: z.number(),
  exportedAt: z.string().optional(),
  user: z.object({ displayName: z.string().nullable().optional() }).optional(),
  highlights: z
    .array(
      z.object({
        articleId: z.string(),
        quote: z.string(),
        note: z.string().nullable().optional(),
        prefixContext: z.string(),
        suffixContext: z.string(),
        startOffset: z.number(),
        endOffset: z.number(),
        orphaned: z.boolean().optional(),
        createdAt: z.string().optional(),
      })
    )
    .default([]),
  conversations: z
    .array(
      z.object({
        articleId: z.string().nullable().optional(),
        highlightId: z.string().nullable().optional(),
        type: z.string().optional(),
        title: z.string().nullable().optional(),
        isPinned: z.boolean().optional(),
        provider: z.string(),
        createdAt: z.string().optional(),
        messages: z.array(messageSchema).default([]),
      })
    )
    .default([]),
  srsStates: z
    .array(
      z.object({
        interviewQuestionId: z.string(),
        easeFactor: z.number(),
        intervalDays: z.number(),
        repetitions: z.number(),
        dueAt: z.string(),
      })
    )
    .default([]),
  testAttempts: z
    .array(
      z.object({
        roleId: z.string(),
        mode: z.string().optional(),
        startedAt: z.string().optional(),
        completedAt: z.string().nullable().optional(),
        score: z.number().nullable().optional(),
        passed: z.boolean().nullable().optional(),
        answers: z
          .array(
            z.object({
              interviewQuestionId: z.string(),
              userAnswer: z.string(),
              score: z.number().nullable().optional(),
              verdict: z.string().nullable().optional(),
              selfRating: z.number().nullable().optional(),
              llmFeedback: z.string().nullable().optional(),
              gradedByProvider: z.string().nullable().optional(),
            })
          )
          .default([]),
      })
    )
    .default([]),
  bookmarks: z.array(z.object({ articleId: z.string() })).default([]),
  roleSelections: z.array(z.string()).default([]),
  featureFlags: z
    .object({
      newsEnabledGlobal: z.boolean(),
      newsEnabledRoles: z.array(z.string()),
      pwaEnabled: z.boolean(),
    })
    .nullable()
    .optional(),
});

/**
 * POST /api/import — restores a previously exported JSON document (see
 * app/api/export/route.ts) for the current default user.
 *
 * CONFLICT-HANDLING POLICY (deliberately additive/non-destructive, not a
 * wholesale replace):
 *  - Rows with a real natural key in the schema — SrsState
 *    ([userId,interviewQuestionId]), Bookmark ([userId,articleId]),
 *    UserRoleSelection ([userId,roleId]) — are upserted: the import's
 *    values win for that key, since this is the same user restoring their
 *    own current-state data, not merging two different people's data.
 *  - FeatureFlags is a per-user singleton — imported values overwrite the
 *    current row.
 *  - Rows that represent historical *activity* and have no natural key —
 *    Highlight, Conversation (+Message), TestAttempt (+Answer) — are never
 *    used to overwrite existing rows. They're only inserted as new rows,
 *    and only when no equivalent row already exists for this user (a
 *    content-fingerprint check: for a Highlight that's
 *    articleId+startOffset+endOffset+quote; for a Conversation it's
 *    articleId+provider+createdAt+title; for a TestAttempt it's
 *    roleId+startedAt). This avoids duplicate history on a re-import of
 *    the same file while never silently overwriting real, unrelated
 *    activity the user might not want touched.
 *  - Certificates are metadata-only in the export (no binary file) and are
 *    only informational in the response — they are NOT recreated as DB
 *    rows on import, since a Certificate is tied 1:1 to a specific
 *    TestAttempt row and re-attaching it correctly to a freshly-created
 *    attempt would risk producing a certificate whose verificationHash no
 *    longer matches re-derivable data. The import response reports how
 *    many were present in the file so the user knows to re-take/re-issue
 *    if needed.
 *  - Rows that reference an InterviewQuestion id (SrsState, test answers)
 *    are skipped (and counted) if that id doesn't exist in this
 *    database — expected when importing into a database that was
 *    re-seeded from scratch, since InterviewQuestion ids are
 *    non-deterministic cuids assigned at seed time, not stable natural
 *    keys.
 */
export async function POST(request: Request) {
  const user = await getDefaultUser();

  const body = await request.json();
  const parsed = importSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const result = {
    displayNameUpdated: false,
    highlights: { inserted: 0, skippedDuplicate: 0 },
    conversations: { inserted: 0, skippedDuplicate: 0 },
    srsStates: { upserted: 0, skippedMissingQuestion: 0 },
    testAttempts: { inserted: 0, skippedDuplicate: 0, skippedMissingTest: 0 },
    bookmarks: { upserted: 0, skippedMissingArticle: 0 },
    roleSelections: { upserted: 0 },
    featureFlagsUpdated: false,
    // Informational only — certificates are not recreated on import, see
    // policy note above. Read straight off the raw body since certificates
    // aren't part of the validated zod shape (we never act on their content).
    certificatesInFile:
      body && typeof body === "object" && Array.isArray((body as { certificates?: unknown }).certificates)
        ? (body as { certificates: unknown[] }).certificates.length
        : 0,
  };

  if (data.user?.displayName !== undefined && data.user.displayName !== null && data.user.displayName.trim().length > 0) {
    await db.user.update({ where: { id: user.id }, data: { displayName: data.user.displayName } });
    result.displayNameUpdated = true;
  }

  // Validate articleIds exist to avoid FK errors polluting the whole import.
  const allArticleIds = new Set<string>([
    ...data.highlights.map((h) => h.articleId),
    ...data.conversations.map((c) => c.articleId).filter((x): x is string => Boolean(x)),
    ...data.bookmarks.map((b) => b.articleId),
  ]);
  const existingArticles = await db.article.findMany({
    where: { id: { in: Array.from(allArticleIds) } },
    select: { id: true },
  });
  const existingArticleIds = new Set(existingArticles.map((a) => a.id));

  // ---- Highlights (dedupe by content fingerprint) ----
  const existingHighlights = await db.highlight.findMany({
    where: { userId: user.id },
    select: { articleId: true, startOffset: true, endOffset: true, quote: true },
  });
  const highlightFingerprint = (h: { articleId: string; startOffset: number; endOffset: number; quote: string }) =>
    `${h.articleId}::${h.startOffset}::${h.endOffset}::${h.quote}`;
  const existingHighlightKeys = new Set(existingHighlights.map(highlightFingerprint));

  for (const h of data.highlights) {
    if (!existingArticleIds.has(h.articleId)) continue;
    if (existingHighlightKeys.has(highlightFingerprint(h))) {
      result.highlights.skippedDuplicate++;
      continue;
    }
    await db.highlight.create({
      data: {
        articleId: h.articleId,
        userId: user.id,
        quote: h.quote,
        note: h.note ?? null,
        prefixContext: h.prefixContext,
        suffixContext: h.suffixContext,
        startOffset: h.startOffset,
        endOffset: h.endOffset,
        orphaned: h.orphaned ?? false,
        createdAt: h.createdAt ? new Date(h.createdAt) : undefined,
      },
    });
    existingHighlightKeys.add(highlightFingerprint(h));
    result.highlights.inserted++;
  }

  // ---- Conversations + messages (dedupe by content fingerprint) ----
  const existingConversations = await db.conversation.findMany({
    where: { userId: user.id },
    select: { articleId: true, provider: true, createdAt: true, title: true },
  });
  const convoFingerprint = (c: { articleId?: string | null; provider: string; createdAt?: string; title?: string | null }) =>
    `${c.articleId ?? "null"}::${c.provider}::${c.createdAt ?? ""}::${c.title ?? ""}`;
  const existingConvoKeys = new Set(
    existingConversations.map((c) =>
      convoFingerprint({ articleId: c.articleId, provider: c.provider, createdAt: c.createdAt.toISOString(), title: c.title })
    )
  );

  for (const c of data.conversations) {
    if (c.articleId && !existingArticleIds.has(c.articleId)) continue;
    const key = convoFingerprint(c);
    if (existingConvoKeys.has(key)) {
      result.conversations.skippedDuplicate++;
      continue;
    }
    // highlightId is intentionally dropped on import — the original
    // Highlight row (if any) was likely re-created with a new id above, and
    // Conversation.highlightId is @unique, so blindly reusing the exported
    // id risks a collision/mismatch. The conversation still imports fine
    // without that link; it just won't re-attach to a specific highlight.
    await db.conversation.create({
      data: {
        userId: user.id,
        articleId: c.articleId ?? null,
        type: c.type ?? "chat",
        title: c.title ?? null,
        isPinned: c.isPinned ?? false,
        provider: c.provider,
        createdAt: c.createdAt ? new Date(c.createdAt) : undefined,
        messages: {
          create: c.messages.map((m) => ({
            role: m.role,
            content: m.content,
            createdAt: new Date(m.createdAt),
          })),
        },
      },
    });
    existingConvoKeys.add(key);
    result.conversations.inserted++;
  }

  // ---- SRS state (upsert by natural key, skip if question doesn't exist) ----
  const questionIds = Array.from(new Set(data.srsStates.map((s) => s.interviewQuestionId)));
  const existingQuestions = await db.interviewQuestion.findMany({
    where: { id: { in: questionIds } },
    select: { id: true },
  });
  const existingQuestionIds = new Set(existingQuestions.map((q) => q.id));

  for (const s of data.srsStates) {
    if (!existingQuestionIds.has(s.interviewQuestionId)) {
      result.srsStates.skippedMissingQuestion++;
      continue;
    }
    await db.srsState.upsert({
      where: { userId_interviewQuestionId: { userId: user.id, interviewQuestionId: s.interviewQuestionId } },
      create: {
        userId: user.id,
        interviewQuestionId: s.interviewQuestionId,
        easeFactor: s.easeFactor,
        intervalDays: s.intervalDays,
        repetitions: s.repetitions,
        dueAt: new Date(s.dueAt),
      },
      update: {
        easeFactor: s.easeFactor,
        intervalDays: s.intervalDays,
        repetitions: s.repetitions,
        dueAt: new Date(s.dueAt),
      },
    });
    result.srsStates.upserted++;
  }

  // ---- Test attempts (dedupe by roleId+startedAt, look up matching Test) ----
  const roleIdsInAttempts = Array.from(new Set(data.testAttempts.map((a) => a.roleId)));
  const testsByRole = await db.test.findMany({ where: { roleId: { in: roleIdsInAttempts } } });
  const testByRoleId = new Map<string, (typeof testsByRole)[number]>();
  for (const t of testsByRole) {
    // Prefer a test whose mode matches what was exported; else first match.
    if (!testByRoleId.has(t.roleId)) testByRoleId.set(t.roleId, t);
  }

  const existingAttempts = await db.testAttempt.findMany({
    where: { userId: user.id },
    select: { startedAt: true, test: { select: { roleId: true } } },
  });
  const attemptFingerprint = (roleId: string, startedAt: string) => `${roleId}::${startedAt}`;
  const existingAttemptKeys = new Set(
    existingAttempts.map((a) => attemptFingerprint(a.test.roleId, a.startedAt.toISOString()))
  );

  for (const a of data.testAttempts) {
    const test = data.testAttempts.length
      ? testsByRole.find((t) => t.roleId === a.roleId && (!a.mode || t.mode === a.mode)) ?? testByRoleId.get(a.roleId)
      : undefined;
    if (!test) {
      result.testAttempts.skippedMissingTest++;
      continue;
    }
    const startedAt = a.startedAt ?? new Date().toISOString();
    const key = attemptFingerprint(a.roleId, startedAt);
    if (existingAttemptKeys.has(key)) {
      result.testAttempts.skippedDuplicate++;
      continue;
    }

    // Answer question ids are checked against the DB separately from the
    // SRS-state check above (different InterviewQuestion subset).
    const answerQuestionIds = Array.from(new Set(a.answers.map((ans) => ans.interviewQuestionId)));
    const existingAnswerQuestions = await db.interviewQuestion.findMany({
      where: { id: { in: answerQuestionIds } },
      select: { id: true },
    });
    const existingAnswerQuestionIds = new Set(existingAnswerQuestions.map((q) => q.id));

    await db.testAttempt.create({
      data: {
        testId: test.id,
        userId: user.id,
        startedAt: new Date(startedAt),
        completedAt: a.completedAt ? new Date(a.completedAt) : null,
        score: a.score ?? null,
        passed: a.passed ?? null,
        answers: {
          create: a.answers
            .filter((ans) => existingAnswerQuestionIds.has(ans.interviewQuestionId))
            .map((ans) => ({
              interviewQuestionId: ans.interviewQuestionId,
              userAnswer: ans.userAnswer,
              score: ans.score ?? null,
              verdict: ans.verdict ?? null,
              selfRating: ans.selfRating ?? null,
              llmFeedback: ans.llmFeedback ?? null,
              gradedByProvider: ans.gradedByProvider ?? null,
            })),
        },
      },
    });
    existingAttemptKeys.add(key);
    result.testAttempts.inserted++;
  }

  // ---- Bookmarks (upsert by natural key) ----
  for (const b of data.bookmarks) {
    if (!existingArticleIds.has(b.articleId)) {
      result.bookmarks.skippedMissingArticle++;
      continue;
    }
    await db.bookmark.upsert({
      where: { userId_articleId: { userId: user.id, articleId: b.articleId } },
      create: { userId: user.id, articleId: b.articleId },
      update: {},
    });
    result.bookmarks.upserted++;
  }

  // ---- Role selections (upsert by natural key, additive) ----
  if (data.roleSelections.length > 0) {
    await db.userRoleSelection.createMany({
      data: data.roleSelections.map((roleId) => ({ userId: user.id, roleId })),
      skipDuplicates: true,
    });
    result.roleSelections.upserted = data.roleSelections.length;
  }

  // ---- Feature flags (singleton overwrite) ----
  if (data.featureFlags) {
    await db.featureFlags.upsert({
      where: { userId: user.id },
      create: { userId: user.id, ...data.featureFlags },
      update: { ...data.featureFlags },
    });
    result.featureFlagsUpdated = true;
  }

  return NextResponse.json({ ok: true, result });
}
