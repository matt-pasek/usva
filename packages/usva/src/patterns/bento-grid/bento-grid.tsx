"use client";
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
  ({ className, columns, style, children, ...p }, ref) => {
    const gridRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        gridRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    React.useEffect(() => {
      const grid = gridRef.current;
      if (!grid) return;
      if (
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        return;

      let frame = 0;
      let pending: { x: number; y: number } | null = null;

      const paint = () => {
        frame = 0;
        const point = pending;
        if (!point) return;
        const gridRect = grid.getBoundingClientRect();
        grid.style.setProperty("--bento-x", `${point.x - gridRect.left}px`);
        grid.style.setProperty("--bento-y", `${point.y - gridRect.top}px`);
        grid.style.setProperty("--bento-fill-o", "1");
        grid.style.setProperty("--edge-o", "1");
        for (const card of grid.querySelectorAll<HTMLElement>(
          "[data-bento-card]",
        )) {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--edge-x", `${point.x - r.left}px`);
          card.style.setProperty("--edge-y", `${point.y - r.top}px`);
        }
      };

      const onMove = (e: PointerEvent) => {
        pending = { x: e.clientX, y: e.clientY };
        if (!frame) frame = requestAnimationFrame(paint);
      };
      const onLeave = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        pending = null;
        grid.style.setProperty("--bento-fill-o", "0");
        grid.style.setProperty("--edge-o", "0");
      };

      grid.addEventListener("pointermove", onMove);
      grid.addEventListener("pointerleave", onLeave);
      return () => {
        grid.removeEventListener("pointermove", onMove);
        grid.removeEventListener("pointerleave", onLeave);
        if (frame) cancelAnimationFrame(frame);
      };
    }, []);

    return (
      <div
        ref={setRefs}
        className={cn(
          "wash-accent group/bento relative isolate grid auto-rows-[minmax(9rem,auto)] grid-flow-dense gap-3 rounded-3xl p-3",
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
      >
        <span aria-hidden className="bento-spotlight" />
        {children}
      </div>
    );
  },
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
  ({ className, span, rowSpan, style, children, ...p }, ref) => (
    <Card
      ref={ref}
      data-bento-card=""
      className={cn(
        "relative border-border bg-surface/70 transition-tint duration-base ease-soft motion-reduce:transition-none",
        className,
      )}
      style={{
        gridColumn: span != null ? `span ${span}` : undefined,
        gridRow: rowSpan != null ? `span ${rowSpan}` : undefined,
        ...style,
      }}
      {...p}
    >
      <span aria-hidden className="edge-glow" />
      {children}
    </Card>
  ),
);
BentoCard.displayName = "BentoCard";
