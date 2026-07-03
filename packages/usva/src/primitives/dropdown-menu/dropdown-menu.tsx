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
          "rim-light min-w-40 rounded-lg border border-border bg-surface-2 p-1 text-sm text-ink shadow-floating",
          "origin-[var(--transform-origin)] transition-[opacity,translate,scale,filter] duration-200 ease-spring motion-reduce:transition-none motion-reduce:transform-none",
          "data-[starting-style]:translate-y-1 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 data-[starting-style]:blur-[2px]",
          "data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[ending-style]:duration-150 data-[ending-style]:ease-soft",
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
      "relative flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 text-muted outline-none",
      "before:absolute before:inset-0 before:rounded-[inherit] before:bg-ink/0 before:transition-colors before:duration-150 before:content-[''] motion-reduce:before:transition-none",
      "[&>*]:relative data-[highlighted]:text-ink data-[highlighted]:before:bg-ink/5",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSeparator = React.forwardRef<
  HTMLHRElement,
  React.ComponentPropsWithoutRef<"hr">
>(({ className, ...props }, ref) => (
  <hr
    ref={ref}
    className={cn("-mx-1 my-1 h-px border-0 bg-border", className)}
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
    className={cn("px-2.5 py-1.5 text-xs text-faint", className)}
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
