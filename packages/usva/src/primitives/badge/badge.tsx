import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { cn } from "../../cn.js";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tabular-nums",
  {
    variants: {
      tone: {
        neutral: "border-border bg-surface-2 text-muted",
        accent: "border-accent/25 bg-accent/12 text-accent",
        "accent-alt": "border-accent-alt/25 bg-accent-alt/12 text-accent-alt",
        success: "border-success/25 bg-success/12 text-success",
        warning: "border-warning/25 bg-warning/12 text-warning",
        danger: "border-danger/25 bg-danger/12 text-danger",
      },
      mono: {
        true: "font-mono text-[0.6875rem] font-semibold uppercase leading-none tracking-wide",
        false: "",
      },
    },
    defaultVariants: { tone: "neutral", mono: false },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  live?: boolean;
}

export function Badge({
  className,
  tone,
  mono,
  live,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        badgeVariants({ tone, mono }),
        live && "border-live/25 bg-live/12 text-live",
        className,
      )}
      {...props}
    >
      {live ? (
        <span
          aria-hidden="true"
          className="-ml-0.5 h-1.5 w-1.5 rounded-full bg-live animate-live-pulse"
        />
      ) : null}
      {children}
    </span>
  );
}
