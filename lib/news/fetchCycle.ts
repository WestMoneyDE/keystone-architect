import { db } from "@/lib/db";
import { getNewsProvider } from "./factory";
import { getDefaultUserNewsFlags, isDomainNewsEnabled } from "./enablement";

export interface NewsFetchCycleSummary {
  ranAt: string;
  enabled: boolean;
  domainsChecked: number;
  domainsFetched: number;
  itemsInserted: number;
  itemsSkippedDuplicate: number;
  errors: number;
}

/**
 * Runs one full news-fetch pass: for every domain, decides (from the
 * default user's FeatureFlags row) whether news fetching is actually
 * enabled for it right now, and if so calls the active NewsProvider and
 * upserts NewsItem rows.
 *
 * Enablement rule (mirrors NewsToggleStep.tsx / app/api/onboarding/route.ts
 * exactly):
 *   - `newsEnabledGlobal === true` → every domain is enabled, OR
 *   - the domain has at least one Article whose `primaryRoles` intersects
 *     `newsEnabledRoles` → that domain is enabled.
 * With the default state (`newsEnabledGlobal: false`, `newsEnabledRoles: []`)
 * NO domain is enabled and this performs zero fetches — but it still runs
 * and logs clearly, so the schedule's liveness stays visible.
 *
 * Dedup: the schema does not have a `@@unique([domainId, url])` constraint
 * on NewsItem (adding one would require an unplanned migration this late in
 * the build), so duplicates are avoided at the application level via a
 * `findFirst` check per item before insert.
 */
export async function runNewsFetchCycle(): Promise<NewsFetchCycleSummary> {
  const ranAt = new Date().toISOString();

  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) {
    console.warn("[news/cron] No default user found — skipping fetch cycle entirely.");
    return {
      ranAt,
      enabled: false,
      domainsChecked: 0,
      domainsFetched: 0,
      itemsInserted: 0,
      itemsSkippedDuplicate: 0,
      errors: 0,
    };
  }

  const flags = await getDefaultUserNewsFlags();
  const { newsEnabledGlobal, newsEnabledRoles } = flags;

  const domains = await db.domain.findMany({ select: { id: true, slug: true, title: true } });

  if (!newsEnabledGlobal && newsEnabledRoles.length === 0) {
    console.log(
      `[news/cron] News fetch skipped: disabled for all domains (newsEnabledGlobal=false, newsEnabledRoles=[]). Checked ${domains.length} domains, fetched 0.`
    );
    return {
      ranAt,
      enabled: false,
      domainsChecked: domains.length,
      domainsFetched: 0,
      itemsInserted: 0,
      itemsSkippedDuplicate: 0,
      errors: 0,
    };
  }

  const provider = getNewsProvider(user.id);

  let domainsFetched = 0;
  let itemsInserted = 0;
  let itemsSkippedDuplicate = 0;
  let errors = 0;

  for (const domain of domains) {
    const enabledForDomain = await isDomainNewsEnabled(domain.id, flags);
    if (!enabledForDomain) continue;

    domainsFetched += 1;
    try {
      const items = await provider.fetchForDomain(domain.slug, domain.title);
      for (const item of items) {
        const existing = await db.newsItem.findFirst({
          where: { domainId: domain.id, url: item.url },
          select: { id: true },
        });
        if (existing) {
          itemsSkippedDuplicate += 1;
          continue;
        }
        await db.newsItem.create({
          data: {
            domainId: domain.id,
            title: item.title,
            url: item.url,
            source: item.source,
            publishedAt: new Date(item.publishedAt),
            summary: item.summary,
          },
        });
        itemsInserted += 1;
      }
    } catch (err) {
      errors += 1;
      console.error(`[news/cron] fetch failed for domain "${domain.slug}": ${(err as Error).message}`);
    }
  }

  console.log(
    `[news/cron] News fetch complete. Checked ${domains.length} domains, fetched for ${domainsFetched}, inserted ${itemsInserted} new items (skipped ${itemsSkippedDuplicate} duplicates), ${errors} errors.`
  );

  return {
    ranAt,
    enabled: true,
    domainsChecked: domains.length,
    domainsFetched,
    itemsInserted,
    itemsSkippedDuplicate,
    errors,
  };
}
