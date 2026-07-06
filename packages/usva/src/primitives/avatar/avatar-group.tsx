import * as React from "react";
import { cn } from "../../cn.js";

export type AvatarGroupSize = "sm" | "md" | "lg";
export type AvatarGroupTone = "solid" | "accent" | "neutral";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Cap the visible avatars; the rest collapse into a "+N" chip. */
  max?: number;
  size?: AvatarGroupSize;
  /** Caption after the stack, e.g. "25+ active users". */
  label?: React.ReactNode;
  /** Colors the overflow chip to match a tinted cluster. Defaults to neutral. */
  tone?: AvatarGroupTone;
}

const overlap: Record<AvatarGroupSize, string> = {
  sm: "-ml-1.5",
  md: "-ml-2",
  lg: "-ml-2.5",
};

const overflowChip: Record<AvatarGroupSize, string> = {
  sm: "size-8 text-[0.7rem]",
  md: "size-10 text-xs",
  lg: "size-14 text-sm",
};

const chipTone: Record<AvatarGroupTone, string> = {
  solid: "bg-accent-2 text-on-accent",
  accent: "bg-accent-tint text-on-tint",
  neutral: "bg-surface-2 text-muted",
};

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      className,
      max,
      size = "md",
      label,
      tone = "neutral",
      children,
      ...props
    },
    ref,
  ) => {
    const all = React.Children.toArray(children);
    const shown = max != null ? all.slice(0, max) : all;
    const overflow = all.length - shown.length;

    return (
      <div ref={ref} className={cn("flex items-center", className)} {...props}>
        <div className="flex items-center">
          {shown.map((child, i) => (
            <span
              key={(child as React.ReactElement).key}
              className={cn(
                "rounded-full shadow-raised ring-2 ring-surface",
                i > 0 && overlap[size],
              )}
            >
              {child}
            </span>
          ))}
          {overflow > 0 && (
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-full font-bold tabular-nums shadow-raised ring-2 ring-surface",
                overlap[size],
                overflowChip[size],
                chipTone[tone],
              )}
            >
              +{overflow}
            </span>
          )}
        </div>
        {label != null && (
          <span className="ml-3 text-sm font-medium text-muted">{label}</span>
        )}
      </div>
    );
  },
);
AvatarGroup.displayName = "AvatarGroup";
