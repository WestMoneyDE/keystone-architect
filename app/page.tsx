import Link from "next/link";
import { Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { getTouchedArticleIds } from "@/lib/engagement";
import { Avatar } from "@/components/ui/Avatar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { StatsGrid } from "@/components/home/StatsGrid";
import { NoProviderBanner } from "@/components/home/NoProviderBanner";
import { scoreRecommendations } from "@/lib/recommendation";

export const dynamic = "force-dynamic";

const DISPLAY_NAME_FALLBACK = "Architect";

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) throw new Error("No default user found — run `npm run db:seed` first.");
  return user;
}

// "Touched" article signal — see lib/engagement.ts for the full rationale.
// Factored out to lib/engagement.ts so other features (the SRS "Gelerntes"
// mode) share this exact same definition.

export default async function HomePage() {
  const user = await getDefaultUser();

  const [
    totalArticles,
    certificateCount,
    srsDueCount,
    roleSelections,
    domains,
    touchedArticleIds,
    activeProviderConfig,
  ] = await Promise.all([
    db.article.count(),
    db.certificate.count({ where: { userId: user.id } }),
    db.srsState.count({ where: { userId: user.id, dueAt: { lte: new Date() } } }),
    db.userRoleSelection.findMany({ where: { userId: user.id }, select: { roleId: true } }),
    db.domain.findMany({
      orderBy: { wave: "asc" },
      select: {
        id: true,
        slug: true,
        title: true,
        wave: true,
        articles: { select: { id: true } },
      },
    }),
    getTouchedArticleIds(user.id),
    db.providerConfig.findFirst({ where: { userId: user.id, isActive: true }, select: { id: true } }),
  ]);

  const selectedRoleIds = roleSelections.map((r) => r.roleId);
  const engagementPercent = totalArticles > 0 ? Math.round((touchedArticleIds.size / totalArticles) * 100) : 0;

  // "Next best article" — role-filtered (or full catalog if no roles
  // selected), not-yet-touched candidates, scored by real behavioral
  // signals (graph affinity to touched articles, recent-view domain
  // affinity, recent-search keyword overlap) via lib/recommendation.ts.
  // Falls back to curriculum order (domain wave, then article sequence)
  // when no behavioral signal fires — see that module's doc comment for
  // the full scoring breakdown. This is what makes the feature degrade
  // gracefully for a fresh account with zero ArticleView/SearchLog rows.
  const roleFilter = selectedRoleIds.length > 0 ? { primaryRoles: { hasSome: selectedRoleIds } } : {};
  const candidateArticles = await db.article.findMany({
    where: { ...roleFilter },
    orderBy: [{ domain: { wave: "asc" } }, { sequence: "asc" }],
    select: {
      id: true,
      title: true,
      domainTitle: true,
      domainId: true,
      primaryRoles: true,
      sequence: true,
      requires: true,
      related: true,
      domain: { select: { wave: true } },
    },
    take: 200, // small enough to scan in memory for the not-yet-touched filter below
  });
  const untouchedCandidates = candidateArticles.filter((a) => !touchedArticleIds.has(a.id));
  // 6 (not 5): fills the 3-column grid completely across two full rows with
  // no empty trailing cell.
  const nextBestArticles = await scoreRecommendations(user.id, untouchedCandidates, touchedArticleIds, 6);

  // Per-domain progress bars (precedent: app/domains/page.tsx's card grid;
  // this adds the touched-count ratio that page doesn't compute).
  const domainProgress = domains.map((d) => {
    const total = d.articles.length;
    const touched = d.articles.filter((a) => touchedArticleIds.has(a.id)).length;
    return {
      id: d.id,
      slug: d.slug,
      title: d.title,
      wave: d.wave,
      total,
      touched,
      percent: total > 0 ? Math.round((touched / total) * 100) : 0,
    };
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Avatar name={user.displayName ?? ""} size={56} className="shrink-0 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Willkommen zurück, {user.displayName || DISPLAY_NAME_FALLBACK}
          </h1>
          <p className="text-sm text-muted-foreground">
            {selectedRoleIds.length > 0
              ? `Fokus: ${selectedRoleIds.join(", ")}`
              : "Noch keine Rollen ausgewählt — alle Empfehlungen zeigen die volle Wissensbasis."}
          </p>
        </div>
      </div>

      <NoProviderBanner show={!activeProviderConfig} />

      <StatsGrid
        engagementPercent={engagementPercent}
        certificateCount={certificateCount}
        srsDueCount={srsDueCount}
        selectedRoleCount={selectedRoleIds.length}
      />
      <p className="-mt-6 text-xs text-muted-foreground">
        &bdquo;Engagement&ldquo; zählt Artikel, mit denen du interagiert hast (Highlight, Chat oder Karteikarten-Review)
        — es gibt (noch) kein separates Lese-Tracking, deshalb ist das eine ehrliche Annäherung, keine exakte
        Lesequote.
      </p>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={18} className="text-accent" />
          <h2 className="text-lg font-semibold text-foreground">Nächste beste Artikel</h2>
        </div>
        {nextBestArticles.length === 0 ? (
          <GlassCard className="p-5 text-sm text-muted-foreground">
            Keine unberührten Artikel mehr für deine ausgewählten Rollen gefunden — sieh dich in den Domains um oder
            wähle weitere Rollen in den Einstellungen.
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nextBestArticles.map((a) => (
              <Link key={a.id} href={`/articles/${a.id}`}>
                <GlassCard className="flex h-full flex-col gap-2 p-4 rounded-xl">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-foreground">{a.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{a.domainTitle}</p>
                  <p className="text-xs italic text-accent">{a.reason}</p>
                  <div className="mt-auto flex flex-wrap gap-1 pt-1">
                    {a.primaryRoles.slice(0, 3).map((r) => (
                      <Badge key={r} variant="accent">
                        {r}
                      </Badge>
                    ))}
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Fortschritt nach Domain</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {domainProgress.map((d) => (
            <Link key={d.id} href={`/domains/${d.slug}`}>
              <GlassCard className="p-4 rounded-xl">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium text-foreground">{d.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {d.touched}/{d.total}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${d.percent}%` }}
                  />
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
