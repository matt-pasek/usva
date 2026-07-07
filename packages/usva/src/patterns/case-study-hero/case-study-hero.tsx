import * as React from "react";
import { cn } from "../../cn.js";

export interface CaseStudyHeroLink {
  href: string;
  label: React.ReactNode;
  /** Opens in a new tab, with the rel guard and a screen-reader hint. */
  external?: boolean;
}

export interface CaseStudyHeroMetaItem {
  label: React.ReactNode;
  value: React.ReactNode;
}

export type CaseStudyHeroHeadingLevel = "h1" | "h2" | "h3";

export interface CaseStudyHeroProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Heading element for the headline. Pick by document outline, not by size. */
  headingLevel?: CaseStudyHeroHeadingLevel;
  /** Mono uppercase kicker, e.g. "Case study". */
  eyebrow?: React.ReactNode;
  /** Secondary mono line, e.g. the client and year. */
  kicker?: React.ReactNode;
  headline: React.ReactNode;
  /** Second line of the headline, carrying the accent color. */
  headlineAccent?: React.ReactNode;
  /**
   * Categorical, not semantic: any CSS color, keyed to the study rather than to a
   * meaning. Falls back to the alternate accent token.
   */
  accentColor?: string;
  tagline?: React.ReactNode;
  link?: CaseStudyHeroLink;
  meta?: CaseStudyHeroMetaItem[];
  /** Arbitrary node so callers can pass Chips, spans, or nothing. */
  tags?: React.ReactNode;
  /** The media well. Pass a MockupShowcase, an img, a video, or an iframe. */
  children?: React.ReactNode;
}

const pill =
  "relative inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted outline-none after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-[''] transition-control duration-fast ease-soft hover:border-border-strong hover:text-ink focus-visible:ring-focus";

/**
 * The copy-driven opener for a case study. Motion-free by design: wrap it, or its
 * parts, in `RevealGroup` for kajo's staggered entrance.
 */
export const CaseStudyHero = React.forwardRef<HTMLElement, CaseStudyHeroProps>(
  (
    {
      className,
      headingLevel: Heading = "h1",
      eyebrow,
      kicker,
      headline,
      headlineAccent,
      accentColor,
      tagline,
      link,
      meta,
      tags,
      children,
      ...props
    },
    ref,
  ) => (
    <header ref={ref} className={cn("flex flex-col", className)} {...props}>
      {(eyebrow != null || kicker != null || link) && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {eyebrow != null && (
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-accent-alt">
                {eyebrow}
              </p>
            )}
            {kicker != null && (
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {kicker}
              </p>
            )}
          </div>
          {link && (
            <a
              href={link.href}
              className={pill}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {link.label}
              {link.external && (
                <span className="sr-only"> (opens in a new tab)</span>
              )}
              <span aria-hidden="true" className="text-accent-alt">
                ↗
              </span>
            </a>
          )}
        </div>
      )}

      <Heading className="mb-6 text-[clamp(3rem,8vw,5.5rem)] font-black leading-none tracking-[-0.03em] text-ink">
        {headline}
        {headlineAccent != null && (
          <>
            <br />
            <span style={{ color: accentColor ?? "var(--color-accent-alt)" }}>
              {headlineAccent}
            </span>
          </>
        )}
      </Heading>

      {tagline != null && (
        <p className="mb-6 max-w-xl text-[1.0625rem] leading-[1.7] text-muted">
          {tagline}
        </p>
      )}

      {meta != null && meta.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-t border-border pt-8 sm:grid-cols-4">
          {meta.map((item, index) => (
            <div key={typeof item.label === "string" ? item.label : index}>
              <dt className="mb-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
                {item.label}
              </dt>
              <dd className="text-[0.9375rem] font-semibold text-ink">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {children != null && <div className="mt-14">{children}</div>}

      {tags != null && <div className="mt-8 flex flex-wrap gap-2">{tags}</div>}
    </header>
  ),
);
CaseStudyHero.displayName = "CaseStudyHero";
