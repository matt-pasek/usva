import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

export const progressVariants = cva(
  "w-full overflow-hidden rounded-full bg-border-strong",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
  glow?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, size, value, max = 100, glow = false, ...props }, ref) => {
    const indeterminate = value === undefined;
    const pct = indeterminate
      ? 0
      : Math.max(0, Math.min(100, (value / max) * 100));
    const complete = !indeterminate && pct >= 100;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        className={cn(progressVariants({ size }), className)}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full",
            complete ? "bg-live" : "bg-accent bg-gradient-accent",
            glow && "glow-accent",
            indeterminate
              ? "w-full animate-shimmer motion-reduce:animate-none"
              : "transition-layout duration-ambient ease-soft motion-reduce:transition-none",
          )}
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    );
  },
);
Progress.displayName = "Progress";
