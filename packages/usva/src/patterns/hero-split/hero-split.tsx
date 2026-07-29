import * as React from "react";
import { cn } from "../../cn.js";

export type HeroSplitHeadingLevel = "h1" | "h2";

export interface HeroSplitProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  /** Second phrase of the title, carrying the accent color. */
  titleAccent?: React.ReactNode;
  /** Categorical: any CSS color, keyed to the product. Falls back to accent-alt. */
  accentColor?: string;
  headingLevel?: HeroSplitHeadingLevel;
  /** Pill above the title. Pass an Announcement or a Badge. */
  badge?: React.ReactNode;
  body?: React.ReactNode;
  /** The call to action row. Pass Buttons. */
  actions?: React.ReactNode;
  /** Social proof under the actions. Pass an AvatarGroup and a line of copy. */
  proof?: React.ReactNode;
  /** Small print under the copy column. */
  note?: React.ReactNode;
  /** The product shot, to the side on wide screens and stacked below on narrow. */
  visual?: React.ReactNode;
  /**
   * Painted behind everything, under a scrim. sisu puts a WebGL Plasma here; that one
   * is provenance-locked, so this is a slot rather than a built-in atmosphere.
   */
  background?: React.ReactNode;
}

export const HeroSplit = React.forwardRef<HTMLElement, HeroSplitProps>(
  (
    {
      className,
      title,
      titleAccent,
      accentColor,
      headingLevel: Heading = "h1",
      badge,
      body,
      actions,
      proof,
      note,
      visual,
      background,
      ...props
    },
    ref,
  ) => (
    <section
      ref={ref}
      className={cn(
        "@container relative isolate flex flex-col gap-12 overflow-hidden px-6 py-20 sm:px-10",
        // Container queries, not viewport ones. A hero dropped into a narrow column
        // would otherwise still lay itself out side by side and size its title off
        // the window, overrunning whatever sits next to it.
        "@5xl:flex-row @5xl:items-center @5xl:justify-between",
        className,
      )}
      {...props}
    >
      {background != null && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          {background}
          <div
            data-hero-scrim=""
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, color-mix(in oklab, var(--color-bg) 10%, transparent), color-mix(in oklab, var(--color-bg) 76%, transparent) 76%, var(--color-bg))",
            }}
            className="absolute inset-0"
          />
        </div>
      )}

      <div className="z-10 flex w-full flex-col gap-4 text-center @5xl:max-w-[47.5rem] @5xl:text-left">
        <div>
          {badge != null && <div className="mb-6 inline-flex">{badge}</div>}
          <Heading className="text-[clamp(2.5rem,6.5cqi,6.5rem)] font-bold leading-[0.96] text-balance text-ink">
            {title}
            {titleAccent != null && (
              <>
                {" "}
                <span
                  style={{ color: accentColor ?? "var(--color-accent-alt)" }}
                >
                  {titleAccent}
                </span>
              </>
            )}
          </Heading>
        </div>

        {body != null && (
          <p className="mx-auto max-w-[38.75rem] text-[1.08rem] leading-8 text-balance text-muted @5xl:mx-0">
            {body}
          </p>
        )}

        {(actions != null || proof != null) && (
          <div>
            {actions != null && (
              <div className="mt-3 flex flex-wrap justify-center gap-3 @5xl:justify-start">
                {actions}
              </div>
            )}
            {proof != null && (
              <div className="mx-auto mt-4 flex w-fit items-center gap-4 text-sm font-semibold text-muted @5xl:mx-0">
                {proof}
              </div>
            )}
          </div>
        )}

        {note != null && (
          <p className="mx-auto mt-4 max-w-[31rem] text-[0.7rem] leading-6 text-pretty text-muted @5xl:mx-0">
            {note}
          </p>
        )}
      </div>

      {visual != null && (
        <div className="relative z-10 w-full @5xl:w-auto @5xl:shrink-0">
          {visual}
        </div>
      )}
    </section>
  ),
);
HeroSplit.displayName = "HeroSplit";
