"use client";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";
import { Spinner } from "../spinner/spinner.js";

const iconButtonVariants = cva(
  cn(
    "relative inline-grid place-items-center border outline-none",
    "transition-control duration-fast ease-soft",
    "active:scale-[0.96] focus-visible:ring-focus",
    "disabled:pointer-events-none disabled:opacity-50",
    "motion-reduce:transition-none motion-reduce:transform-none",
    "before:absolute before:content-['']",
    "[&_svg]:pointer-events-none",
  ),
  {
    variants: {
      // the `before` inset expands the hit area to 44px without growing the box,
      // so it has to scale inversely with the visual size
      size: {
        sm: "size-8 rounded-lg before:-inset-1.5 [&_svg]:h-4 [&_svg]:w-4",
        md: "size-10 rounded-xl before:-inset-0.5 [&_svg]:h-[1.15rem] [&_svg]:w-[1.15rem]",
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
  /** Swaps the icon for a spinner. Blocks interaction without dimming the control. */
  loading?: boolean;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      size = "md",
      active,
      tooltip,
      side = "top",
      loading,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const id = React.useId();
    const glyph = loading ? (
      <Spinner
        aria-hidden="true"
        label=""
        tone="current"
        size="sm"
        className={size === "sm" ? "scale-75" : undefined}
      />
    ) : (
      children
    );
    const shared = {
      type: "button",
      "aria-busy": loading || undefined,
      "data-loading": loading || undefined,
      onClick: loading ? undefined : onClick,
      className: cn(
        iconButtonVariants({ size, active }),
        loading && "pointer-events-none",
        className,
      ),
    } as const;

    if (!tooltip) {
      return (
        <button ref={ref} {...shared} {...props}>
          {glyph}
        </button>
      );
    }
    return (
      <span className="group relative isolate inline-flex">
        <button ref={ref} aria-describedby={id} {...shared} {...props}>
          {glyph}
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
