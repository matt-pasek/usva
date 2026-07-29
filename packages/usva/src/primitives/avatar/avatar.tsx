"use client";
import { Avatar as Base } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

const rootVariants = cva(
  "relative inline-flex shrink-0 select-none items-center justify-center rounded-full ring-1 ring-inset ring-border",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-14 w-14",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const fallbackVariants = cva(
  "flex h-full w-full items-center justify-center font-semibold",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
      tone: {
        solid: "bg-accent-2 text-on-accent",
        accent: "bg-accent-tint font-bold text-on-tint",
        neutral: "bg-surface-2 text-muted",
      },
    },
    defaultVariants: { size: "md", tone: "solid" },
  },
);

export type AvatarTone = "solid" | "accent" | "neutral";

const dotVariants = cva(
  "absolute right-0 bottom-0 rounded-full ring-2 ring-surface",
  {
    variants: {
      size: {
        sm: "h-2 w-2",
        md: "h-2.5 w-2.5",
        lg: "h-3.5 w-3.5",
      },
      status: {
        online: "bg-live animate-live-pulse",
        away: "bg-warning",
        busy: "bg-danger",
        offline: "bg-border-strong",
      },
    },
    defaultVariants: { size: "md", status: "offline" },
  },
);

export type AvatarStatus = "online" | "away" | "busy" | "offline";

export interface AvatarProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Base.Root>,
      "render" | "className"
    >,
    VariantProps<typeof rootVariants> {
  className?: string;
  src?: string;
  alt: string;
  fallback?: string;
  status?: AvatarStatus;
  /** Fallback fill: solid accent (default), tinted accent, or neutral. */
  tone?: AvatarTone;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt, fallback, size, status, tone, ...props }, ref) => {
    return (
      <Base.Root
        ref={ref}
        className={cn(rootVariants({ size }), className)}
        {...props}
      >
        <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-surface-2">
          {src ? (
            <Base.Image
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
            />
          ) : null}
          <Base.Fallback className={fallbackVariants({ size, tone })}>
            {fallback}
          </Base.Fallback>
        </span>
        {status ? (
          <span aria-hidden="true" className={dotVariants({ size, status })} />
        ) : null}
      </Base.Root>
    );
  },
);
Avatar.displayName = "Avatar";
