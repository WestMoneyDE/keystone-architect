"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import type { RoleCardData } from "./types";

interface RoleSelectionStepProps {
  roles: RoleCardData[];
  selected: string[];
  onToggle: (roleId: string) => void;
}

const TIER_SECTIONS: { tier: RoleCardData["tier"]; heading: string; blurb: string; badgeVariant: BadgeVariant }[] = [
  {
    tier: "executive",
    heading: "Executive Tier",
    blurb: "Am seniorsten, wenigste offene Positionen, höchste Vergütungsobergrenze.",
    badgeVariant: "executive",
  },
  {
    tier: "core",
    heading: "Core Leadership",
    blurb: "Breite, grundlegende Senior-/Staff+-Rollen, die in fast jeder großen Organisation vorkommen.",
    badgeVariant: "core",
  },
  {
    tier: "emerging-specialist",
    heading: "Emerging Specialist",
    blurb:
      "Neuere, schnell wachsende, hochspezialisierte technische Domänen mit starker Nachfragedynamik, aber (noch) kleinerem Markt.",
    badgeVariant: "emerging-specialist",
  },
];

export function RoleSelectionStep({ roles, selected, onToggle }: RoleSelectionStepProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Rollen auswählen</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Deine Auswahl priorisiert Empfehlungen und Tests für diese Rollen — alle 720 Artikel bleiben trotzdem
          durchsuchbar und browsbar, unabhängig davon, was du hier wählst. Mehrfachauswahl möglich, auch leer lassen
          ist erlaubt.
        </p>
      </div>

      {TIER_SECTIONS.map((section) => {
        const roleCards = roles.filter((r) => r.tier === section.tier);
        if (roleCards.length === 0) return null;
        return (
          <section key={section.tier} className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{section.heading}</h3>
              <Badge variant={section.badgeVariant}>{roleCards.length}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">{section.blurb}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {roleCards.map((role) => {
                const isSelected = selected.includes(role.roleId);
                return (
                  <GlassCard
                    key={role.roleId}
                    onClick={() => onToggle(role.roleId)}
                    className={`cursor-pointer p-4 ${isSelected ? "ring-2 ring-accent" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-foreground">{role.label}</h4>
                      <Badge variant={section.badgeVariant}>{role.roleId}</Badge>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{role.shortDescription}</p>
                    <p className="mt-3 text-sm font-medium text-foreground">
                      ${role.indicativeRateMinUsd}–${role.indicativeRateMaxUsd}/hr
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground italic">{role.rateDisclaimer}</p>
                  </GlassCard>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
