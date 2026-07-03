"use client";
import { Menu as Base } from "@base-ui/react/menu";
import * as React from "react";
import { cn } from "../../cn.js";

export type DropdownMenuProps = Base.Root.Props;

function DropdownMenuRoot(props: DropdownMenuProps) {
  return <Base.Root {...props} />;
}
DropdownMenuRoot.displayName = "DropdownMenu";

export const DropdownMenuTrigger = Base.Trigger;

export type DropdownMenuContentProps = React.ComponentPropsWithoutRef<
  typeof Base.Popup
> & {
  sideOffset?: number;
};

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <Base.Portal>
    <Base.Positioner sideOffset={sideOffset} className="z-dropdown">
      <Base.Popup
        ref={ref}
        className={cn(
          "min-w-40 rounded-md border border-border bg-overlay py-1 text-sm text-ink shadow-md",
          "transition-[opacity,transform] duration-150 motion-reduce:transition-none motion-reduce:transform-none",
          "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
          "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
          className,
        )}
        {...props}
      >
        {children}
      </Base.Popup>
    </Base.Positioner>
  </Base.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

export type DropdownMenuItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof Base.Item>,
  "onClick"
> & {
  onSelect?: React.ComponentPropsWithoutRef<typeof Base.Item>["onClick"];
};

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(({ className, onSelect, ...props }, ref) => (
  <Base.Item
    ref={ref}
    onClick={onSelect}
    className={cn(
      "flex cursor-default items-center gap-2 px-3 py-1.5 outline-none",
      "data-[highlighted]:bg-surface-2",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn("my-1 h-px bg-border", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-3 py-1.5 text-xs text-muted", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
});
