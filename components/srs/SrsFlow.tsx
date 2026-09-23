"use client";

// components/srs/SrsFlow.tsx — client wrapper that owns the "Gelerntes" vs.
// "Zufällig" mode selection state, sitting between app/srs/page.tsx (server
// component, handles ?roleId=/?domainId=) and ReviewQueue (the actual
// flashcard flow). Fast-follow to ticket 10.

import { useEffect, useState } from "react";
import { ModeSelector, type SrsCounts, type SrsMode } from "./ModeSelector";
import { ReviewQueue } from "./ReviewQueue";

export interface SrsFlowProps {
  roleId?: string;
  domainId?: string;
}

export function SrsFlow({ roleId, domainId }: SrsFlowProps) {
  const [mode, setMode] = useState<SrsMode | null>(null);
  const [counts, setCounts] = useState<SrsCounts | undefined>(undefined);

  // Re-fetched whenever the mode-selection screen is (re-)shown, including
  // after "Modus wechseln", so the counts and the learned-mode empty-state
  // check reflect current data rather than a stale value from page load.
  useEffect(() => {
    if (mode !== null) return;
    let cancelled = false;
    fetch("/api/srs/counts")
      .then((res) => res.json())
      .then((data: SrsCounts) => {
        if (!cancelled) setCounts(data);
      })
      .catch(() => {
        // Counts are a nice-to-have for the selector; harmless if this
        // silently stays undefined — the mode picker still works.
      });
    return () => {
      cancelled = true;
    };
  }, [mode]);

  if (mode === null) {
    return <ModeSelector onSelect={setMode} counts={counts} />;
  }

  return (
    <ReviewQueue
      key={mode}
      roleId={roleId}
      domainId={domainId}
      mode={mode}
      learnedPoolSize={counts?.learnedCount}
      onChangeMode={() => setMode(null)}
    />
  );
}
