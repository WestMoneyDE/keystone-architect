"use client";

import { Award, BookOpen, Compass, Layers } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";

// StatsCard is a client component whose `icon` prop is a component
// reference (LucideIcon) — that can't be passed across the server/client
// boundary as a prop from a server component (React/Next.js only allows
// serializable data or already-rendered elements across that boundary).
// This thin client wrapper takes plain serializable numbers from the
// server-rendered app/page.tsx and resolves icons locally instead.
interface StatsGridProps {
  engagementPercent: number;
  certificateCount: number;
  srsDueCount: number;
  selectedRoleCount: number;
}

export function StatsGrid({ engagementPercent, certificateCount, srsDueCount, selectedRoleCount }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Engagement"
        value={`${engagementPercent}%`}
        icon={BookOpen}
        gradient="from-indigo-500 to-purple-500"
      />
      <StatsCard title="Zertifikate" value={certificateCount} icon={Award} gradient="from-amber-500 to-orange-500" />
      <StatsCard title="Karteikarten fällig" value={srsDueCount} icon={Layers} gradient="from-teal-500 to-emerald-500" />
      <StatsCard title="Ausgewählte Rollen" value={selectedRoleCount} icon={Compass} gradient="from-sky-500 to-blue-500" />
    </div>
  );
}
