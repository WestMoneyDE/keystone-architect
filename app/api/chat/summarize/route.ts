import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getActiveProvider } from "@/lib/llm/factory";
import type { LLMMessage } from "@/lib/llm/types";

// Same budgeting rationale as app/api/chat/route.ts's MAX_ARTICLE_CONTEXT_CHARS
// — kept smaller here because the prompt also has to fit N conversation
// excerpts alongside the article body.
const MAX_ARTICLE_CONTEXT_CHARS = 4000;
const MAX_CONVO_EXCERPT_CHARS = 600;

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) {
    throw new Error("No default user found — run `npm run db:seed` first.");
  }
  return user;
}

const bodySchema = z.object({ articleId: z.string().min(1) });

// POST { articleId } — synthesizes a summary of everything discussed about
// this article across ALL of the user's conversations for it (chat +
// prior summaries), persists it as a new Conversation (type: "summary")
// with one assistant Message, and returns it. Mirrors app/api/chat/route.ts's
// { error: "no-provider" } sentinel shape when no LLM is configured, so the
// client (SummaryEntry) can reuse the same handling pattern.
export async function POST(request: Request) {
  const user = await getDefaultUser();
  const body = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { articleId } = parsed.data;

  const article = await db.article.findUnique({
    where: { id: articleId },
    select: { title: true, body: true },
  });
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const provider = await getActiveProvider(user.id);
  if (!provider) {
    return NextResponse.json({ error: "no-provider" });
  }

  const priorConversations = await db.conversation.findMany({
    where: { articleId, userId: user.id },
    orderBy: { createdAt: "asc" },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  const conversationExcerpts = priorConversations
    .filter((c) => c.messages.length > 0)
    .map((c, idx) => {
      const label =
        c.type === "summary"
          ? `Frühere Zusammenfassung ${idx + 1}`
          : `Gespräch ${idx + 1}${c.title ? ` — "${c.title}"` : ""}`;
      const text = c.messages
        .map((m) => `${m.role === "user" ? "Nutzer" : "Assistent"}: ${m.content}`)
        .join("\n")
        .slice(0, MAX_CONVO_EXCERPT_CHARS);
      return `--- ${label} ---\n${text}`;
    })
    .join("\n\n");

  const truncatedArticle =
    article.body.length > MAX_ARTICLE_CONTEXT_CHARS
      ? `${article.body.slice(0, MAX_ARTICLE_CONTEXT_CHARS)}\n\n[…gekürzt, Artikel ist länger…]`
      : article.body;

  const llmMessages: LLMMessage[] = [
    {
      role: "system",
      content:
        "You are Keystone's in-app assistant. Synthesize a concise, well-structured summary (in German, " +
        "using short headings/bullets where useful) of everything that has been discussed across all " +
        "conversations about this article. Actually synthesize — group related points, call out the key " +
        "questions asked and answers given, and note any open questions — do not just concatenate the " +
        "conversations back to back.",
    },
    {
      role: "user",
      content:
        `Artikel: "${article.title}"\n\n${truncatedArticle}\n\n` +
        (conversationExcerpts
          ? `Bisherige Gespräche zu diesem Artikel:\n\n${conversationExcerpts}\n\n`
          : "Es gibt noch keine bisherigen Gespräche zu diesem Artikel. Weise kurz darauf hin und fasse " +
            "stattdessen die wichtigsten Kernpunkte des Artikels selbst zusammen.\n\n") +
        "Erstelle jetzt die Zusammenfassung.",
    },
  ];

  let full = "";
  try {
    for await (const chunk of provider.complete(llmMessages)) {
      if (chunk.delta) full += chunk.delta;
      if (chunk.done) break;
    }
  } catch (err) {
    return NextResponse.json(
      { error: "llm-error", message: err instanceof Error ? err.message : "LLM error" },
      { status: 502 },
    );
  }

  const conversation = await db.conversation.create({
    data: {
      userId: user.id,
      articleId,
      type: "summary",
      title: "Zusammenfassung aller Gespräche",
      provider: provider.id,
      messages: { create: { role: "assistant", content: full.trim() || "Keine Inhalte generiert." } },
    },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return NextResponse.json({ conversation });
}
