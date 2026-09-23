"use client";

import { BookOpen, GraduationCap, Layers, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatsCard } from "@/components/ui/StatsCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

/**
 * Visual QA route for ticket 2's design-system components. Not part of the
 * real app navigation — renders one of each new component with sample data
 * so they can be inspected without real Prisma-backed pages existing yet.
 * Rendered inside AppShell via the root layout, so the sidebar/theme toggle
 * are exercised here too.
 */
export default function ComponentsPreviewPage() {
  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="mb-1 text-2xl font-bold">Component preview</h1>
        <p className="text-muted-foreground">
          Visual QA for GlassCard, StatsCard, Button, and Badge (ticket 2).
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          StatsCard
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Articles"
            value={720}
            change={12.4}
            icon={BookOpen}
            gradient="from-indigo-500 to-purple-500"
          />
          <StatsCard
            title="Questions"
            value={3849}
            change={4.1}
            icon={Layers}
            gradient="from-sky-500 to-cyan-500"
          />
          <StatsCard
            title="Domains"
            value={31}
            icon={TrendingUp}
            gradient="from-emerald-500 to-teal-500"
          />
          <StatsCard
            title="Roles"
            value={8}
            change={-2.3}
            icon={GraduationCap}
            gradient="from-orange-500 to-rose-500"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          GlassCard
        </h2>
        <GlassCard className="max-w-md p-6">
          <p className="font-medium">Plain glass card</p>
          <p className="text-sm text-muted-foreground">
            Frosted background driven by --glass-bg / --glass-border / --glass-blur.
          </p>
        </GlassCard>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Button
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" size="md">
            Primary md
          </Button>
          <Button variant="secondary" size="md">
            Secondary md
          </Button>
          <Button variant="ghost" size="md">
            Ghost md
          </Button>
          <Button variant="primary" size="sm">
            Primary sm
          </Button>
          <Button variant="secondary" size="sm">
            Secondary sm
          </Button>
          <Button variant="ghost" size="sm">
            Ghost sm
          </Button>
          <Button variant="primary" size="md" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Badge
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="executive">Executive Tier</Badge>
          <Badge variant="core">Core Leadership</Badge>
          <Badge variant="emerging-specialist">Emerging Specialist</Badge>
        </div>
      </section>
    </div>
  );
}
