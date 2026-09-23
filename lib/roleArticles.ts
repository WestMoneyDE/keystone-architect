/**
 * lib/roleArticles.ts — shared "eligible articles for a role" query.
 *
 * Originally only app/roles/[role]/page.tsx needed this (as a bare
 * `db.article.count()`). The sidebar's RoleArticlesPanel (fast-follow to
 * ticket 9) needs the actual article list, not just a count, so this
 * factors the query out to a single shared definition — both the full
 * page and the panel's API route call this, so "eligible for role X"
 * can never silently drift between the two surfaces.
 */

import { db } from "@/lib/db";

export interface RoleEligibleArticle {
  id: string;
  title: string;
  domainTitle: string;
}

/**
 * Articles whose `primaryRoles` includes `roleId`, in curriculum order
 * (domain wave, then article sequence) — same ordering convention as
 * app/page.tsx's "next best article" candidate query.
 */
export async function getRoleEligibleArticles(roleId: string): Promise<RoleEligibleArticle[]> {
  const articles = await db.article.findMany({
    where: { primaryRoles: { has: roleId } },
    orderBy: [{ domain: { wave: "asc" } }, { sequence: "asc" }],
    select: { id: true, title: true, domainTitle: true },
  });
  return articles;
}
