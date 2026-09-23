import QRCode from "qrcode";
import { db } from "@/lib/db";
import { getLanIp } from "@/lib/network";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const dynamic = "force-dynamic";

// Re-exposes the same choices app/setup/page.tsx collects at first run —
// provider, role selection, display name, news — plus what didn't exist at
// onboarding time: theme (note only, the control already lives in the top
// bar), the PWA toggle, and export/import. Reuses the same
// components/setup/* step components and the same
// /api/onboarding + /api/provider-config routes rather than duplicating
// their logic, per the ticket's guidance.
export default async function SettingsPage() {
  const [user, roleMetas, roles, roleSelections, featureFlags] = await Promise.all([
    db.user.findFirst({ where: { isDefault: true } }),
    db.roleMeta.findMany(),
    db.role.findMany({ orderBy: { id: "asc" } }),
    db.user
      .findFirst({ where: { isDefault: true } })
      .then((u) => (u ? db.userRoleSelection.findMany({ where: { userId: u.id } }) : [])),
    db.user
      .findFirst({ where: { isDefault: true } })
      .then((u) => (u ? db.featureFlags.findUnique({ where: { userId: u.id } }) : null)),
  ]);

  if (!user) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Kein Standard-Benutzer gefunden — führe zuerst <code>npm run db:seed</code> aus.
      </div>
    );
  }

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

  const newsMode: "off" | "global" | "roles" = featureFlags?.newsEnabledGlobal
    ? "global"
    : (featureFlags?.newsEnabledRoles.length ?? 0) > 0
      ? "roles"
      : "off";

  // Remote Access QR panel (ticket 13) — LAN IP is detected server-side
  // (os.networkInterfaces(), filtered to exclude VPN/WSL/virtual adapters
  // in lib/network.ts) and the QR code is rendered to a data: URL here so
  // no client-side QR library or extra round-trip is needed.
  const port = process.env.PORT ?? "3000";
  const { address: lanIp } = getLanIp();
  const remoteUrl = lanIp ? `http://${lanIp}:${port}` : null;
  const remoteQrDataUrl = remoteUrl
    ? await QRCode.toDataURL(remoteUrl, { margin: 1, width: 220 })
    : null;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Einstellungen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Alle Onboarding-Entscheidungen lassen sich hier jederzeit ändern.
        </p>
      </div>

      <SettingsClient
        initialDisplayName={user.displayName ?? ""}
        roles={roleCards}
        initialSelectedRoles={roleSelections.map((r) => r.roleId)}
        initialNewsMode={newsMode}
        initialNewsRoleIds={featureFlags?.newsEnabledRoles ?? []}
        initialPwaEnabled={featureFlags?.pwaEnabled ?? true}
        remoteUrl={remoteUrl}
        remoteQrDataUrl={remoteQrDataUrl}
      />
    </div>
  );
}
