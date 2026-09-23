import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, CheckCircle2, XCircle } from "lucide-react";
import { db } from "@/lib/db";
import { getRoleEligibleArticles } from "@/lib/roleArticles";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) throw new Error("No default user found — run `npm run db:seed` first.");
  return user;
}

export default async function RoleDetailPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: roleId } = await params;
  const user = await getDefaultUser();

  const [role, meta, eligibleArticles, attempts] = await Promise.all([
    db.role.findUnique({ where: { id: roleId } }),
    db.roleMeta.findUnique({ where: { roleId } }),
    getRoleEligibleArticles(roleId),
    db.testAttempt.findMany({
      where: { userId: user.id, test: { roleId } },
      include: { test: true, certificate: true },
      orderBy: { startedAt: "desc" },
    }),
  ]);

  if (!role) notFound();

  const passedAttempt = attempts.find((a) => a.passed);
  const inProgress = attempts.find((a) => !a.completedAt);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <Link href="/roles" className="text-sm text-muted-foreground hover:text-foreground">
          ← Alle Rollen
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent text-white">
            <Award size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{role.label}</h1>
            {meta && <Badge variant="neutral">{meta.tier}</Badge>}
          </div>
        </div>
      </div>

      {meta && (
        <GlassCard className="flex flex-col gap-2 p-5 rounded-2xl">
          <p className="text-foreground">{meta.shortDescription}</p>
          <p className="text-sm text-muted-foreground">
            Indikativer Stundensatz: ${meta.indicativeRateMinUsd}–${meta.indicativeRateMaxUsd}/h
          </p>
          <p className="text-xs text-muted-foreground">{meta.rateDisclaimer}</p>
        </GlassCard>
      )}

      <GlassCard className="flex flex-col gap-4 p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Verfügbare Artikel für diese Rolle</p>
            <p className="text-2xl font-bold text-foreground">{eligibleArticles.length}</p>
          </div>
          {passedAttempt ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 size={12} /> Zertifiziert
            </Badge>
          ) : (
            <Badge variant="neutral">Noch nicht zertifiziert</Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href={`/roles/${roleId}/test`}>
            <Button variant="primary">{inProgress ? "Test fortsetzen" : "Test starten"}</Button>
          </Link>
          {passedAttempt?.certificate && (
            <Link href={`/roles/${roleId}/certificate/${passedAttempt.id}`}>
              <Button variant="secondary">Zertifikat ansehen</Button>
            </Link>
          )}
        </div>
      </GlassCard>

      {attempts.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Bisherige Versuche</h2>
          <div className="flex flex-col gap-2">
            {attempts.map((a) => (
              <GlassCard key={a.id} className="flex items-center justify-between p-3 rounded-xl text-sm">
                <span className="text-muted-foreground">
                  {new Date(a.startedAt).toLocaleString("de-DE")} · {a.test.mode === "graded" ? "LLM-bewertet" : "Selbsteinschätzung"}
                </span>
                {a.completedAt ? (
                  a.passed ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 size={12} /> {a.score?.toFixed(1)}%
                    </Badge>
                  ) : (
                    <Badge variant="danger" className="gap-1">
                      <XCircle size={12} /> {a.score?.toFixed(1)}%
                    </Badge>
                  )
                ) : (
                  <Badge variant="warning">Läuft</Badge>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
