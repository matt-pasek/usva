import * as React from "react";
import { cn } from "../../cn.js";

export interface Step {
  /** Optional icon; falls back to the mono step number. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  body?: React.ReactNode;
  /** Stable key; defaults to the index. */
  id?: string;
}

export interface StepListProps
  extends Omit<React.HTMLAttributes<HTMLOListElement>, "children"> {
  steps: Step[];
  /** Level of each step title. Pick it to fit the page outline. */
  headingLevel?: "h2" | "h3" | "h4";
}

export const StepList = React.forwardRef<HTMLOListElement, StepListProps>(
  ({ className, steps, headingLevel: Heading = "h4", ...props }, ref) => {
    const last = steps.length - 1;
    return (
      <ol ref={ref} className={cn("flex flex-col", className)} {...props}>
        {steps.map((step, i) => {
          const key = step.id ?? `step-${i}`;
          const ordinal = (i + 1).toString().padStart(2, "0");
          return (
            <li key={key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 font-mono text-sm tabular-nums text-accent-alt [&_svg]:h-[1.15rem] [&_svg]:w-[1.15rem]">
                  {step.icon ?? ordinal}
                </span>
                {i < last && (
                  <span
                    aria-hidden="true"
                    className="mt-1 min-h-8 w-px flex-1 bg-border"
                  />
                )}
              </div>
              <div
                className={cn(
                  "min-w-0",
                  step.body == null && "flex min-h-11 flex-col justify-center",
                  i < last ? "pb-8" : "pb-0",
                )}
              >
                {step.icon != null && (
                  <p className="mb-1 font-mono text-[0.7rem] tabular-nums tracking-[0.16em] text-muted">
                    {ordinal}
                  </p>
                )}
                <Heading
                  className={cn(
                    "text-base font-semibold tracking-[-0.01em] text-ink",
                    step.body != null && "mb-1",
                  )}
                >
                  {step.title}
                </Heading>
                {step.body != null && (
                  <p className="text-sm leading-relaxed text-muted">
                    {step.body}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  },
);
StepList.displayName = "StepList";
