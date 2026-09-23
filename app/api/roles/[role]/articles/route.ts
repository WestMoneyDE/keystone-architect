import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getRoleEligibleArticles } from "@/lib/roleArticles";

/**
 * GET: eligible articles for a role, for the sidebar's RoleArticlesPanel
 * (fast-follow to ticket 9). Reuses the exact same query as
 * app/roles/[role]/page.tsx's "Verfügbare Artikel" count, factored into
 * lib/roleArticles.ts, so the panel and the full page can never disagree
 * about what counts as "eligible for this role".
 */
export async function GET(_request: Request, { params }: { params: Promise<{ role: string }> }) {
  const { role: roleId } = await params;

  const role = await db.role.findUnique({ where: { id: roleId } });
  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  const articles = await getRoleEligibleArticles(roleId);

  return NextResponse.json({
    role: { id: role.id, label: role.label },
    articles,
  });
}
