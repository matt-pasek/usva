"use client";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  arcPath,
  dashForTurn,
  turnToAngle,
  valueToTurn,
} from "./knob-geometry.js";
import { useKnobValue } from "./use-knob-value.js";

const SIZES = {
  sm: { box: 44, stroke: 3, tick: 7, thickness: 2 },
  md: { box: 64, stroke: 4, tick: 10, thickness: 2.5 },
  lg: { box: 96, stroke: 6, tick: 14, thickness: 3 },
} as const;

const controlVariants = cva(
  cn(
    "group relative touch-none select-none rounded-full outline-none",
    "cursor-grab data-[dragging]:cursor-grabbing",
    "focus-visible:ring-focus",
    "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
    "after:absolute after:inset-0 after:content-['']",
  ),
  {
    variants: { size: { sm: "", md: "", lg: "" } },
    defaultVariants: { size: "md" },
  },
);

export interface KnobProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      "defaultValue" | "onChange" | "children"
    >,
    VariantProps<typeof controlVariants> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  onValueCommitted?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: React.ReactNode;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  disabled?: boolean;
}

export const Knob = React.forwardRef<HTMLDivElement, KnobProps>(
  (
    {
      className,
      size,
      value,
      defaultValue,
      onValueChange,
      onValueCommitted,
      min = 0,
      max = 100,
      step = 1,
      label,
      showValue,
      formatValue,
      disabled,
      ...props
    },
    ref,
  ) => {
    const labelId = React.useId();
    const metrics = SIZES[size ?? "md"];
    const {
      value: current,
      dragging,
      handlers,
    } = useKnobValue({
      value,
      defaultValue,
      min,
      max,
      step,
      disabled,
      onValueChange,
      onValueCommitted,
    });

    const center = metrics.box / 2;
    const ringRadius = center - metrics.stroke / 2;
    const bodyRadius = ringRadius - metrics.stroke * 1.5;
    const anchorRadius = bodyRadius - metrics.tick;
    const head = metrics.stroke * 1.5;
    const thumbLength = dragging
      ? ringRadius + metrics.stroke * 0.75 - anchorRadius
      : metrics.tick;
    const turn = valueToTurn(current, min, max);
    const path = arcPath(ringRadius, center);
    const formatted = formatValue ? formatValue(current) : String(current);

    return (
      <div
        ref={ref}
        className={cn("inline-flex flex-col items-center gap-2", className)}
        {...props}
      >
        {label ? (
          <span
            id={labelId}
            className={cn(
              "text-sm text-ink select-none",
              disabled && "opacity-50",
            )}
          >
            {label}
          </span>
        ) : null}

        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={current}
          aria-valuetext={formatted}
          aria-labelledby={label ? labelId : undefined}
          aria-disabled={disabled || undefined}
          data-dragging={dragging ? "" : undefined}
          data-disabled={disabled ? "" : undefined}
          className={controlVariants({ size })}
          style={{ width: metrics.box, height: metrics.box }}
          {...(disabled ? {} : handlers)}
        >
          <svg
            viewBox={`0 0 ${metrics.box} ${metrics.box}`}
            width={metrics.box}
            height={metrics.box}
            aria-hidden="true"
            focusable="false"
            className="block"
          >
            <path
              d={path}
              fill="none"
              strokeWidth={metrics.stroke}
              strokeLinecap="round"
              className="stroke-border-strong"
            />
            <path
              d={path}
              fill="none"
              strokeWidth={metrics.stroke}
              strokeLinecap="round"
              strokeDasharray={dashForTurn(turn, ringRadius)}
              className={cn(
                "stroke-accent",
                dragging
                  ? "transition-none"
                  : "transition-[stroke-dasharray] duration-fast ease-soft motion-reduce:transition-none",
              )}
            />
          </svg>

          <div
            className="absolute rounded-full bg-sunken shadow-raised cursor-ew-resize"
            style={{ inset: center - bodyRadius }}
          />

          <div
            className={cn(
              "pointer-events-none absolute inset-0",
              dragging
                ? "transition-none"
                : "transition-transform duration-fast ease-soft motion-reduce:transition-none",
            )}
            style={{ transform: `rotate(${turnToAngle(turn)}deg)` }}
          >
            <div
              className="absolute left-1/2"
              style={{ top: center - anchorRadius }}
            >
              <div
                className={cn(
                  "absolute top-0 left-0 rounded-full bg-ink/70",
                  "transition-[width,height,background-color] duration-fast ease-soft motion-reduce:transition-none",
                  "group-hover:bg-ink",
                  "group-data-[dragging]:bg-ink/30",
                )}
                style={{
                  width: dragging ? head : metrics.thickness,
                  height: thumbLength,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-accent opacity-0 transition-opacity duration-fast ease-soft group-data-[dragging]:opacity-100 group-data-[dragging]:glow-accent-strong motion-reduce:transition-none"
                  style={{ width: head, height: head }}
                />
              </div>
            </div>
          </div>
        </div>

        {showValue ? (
          <span className="font-mono text-xs tabular-nums text-muted">
            {formatted}
          </span>
        ) : null}
      </div>
    );
  },
);

Knob.displayName = "Knob";
