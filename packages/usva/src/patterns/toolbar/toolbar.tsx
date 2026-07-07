import * as React from "react";
import { cn } from "../../cn.js";

export type ToolbarProps = React.HTMLAttributes<HTMLDivElement>;

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, role = "toolbar", ...props }, ref) => (
    <div
      ref={ref}
      role={role}
      className={cn(
        "flex min-h-11 flex-wrap items-center gap-2 border-b border-border bg-surface px-3 py-2 text-sm text-ink",
        className,
      )}
      {...props}
    />
  ),
);
Toolbar.displayName = "Toolbar";

export type ToolbarGroupProps = React.HTMLAttributes<HTMLDivElement>;

export const ToolbarGroup = React.forwardRef<HTMLDivElement, ToolbarGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    />
  ),
);
ToolbarGroup.displayName = "ToolbarGroup";

export type ToolbarActionsProps = React.HTMLAttributes<HTMLDivElement>;

export const ToolbarActions = React.forwardRef<
  HTMLDivElement,
  ToolbarActionsProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("ml-auto flex flex-wrap items-center gap-1.5", className)}
    {...props}
  />
));
ToolbarActions.displayName = "ToolbarActions";

export interface ToolbarLegendProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Cap the visible keys; the rest collapse into a "+N" indicator. */
  max?: number;
}

export const ToolbarLegend = React.forwardRef<
  HTMLDivElement,
  ToolbarLegendProps
>(({ className, max, children, ...props }, ref) => {
  const all = React.Children.toArray(children);
  const shown = max != null ? all.slice(0, max) : all;
  const overflow = all.length - shown.length;

  return (
    <div
      ref={ref}
      className={cn("flex min-w-0 items-center gap-5", className)}
      {...props}
    >
      {shown}
      {overflow > 0 && (
        <span className="shrink-0 font-mono text-xs tabular-nums text-muted">
          +{overflow}
        </span>
      )}
    </div>
  );
});
ToolbarLegend.displayName = "ToolbarLegend";

export interface ToolbarLegendItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Categorical key colour, any CSS colour, following StripeCard's stripeColor.
   * A legend swatch names a thing, it does not carry a semantic tone.
   */
  swatch?: string;
}

export const ToolbarLegendItem = React.forwardRef<
  HTMLDivElement,
  ToolbarLegendItemProps
>(({ className, swatch, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-w-0 items-center gap-1.5 text-xs font-medium text-muted",
      className,
    )}
    {...props}
  >
    <span
      aria-hidden="true"
      data-testid="toolbar-legend-swatch"
      className={cn(
        "size-2 shrink-0 rounded-sm",
        swatch == null && "bg-border-strong",
      )}
      style={{ backgroundColor: swatch }}
    />
    <span className="truncate">{children}</span>
  </div>
));
ToolbarLegendItem.displayName = "ToolbarLegendItem";

export type ToolbarCountTone =
  | "accent"
  | "accent-alt"
  | "success"
  | "warning"
  | "danger";

const countTone: Record<ToolbarCountTone, string> = {
  accent: "border-accent/30 bg-accent/10 text-accent",
  "accent-alt": "border-accent-alt/30 bg-accent-alt/10 text-accent-alt",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
};

const countDot: Record<ToolbarCountTone, string> = {
  accent: "bg-accent",
  "accent-alt": "bg-accent-alt",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export interface ToolbarCountProps
  extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  tone?: ToolbarCountTone;
}

/**
 * A status chip that disappears at zero, so callers stop guarding the render.
 *
 * Enter is CSS only. There is no exit animation: without AnimatePresence the
 * node is already unmounted, and a status chip does not justify making the
 * whole Toolbar a client component.
 */
export const ToolbarCount = React.forwardRef<HTMLDivElement, ToolbarCountProps>(
  ({ className, count, tone = "accent", children, ...props }, ref) => {
    if (!(count > 0)) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-8 animate-reveal items-center gap-2 rounded-lg border px-3",
          "text-xs font-semibold tabular-nums",
          countTone[tone],
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn("size-1.5 shrink-0 rounded-full", countDot[tone])}
        />
        <span>{count}</span>
        <span>{children}</span>
      </div>
    );
  },
);
ToolbarCount.displayName = "ToolbarCount";
