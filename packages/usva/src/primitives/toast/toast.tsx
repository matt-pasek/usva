"use client";
import { Toast as Base } from "@base-ui/react/toast";
import type * as React from "react";
import { cn } from "../../cn.js";

export type ToastType = "success" | "warning" | "danger" | "info";

export interface ToastActionOptions {
  label: string;
  onClick?: () => void;
}

export interface ToastOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  type?: ToastType;
  duration?: number;
  action?: ToastActionOptions;
}

export const toastManager = Base.createToastManager();

export function toast(options: ToastOptions): string {
  const { duration, action, ...rest } = options;
  return toastManager.add({
    ...rest,
    timeout: duration,
    actionProps: action
      ? { children: action.label, onClick: action.onClick }
      : undefined,
  });
}

export type NotifyOptions = Omit<ToastOptions, "title" | "type">;

function makeNotifier(type: ToastType) {
  return (title: React.ReactNode, options?: NotifyOptions): string =>
    toast({ ...options, title, type });
}

/**
 * Imperative sugar over `toast()`. Call from anywhere, including outside React:
 * `notify.success("Saved")`, `notify.error("Upload failed", { description })`.
 * Needs a mounted `Toaster` to render into, but not around the call site.
 */
export const notify = {
  success: makeNotifier("success"),
  warning: makeNotifier("warning"),
  danger: makeNotifier("danger"),
  error: makeNotifier("danger"),
  info: makeNotifier("info"),
};

export interface ToasterProps {
  limit?: number;
  timeout?: number;
}

interface ToneStyle {
  icon: React.ReactNode;
  text: string;
  dot: string;
  tint: string;
}

const toneStyles: Record<ToastType, ToneStyle> = {
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
  info: {
    icon: <InfoIcon />,
    text: "text-info",
    dot: "bg-info",
    tint: "bg-info/[0.06]",
  },
};

function ToastItem({ toast: item }: { toast: Base.Root.ToastObject }) {
  const tone = item.type ? toneStyles[item.type as ToastType] : undefined;
  const duration = typeof item.timeout === "number" ? item.timeout : 0;
  return (
    <Base.Root
      toast={item}
      swipeDirection={["down", "right"]}
      className={cn(
        "group/toast rim-light pointer-events-auto relative isolate flex w-full max-w-sm gap-3 overflow-hidden rounded-xl border border-border bg-overlay p-4 text-ink shadow-overlay",
        "transition-enter duration-slow ease-spring motion-reduce:transition-none motion-reduce:transform-none",
        "data-[starting-style]:translate-y-3 data-[starting-style]:opacity-0 data-[starting-style]:blur-[3px]",
        "data-[ending-style]:translate-x-4 data-[ending-style]:opacity-0 data-[ending-style]:duration-fast data-[ending-style]:ease-soft",
        "data-[swiping]:transition-none motion-reduce:data-[starting-style]:translate-none motion-reduce:data-[ending-style]:translate-none",
      )}
    >
      {tone ? (
        <>
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-0 rounded-[inherit]",
              tone.tint,
            )}
          />
          <span
            aria-hidden="true"
            className={cn("relative mt-0.5 shrink-0", tone.text)}
          >
            {tone.icon}
          </span>
        </>
      ) : null}
      <div className="relative flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          {tone ? (
            <span
              aria-hidden="true"
              className={cn("size-1.5 shrink-0 rounded-full", tone.dot)}
            />
          ) : null}
          <Base.Title className="text-sm font-semibold text-ink" />
        </div>
        <Base.Description className="text-sm text-muted" />
        <Base.Action
          className={cn(
            "mt-1 self-start rounded-md border border-border-strong px-2.5 py-1 text-xs font-medium text-ink outline-none",
            "transition-control duration-fast ease-soft motion-reduce:transition-none",
            "hover:bg-surface-2 focus-visible:border-transparent focus-visible:ring-focus",
            "active:scale-[0.98] motion-reduce:transform-none",
          )}
        />
      </div>
      <Base.Close
        aria-label="Dismiss"
        className={cn(
          "relative -m-1 flex size-6 shrink-0 items-center justify-center rounded-md text-muted outline-none",
          "before:absolute before:-inset-2.5 before:content-['']",
          "transition-control duration-fast ease-soft motion-reduce:transition-none motion-reduce:transform-none",
          "hover:bg-surface-2 hover:text-ink active:scale-[0.96] focus-visible:ring-focus",
        )}
      >
        <CloseIcon />
      </Base.Close>
      {duration > 0 ? (
        <span
          aria-hidden="true"
          style={
            { "--usva-toast-duration": `${duration}ms` } as React.CSSProperties
          }
          className={cn(
            "animate-toast-countdown pointer-events-none absolute inset-x-0 bottom-0 h-0.5 opacity-60 group-hover/toast:[animation-play-state:paused]",
            tone ? tone.dot : "bg-border-strong",
          )}
        />
      ) : null}
    </Base.Root>
  );
}

function ToastList() {
  const { toasts } = Base.useToastManager();
  return (
    <>
      {toasts.map((item) => (
        <ToastItem key={item.id} toast={item} />
      ))}
    </>
  );
}

/**
 * Mount once, anywhere in the tree. It does not wrap your app: `notify` and `toast`
 * talk to a module-scoped manager, not to React context, so the call site never has
 * to sit underneath this. Toasts fired before it mounts are dropped, not queued.
 */
export function Toaster({ limit, timeout }: ToasterProps) {
  return (
    <Base.Provider toastManager={toastManager} limit={limit} timeout={timeout}>
      <Base.Portal>
        <Base.Viewport className="pointer-events-none fixed bottom-4 left-4 right-4 z-toast flex w-auto flex-col-reverse gap-2 sm:left-auto sm:w-full sm:max-w-sm">
          <ToastList />
        </Base.Viewport>
      </Base.Portal>
    </Base.Provider>
  );
}
Toaster.displayName = "Toaster";

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

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
