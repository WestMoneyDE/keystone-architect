import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Simple case-insensitive title search backing AppShell's sidebar search
// box. Intentionally minimal — ticket 5 builds the full Cmd+K palette.

// Below this length we treat a query as still-typing (this route fires on
// every keystroke of the sidebar's fast incremental search, unlike the
// smart-search route which only fires on submit/idle-pause) and skip
// logging it — logging every keystroke would flood SearchLog with
// fragments like "k", "ku", "kub" for one actual search. 4 chars is short
// enough to allow real short queries ("saas", "sre") through while
// filtering single/double-letter keystroke noise.
const MIN_LOGGABLE_QUERY_LENGTH = 4;

async function getDefaultUser() {
  return db.user.findFirst({ where: { isDefault: true } });
}

/**
 * Fire-and-forget query logging for the "next best article" search-intent
 * signal (see lib/recommendation.ts). Only logs queries that look like a
 * genuinely typed-out search, not every keystroke — see
 * MIN_LOGGABLE_QUERY_LENGTH above. Never throws into the search response.
 */
async function logSearchQuery(query: string) {
  if (query.length < MIN_LOGGABLE_QUERY_LENGTH) return;
  try {
    const user = await getDefaultUser();
    if (!user) return;
    await db.searchLog.create({ data: { userId: user.id, query } });
  } catch (err) {
    console.error("Failed to log search query (non-fatal):", err);
  }
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length === 0) {
    return NextResponse.json({ results: [] });
  }

  void logSearchQuery(q);

  const results = await db.article.findMany({
    where: { title: { contains: q, mode: "insensitive" } },
    select: { id: true, title: true, domainTitle: true },
    orderBy: { title: "asc" },
    take: 20,
  });

  return NextResponse.json({ results });
}
