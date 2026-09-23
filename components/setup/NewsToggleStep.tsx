"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import type { NewsMode, RoleCardData } from "./types";

interface NewsToggleStepProps {
  roles: RoleCardData[];
  selectedRoles: string[]; // roles chosen in Step B
  mode: NewsMode;
  onModeChange: (mode: NewsMode) => void;
  newsRoleIds: string[];
  onNewsRoleToggle: (roleId: string) => void;
}

export function NewsToggleStep({
  roles,
  selectedRoles,
  mode,
  onModeChange,
  newsRoleIds,
  onNewsRoleToggle,
}: NewsToggleStepProps) {
  // If the user picked no roles in Step B, offer all 8 for the per-role
  // news option instead of an empty list.
  const rolesForNewsChoice = selectedRoles.length > 0 ? roles.filter((r) => selectedRoles.includes(r.roleId)) : roles;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">News-Feed</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Jedes Dokument kann optional aktuelle News zum Thema anzeigen. Das läuft über einen periodischen
          Hintergrund-Job, der ausgehende Netzwerkanfragen an externe Quellen stellt (RSS-Feeds bzw. optional die
          Web-Suche deines LLM-Anbieters) — standardmäßig aus.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard
          onClick={() => onModeChange("off")}
          className={`cursor-pointer p-4 ${mode === "off" ? "ring-2 ring-accent" : ""}`}
        >
          <h3 className="font-medium text-foreground">Aus</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Kein Hintergrund-Job, keine ausgehenden Anfragen. Empfohlener Standard.
          </p>
        </GlassCard>
        <GlassCard
          onClick={() => onModeChange("global")}
          className={`cursor-pointer p-4 ${mode === "global" ? "ring-2 ring-accent" : ""}`}
        >
          <h3 className="font-medium text-foreground">Für alle Themen</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Holt periodisch News für alle 31 Domänen. Mehr Netzwerkverkehr, aber vollständige Abdeckung.
          </p>
        </GlassCard>
        <GlassCard
          onClick={() => onModeChange("roles")}
          className={`cursor-pointer p-4 ${mode === "roles" ? "ring-2 ring-accent" : ""}`}
        >
          <h3 className="font-medium text-foreground">Nur für bestimmte Rollen</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Holt News nur für die Domänen der ausgewählten Rollen — guter Mittelweg.
          </p>
        </GlassCard>
      </div>

      {mode === "roles" && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium text-foreground mb-3">
            Rollen für News auswählen{" "}
            {selectedRoles.length === 0 && (
              <span className="font-normal text-muted-foreground">
                (keine Rollen aus Schritt 2 gewählt — hier stehen alle 8 zur Auswahl)
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {rolesForNewsChoice.map((role) => {
              const checked = newsRoleIds.includes(role.roleId);
              return (
                <label
                  key={role.roleId}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm cursor-pointer ${
                    checked ? "border-accent bg-accent/10 text-accent" : "border-border text-foreground"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onNewsRoleToggle(role.roleId)}
                    className="accent-[var(--accent)]"
                  />
                  {role.label}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
