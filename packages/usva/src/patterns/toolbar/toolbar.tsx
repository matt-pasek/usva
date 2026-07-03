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
