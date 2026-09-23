"use client";

import { type LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { GlassCard } from "./GlassCard";

export interface StatsCardProps {
  title: string;
  value: string | number;
  /** Percentage change, e.g. 12.4 or -3.1. Positive renders success, negative renders danger. */
  change?: number;
  icon: LucideIcon;
  /** Optional Tailwind gradient classes applied to the icon badge, e.g. "from-indigo-500 to-purple-500". */
  gradient?: string;
}

export function StatsCard({ title, value, change, icon: Icon, gradient }: StatsCardProps) {
  const isPositive = typeof change === "number" && change >= 0;

  return (
    <GlassCard className="p-6 rounded-2xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white ${
            gradient ?? "from-accent to-accent"
          }`}
        >
          <Icon size={20} />
        </div>
      </div>

      {typeof change === "number" && (
        <div
          className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${
            isPositive ? "text-success" : "text-danger"
          }`}
        >
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{Math.abs(change)}%</span>
        </div>
      )}
    </GlassCard>
  );
}
