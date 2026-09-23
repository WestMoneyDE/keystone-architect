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

const createSchema = z.object({
  articleId: z.string().min(1),
  quote: z.string().min(1),
  prefixContext: z.string().default(""),
  suffixContext: z.string().default(""),
  startOffset: z.number().int().nonnegative(),
  endOffset: z.number().int().nonnegative(),
});

// POST: persist a highlight immediately (optimistic — happens before any
// LLM call, per the plan's highlight-to-ask flow).
export async function POST(request: Request) {
  const user = await getDefaultUser();
  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { articleId, quote, prefixContext, suffixContext, startOffset, endOffset } = parsed.data;

  if (endOffset <= startOffset) {
    return NextResponse.json({ error: "endOffset must be greater than startOffset" }, { status: 400 });
  }

  const article = await db.article.findUnique({ where: { id: articleId }, select: { id: true } });
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const highlight = await db.highlight.create({
    data: {
      articleId,
      userId: user.id,
      quote,
      prefixContext,
      suffixContext,
      startOffset,
      endOffset,
    },
  });

  return NextResponse.json({ highlight });
}

// GET ?articleId=... : all highlights for an article, for re-rendering
// overlays on page load. The client re-runs `reanchor()` against the freshly
// rendered DOM and calls PATCH for any highlight whose orphaned status
// changed (simple re-check-and-update-if-changed, not attempted here since
// this route has no DOM access).
export async function GET(request: Request) {
  const user = await getDefaultUser();
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get("articleId");
  if (!articleId) {
    return NextResponse.json({ error: "articleId is required" }, { status: 400 });
  }

  const highlights = await db.highlight.findMany({
    where: { articleId, userId: user.id },
    orderBy: { createdAt: "asc" },
    include: { conversation: { select: { id: true } } },
  });

  return NextResponse.json({ highlights });
}

const patchSchema = z.object({
  id: z.string().min(1),
  orphaned: z.boolean().optional(),
  startOffset: z.number().int().nonnegative().optional(),
  endOffset: z.number().int().nonnegative().optional(),
});

// PATCH: used by the client-side reanchor pass to flip `orphaned` (either
// direction — a highlight can go from fine -> orphaned if content changed,
// or orphaned -> fine if content reverted) and, optionally, to persist
// drifted-but-still-found offsets after a successful fuzzy re-anchor.
export async function PATCH(request: Request) {
  const user = await getDefaultUser();
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { id, orphaned, startOffset, endOffset } = parsed.data;

  const existing = await db.highlight.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Highlight not found" }, { status: 404 });
  }

  const highlight = await db.highlight.update({
    where: { id },
    data: {
      ...(orphaned !== undefined ? { orphaned } : {}),
      ...(startOffset !== undefined ? { startOffset } : {}),
      ...(endOffset !== undefined ? { endOffset } : {}),
    },
  });

  return NextResponse.json({ highlight });
}

// DELETE ?id=... : deletes a highlight. Deletion is immediate (not deferred
// behind a server-side undo window) — the undo-toast pattern instead keeps
// the deleted row's full data client-side and, on "Undo", POSTs a fresh
// `Highlight` recreated from that held data. Simpler than a server-side
// "pending deletion" queue/TTL, and the recreated row gets a new id, which
// is fine since nothing else references it yet (a highlight's conversation,
// if any, is deleted via Prisma's relation — see below — same as the
// original would have required an explicit "are you sure, this deletes the
// conversation too" dialog; the undo-toast replaces that confirmation UX).
export async function DELETE(request: Request) {
  const user = await getDefaultUser();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const existing = await db.highlight.findUnique({ where: { id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Highlight not found" }, { status: 404 });
  }

  // A highlight-anchored Conversation has `highlightId String? @unique` with
  // no onDelete cascade in the schema, so an FK-referencing conversation
  // would block a plain delete. Detach it first (conversation itself stays,
  // just no longer highlight-anchored) rather than destroying chat history.
  await db.conversation.updateMany({ where: { highlightId: id }, data: { highlightId: null } });
  await db.highlight.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
