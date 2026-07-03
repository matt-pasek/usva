"use client";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

export const chipVariants = cva(
  cn(
    "inline-flex items-center gap-1.5 rounded-full border font-mono font-medium uppercase tracking-wide",
    "transition-[color,background-color,border-color,translate,box-shadow] duration-150 ease-soft",
    "hover:-translate-y-0.5 hover:border-border-strong motion-reduce:transform-none motion-reduce:transition-none",
  ),
  {
    variants: {
      tone: {
        default: "border-border bg-surface-2 text-muted",
        accent:
          "border-accent/25 bg-accent/12 text-accent hover:border-accent/40",
        "accent-alt":
          "border-accent-alt/25 bg-accent-alt/12 text-accent-alt hover:border-accent-alt/40",
        success:
          "border-success/25 bg-success/12 text-success hover:border-success/40",
        warning:
          "border-warning/25 bg-warning/12 text-warning hover:border-warning/40",
        danger:
          "border-danger/25 bg-danger/12 text-danger hover:border-danger/40",
      },
      size: {
        sm: "h-6 px-2 text-[0.6875rem]",
        md: "h-7 px-2.5 text-xs",
      },
      selected: {
        true: "glow-ring border-transparent text-ink hover:border-transparent",
        false: "",
      },
    },
    defaultVariants: { tone: "default", size: "md", selected: false },
  },
);

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onError">,
    VariantProps<typeof chipVariants> {
  value?: React.ReactNode;
  onRemove?: () => void;
  removeLabel?: string;
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      className,
      tone,
      size,
      selected,
      value,
      onRemove,
      removeLabel = "Remove",
      children,
      ...props
    },
    ref,
  ) => (
    <span
      ref={ref}
      className={cn(chipVariants({ tone, size, selected }), className)}
      {...props}
    >
      <span className="truncate">{children}</span>
      {value !== undefined ? (
        <span className="border-current/20 border-l pl-1.5 font-semibold text-ink tabular-nums">
          {value}
        </span>
      ) : null}
      {onRemove ? (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className={cn(
            "-mr-1 relative ml-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full outline-none",
            "text-current/70 transition-[color,background-color,transform] duration-150 ease-soft",
            "hover:bg-current/10 hover:text-current active:scale-90",
            "focus-visible:ring-focus motion-reduce:transform-none motion-reduce:transition-none",
            "before:absolute before:-inset-2.5 before:content-['']",
          )}
        >
          <RemoveIcon />
        </button>
      ) : null}
    </span>
  ),
);
Chip.displayName = "Chip";

function RemoveIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3 w-3"
      aria-hidden="true"
    >
      <path d="M3 3l6 6M9 3l-6 6" />
    </svg>
  );
}
