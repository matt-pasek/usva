"use client";
import * as React from "react";
import { cn } from "../../cn.js";

export type CalloutTone = "neutral" | "info" | "success" | "warning" | "danger";

interface ToneStyle {
  icon: React.ReactNode;
  text: string;
  dot: string;
  tint: string;
}

const toneStyles: Record<Exclude<CalloutTone, "neutral">, ToneStyle> = {
  info: {
    icon: <InfoIcon />,
    text: "text-info",
    dot: "bg-info",
    tint: "bg-info/[0.06]",
  },
  success: {
    icon: <CheckIcon />,
    text: "text-success",
    dot: "bg-success",
    tint: "bg-success/[0.06]",
  },
  warning: {
    icon: <AlertIcon />,
    text: "text-warning",
    dot: "bg-warning",
    tint: "bg-warning/[0.06]",
  },
  danger: {
    icon: <ErrorIcon />,
    text: "text-danger",
    dot: "bg-danger",
    tint: "bg-danger/[0.07]",
  },
};

export interface CalloutProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: CalloutTone;
  title?: React.ReactNode;
  /** One action on the end of the block. Anything more belongs on the page. */
  action?: React.ReactNode;
  /** Swap the tone icon, or pass false to drop it. */
  icon?: React.ReactNode | false;
  /** A callout that vanishes on its own is a toast, so this is opt-in. */
  dismissible?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  (
    {
      className,
      tone = "neutral",
      title,
      action,
      icon,
      dismissible = false,
      onDismiss,
      dismissLabel = "Dismiss",
      children,
      ...props
    },
    ref,
  ) => {
    const [dismissed, setDismissed] = React.useState(false);
    if (dismissed) return null;

    const styles = tone === "neutral" ? undefined : toneStyles[tone];
    const glyph = icon === false ? null : (icon ?? styles?.icon ?? null);

    return (
      <div
        ref={ref}
        role={tone === "danger" ? "alert" : "status"}
        data-tone={tone}
        className={cn(
          "relative isolate flex w-full gap-3 rounded-xl border border-border bg-surface p-4 text-ink",
          className,
        )}
        {...props}
      >
        {styles ? (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 rounded-[inherit]",
              styles.tint,
            )}
          />
        ) : null}

        {glyph ? (
          <span
            aria-hidden="true"
            className={cn("relative mt-px shrink-0", styles?.text)}
          >
            {glyph}
          </span>
        ) : null}

        <div className="relative flex min-w-0 flex-1 flex-col gap-1">
          {title ? (
            <div className="flex items-center gap-2">
              {styles ? (
                <span
                  aria-hidden="true"
                  className={cn("size-1.5 shrink-0 rounded-full", styles.dot)}
                />
              ) : null}
              <p className="font-semibold text-sm text-ink">{title}</p>
            </div>
          ) : null}
          {children ? (
            <div className="text-sm text-muted text-pretty">{children}</div>
          ) : null}
          {action ? <div className="mt-2 flex gap-2">{action}</div> : null}
        </div>

        {dismissible ? (
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={() => {
              setDismissed(true);
              onDismiss?.();
            }}
            className={cn(
              "relative -mt-1 -mr-1 grid size-7 shrink-0 place-items-center self-start rounded-md text-muted outline-none",
              "transition-control duration-base ease-soft motion-reduce:transition-none",
              "hover:bg-surface-2 hover:text-ink focus-visible:ring-focus",
            )}
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>
    );
  },
);
Callout.displayName = "Callout";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
