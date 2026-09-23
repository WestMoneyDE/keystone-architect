"use client";

// components/srs/ModeSelector.tsx — the "Gelerntes" vs. "Zufällig" queue
// mode picker shown before the review queue (fast-follow to ticket 10).
// Follows the established two/three-card choice convention from
// components/setup/NewsToggleStep.tsx: GlassCard options, ring-2 ring-accent
// on the active one, a one-line explanation under each.

import { GlassCard } from "@/components/ui/GlassCard";

export type SrsMode = "learned" | "random";

export interface SrsCounts {
  learnedCount: number;
  randomCount: number;
}

interface ModeSelectorProps {
  onSelect: (mode: SrsMode) => void;
  // Fetched once by the parent (components/srs/SrsFlow.tsx) so the same
  // /api/srs/counts response can also drive the learned-mode empty-state
  // check in ReviewQueue — undefined while loading, cards render without
  // the count suffix until it resolves.
  counts?: SrsCounts;
}

export function ModeSelector({ onSelect, counts }: ModeSelectorProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Wie möchtest du üben?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Wähle, aus welchem Fragenpool die Sitzung zusammengestellt wird.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <GlassCard
          onClick={() => onSelect("learned")}
          className="cursor-pointer p-5 hover:ring-2 hover:ring-accent/50"
        >
          <h3 className="font-medium text-foreground">
            Gelerntes{counts ? ` (${counts.learnedCount} Karten)` : ""}
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Nur Fragen aus Dokumenten, mit denen du bereits interagiert hast (gelesen, markiert oder besprochen).
          </p>
        </GlassCard>
        <GlassCard
          onClick={() => onSelect("random")}
          className="cursor-pointer p-5 hover:ring-2 hover:ring-accent/50"
        >
          <h3 className="font-medium text-foreground">
            Zufällig{counts ? ` (${counts.randomCount} Karten)` : ""}
          </h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Zufällige Auswahl aus dem gesamten Fragenpool, inklusive neuer, noch nie gesehener Karten.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
