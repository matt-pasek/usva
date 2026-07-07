import * as React from "react";
import { cn } from "../../cn.js";

export interface ProgressRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label: React.ReactNode;
  value: number;
  max: number;
  /** Trailing unit on the figures, e.g. "cr". */
  unit?: string;
  /** A slot, usually a Badge. ProgressRow never derives status from the ratio. */
  status?: React.ReactNode;
  /**
   * Categorical key colour, any CSS colour, following StripeCard's stripeColor.
   * It says which module this row is, not how it is doing.
   */
  barColor?: string;
  /** Accessible name for the bar. Defaults to `label` when that is a string. */
  "aria-label"?: string;
}

function ratio(value: number, max: number): number {
  if (!(max > 0)) return 0;
  return Math.min(Math.max(value / max, 0), 1);
}

/**
 * A labelled progress bar with mono figures and a status slot.
 *
 * Deliberately not a disclosure: sisu's SectionHeader wraps this shape in a
 * button with a chevron and aria-expanded. That accordion is a separate
 * concern and does not belong inside a progress row.
 */
export const ProgressRow = React.forwardRef<HTMLDivElement, ProgressRowProps>(
  (
    {
      className,
      label,
      value,
      max,
      unit,
      status,
      barColor,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const percent = ratio(value, max) * 100;
    const name = ariaLabel ?? (typeof label === "string" ? label : undefined);

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-4 py-3", className)}
        {...props}
      >
        <div className="min-w-0 flex-1">
          <div className="mb-2 truncate text-sm font-semibold text-ink">
            {label}
          </div>
          <div
            role="progressbar"
            aria-label={name}
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            className="block h-1.5 max-w-96 overflow-hidden rounded-full bg-surface-2"
          >
            <span
              data-testid="progress-row-fill"
              className={cn(
                "block h-full rounded-full transition-[width] duration-slow ease-soft motion-reduce:transition-none",
                barColor == null && "bg-accent",
              )}
              style={{
                width: `${percent}%`,
                backgroundColor: barColor,
              }}
            />
          </div>
        </div>

        {status != null && <div className="shrink-0">{status}</div>}

        <div className="min-w-20 shrink-0 text-right font-mono text-sm tabular-nums">
          <span className="font-semibold text-ink">{value}</span>
          <span className="text-muted">
            {" / "}
            {max}
            {unit != null && ` ${unit}`}
          </span>
        </div>
      </div>
    );
  },
);
ProgressRow.displayName = "ProgressRow";
