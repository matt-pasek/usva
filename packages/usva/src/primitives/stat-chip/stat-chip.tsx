import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../cn.js";

export const statChipVariants = cva(
  cn(
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 font-mono tabular-nums",
    "transition-tint duration-fast ease-soft",
  ),
  {
    variants: {
      tone: {
        neutral: "border-border bg-surface-2",
        accent: "border-accent/25 bg-accent/8",
        "accent-alt": "border-accent-alt/25 bg-accent-alt/8",
        success: "border-success/25 bg-success/8",
        warning: "border-warning/25 bg-warning/8",
        danger: "border-danger/25 bg-danger/8",
      },
      size: {
        sm: "h-6 text-[0.6875rem]",
        md: "h-7 text-xs",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

const valueTone: Record<string, string> = {
  neutral: "text-ink",
  accent: "text-accent",
  "accent-alt": "text-accent-alt",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

export interface StatChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statChipVariants> {
  /** Leading muted label, e.g. "credits". */
  label?: React.ReactNode;
  /** The figure. Rendered semibold and tabular. */
  value: React.ReactNode;
  /** Trailing faint unit, e.g. "cr", "%". */
  unit?: React.ReactNode;
}

export function StatChip({
  className,
  tone = "neutral",
  size,
  label,
  value,
  unit,
  ...props
}: StatChipProps) {
  return (
    <span
      className={cn(statChipVariants({ tone, size }), className)}
      {...props}
    >
      {label != null && (
        <span className="uppercase tracking-wide text-muted">{label}</span>
      )}
      <span className={cn("font-semibold", valueTone[tone ?? "neutral"])}>
        {value}
      </span>
      {unit != null && <span className="text-muted">{unit}</span>}
    </span>
  );
}
StatChip.displayName = "StatChip";
