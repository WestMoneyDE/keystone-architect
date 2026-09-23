import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const EXPORT_VERSION = 1;

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) throw new Error("No default user found — run `npm run db:seed` first.");
  return user;
}

// GET /api/export — a single versioned JSON document containing everything
// the current (default, local) user has produced: highlights/notes,
// conversations + messages, SRS state, test attempts + answers, certificate
// *metadata* (not the binary PDF/PNG files — those live on disk at
// pdfPath/socialCardPath and should be re-downloaded from
// /api/certificates/[id]/pdf if needed after a re-import), bookmarks (empty
// today — no ticket has shipped bookmark UI yet, kept for forward
// compatibility with the schema), role selection, feature flags and
// display name. See app/api/import/route.ts for the matching restore logic
// and its conflict-handling policy.
export async function GET() {
  const user = await getDefaultUser();

  const [highlights, conversations, srsStates, testAttempts, certificates, bookmarks, roleSelections, featureFlags] =
    await Promise.all([
      db.highlight.findMany({ where: { userId: user.id } }),
      db.conversation.findMany({
        where: { userId: user.id },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      }),
      db.srsState.findMany({ where: { userId: user.id } }),
      db.testAttempt.findMany({
        where: { userId: user.id },
        include: { answers: true, test: { select: { roleId: true, mode: true } } },
      }),
      db.certificate.findMany({ where: { userId: user.id } }),
      db.bookmark.findMany({ where: { userId: user.id } }),
      db.userRoleSelection.findMany({ where: { userId: user.id } }),
      db.featureFlags.findUnique({ where: { userId: user.id } }),
    ]);

  const doc = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    user: {
      displayName: user.displayName,
    },
    highlights: highlights.map((h) => ({
      id: h.id,
      articleId: h.articleId,
      quote: h.quote,
      note: h.note,
      prefixContext: h.prefixContext,
      suffixContext: h.suffixContext,
      startOffset: h.startOffset,
      endOffset: h.endOffset,
      orphaned: h.orphaned,
      createdAt: h.createdAt.toISOString(),
    })),
    conversations: conversations.map((c) => ({
      id: c.id,
      articleId: c.articleId,
      highlightId: c.highlightId,
      type: c.type,
      title: c.title,
      isPinned: c.isPinned,
      provider: c.provider,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      messages: c.messages.map((m) => ({
        role: m.role,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      })),
    })),
    srsStates: srsStates.map((s) => ({
      interviewQuestionId: s.interviewQuestionId,
      easeFactor: s.easeFactor,
      intervalDays: s.intervalDays,
      repetitions: s.repetitions,
      dueAt: s.dueAt.toISOString(),
    })),
    testAttempts: testAttempts.map((a) => ({
      id: a.id,
      roleId: a.test.roleId,
      mode: a.test.mode,
      startedAt: a.startedAt.toISOString(),
      completedAt: a.completedAt?.toISOString() ?? null,
      score: a.score,
      passed: a.passed,
      answers: a.answers.map((ans) => ({
        interviewQuestionId: ans.interviewQuestionId,
        userAnswer: ans.userAnswer,
        score: ans.score,
        verdict: ans.verdict,
        selfRating: ans.selfRating,
        llmFeedback: ans.llmFeedback,
        gradedByProvider: ans.gradedByProvider,
      })),
    })),
    // Metadata only — see comment above. The PDF/PNG themselves are not
    // embedded in this export.
    certificates: certificates.map((c) => ({
      attemptId: c.attemptId,
      roleId: c.roleId,
      score: c.score,
      issuedAt: c.issuedAt.toISOString(),
      verificationHash: c.verificationHash,
      pdfPath: c.pdfPath,
      socialCardPath: c.socialCardPath,
      note: "Binary PDF/social-card files are not included — re-download from /api/certificates/[id]/pdf after import if needed.",
    })),
    bookmarks: bookmarks.map((b) => ({ articleId: b.articleId, createdAt: b.createdAt.toISOString() })),
    roleSelections: roleSelections.map((r) => r.roleId),
    featureFlags: featureFlags
      ? {
          newsEnabledGlobal: featureFlags.newsEnabledGlobal,
          newsEnabledRoles: featureFlags.newsEnabledRoles,
          pwaEnabled: featureFlags.pwaEnabled,
        }
      : null,
  };

  return NextResponse.json(doc, {
    headers: {
      "Content-Disposition": `attachment; filename="keystone-export-${doc.exportedAt.slice(0, 10)}.json"`,
    },
  });
}
