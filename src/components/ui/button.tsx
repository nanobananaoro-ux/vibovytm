"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-vibovy-dark";

  const variants = {
    primary:
      "bg-vibowy-primary text-white hover:bg-vibowy-primary-hover focus:ring-vibowy-primary shadow-lg shadow-blue-500/20",
    secondary:
      "bg-vibovy-surface text-text-primary border border-vibovy-surface-hover hover:bg-vibovy-surface-hover focus:ring-vibowy-primary",
    outline:
      "bg-transparent text-text-primary border border-vibovy-surface-hover hover:bg-vibovy-surface-hover focus:ring-vibowy-primary",
    ghost:
      "bg-transparent text-text-secondary hover:bg-vibovy-surface hover:text-text-primary focus:ring-vibowy-primary",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg shadow-red-500/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className,
        disabled && "opacity-50 cursor-not-allowed"
      )}
      disabled={disabled}
      {...props}
    />
  );
}