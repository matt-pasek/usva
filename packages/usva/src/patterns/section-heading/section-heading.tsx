import * as React from "react";
import { cn } from "../../cn.js";

export type SectionHeadingTone = "accent" | "accent-alt";
export type SectionHeadingLevel = "h1" | "h2" | "h3";

const eyebrowTone: Record<SectionHeadingTone, string> = {
  accent: "text-accent",
  "accent-alt": "text-accent-alt",
};

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  as?: SectionHeadingLevel;
  tone?: SectionHeadingTone;
}

/**
 * A display heading: mono uppercase eyebrow over a large fluid title.
 *
 * Not SectionLabel. That one is built around a numbered mono index with an
 * optional lede and stays at body scale. This is the section opener that
 * carries the page, and the two do not collapse into one component without
 * making both worse.
 */
export const SectionHeading = React.forwardRef<
  HTMLDivElement,
  SectionHeadingProps
>(
  (
    {
      className,
      eyebrow,
      title,
      as: Tag = "h2",
      tone = "accent-alt",
      ...props
    },
    ref,
  ) => (
    <div ref={ref} className={cn("mb-10", className)} {...props}>
      {eyebrow != null && (
        <p
          className={cn(
            "mb-3 font-mono text-xs uppercase tracking-[0.18em]",
            eyebrowTone[tone],
          )}
        >
          {eyebrow}
        </p>
      )}
      <Tag className="max-w-3xl text-balance text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.15] tracking-[-0.02em] text-ink">
        {title}
      </Tag>
    </div>
  ),
);
SectionHeading.displayName = "SectionHeading";
