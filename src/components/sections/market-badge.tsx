"use client";

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

interface MarketBadgeProps {
  value?: number;
  change?: number;
  size?: "sm" | "md" | "lg";
}

export function MarketBadge({
  value,
  change = 0,
  size = "md",
}: MarketBadgeProps) {
  const sizes = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-lg",
  };

  const isPositive = change >= 0;
  const changeColor = isPositive ? "text-emerald-400" : "text-red-400";
  const changeIcon = isPositive ? "▲" : "▼";

  return (
    <div className="flex items-baseline gap-1">
      {value !== undefined && (
        <span className={cn(sizes[size], "font-bold text-text-primary")}>
          {formatCurrency(value)}
        </span>
      )}
      <span className={`${changeColor} font-medium text-xs`}>
        {changeIcon} {Math.abs(change || 0)}%
      </span>
    </div>
  );
}