import * as React from "react";
import { cn } from "../../cn.js";

export interface StepChipsProps
  extends Omit<React.HTMLAttributes<HTMLOListElement>, "children"> {
  steps: React.ReactNode[];
}

/**
 * A numbered sequence of chips, joined by arrows. The arrow lives inside its step
 * rather than between steps: an `ol` may only contain `li`, and sisu's sibling
 * fragments put the arrows outside the list entirely.
 */
export const StepChips = React.forwardRef<HTMLOListElement, StepChipsProps>(
  ({ className, steps, ...props }, ref) => {
    const last = steps.length - 1;
    return (
      <ol
        ref={ref}
        className={cn(
          "flex list-none flex-wrap items-center gap-1.5",
          className,
        )}
        {...props}
      >
        {steps.map((step, index) => (
          <li
            key={typeof step === "string" ? step : index}
            className="inline-flex items-center gap-1.5"
          >
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-ink/[0.04] px-2.5 py-1.5 text-xs text-muted">
              <span
                aria-hidden="true"
                className="grid size-[1.1rem] shrink-0 place-items-center rounded-full bg-accent-alt/15 text-[0.62rem] font-bold tabular-nums text-accent-alt"
              >
                {index + 1}
              </span>
              {step}
            </span>
            {index < last && (
              <span
                data-step-separator=""
                aria-hidden="true"
                className="hidden text-muted sm:inline"
              >
                &rarr;
              </span>
            )}
          </li>
        ))}
      </ol>
    );
  },
);
StepChips.displayName = "StepChips";
