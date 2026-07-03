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

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  highlight?: CardHighlight;
  /** @deprecated use `highlight="wash"` */
  wash?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive, highlight = "none", wash, ...p }, ref) => {
    const resolved: CardHighlight =
      highlight === "none" && wash ? "wash" : highlight;
    return (
      <div
        ref={ref}
        data-interactive={interactive ? "" : undefined}
        data-highlight={resolved !== "none" ? resolved : undefined}
        className={cn(
          "rim-light isolate rounded-2xl border border-border bg-surface text-ink",
          resolved === "ring" ? "glow-ring" : "shadow-floating",
          resolved === "wash" && "wash-accent",
          resolved === "edge" &&
            "after:absolute after:inset-x-0 after:top-0 after:h-px after:hairline-accent",
          interactive &&
            "transition-[translate,box-shadow] duration-200 ease-soft hover:-translate-y-0.5 hover:shadow-overlay motion-reduce:transform-none motion-reduce:transition-none",
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
