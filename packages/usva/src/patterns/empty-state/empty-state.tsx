import * as React from "react";
import { cn } from "../../cn.js";

export interface EmptyStateProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  variant?: "solid" | "dashed";
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon,
      title,
      description,
      action,
      variant = "solid",
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-border px-6 py-14 text-center",
        variant === "dashed" ? "border-dashed bg-transparent" : "bg-surface",
        className,
      )}
      {...props}
    >
      {icon != null && (
        <div
          aria-hidden="true"
          className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface-2 text-faint [&_svg]:h-5 [&_svg]:w-5"
        >
          {icon}
        </div>
      )}
      <h3 className="text-balance text-base font-semibold tracking-[-0.01em] text-ink">
        {title}
      </h3>
      {description != null && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-pretty text-muted">
          {description}
        </p>
      )}
      {action != null && <div className="mt-6">{action}</div>}
    </div>
  ),
);
EmptyState.displayName = "EmptyState";
