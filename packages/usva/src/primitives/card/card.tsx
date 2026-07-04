import * as React from "react";
import { cn } from "../../cn.js";
import { Badge, type BadgeProps } from "../badge/badge.js";

type Div = React.HTMLAttributes<HTMLDivElement>;
const make = (base: string, name: string) =>
  Object.assign(
    React.forwardRef<HTMLDivElement, Div>(({ className, ...p }, ref) => (
      <div ref={ref} className={cn(base, className)} {...p} />
    )),
    { displayName: name },
  );

export type CardHighlight = "none" | "wash" | "edge" | "ring";

/**
 * The shared surface vocabulary. One word picks how any card-like surface
 * (Card, StatCard, Panel, Dialog) sits on the page, and the same choice reads
 * consistently across all of them.
 *   elevated: the default. Lit-from-above surface fill, rim light, shadow.
 *   flat:     quiet surface fill, no lift. The sisu/dashboard workhorse.
 *   glass:    translucent, blurs what sits behind it. A rare, purposeful
 *             choice, never a default.
 *   outline:  transparent, carried by its border alone.
 */
export type CardSurface = "elevated" | "flat" | "glass" | "outline";

/** Background + rim treatment per surface. No shadow; consumers pick the level. */
export const SURFACE_SKIN: Record<CardSurface, string> = {
  elevated: "rim-light bg-surface",
  flat: "bg-surface",
  glass: "rim-light bg-surface/65 backdrop-blur-md",
  outline: "bg-transparent",
};

/** Whether a surface reads as raised (gets its host's elevation shadow). */
export const SURFACE_ELEVATED: Record<CardSurface, boolean> = {
  elevated: true,
  flat: false,
  glass: true,
  outline: false,
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  highlight?: CardHighlight;
  surface?: CardSurface;
  /** @deprecated use `highlight="wash"` */
  wash?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      interactive,
      highlight = "none",
      surface = "elevated",
      wash,
      ...p
    },
    ref,
  ) => {
    const resolved: CardHighlight =
      highlight === "none" && wash ? "wash" : highlight;
    return (
      <div
        ref={ref}
        data-interactive={interactive ? "" : undefined}
        data-highlight={resolved !== "none" ? resolved : undefined}
        data-surface={surface}
        className={cn(
          "isolate rounded-2xl border border-border text-ink",
          SURFACE_SKIN[surface],
          resolved === "ring"
            ? "glow-ring"
            : SURFACE_ELEVATED[surface] && "shadow-floating",
          resolved === "wash" && "wash-accent",
          resolved === "edge" &&
            "after:absolute after:inset-x-5 after:top-0 after:h-px after:hairline-accent",
          interactive &&
            "transition-control duration-base ease-soft hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none",
          interactive && resolved !== "ring" && "hover:shadow-overlay",
          className,
        )}
        {...p}
      />
    );
  },
);
Card.displayName = "Card";

export interface CardHeaderProps extends Div {
  row?: boolean;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, row, ...p }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative p-5 after:absolute after:inset-x-5 after:bottom-0 after:h-px after:hairline-accent",
        row ? "flex flex-row items-start gap-4" : "flex flex-col gap-1.5",
        className,
      )}
      {...p}
    />
  ),
);
CardHeader.displayName = "CardHeader";

export const CardBody = make("p-5", "CardBody");
export const CardFooter = make(
  "flex items-center gap-2 p-5 border-t border-border",
  "CardFooter",
);

export const CardEyebrow = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...p }, ref) => (
  <p
    ref={ref}
    className={cn(
      "font-mono text-[0.65rem] uppercase leading-none tracking-[0.16em] text-muted",
      className,
    )}
    {...p}
  />
));
CardEyebrow.displayName = "CardEyebrow";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...p }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-balance text-sm font-semibold tracking-[-0.01em] text-ink",
      className,
    )}
    {...p}
  />
));
CardTitle.displayName = "CardTitle";

export const CardIcon = make(
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 text-muted [&_svg]:h-4 [&_svg]:w-4",
  "CardIcon",
);

export const CardActions = make(
  "ml-auto flex items-center gap-1",
  "CardActions",
);

export function CardBadge({ className, ...props }: BadgeProps) {
  return <Badge className={cn("self-start", className)} {...props} />;
}
CardBadge.displayName = "CardBadge";
