import * as React from "react";
import { cn } from "../../cn.js";
import {
  type CardSurface,
  SURFACE_ELEVATED,
  SURFACE_SKIN,
} from "../../primitives/card/card.js";
import { Spinner } from "../../primitives/spinner/spinner.js";

export interface PanelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  /** Replaces the default centered spinner while `loading`. */
  loadingSlot?: React.ReactNode;
  /** How the panel sits on the page. Defaults to elevated. */
  surface?: CardSurface;
}

/**
 * The dashboard panel. A full-height card with a mono eyebrow header, an icon
 * tile, badge/actions slots, and a loading state. Built to live in a grid cell:
 * it fills its box and scrolls its body. usva's "usability pole" workhorse.
 */
export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      className,
      icon,
      eyebrow,
      title,
      badge,
      actions,
      loading = false,
      loadingSlot,
      surface = "elevated",
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-surface={surface}
      className={cn(
        "relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border text-ink",
        SURFACE_SKIN[surface],
        SURFACE_ELEVATED[surface] && "shadow-floating",
        className,
      )}
      {...props}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {icon != null && (
            <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-surface-2 text-muted [&_svg]:h-4 [&_svg]:w-4">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            {eyebrow != null && (
              <p className="font-mono text-[0.625rem] font-semibold uppercase leading-none tracking-[0.12em] text-muted">
                {eyebrow}
              </p>
            )}
            <div className="mt-1 truncate text-sm font-semibold tracking-[-0.01em] text-ink">
              {title}
            </div>
          </div>
        </div>
        {(badge != null || actions != null) && (
          <div className="flex shrink-0 items-center gap-2">
            {badge}
            {actions}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {loading
          ? (loadingSlot ?? (
              <div className="grid h-full min-h-24 place-items-center">
                <Spinner />
              </div>
            ))
          : children}
      </div>
    </div>
  ),
);
Panel.displayName = "Panel";
