import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) {
    throw new Error("No default user found — run `npm run db:seed` first.");
  }
  return user;
}

// GET ?articleId=... : all conversations (chat + summary) for that article,
// with everything the sidebar needs to compute relevance scores CLIENT-SIDE
// (per the plan: "anchor in viewport" is inherently a client-side signal, so
// scoring can't happen server-side) — message count, last-message timestamp,
// isPinned, the linked highlight's orphaned status, and the full message
// history (so clicking an entry can reopen the dock with real prior history
// without a second round-trip).
export async function GET(request: Request) {
  const user = await getDefaultUser();
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get("articleId");
  if (!articleId) {
    return NextResponse.json({ error: "articleId is required" }, { status: 400 });
  }

  const conversations = await db.conversation.findMany({
    where: { articleId, userId: user.id },
    orderBy: { updatedAt: "desc" },
    include: {
      highlight: {
        select: { id: true, quote: true, note: true, orphaned: true, startOffset: true, endOffset: true },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        select: { role: true, content: true, createdAt: true },
      },
    },
  });

  const result = conversations.map((c) => {
    const lastMessage = c.messages[c.messages.length - 1];
    return {
      id: c.id,
      type: c.type,
      title: c.title,
      isPinned: c.isPinned,
      provider: c.provider,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      messageCount: c.messages.length,
      lastMessageAt: lastMessage ? lastMessage.createdAt : c.createdAt,
      messages: c.messages.map((m) => ({ role: m.role, content: m.content })),
      highlight: c.highlight
        ? {
            id: c.highlight.id,
            quote: c.highlight.quote,
            note: c.highlight.note,
            orphaned: c.highlight.orphaned,
            startOffset: c.highlight.startOffset,
            endOffset: c.highlight.endOffset,
          }
        : null,
    };
  });

  return NextResponse.json({ conversations: result });
}

// POST: used ONLY by the sidebar's undo-toast restore path (see
// components/sidebar/ConversationSidebar.tsx) — recreates a conversation +
// its messages from a client-held snapshot taken right before DELETE. Not a
// general "create conversation" endpoint (that's app/api/chat/route.ts,
// which creates conversations as a side effect of sending the first
// message) — this one accepts prior messages directly.
const restoreSchema = z.object({
  articleId: z.string().min(1).nullable().optional(),
  type: z.enum(["chat", "summary"]).default("chat"),
  title: z.string().nullable().optional(),
  isPinned: z.boolean().default(false),
  provider: z.string().min(1),
  messages: z.array(z.object({ role: z.enum(["user", "assistant", "system"]), content: z.string() })),
});

export async function POST(request: Request) {
  const user = await getDefaultUser();
  const body = await request.json();
  const parsed = restoreSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { articleId, type, title, isPinned, provider, messages } = parsed.data;

  const conversation = await db.conversation.create({
    data: {
      userId: user.id,
      articleId: articleId ?? undefined,
      type,
      title: title ?? undefined,
      isPinned,
      provider,
      messages: { create: messages.map((m) => ({ role: m.role, content: m.content })) },
    },
    include: { messages: true },
  });

  return NextResponse.json({ conversation });
}

// PATCH accepts any combination of: `isPinned` (pin toggle), `title` (plain
// conversation rename — the Notion-style expanded block's editable field for
// non-highlight entries), and `note` (the Notion-style expanded block's
// editable field for highlight-anchored entries — writes to `Highlight.note`,
// a free-text user annotation kept deliberately separate from
// `Highlight.quote`, which is the anchored source text lib/annotation/anchor.ts
// re-anchors against; overwriting `quote` with user edits would break
// re-anchoring on the next page load).
const patchSchema = z.object({
  id: z.string().min(1),
  isPinned: z.boolean().optional(),
  title: z.string().max(200).optional(),
  note: z.string().max(8000).nullable().optional(),
});

export async function PATCH(request: Request) {
  const user = await getDefaultUser();
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, isPinned, title, note } = parsed.data;

  const existing = await db.conversation.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  if (note !== undefined) {
    if (!existing.highlightId) {
      return NextResponse.json(
        { error: "This conversation has no linked highlight to attach a note to" },
        { status: 400 },
      );
    }
    await db.highlight.update({ where: { id: existing.highlightId }, data: { note } });
  }

  const conversation = await db.conversation.update({
    where: { id },
    data: {
      ...(isPinned !== undefined ? { isPinned } : {}),
      ...(title !== undefined ? { title } : {}),
    },
  });

  return NextResponse.json({ conversation });
}

// DELETE ?id=... : immediate delete (undo-toast pattern on the client holds
// the full snapshot and re-POSTs it on Undo — same pattern as
// app/api/highlights/route.ts's DELETE).
export async function DELETE(request: Request) {
  const user = await getDefaultUser();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const existing = await db.conversation.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  await db.message.deleteMany({ where: { conversationId: id } });
  await db.conversation.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
