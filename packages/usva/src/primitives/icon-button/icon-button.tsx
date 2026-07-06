"use client";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

const iconButtonVariants = cva(
  cn(
    "relative inline-grid place-items-center border outline-none",
    "transition-control duration-fast ease-soft",
    "active:scale-[0.96] focus-visible:ring-focus",
    "disabled:pointer-events-none disabled:opacity-50",
    "motion-reduce:transition-none motion-reduce:transform-none",
    "[&_svg]:pointer-events-none",
  ),
  {
    variants: {
      size: {
        sm: "size-8 rounded-lg [&_svg]:h-4 [&_svg]:w-4",
        md: "size-10 rounded-xl [&_svg]:h-[1.15rem] [&_svg]:w-[1.15rem]",
      },
      active: {
        true: "glow-ring border-transparent text-accent",
        false:
          "border-border bg-surface text-muted hover:border-border-strong hover:text-ink",
      },
    },
    defaultVariants: { size: "md", active: false },
  },
);

const tooltipSide: Record<string, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Accessible label. Required, since the button is icon-only. */
  "aria-label": string;
  /** Optional visible tooltip on hover/focus. Falls back to aria-label. */
  tooltip?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, size, active, tooltip, side = "top", children, ...props },
    ref,
  ) => {
    const id = React.useId();
    if (!tooltip) {
      return (
        <button
          ref={ref}
          type="button"
          className={cn(iconButtonVariants({ size, active }), className)}
          {...props}
        >
          {children}
        </button>
      );
    }
    return (
      <span className="group relative isolate inline-flex">
        <button
          ref={ref}
          type="button"
          aria-describedby={id}
          className={cn(iconButtonVariants({ size, active }), className)}
          {...props}
        >
          {children}
        </button>
        <span
          id={id}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-overlay whitespace-nowrap rounded-md border border-border bg-overlay px-2 py-1 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-ink shadow-floating",
            "opacity-0 transition-opacity duration-fast ease-soft group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none",
            tooltipSide[side],
          )}
        >
          {tooltip}
        </span>
      </span>
    );
  },
);
IconButton.displayName = "IconButton";
