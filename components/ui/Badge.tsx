import { type ReactNode } from "react";

/**
 * Extensible string union rather than a hardcoded 2-3 option enum: later
 * tickets reuse this for role tier badges (executive/core/emerging-specialist)
 * and competency markers, so new variants can be added to this union without
 * touching every call site's type.
 */
export type BadgeVariant =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "executive"
  | "core"
  | "emerging-specialist";

export interface BadgeProps {
  children?: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-border/60 text-foreground",
  accent: "bg-accent/15 text-accent",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  executive: "bg-purple-500/15 text-purple-600",
  core: "bg-blue-500/15 text-blue-600",
  "emerging-specialist": "bg-teal-500/15 text-teal-600",
};

export function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
