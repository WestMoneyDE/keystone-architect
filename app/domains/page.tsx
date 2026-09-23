import Link from "next/link";
import { Layers, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

// Role-relevance threshold (fast-follow): a domain is "Empfohlen" when at
// least this share of its articles have a primaryRoles overlap with the
// user's preferred roles. Tuned by feel, not empirically fit — same
// approach as lib/recommendation.ts's scoring weights.
const RECOMMENDED_OVERLAP_THRESHOLD = 0.3;

export default async function DomainsPage() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  const roleSelections = user
    ? await db.userRoleSelection.findMany({ where: { userId: user.id } })
    : [];
  const preferredRoleIds = new Set(roleSelections.map((r) => r.roleId));
  const hasPreferredRoles = preferredRoleIds.size > 0;

  const domains = await db.domain.findMany({
    orderBy: { id: "asc" },
    include: {
      articles: { select: { primaryRoles: true } },
      _count: { select: { articles: true } },
    },
  });

  // Real computed relevance signal: for each domain, how many of its
  // articles have at least one primaryRoles entry matching a role the user
  // has marked as preferred (via UserRoleSelection, editable on /roles and
  // /settings). No fake "recommended" badges when there's no signal —
  // degrades to plain unranked grid when the user has zero preferred roles.
  const domainsWithRelevance = domains.map((domain) => {
    let matchCount = 0;
    if (hasPreferredRoles) {
      for (const article of domain.articles) {
        if (article.primaryRoles.some((r) => preferredRoleIds.has(r))) matchCount++;
      }
    }
    const total = domain._count.articles;
    const ratio = total > 0 ? matchCount / total : 0;
    return { domain, matchCount, total, ratio };
  });

  const sorted = hasPreferredRoles
    ? [...domainsWithRelevance].sort((a, b) => {
        if (b.ratio !== a.ratio) return b.ratio - a.ratio;
        return a.domain.id.localeCompare(b.domain.id);
      })
    : domainsWithRelevance;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-foreground">Domains</h1>
        <p className="text-muted-foreground">
          {domains.length} domains covering the full knowledge base.
          {hasPreferredRoles && " Sortiert nach Relevanz für deine bevorzugten Rollen."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map(({ domain, matchCount, total, ratio }) => {
          const isRecommended = hasPreferredRoles && total > 0 && ratio >= RECOMMENDED_OVERLAP_THRESHOLD;
          return (
            <Link key={domain.id} href={`/domains/${domain.slug}`}>
              <GlassCard className="flex h-full flex-col gap-3 p-5 rounded-2xl">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent text-white">
                    <Layers size={18} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isRecommended && (
                      <Badge variant="accent" className="gap-1">
                        <Sparkles size={12} /> Empfohlen
                      </Badge>
                    )}
                    <Badge variant="neutral">Wave {domain.wave}</Badge>
                  </div>
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{domain.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {total} article{total === 1 ? "" : "s"}
                  </p>
                  {hasPreferredRoles && total > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {matchCount} von {total} Artikeln passen zu deinen Rollen
                    </p>
                  )}
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
