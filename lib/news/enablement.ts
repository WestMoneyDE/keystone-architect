import { db } from "@/lib/db";

export interface NewsEnablementState {
  newsEnabledGlobal: boolean;
  newsEnabledRoles: string[];
}

/** Reads the default user's FeatureFlags row (or the off defaults if none exists yet). */
export async function getDefaultUserNewsFlags(): Promise<NewsEnablementState> {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) return { newsEnabledGlobal: false, newsEnabledRoles: [] };

  const flags = await db.featureFlags.findUnique({ where: { userId: user.id } });
  return {
    newsEnabledGlobal: flags?.newsEnabledGlobal ?? false,
    newsEnabledRoles: flags?.newsEnabledRoles ?? [],
  };
}

/**
 * Same enablement rule used by the cron cycle (lib/news/fetchCycle.ts):
 * globally on, OR the domain has at least one article whose primaryRoles
 * intersects the enabled role list.
 */
export async function isDomainNewsEnabled(domainId: string, flags: NewsEnablementState): Promise<boolean> {
  if (flags.newsEnabledGlobal) return true;
  if (flags.newsEnabledRoles.length === 0) return false;

  const match = await db.article.findFirst({
    where: { domainId, primaryRoles: { hasSome: flags.newsEnabledRoles } },
    select: { id: true },
  });
  return Boolean(match);
}
