import * as React from "react";
import { cn } from "../../cn.js";
import { Card, type CardProps } from "../../primitives/card/card.js";

export type EntityCardProps = CardProps;

export const EntityCard = React.forwardRef<HTMLDivElement, EntityCardProps>(
  ({ className, ...p }, ref) => (
    <Card
      ref={ref}
      className={cn(
        "group/entity flex flex-col overflow-hidden rounded-2xl",
        className,
      )}
      {...p}
    />
  ),
);
EntityCard.displayName = "EntityCard";

export const EntityMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...p }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative aspect-video w-full overflow-hidden bg-surface-2",
      "[&_img]:h-full [&_img]:w-full [&_img]:object-cover",
      "[&>*]:transition-[scale] [&>*]:duration-500 [&>*]:ease-soft",
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
      className,
    )}
    {...p}
  />
));
EntityMeta.displayName = "EntityMeta";

export const EntityTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...p }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "flex items-center gap-1.5 text-balance px-5 pt-3 text-base font-semibold tracking-[-0.01em] text-ink",
      "transition-[gap] duration-200 ease-soft motion-reduce:transition-none",
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
    className={cn("px-5 pt-2 text-sm text-muted [text-wrap:pretty]", className)}
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
    className={cn("mt-auto flex items-center gap-2 p-5", className)}
    {...p}
  />
));
EntityActions.displayName = "EntityActions";
