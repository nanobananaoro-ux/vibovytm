"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "primary" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-vibovy-surface text-text-secondary border border-vibovy-border",
    success: "bg-emerald-900/30 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-900/30 text-amber-400 border-amber-500/20",
    danger: "bg-red-900/30 text-red-400 border-red-500/20",
    primary: "bg-vibowy-primary text-white",
    outline:
      "bg-transparent text-text-secondary border border-vibovy-border",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}