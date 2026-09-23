import { db } from "@/lib/db";
import { SetupWizard } from "@/components/setup/SetupWizard";

// This route is always reachable directly (for re-running setup), not just
// on first run — no "first-run auto-redirect to /setup" detection here,
// that's an explicitly deferred nice-to-have per the plan.
export default async function SetupPage() {
  const [roleMetas, roles] = await Promise.all([
    db.roleMeta.findMany(),
    db.role.findMany({ orderBy: { id: "asc" } }),
  ]);

  const roleLabelById = new Map(roles.map((r) => [r.id, r.label]));

  const roleCards = roleMetas
    .map((rm) => ({
      roleId: rm.roleId,
      label: roleLabelById.get(rm.roleId) ?? rm.roleId,
      shortDescription: rm.shortDescription,
      tier: rm.tier as "executive" | "core" | "emerging-specialist",
      indicativeRateMinUsd: rm.indicativeRateMinUsd,
      indicativeRateMaxUsd: rm.indicativeRateMaxUsd,
      rateDisclaimer: rm.rateDisclaimer,
    }))
    .sort((a, b) => a.roleId.localeCompare(b.roleId));

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
      <SetupWizard roles={roleCards} />
    </div>
  );
}
