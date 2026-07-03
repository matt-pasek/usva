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

export interface ToastProviderProps {
  children?: React.ReactNode;
  limit?: number;
  timeout?: number;
}

const swipeTransform = {
  transform:
    "translateX(var(--toast-swipe-movement-x, 0px)) translateY(var(--toast-swipe-movement-y, 0px))",
};

function ToastItem({ toast: item }: { toast: Base.Root.ToastObject }) {
  return (
    <Base.Root
      toast={item}
      swipeDirection={["down", "right"]}
      style={swipeTransform}
      className={cn(
        "pointer-events-auto flex w-full max-w-sm flex-col gap-1 rounded-lg border border-border bg-surface p-4 text-ink shadow-lg",
        "border-l-4",
        "transition-[opacity,scale,translate] duration-200 motion-reduce:transition-none",
        "data-[starting-style]:translate-y-2 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
        "data-[ending-style]:translate-x-4 data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
        "data-[swiping]:transition-none motion-reduce:data-[starting-style]:translate-none motion-reduce:data-[ending-style]:translate-none",
        "data-[type=success]:border-l-success",
        "data-[type=warning]:border-l-warning",
        "data-[type=danger]:border-l-danger",
        "data-[type=info]:border-l-info",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <Base.Title className="text-sm font-semibold text-ink" />
          <Base.Description className="text-sm text-muted" />
        </div>
        <Base.Close
          aria-label="Dismiss"
          className={cn(
            "shrink-0 rounded-md text-muted outline-none transition-colors",
            "hover:text-ink focus-visible:ring-2 focus-visible:ring-ring",
          )}
        >
          <CloseIcon />
        </Base.Close>
      </div>
      <Base.Action
        className={cn(
          "self-start rounded-md border border-border-strong px-2.5 py-1 text-xs font-medium text-ink outline-none transition-colors",
          "hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-ring",
        )}
      />
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

export function ToastProvider({
  children,
  limit,
  timeout,
}: ToastProviderProps) {
  return (
    <Base.Provider toastManager={toastManager} limit={limit} timeout={timeout}>
      {children}
      <Base.Portal>
        <Base.Viewport className="pointer-events-none fixed bottom-4 right-4 z-toast flex w-full max-w-sm flex-col-reverse gap-2">
          <ToastList />
        </Base.Viewport>
      </Base.Portal>
    </Base.Provider>
  );
}
ToastProvider.displayName = "ToastProvider";

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
