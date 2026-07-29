import type * as React from "react";
import { cn } from "../../cn.js";
import { BentoMetric } from "../bento-grid/bento-grid.js";

export interface StatBentoItem {
  value: React.ReactNode;
  label: React.ReactNode;
  /** Trailing unit on the value, keyed to the alternate accent. */
  suffix?: React.ReactNode;
  icon?: React.ReactNode;
}

interface StatBentoOwnProps<T extends React.ElementType> {
  stats: StatBentoItem[];
  /** Count each numeric value up from zero on mount. */
  animate?: boolean;
  /**
   * Element rendered as the grid. Pass `RevealGroup` to stagger the cells: it
   * animates its direct children, so it has to be the grid rather than wrap it.
   */
  as?: T;
}

export type StatBentoProps<T extends React.ElementType = "div"> =
  StatBentoOwnProps<T> &
    Omit<React.ComponentPropsWithoutRef<T>, keyof StatBentoOwnProps<T>>;

/**
 * A standalone strip of headline numbers, not a bento of mixed cells: every child is
 * a display-weight metric. It stays motion-free so the copied registry source has no
 * import to resolve. Polymorphic rather than a forwardRef so `as` can carry the props
 * of whatever element renders the grid.
 *
 * Cells take a translucent ink fill rather than `bg-surface`, which would vanish the
 * moment the strip sits inside a Card that already paints that surface.
 */
export function StatBento<T extends React.ElementType = "div">({
  className,
  stats,
  animate,
  as,
  ...props
}: StatBentoProps<T>) {
  const Comp = (as ?? "div") as React.ElementType;
  return (
    <Comp
      className={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", className)}
      {...props}
    >
      {stats.map((stat, index) => (
        <BentoMetric
          key={typeof stat.label === "string" ? stat.label : index}
          size="lg"
          animate={animate}
          value={stat.value}
          suffix={stat.suffix}
          label={stat.label}
          icon={stat.icon}
          className="rounded-2xl bg-ink/[0.04] sm:p-8"
        />
      ))}
    </Comp>
  );
}
StatBento.displayName = "StatBento";
