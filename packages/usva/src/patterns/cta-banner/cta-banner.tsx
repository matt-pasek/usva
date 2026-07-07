import * as React from "react";
import { cn } from "../../cn.js";
import { StepChips } from "../step-chips/step-chips.js";

export type CtaBannerHeadingLevel = "h2" | "h3" | "h4";

export interface CtaBannerProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  body?: React.ReactNode;
  headingLevel?: CtaBannerHeadingLevel;
  /** Numbered chips under the copy. Rendered as an ordered list. */
  steps?: React.ReactNode[];
  /** Names the step sequence for assistive tech, e.g. "Setup steps". */
  stepsLabel?: string;
  /** The call to action itself. Pass a Button. */
  action?: React.ReactNode;
  /** Mono kicker beside the footer content. */
  footerLabel?: React.ReactNode;
  /** Trailing proof row, e.g. a set of Chips. Draws a rule above itself. */
  footer?: React.ReactNode;
}

/**
 * The closing panel of a marketing page. The accent wash is an inline gradient rather
 * than an arbitrary Tailwind value so it survives the registry copy without depending
 * on the consumer's Tailwind config seeing the class.
 */
export const CtaBanner = React.forwardRef<HTMLElement, CtaBannerProps>(
  (
    {
      className,
      title,
      body,
      headingLevel: Heading = "h2",
      steps,
      stepsLabel,
      action,
      footerLabel,
      footer,
      ...props
    },
    ref,
  ) => (
    <section
      ref={ref}
      style={{
        backgroundImage:
          "linear-gradient(135deg, color-mix(in oklab, var(--color-accent-alt) 7%, transparent), color-mix(in oklab, var(--color-accent-alt) 2%, transparent) 50%, transparent 100%)",
      }}
      className={cn(
        "relative isolate overflow-hidden rounded-2xl border border-accent-alt/15 px-8 py-7 max-md:px-5",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-start justify-between gap-8">
        <div className="min-w-0">
          <Heading className="mb-2 text-[1.1rem] font-bold leading-tight text-ink">
            {title}
          </Heading>
          {body != null && (
            <p className="max-w-2xl text-sm leading-6 text-muted">{body}</p>
          )}
          {steps != null && steps.length > 0 && (
            <StepChips className="mt-4" steps={steps} aria-label={stepsLabel} />
          )}
        </div>
        {action}
      </div>

      {footer != null && (
        <>
          <div
            data-cta-rule=""
            aria-hidden="true"
            className="my-5 h-px bg-border"
          />
          <div className="flex flex-wrap items-center gap-3">
            {footerLabel != null && (
              <span className="whitespace-nowrap font-mono text-[0.68rem] font-bold uppercase tracking-widest text-muted">
                {footerLabel}
              </span>
            )}
            <div className="flex flex-wrap gap-1.5">{footer}</div>
          </div>
        </>
      )}
    </section>
  ),
);
CtaBanner.displayName = "CtaBanner";
