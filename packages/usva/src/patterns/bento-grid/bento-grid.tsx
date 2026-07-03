import * as React from "react";
import { cn } from "../../cn.js";
import {
  Card,
  type CardHighlight,
  type CardProps,
} from "../../primitives/card/card.js";

export interface BentoGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Force an explicit column count; omit for a responsive auto-fit grid. */
  columns?: number;
}

export const BentoGrid = React.forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, columns, style, ...p }, ref) => (
    <div
      ref={ref}
      className={cn(
        "wash-accent group/bento relative grid auto-rows-[minmax(9rem,auto)] grid-flow-dense gap-3 rounded-3xl p-3",
        columns == null &&
          "[grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))]",
        className,
      )}
      style={
        columns == null
          ? style
          : {
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              ...style,
            }
      }
      {...p}
    />
  ),
);
BentoGrid.displayName = "BentoGrid";

export interface BentoCardProps extends CardProps {
  /**
   * Column span. Not a position: the grid is `grid-flow-dense`, so a wide card
   * lets narrower ones backfill ahead of it. Nothing clamps this against
   * `columns`, so overshoot and the card overflows its track.
   */
  span?: number;
  /** Row span. Rows are `minmax(9rem,auto)`, so this raises the floor, not the height. */
  rowSpan?: number;
  highlight?: CardHighlight;
}

export const BentoCard = React.forwardRef<HTMLDivElement, BentoCardProps>(
  ({ className, span, rowSpan, style, ...p }, ref) => (
    <Card
      ref={ref}
      className={cn(
        "border-border bg-surface/70 transition-[border-color,box-shadow] duration-200 ease-soft group-hover/bento:border-border-strong motion-reduce:transition-none",
        className,
      )}
      style={{
        gridColumn: span != null ? `span ${span}` : undefined,
        gridRow: rowSpan != null ? `span ${rowSpan}` : undefined,
        ...style,
      }}
      {...p}
    />
  ),
);
BentoCard.displayName = "BentoCard";
