"use client";

import Link from "next/link";
import { useState } from "react";
import { Award, CheckCircle2, Circle, Clock, XCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";

type Status = "not-started" | "in-progress" | "passed" | "failed";

const statusMeta: Record<Status, { label: string; icon: typeof Circle; variant: BadgeVariant }> = {
  "not-started": { label: "Nicht begonnen", icon: Circle, variant: "neutral" },
  "in-progress": { label: "In Bearbeitung", icon: Clock, variant: "warning" },
  passed: { label: "Bestanden", icon: CheckCircle2, variant: "success" },
  failed: { label: "Nicht bestanden", icon: XCircle, variant: "danger" },
};

const tierBadgeVariant: Record<string, BadgeVariant> = {
  executive: "executive",
  core: "core",
  "emerging-specialist": "emerging-specialist",
};

export interface RoleCardEntry {
  id: string;
  label: string;
  tier: string | null;
  shortDescription: string | null;
  status: Status;
  bestScore: number | null;
}

interface RolesGridProps {
  roles: RoleCardEntry[];
  initialPreferredRoleIds: string[];
}

// Inline checkbox toggle (fast-follow to ticket 9): lets the user add/remove
// a role from their preferred set (UserRoleSelection) directly on this page,
// without navigating to /setup or /settings. Both surfaces read/write the
// same table, so a toggle here shows up there and vice versa. Optimistic —
// the checkbox flips immediately on click and only reverts if the request
// actually fails, matching the project's low-friction interaction style.
export function RolesGrid({ roles, initialPreferredRoleIds }: RolesGridProps) {
  const [preferred, setPreferred] = useState<Set<string>>(new Set(initialPreferredRoleIds));
  const { show } = useToast();

  async function togglePreference(roleId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const wasPreferred = preferred.has(roleId);
    const nextPreferred = !wasPreferred;

    setPreferred((prev) => {
      const next = new Set(prev);
      if (nextPreferred) next.add(roleId);
      else next.delete(roleId);
      return next;
    });

    try {
      const res = await fetch("/api/roles/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId, preferred: nextPreferred }),
      });
      if (!res.ok) throw new Error("request failed");
    } catch {
      // revert on failure
      setPreferred((prev) => {
        const next = new Set(prev);
        if (wasPreferred) next.add(roleId);
        else next.delete(roleId);
        return next;
      });
      show({ message: "Rollenpräferenz konnte nicht gespeichert werden." });
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => {
        const isPreferred = preferred.has(role.id);
        const { label, icon: Icon, variant } = statusMeta[role.status];

        return (
          <Link key={role.id} href={`/roles/${role.id}`}>
            <GlassCard className="relative flex h-full flex-col gap-3 p-5 rounded-2xl">
              <button
                type="button"
                onClick={(e) => togglePreference(role.id, e)}
                aria-pressed={isPreferred}
                aria-label={isPreferred ? `${role.label} aus bevorzugten Rollen entfernen` : `${role.label} zu bevorzugten Rollen hinzufügen`}
                title={isPreferred ? "Bevorzugte Rolle — klicken zum Entfernen" : "Als bevorzugte Rolle markieren"}
                className={`absolute right-4 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                  isPreferred
                    ? "border-accent bg-accent text-white"
                    : "border-border bg-background/80 text-transparent hover:border-accent/60"
                }`}
              >
                <CheckCircle2 size={16} className={isPreferred ? "opacity-100" : "opacity-0"} />
              </button>

              <div className="flex items-start justify-between gap-2 pr-8">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent text-white">
                  <Award size={18} />
                </div>
                {role.tier && <Badge variant={tierBadgeVariant[role.tier] ?? "neutral"}>{role.tier}</Badge>}
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{role.label}</h2>
                {role.shortDescription && (
                  <p className="mt-1 text-sm text-muted-foreground">{role.shortDescription}</p>
                )}
              </div>
              <div className="mt-auto flex items-center justify-between pt-2">
                <Badge variant={variant} className="gap-1">
                  <Icon size={12} /> {label}
                </Badge>
                {role.bestScore != null && (
                  <span className="text-sm font-medium text-foreground">{role.bestScore.toFixed(0)}%</span>
                )}
              </div>
            </GlassCard>
          </Link>
        );
      })}
    </div>
  );
}
