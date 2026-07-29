import * as React from "react";
import { cn } from "../../cn.js";
import { Card, type CardProps } from "../../primitives/card/card.js";

export interface StripeCardProps extends Omit<CardProps, "title"> {
  heading: React.ReactNode;
  /** Mono meta, left side (e.g. a code). */
  metaLeft?: React.ReactNode;
  /** Mono meta, right side (e.g. a count). Rendered accent-colored. */
  metaRight?: React.ReactNode;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  /** Leading stripe color. Any CSS color; defaults to a neutral token. */
  stripeColor?: string;
  /** Paints a faint background wash keyed to `stripeColor` (or the accent). */
  wash?: boolean;
  selected?: boolean;
}

/**
 * A compact entity row-card with a leading color stripe, a heading, mono meta,
 * a badge slot, and an optional footer. Flat at rest, lifts on hover.
 *
 * The stripe is a categorical key: it says which module, project, or status the
 * row belongs to. It is not a decorative accent, and not the banned side-stripe.
 * Give it meaning or leave it neutral.
 */
export const StripeCard = React.forwardRef<HTMLDivElement, StripeCardProps>(
  (
    {
      className,
      heading,
      metaLeft,
      metaRight,
      badge,
      footer,
      stripeColor,
      wash = false,
      selected = false,
      children,
      ...props
    },
    ref,
  ) => (
    <Card
      ref={ref}
      interactive
      highlight={selected ? "ring" : "none"}
      className={cn(
        "group/stripe relative isolate flex flex-col overflow-hidden",
        className,
      )}
      {...props}
    >
      {wash && (
        <span
          aria-hidden="true"
          data-stripe-wash=""
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(105deg, color-mix(in oklab, ${stripeColor ?? "var(--color-accent)"} 20%, transparent), color-mix(in oklab, ${stripeColor ?? "var(--color-accent)"} 6%, transparent) 42%, transparent 78%)`,
          }}
        />
      )}
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="flex min-w-0 items-stretch gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "w-1 shrink-0 self-stretch rounded-full",
              stripeColor ? undefined : "bg-border-strong",
            )}
            style={stripeColor ? { backgroundColor: stripeColor } : undefined}
          />
          <div className="min-w-0">
            <h3 className="text-balance text-sm font-semibold leading-snug text-ink">
              {heading}
            </h3>
            {(metaLeft != null || metaRight != null) && (
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted">
                {metaLeft != null && <span>{metaLeft}</span>}
                {metaLeft != null && metaRight != null && (
                  <span aria-hidden="true">·</span>
                )}
                {metaRight != null && (
                  <span className="font-semibold text-accent">{metaRight}</span>
                )}
              </p>
            )}
          </div>
        </div>
        {badge != null && <div className="shrink-0">{badge}</div>}
      </div>

      {children}

      {footer != null && (
        <div className="mt-auto border-t border-border bg-surface-2/50 px-4 py-2 text-xs text-muted">
          {footer}
        </div>
      )}
    </Card>
  ),
);
StripeCard.displayName = "StripeCard";
