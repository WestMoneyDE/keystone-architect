"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  className?: string;
}

/**
 * Frosted glassmorphism card. Looks correct in both light and dark themes
 * because it is driven entirely by the --glass-* CSS variables defined in
 * app/globals.css (which flip when [data-theme="dark"] is set on <html>).
 */
export function GlassCard({ children, className = "", ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`glass-card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
