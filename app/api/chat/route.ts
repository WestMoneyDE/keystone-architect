import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getActiveProvider } from "@/lib/llm/factory";
import type { LLMMessage } from "@/lib/llm/types";

// How much of an article's raw markdown body to inject as grounding context.
// Keeps the system prompt well within context limits across all providers
// (including smaller-context API models) while still giving the assistant
// enough of the article to answer specific questions accurately.
const MAX_ARTICLE_CONTEXT_CHARS = 6000;

const chatSchema = z.object({
  conversationId: z.string().optional(),
  articleId: z.string().nullable().optional(),
  // Set by FloatingDock when scope.mode === 'highlight' (ticket 7). The
  // route re-fetches the Highlight row itself (never trusts client-supplied
  // quote/context text) both to scope the system prompt and to link the
  // conversation back via Conversation.highlightId.
  highlightId: z.string().optional(),
  message: z.string().min(1).max(8000),
});

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) {
    throw new Error("No default user found — run `npm run db:seed` first.");
  }
  return user;
}

function deriveTitle(message: string): string {
  const trimmed = message.trim().replace(/\s+/g, " ");
  return trimmed.length > 60 ? `${trimmed.slice(0, 60)}…` : trimmed;
}

interface HighlightAnchor {
  quote: string;
  prefixContext: string;
  suffixContext: string;
}

function buildSystemMessage(
  article: { title: string; body: string } | null,
  highlight?: HighlightAnchor | null,
): LLMMessage {
  if (highlight) {
    // Highlight mode: the user selected a specific passage via "Frage
    // stellen" — scope the answer to that passage first, distinctly from
    // "the whole article," per the plan's highlight-to-ask flow. The
    // surrounding article body is still included as supporting grounding,
    // but the highlighted quote is called out prominently and first.
    const articleContext = article
      ? article.body.length > MAX_ARTICLE_CONTEXT_CHARS
        ? `${article.body.slice(0, MAX_ARTICLE_CONTEXT_CHARS)}\n\n[…gekürzt, Artikel ist länger…]`
        : article.body
      : "";

    return {
      role: "system",
      content:
        "You are Keystone's in-app assistant, an expert on enterprise architecture and IT " +
        "leadership topics. Answer concisely, in the language the user writes in (default to " +
        "German if unclear).\n\n" +
        "The user highlighted this EXACT passage in the article " +
        `${article ? `"${article.title}"` : ""} and wants your answer focused specifically on it, ` +
        "not the article in general:\n\n" +
        "--- HIGHLIGHTED PASSAGE (this is what the user is actually asking about) ---\n" +
        `[...${highlight.prefixContext}] ${highlight.quote} [${highlight.suffixContext}...]\n` +
        "--- END HIGHLIGHTED PASSAGE ---\n\n" +
        (articleContext ? `Rest of the article, for supporting context only:\n\n${articleContext}\n\n` : "") +
        "Ground your answer primarily in the highlighted passage above. Only fall back to the " +
        "rest of the article or your general knowledge if the highlighted passage alone doesn't " +
        "answer the question.",
    };
  }

  if (article) {
    const truncated =
      article.body.length > MAX_ARTICLE_CONTEXT_CHARS
        ? `${article.body.slice(0, MAX_ARTICLE_CONTEXT_CHARS)}\n\n[…gekürzt, Artikel ist länger…]`
        : article.body;

    return {
      role: "system",
      content:
        "You are Keystone's in-app assistant, an expert on enterprise architecture and IT " +
        "leadership topics. Answer concisely, in the language the user writes in (default to " +
        "German if unclear). The user is currently reading this article:\n\n" +
        `Title: ${article.title}\n\n${truncated}\n\n` +
        "Ground your answers in this article's content when the question relates to it. If the " +
        "question is unrelated to the article, answer normally using your general knowledge, but " +
        "stay concise and helpful.",
    };
  }

  return {
    role: "system",
    content:
      "You are Keystone's in-app assistant for a self-hosted Enterprise Architecture knowledge " +
      "platform containing 720 articles across 31 domains, tagged for 8 IT-architecture-adjacent " +
      "roles (STAFF, PRINCIPAL, CHIEF, PLATFORM, ENTERPRISE, CLOUD, GENAI, MLOPS). The user is " +
      "currently browsing the platform generally (no specific article open). Answer concisely, in " +
      "the language the user writes in (default to German if unclear), and help them navigate or " +
      "understand enterprise architecture topics.",
  };
}

export async function POST(request: Request) {
  const user = await getDefaultUser();
  const body = await request.json();
  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { conversationId, articleId, highlightId, message } = parsed.data;

  const provider = await getActiveProvider(user.id);
  if (!provider) {
    // Expected, non-exceptional state (no LLM configured yet) — 200 with a
    // sentinel the client renders as a "configure a provider" CTA, not a 500.
    return NextResponse.json({ error: "no-provider" });
  }

  // Resolve the highlight (if any) up front — never trust client-supplied
  // quote/context text, always re-fetch from the Highlight row itself.
  const highlight =
    highlightId && (await db.highlight.findFirst({ where: { id: highlightId, userId: user.id } }));

  // Load or create the conversation. For a highlight-anchored chat, prefer
  // reusing the Conversation already linked to that Highlight (1:1 relation)
  // over always creating a new one — so reopening the same highlight
  // continues the same thread.
  let conversation = conversationId
    ? await db.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      })
    : highlight
      ? await db.conversation.findUnique({
          where: { highlightId: highlight.id },
          include: { messages: { orderBy: { createdAt: "asc" } } },
        })
      : null;

  if (!conversation) {
    conversation = await db.conversation.create({
      data: {
        userId: user.id,
        articleId: highlight ? highlight.articleId : (articleId ?? null),
        highlightId: highlight ? highlight.id : undefined,
        type: "chat",
        title: highlight ? deriveTitle(highlight.quote) : deriveTitle(message),
        provider: provider.id,
      },
      include: { messages: true },
    });
  }

  // Persist the incoming user message immediately.
  await db.message.create({
    data: { conversationId: conversation.id, role: "user", content: message },
  });

  const article = conversation.articleId
    ? await db.article.findUnique({
        where: { id: conversation.articleId },
        select: { title: true, body: true },
      })
    : null;

  const history: LLMMessage[] = conversation.messages.map((m) => ({
    role: m.role as LLMMessage["role"],
    content: m.content,
  }));

  const llmMessages: LLMMessage[] = [
    buildSystemMessage(
      article ? { title: article.title, body: article.body } : null,
      highlight
        ? { quote: highlight.quote, prefixContext: highlight.prefixContext, suffixContext: highlight.suffixContext }
        : null,
    ),
    ...history,
    { role: "user", content: message },
  ];

  const encoder = new TextEncoder();
  const conversationIdForClient = conversation.id;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(obj)}\n`));
      };

      // First line: conversation id, so the client can track it across turns
      // even before any token has arrived.
      send({ type: "meta", conversationId: conversationIdForClient });

      let full = "";
      try {
        for await (const chunk of provider.complete(llmMessages)) {
          if (chunk.delta) {
            full += chunk.delta;
            send({ type: "delta", delta: chunk.delta });
          }
          if (chunk.done) {
            break;
          }
        }
      } catch (err) {
        send({ type: "error", message: err instanceof Error ? err.message : "LLM error" });
        controller.close();
        return;
      }

      if (full.trim().length > 0) {
        await db.message.create({
          data: { conversationId: conversationIdForClient, role: "assistant", content: full },
        });
      }

      send({ type: "done" });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}
