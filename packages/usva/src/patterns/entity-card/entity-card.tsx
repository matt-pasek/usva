import * as React from "react";
import { cn } from "../../cn.js";
import { Card, type CardProps } from "../../primitives/card/card.js";

export type EntityVariant = "stack" | "row" | "showcase";

export interface EntityCardProps extends CardProps {
  /**
   * Layout style:
   *   stack:    media on top, content below (gallery tile; the default).
   *   row:      media as a side panel, content beside it (compact list row).
   *   showcase: a large content column with an oversized title (the numbered
   *             "selected work" card).
   */
  variant?: EntityVariant;
}

const variantRoot: Record<EntityVariant, string> = {
  stack: "flex-col",
  row: "flex-col sm:flex-row sm:items-stretch",
  showcase: "flex-col",
};

export const EntityCard = React.forwardRef<HTMLDivElement, EntityCardProps>(
  ({ className, variant = "stack", ...p }, ref) => (
    <Card
      ref={ref}
      data-variant={variant}
      className={cn(
        "group/entity flex overflow-hidden rounded-2xl",
        variantRoot[variant],
        className,
      )}
      {...p}
    />
  ),
);
EntityCard.displayName = "EntityCard";

/** The text column. Required for `row`/`showcase`; wraps meta, title, body. */
export const EntityContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...p }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-w-0 flex-1 flex-col",
      "group-data-[variant=showcase]/entity:justify-end group-data-[variant=showcase]/entity:p-[clamp(1.25rem,3vw,2rem)]",
      className,
    )}
    {...p}
  />
));
EntityContent.displayName = "EntityContent";

export const EntityMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...p }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative aspect-video w-full overflow-hidden bg-sunken",
      "group-data-[variant=row]/entity:aspect-square group-data-[variant=row]/entity:w-full group-data-[variant=row]/entity:sm:aspect-auto group-data-[variant=row]/entity:sm:w-40 group-data-[variant=row]/entity:sm:shrink-0",
      "[&_img]:h-full [&_img]:w-full [&_img]:object-cover",
      "[&>*]:transition-control [&>*]:duration-ambient [&>*]:ease-soft",
      "group-hover/entity:[&>*]:scale-[1.03]",
      "motion-reduce:[&>*]:transition-none motion-reduce:[&>*]:scale-100",
      className,
    )}
    {...p}
  />
));
EntityMedia.displayName = "EntityMedia";

export const EntityMeta = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...p }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-2 px-5 pt-5 font-mono text-[0.7rem] uppercase tracking-[0.12em] tabular-nums text-muted",
      "group-data-[variant=showcase]/entity:px-0 group-data-[variant=showcase]/entity:pt-0",
      className,
    )}
    {...p}
  />
));
EntityMeta.displayName = "EntityMeta";

/** The oversized mono index marker, e.g. 001, for the showcase style. */
export const EntityIndex = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...p }, ref) => (
  <span
    ref={ref}
    className={cn(
      "font-mono text-sm font-bold tabular-nums tracking-[0.16em] text-accent-alt",
      className,
    )}
    {...p}
  />
));
EntityIndex.displayName = "EntityIndex";

export const EntityTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...p }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "flex items-center gap-1.5 text-balance px-5 pt-3 text-base font-semibold tracking-[-0.01em] text-ink",
      "group-data-[variant=showcase]/entity:px-0 group-data-[variant=showcase]/entity:pt-4 group-data-[variant=showcase]/entity:text-[clamp(1.5rem,3vw,2.25rem)] group-data-[variant=showcase]/entity:font-bold group-data-[variant=showcase]/entity:leading-[1.05]",
      "transition-layout duration-base ease-soft motion-reduce:transition-none",
      "after:leading-none after:text-accent group-data-[interactive]/entity:after:content-['→']",
      "group-hover/entity:gap-2.5",
      className,
    )}
    {...p}
  />
));
EntityTitle.displayName = "EntityTitle";

export const EntityBody = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...p }, ref) => (
  <p
    ref={ref}
    className={cn(
      "px-5 pt-2 text-sm text-muted [text-wrap:pretty]",
      "group-data-[variant=showcase]/entity:px-0 group-data-[variant=showcase]/entity:pt-4 group-data-[variant=showcase]/entity:max-w-prose group-data-[variant=showcase]/entity:leading-relaxed",
      className,
    )}
    {...p}
  />
));
EntityBody.displayName = "EntityBody";

export const EntityActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...p }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-auto flex items-center gap-2 p-5",
      "group-data-[variant=showcase]/entity:px-0 group-data-[variant=showcase]/entity:pb-0 group-data-[variant=showcase]/entity:pt-6",
      className,
    )}
    {...p}
  />
));
EntityActions.displayName = "EntityActions";
