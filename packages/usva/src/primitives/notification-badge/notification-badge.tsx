import * as React from "react";
import { cn } from "../../cn.js";

export type NotificationTone = "accent" | "accent-alt" | "danger" | "warning";

export interface NotificationBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** The count to show. Hidden at 0 unless `showZero`. */
  count?: number;
  /** Cap before showing "N+". Defaults to 9. */
  max?: number;
  tone?: NotificationTone;
  /** Show a bare dot instead of a number. */
  dot?: boolean;
  showZero?: boolean;
}

const toneClass: Record<NotificationTone, string> = {
  accent: "bg-accent text-on-accent",
  "accent-alt": "bg-accent-alt text-bg",
  danger: "bg-danger text-bg",
  warning: "bg-warning text-bg",
};

export const NotificationBadge = React.forwardRef<
  HTMLSpanElement,
  NotificationBadgeProps
>(
  (
    {
      className,
      count = 0,
      max = 9,
      tone = "danger",
      dot = false,
      showZero = false,
      children,
      ...props
    },
    ref,
  ) => {
    const visible = dot || count > 0 || showZero;
    return (
      <span
        ref={ref}
        className={cn("relative inline-flex", className)}
        {...props}
      >
        {children}
        {visible &&
          (dot ? (
            <span
              aria-hidden="true"
              className={cn(
                "absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-surface",
                toneClass[tone],
              )}
            />
          ) : (
            <span
              className={cn(
                "absolute -top-1.5 -right-1.5 inline-flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full px-1 font-mono text-[0.625rem] font-semibold leading-none tabular-nums ring-2 ring-surface",
                toneClass[tone],
              )}
            >
              {count > max ? `${max}+` : count}
            </span>
          ))}
      </span>
    );
  },
);
NotificationBadge.displayName = "NotificationBadge";
