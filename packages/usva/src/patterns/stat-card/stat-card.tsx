import * as React from "react";
import { cn } from "../../cn.js";
import {
  Card,
  CardBody,
  type CardSurface,
} from "../../primitives/card/card.js";

export type StatTrend = "up" | "down" | "flat";
export type StatTone = "neutral" | "accent" | "accent-alt";

export interface StatCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: React.ReactNode;
  note?: React.ReactNode;
  icon?: React.ReactNode;
  trend?: StatTrend;
  size?: "sm" | "md";
  /** Blow the tile up to a hero stat: larger numeral, more presence. */
  featured?: boolean;
  /** Tints the border and colors the value. Defaults to neutral. */
  tone?: StatTone;
  /** How the tile sits on the page. Defaults to elevated. */
  surface?: CardSurface;
  spark?: React.ReactNode;
}

const trendTone: Record<StatTrend, string> = {
  up: "text-success",
  down: "text-danger",
  flat: "text-muted",
};

const trendGlyph: Record<StatTrend, string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

const toneBorder: Record<StatTone, string> = {
  neutral: "",
  accent: "border-accent/25",
  "accent-alt": "border-accent-alt/25",
};

const toneValue: Record<StatTone, string> = {
  neutral: "text-ink",
  accent: "text-accent",
  "accent-alt": "text-accent-alt",
};

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      label,
      value,
      unit,
      note,
      icon,
      trend,
      size = "md",
      featured,
      tone = "neutral",
      surface = "elevated",
      spark,
      ...props
    },
    ref,
  ) => (
    <Card
      ref={ref}
      highlight="wash"
      surface={surface}
      className={cn(toneBorder[tone], className)}
      {...props}
    >
      <CardBody
        className={cn(featured ? "p-6" : size === "sm" ? "p-4" : "p-5")}
      >
        <div className="flex items-start justify-between gap-3">
          <span className="pt-0.5 font-mono text-[0.65rem] font-medium uppercase leading-none tracking-[0.16em] text-muted">
            {label}
          </span>
          {icon != null && (
            <span
              aria-hidden="true"
              className="-mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-muted [&_svg]:h-3.5 [&_svg]:w-3.5"
            >
              {icon}
            </span>
          )}
        </div>

        <div
          className={cn(
            "flex items-baseline gap-1.5",
            featured ? "mt-4" : size === "sm" ? "mt-2" : "mt-3",
          )}
        >
          <span
            className={cn(
              "font-mono font-semibold leading-none tabular-nums tracking-tight",
              toneValue[tone],
              featured
                ? "text-[clamp(2.5rem,5vw,3.5rem)]"
                : size === "sm"
                  ? "text-2xl"
                  : "text-[2rem]",
            )}
          >
            {value}
          </span>
          {unit != null && (
            <span className="font-mono text-sm text-muted">{unit}</span>
          )}
        </div>

        {(note != null || trend != null || spark != null) && (
          <div className="mt-3 flex items-center justify-between gap-3">
            {(note != null || trend != null) && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-mono text-[0.7rem] tabular-nums",
                  trend != null ? trendTone[trend] : "text-muted",
                )}
              >
                {trend != null && (
                  <span aria-hidden="true">{trendGlyph[trend]}</span>
                )}
                {note}
              </span>
            )}
            {spark != null && (
              <div className="min-w-0 flex-1 text-accent [&>*]:w-full">
                {spark}
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  ),
);
StatCard.displayName = "StatCard";
