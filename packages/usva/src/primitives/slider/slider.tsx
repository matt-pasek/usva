"use client";
import { Slider as Base, type SliderRootProps } from "@base-ui/react/slider";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

const trackVariants = cva(
  "relative w-full select-none rounded-full border border-border bg-surface-2",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-1.5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const thumbVariants = cva(
  cn(
    "rounded-full border border-accent bg-gradient-accent shadow-raised outline-none transition-control duration-base ease-soft hover:glow-ring has-[:focus-visible]:ring-focus data-[dragging]:glow-ring",
    "after:absolute after:content-['']",
  ),
  {
    variants: {
      size: {
        sm: "size-3.5 after:-inset-[5px]",
        md: "size-4 after:-inset-1",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const controlVariants = cva("flex w-full touch-none items-center py-1.5", {
  variants: {
    size: {
      sm: "px-[7px]",
      md: "px-2",
    },
  },
  defaultVariants: { size: "md" },
});

export interface SliderProps
  extends Omit<SliderRootProps<number>, "render" | "className">,
    VariantProps<typeof trackVariants> {
  className?: string;
  label?: React.ReactNode;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    { className, size, label, showValue, formatValue, disabled, ...props },
    ref,
  ) => (
    <Base.Root
      ref={ref}
      disabled={disabled}
      className={cn(
        "flex w-full flex-col gap-2",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      {...props}
    >
      {label || showValue ? (
        <div className="flex items-center justify-between gap-4">
          {label ? (
            <Base.Label className="text-sm text-ink select-none">
              {label}
            </Base.Label>
          ) : (
            <span />
          )}
          {showValue ? (
            <Base.Value className="font-mono text-xs tabular-nums text-muted">
              {(formatted, values) =>
                formatValue ? formatValue(values[0] ?? 0) : (formatted[0] ?? "")
              }
            </Base.Value>
          ) : null}
        </div>
      ) : null}
      <Base.Control className={controlVariants({ size })}>
        <Base.Track className={trackVariants({ size })}>
          <Base.Indicator className="rounded-full bg-accent bg-gradient-accent" />
          <Base.Thumb className={thumbVariants({ size })} />
        </Base.Track>
      </Base.Control>
    </Base.Root>
  ),
);
Slider.displayName = "Slider";
