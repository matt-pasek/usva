"use client";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  Spinner,
  type SpinnerSize,
  type SpinnerTone,
  type SpinnerVariant,
} from "../spinner/spinner.js";
import { useScrollLock } from "./use-scroll-lock.js";

export type OverlayContain = "viewport" | "parent";

export interface LoadingOverlayProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * `parent` covers the nearest positioned ancestor and locks nothing.
   * `viewport` covers the page and locks body scroll.
   */
  contain?: OverlayContain;
  label?: string;
  blur?: boolean;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  tone?: SpinnerTone;
}

/**
 * A scrim with a centered spinner.
 *
 * Defaults to `contain="parent"` because that variant locks nothing, and a
 * scroll lock is the one thing here that can reach outside the component and
 * break an unrelated modal.
 */
export const LoadingOverlay = React.forwardRef<
  HTMLDivElement,
  LoadingOverlayProps
>(
  (
    {
      className,
      contain = "parent",
      label,
      blur = true,
      size = "lg",
      variant = "ring",
      tone = "accent",
      ...props
    },
    ref,
  ) => {
    useScrollLock(contain === "viewport");

    return (
      <div
        ref={ref}
        data-testid="loading-overlay"
        data-contain={contain}
        className={cn(
          "z-overlay grid place-items-center gap-3 bg-scrim",
          contain === "viewport" ? "fixed inset-0" : "absolute inset-0",
          blur && "backdrop-blur-sm",
          className,
        )}
        {...props}
      >
        <Spinner
          size={size}
          variant={variant}
          tone={tone}
          label={label ?? "Loading"}
        />
        {label != null && (
          <p
            aria-hidden="true"
            className="animate-reveal font-mono text-xs lowercase tracking-wide text-muted"
          >
            {label}
          </p>
        )}
      </div>
    );
  },
);
LoadingOverlay.displayName = "LoadingOverlay";
