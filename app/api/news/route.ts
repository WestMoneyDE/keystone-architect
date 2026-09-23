import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDefaultUserNewsFlags, isDomainNewsEnabled } from "@/lib/news/enablement";

/**
 * GET /api/news?domainId=<id>
 *
 * Returns whether news is currently enabled for this domain (per the
 * default user's FeatureFlags — see lib/news/enablement.ts for the exact
 * rule) and, if so, the most recent NewsItem rows already stored for it.
 * This route never triggers a fetch itself — items are populated by the
 * node-cron scheduler (lib/news/scheduler.ts) on its own interval, or by
 * `scripts/trigger-news-fetch.ts` for manual/testing runs.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domainId = searchParams.get("domainId");
  if (!domainId) {
    return NextResponse.json({ error: "domainId query param is required" }, { status: 400 });
  }

  const flags = await getDefaultUserNewsFlags();
  const enabled = await isDomainNewsEnabled(domainId, flags);

  if (!enabled) {
    return NextResponse.json({ enabled: false, items: [] });
  }

  const items = await db.newsItem.findMany({
    where: { domainId },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });

  return NextResponse.json({ enabled: true, items });
}
