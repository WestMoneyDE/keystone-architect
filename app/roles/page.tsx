import { db } from "@/lib/db";
import { RolesGrid, type RoleCardEntry } from "@/components/roles/RolesGrid";

export const dynamic = "force-dynamic";

async function getDefaultUser() {
  const user = await db.user.findFirst({ where: { isDefault: true } });
  if (!user) throw new Error("No default user found — run `npm run db:seed` first.");
  return user;
}

export default async function RolesPage() {
  const user = await getDefaultUser();

  const [roles, roleMetas, attempts, roleSelections] = await Promise.all([
    db.role.findMany({ orderBy: { id: "asc" } }),
    db.roleMeta.findMany(),
    db.testAttempt.findMany({
      where: { userId: user.id },
      include: { test: true },
      orderBy: { startedAt: "desc" },
    }),
    db.userRoleSelection.findMany({ where: { userId: user.id } }),
  ]);

  const metaByRole = new Map(roleMetas.map((m) => [m.roleId, m]));

  const attemptsByRole = new Map<string, typeof attempts>();
  for (const attempt of attempts) {
    const list = attemptsByRole.get(attempt.test.roleId) ?? [];
    list.push(attempt);
    attemptsByRole.set(attempt.test.roleId, list);
  }

  const roleEntries: RoleCardEntry[] = roles.map((role) => {
    const meta = metaByRole.get(role.id);
    const roleAttempts = attemptsByRole.get(role.id) ?? [];
    const completed = roleAttempts.filter((a) => a.completedAt);
    const bestScore = completed.reduce<number | null>(
      (best, a) => (a.score != null && (best == null || a.score > best) ? a.score : best),
      null
    );
    const anyPassed = completed.some((a) => a.passed);
    const hasInProgress = roleAttempts.some((a) => !a.completedAt);

    let status: RoleCardEntry["status"] = "not-started";
    if (anyPassed) status = "passed";
    else if (hasInProgress) status = "in-progress";
    else if (completed.length > 0) status = "failed";

    return {
      id: role.id,
      label: role.label,
      tier: meta?.tier ?? null,
      shortDescription: meta?.shortDescription ?? null,
      status,
      bestScore,
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-foreground">Rollen &amp; Zertifizierungen</h1>
        <p className="text-muted-foreground">
          20 Fragen pro Rollen-Test, LLM-bewertet wenn ein Anbieter aktiv ist, sonst Selbsteinschätzung. Bestehensgrenze 70%.
          Markiere Rollen als bevorzugt, um Empfehlungen und Domain-Ranking darauf abzustimmen.
        </p>
      </div>

      <RolesGrid roles={roleEntries} initialPreferredRoleIds={roleSelections.map((r) => r.roleId)} />
    </div>
  );
}
