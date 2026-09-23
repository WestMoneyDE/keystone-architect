"use client";

// app/roles/[role]/test/page.tsx — kicks off a new TestAttempt via
// POST /api/tests/[role]/start on mount and renders TestRunner with the
// result. Simplification (documented in the ticket 9 report): starting a
// test always creates a fresh TestAttempt rather than resuming a specific
// prior in-progress one — acceptable for this ticket's scope; abandoned
// attempts just remain visible, unfinished, in the role page's history.

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { TestRunner, type TestQuestion } from "@/components/test/TestRunner";
import { Button } from "@/components/ui/Button";

interface StartResponse {
  attemptId: string;
  testId: string;
  mode: "graded" | "self-assessed";
  roleId: string;
  roleLabel: string;
  passThreshold: number;
  questions: TestQuestion[];
}

export default function RoleTestPage({ params }: { params: Promise<{ role: string }> }) {
  const { role: roleId } = use(params);
  const [data, setData] = useState<StartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/tests/roles/${roleId}/start`, { method: "POST" });
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(
            json.error === "no-eligible-questions"
              ? "Für diese Rolle sind aktuell keine Testfragen verfügbar."
              : "Test konnte nicht gestartet werden."
          );
          return;
        }
        setData(json);
      } catch {
        if (!cancelled) setError("Test konnte nicht gestartet werden.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [roleId]);

  if (error) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 py-16 text-center">
        <p className="text-danger">{error}</p>
        <Link href={`/roles/${roleId}`}>
          <Button variant="secondary">Zurück zur Rolle</Button>
        </Link>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="animate-spin" size={24} />
        <p>Test wird vorbereitet…</p>
      </div>
    );
  }

  return (
    <TestRunner
      attemptId={data.attemptId}
      roleId={data.roleId}
      roleLabel={data.roleLabel}
      mode={data.mode}
      passThreshold={data.passThreshold}
      questions={data.questions}
    />
  );
}
