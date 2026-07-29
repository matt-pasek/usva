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

      /* Measuring inside the frame would force a synchronous layout on every
       * pointer move, since the previous frame already wrote inline styles.
       * The geometry only changes on resize or scroll, so it is cached and the
       * reads happen up front, never interleaved with the writes. */
      type Measured = { grid: DOMRect; cards: [HTMLElement, DOMRect][] };
      let cache: Measured | null = null;
      let observed: HTMLElement[] = [];

      const resizeObserver =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(() => {
              cache = null;
            });
      resizeObserver?.observe(grid);

      const measure = (): Measured => {
        const cards = Array.from(
          grid.querySelectorAll<HTMLElement>("[data-bento-card]"),
        );
        const same =
          cards.length === observed.length &&
          cards.every((card, i) => card === observed[i]);
        if (!same && resizeObserver) {
          for (const card of observed) resizeObserver.unobserve(card);
          for (const card of cards) resizeObserver.observe(card);
          observed = cards;
        }
        return {
          grid: grid.getBoundingClientRect(),
          cards: cards.map((card) => [card, card.getBoundingClientRect()]),
        };
      };

      const paint = () => {
        frame = 0;
        const point = pending;
        if (!point) return;
        if (!cache) cache = measure();
        const rects = cache;
        grid.style.setProperty("--bento-x", `${point.x - rects.grid.left}px`);
        grid.style.setProperty("--bento-y", `${point.y - rects.grid.top}px`);
        grid.style.setProperty("--bento-fill-o", "1");
        grid.style.setProperty("--edge-o", "1");
        for (const [card, r] of rects.cards) {
          card.style.setProperty("--edge-x", `${point.x - r.left}px`);
          card.style.setProperty("--edge-y", `${point.y - r.top}px`);
        }
      };

      const invalidate = () => {
        cache = null;
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

      grid.addEventListener("pointermove", onMove, { passive: true });
      grid.addEventListener("pointerleave", onLeave, { passive: true });
      window.addEventListener("scroll", invalidate, {
        passive: true,
        capture: true,
      });
      return () => {
        grid.removeEventListener("pointermove", onMove);
        grid.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", invalidate, { capture: true });
        resizeObserver?.disconnect();
        if (frame) cancelAnimationFrame(frame);
      };
    }, []);

    return (
      <div
        ref={setRefs}
        className={cn(
          "wash-accent group/bento relative isolate grid auto-rows-[minmax(0,auto)] grid-flow-dense gap-3 rounded-3xl p-3 sm:auto-rows-[minmax(9rem,auto)]",
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

/**
 * The three cells below are content, not containers. BentoCard supplies the
 * surface, the span, and the edge glow; a cell supplies only padding and fill.
 * They work as a child of any Card, not just a bento cell.
 */

const cellShell = "@container flex h-full flex-col p-6";

/** Mono uppercase label beside an icon tile. Shared by BentoInfo and BentoText. */
function CellLabel({
  icon,
  label,
}: {
  icon?: React.ReactNode;
  label: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {icon != null && (
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-accent-alt [&_svg]:size-4">
          {icon}
        </span>
      )}
      <span className="font-mono text-[0.625rem] uppercase leading-none tracking-[0.18em] text-accent-alt">
        {label}
      </span>
    </div>
  );
}

const metricValueSizes = {
  // Sized against the cell, not the viewport: a display number in a narrow card
  // otherwise renders at its full viewport size and overruns its neighbour.
  md: "text-[clamp(2rem,18cqi,3.5rem)] font-bold text-ink/70",
  lg: "text-[clamp(2.5rem,25cqi,6rem)] font-black text-ink",
} as const;

const NUMERIC = /^-?\d+(\.\d+)?$/;

function parseTarget(value: React.ReactNode): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && NUMERIC.test(value)) return Number(value);
  return null;
}

function decimalsOf(value: React.ReactNode): number {
  const text = String(value);
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COUNT_UP_MS = 900;

/**
 * Counts from zero to `target` on mount using rAF alone. No motion dependency, so the
 * registry-copied source has nothing extra to resolve. Runs in a layout effect so the
 * first paint is already at zero rather than flashing the final value.
 *
 * A hidden or throttled tab never delivers a frame, and a metric stuck at zero is worse
 * than one that never animated, so the count is skipped outright when the document is
 * hidden and snapped to the target if no frame arrives.
 */
function useCountUp(target: number | null, decimals: number, run: boolean) {
  const [display, setDisplay] = React.useState(target);
  const useIsomorphicLayoutEffect =
    typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

  useIsomorphicLayoutEffect(() => {
    const hidden = typeof document !== "undefined" && document.hidden;
    if (!run || target == null || hidden || prefersReducedMotion()) {
      setDisplay(target);
      return;
    }

    setDisplay(0);
    let frame = 0;
    let start = 0;
    let painted = false;

    const step = (now: number) => {
      painted = true;
      if (!start) start = now;
      const progress = Math.min((now - start) / COUNT_UP_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Number((target * eased).toFixed(decimals)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    const rescue = setTimeout(() => {
      if (!painted) setDisplay(target);
    }, COUNT_UP_MS + 300);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(rescue);
    };
  }, [target, decimals, run]);

  return display;
}

export interface BentoMetricProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  value: React.ReactNode;
  label: React.ReactNode;
  icon?: React.ReactNode;
  /** Trailing unit on the value, keyed to the alternate accent. */
  suffix?: React.ReactNode;
  /** Aside under the value. Flavour text, a caveat, a comparison. */
  note?: React.ReactNode;
  /** `lg` is the standalone stat treatment: display weight, full-strength ink. */
  size?: keyof typeof metricValueSizes;
  /** Count up from zero on mount. Ignored for non-numeric values. */
  animate?: boolean;
}

export const BentoMetric = React.forwardRef<HTMLDivElement, BentoMetricProps>(
  (
    {
      className,
      value,
      label,
      icon,
      suffix,
      note,
      size = "md",
      animate,
      ...props
    },
    ref,
  ) => {
    const target = parseTarget(value);
    const decimals = decimalsOf(value);
    const counted = useCountUp(target, decimals, animate === true);
    const shown =
      target == null ? value : (counted ?? target).toFixed(decimals);

    return (
      <div
        ref={ref}
        className={cn(cellShell, "justify-between", className)}
        {...props}
      >
        <div>
          <p
            className={cn(
              "leading-none tracking-[-0.04em] tabular-nums",
              metricValueSizes[size],
            )}
          >
            {shown}
            {suffix != null && (
              <span className="text-accent-alt">{suffix}</span>
            )}
          </p>
          {note != null && (
            <p className="mt-3 font-mono text-[0.6875rem] leading-relaxed text-muted">
              {note}
            </p>
          )}
        </div>
        <span className="mt-4 inline-flex w-fit max-w-full items-center gap-2 self-start whitespace-nowrap rounded-full bg-ink/[0.06] px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.1em] text-muted [&_svg]:size-3">
          {icon}
          {label}
        </span>
      </div>
    );
  },
);
BentoMetric.displayName = "BentoMetric";

export interface BentoInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  icon?: React.ReactNode;
}

/**
 * Label, icon tile, then anything. kajo's `variant="tech-stack"` union is gone:
 * pass Chips as children instead.
 */
export const BentoInfo = React.forwardRef<HTMLDivElement, BentoInfoProps>(
  ({ className, label, icon, children, ...props }, ref) => (
    <div ref={ref} className={cn(cellShell, className)} {...props}>
      <CellLabel icon={icon} label={label} />
      <div className="text-[0.9375rem] leading-relaxed text-ink">
        {children}
      </div>
    </div>
  ),
);
BentoInfo.displayName = "BentoInfo";

export interface BentoTextProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  title: React.ReactNode;
  body?: React.ReactNode;
}

export const BentoText = React.forwardRef<HTMLDivElement, BentoTextProps>(
  ({ className, label, icon, title, body, children, ...props }, ref) => (
    <div ref={ref} className={cn(cellShell, className)} {...props}>
      {label != null && <CellLabel icon={icon} label={label} />}
      <h3 className="text-xl font-semibold tracking-[-0.01em] text-ink">
        {title}
      </h3>
      {body != null && (
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
          {body}
        </p>
      )}
      {children}
    </div>
  ),
);
BentoText.displayName = "BentoText";
