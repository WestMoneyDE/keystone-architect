// lib/engagement.ts — shared "touched" article engagement signal.
//
// There is no readAt/isRead tracking anywhere in the schema (checked before
// building this originally in ticket 12's home dashboard), and adding one
// now would require wiring a write into the article page (a different
// ticket's surface) to be honest rather than decorative. Instead this
// derives real engagement from three signals that already exist and already
// represent the user actually having done something with an article:
// created a Highlight on it, opened a Conversation scoped to it, or
// reviewed (has SrsState for) one of its InterviewQuestions. This is a
// genuine (if partial) engagement proxy, not a fabricated "reading %" — it
// will under-count silent reading with no interaction, which is stated
// explicitly wherever it's shown.
//
// Factored out of app/page.tsx (ticket 12) so the SRS "Gelerntes" mode
// (fast-follow to ticket 10) uses the exact same definition rather than a
// second, diverging "engaged with" heuristic.
import { db } from "@/lib/db";

export async function getTouchedArticleIds(userId: string): Promise<Set<string>> {
  const [highlightArticles, conversationArticles, srsQuestions] = await Promise.all([
    db.highlight.findMany({ where: { userId }, select: { articleId: true }, distinct: ["articleId"] }),
    db.conversation.findMany({
      where: { userId, articleId: { not: null } },
      select: { articleId: true },
      distinct: ["articleId"],
    }),
    db.srsState.findMany({
      where: { userId },
      select: { interviewQuestion: { select: { articleId: true } } },
    }),
  ]);

  const ids = new Set<string>();
  for (const h of highlightArticles) ids.add(h.articleId);
  for (const c of conversationArticles) if (c.articleId) ids.add(c.articleId);
  for (const s of srsQuestions) ids.add(s.interviewQuestion.articleId);
  return ids;
}
