import * as React from "react";
import { cn } from "../../cn.js";

export type SectionLabelTone = "accent" | "accent-alt";

export interface SectionLabelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  index?: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  /** Optional lede below the label row. Turns the label into a section header. */
  description?: React.ReactNode;
  tone?: SectionLabelTone;
}

const indexTone: Record<SectionLabelTone, string> = {
  accent: "text-accent [filter:drop-shadow(var(--usva-glow-accent-strong))]",
  "accent-alt": "text-accent-alt",
};

export const SectionLabel = React.forwardRef<HTMLDivElement, SectionLabelProps>(
  (
    { className, index, title, aside, description, tone = "accent", ...props },
    ref,
  ) => {
    const row = (
      <div className="flex items-center gap-3.5">
        {index != null && (
          <span
            className={cn(
              "font-mono text-[0.7rem] font-medium uppercase leading-none tracking-[0.2em] tabular-nums",
              indexTone[tone],
            )}
          >
            {index}
          </span>
        )}
        <h2 className="text-balance text-sm font-medium lowercase leading-none tracking-[0.01em] text-ink">
          {title}
        </h2>
        <span aria-hidden="true" className="hairline-accent h-px flex-1" />
        {aside != null && (
          <span className="shrink-0 font-mono text-[0.7rem] leading-none tabular-nums text-muted">
            {aside}
          </span>
        )}
      </div>
    );

    if (description == null) {
      return (
        <div ref={ref} className={className} {...props}>
          {row}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-3", className)}
        {...props}
      >
        {row}
        <p className="max-w-prose text-pretty text-sm leading-relaxed text-muted">
          {description}
        </p>
      </div>
    );
  },
);
SectionLabel.displayName = "SectionLabel";
