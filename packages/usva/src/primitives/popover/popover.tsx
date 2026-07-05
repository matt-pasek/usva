"use client";
import { Popover as Base } from "@base-ui/react/popover";
import * as React from "react";
import { cn } from "../../cn.js";

export type PopoverProps = Base.Root.Props;

function PopoverRoot(props: PopoverProps) {
  return <Base.Root {...props} />;
}
PopoverRoot.displayName = "Popover";

export const PopoverTrigger = Base.Trigger;

export type PopoverContentProps = React.ComponentPropsWithoutRef<
  typeof Base.Popup
> & {
  side?: Base.Positioner.Props["side"];
  align?: Base.Positioner.Props["align"];
  sideOffset?: number;
};

export const PopoverContent = React.forwardRef<
  HTMLDivElement,
  PopoverContentProps
>(({ className, side, align, sideOffset = 8, children, ...props }, ref) => (
  <Base.Portal>
    <Base.Positioner
      side={side}
      align={align}
      sideOffset={sideOffset}
      className="z-overlay"
    >
      <Base.Popup
        ref={ref}
        className={cn(
          "rim-light rounded-xl border border-border bg-surface-2 p-4 text-ink shadow-floating",
          "origin-[var(--transform-origin)] transition-enter duration-base ease-spring motion-reduce:transition-none motion-reduce:transform-none",
          "data-[starting-style]:translate-y-1 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 data-[starting-style]:blur-[2px]",
          "data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[ending-style]:duration-fast data-[ending-style]:ease-soft",
          className,
        )}
        {...props}
      >
        {children}
      </Base.Popup>
    </Base.Positioner>
  </Base.Portal>
));
PopoverContent.displayName = "PopoverContent";

export const PopoverArrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Base.Arrow>
>(({ className, ...props }, ref) => (
  <Base.Arrow
    ref={ref}
    className={cn("fill-surface-2", className)}
    {...props}
  />
));
PopoverArrow.displayName = "PopoverArrow";

export const PopoverTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof Base.Title>
>(({ className, ...props }, ref) => (
  <Base.Title
    ref={ref}
    className={cn("text-sm font-semibold text-ink", className)}
    {...props}
  />
));
PopoverTitle.displayName = "PopoverTitle";

export const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof Base.Description>
>(({ className, ...props }, ref) => (
  <Base.Description
    ref={ref}
    className={cn("text-sm text-muted", className)}
    {...props}
  />
));
PopoverDescription.displayName = "PopoverDescription";

export const PopoverClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Base.Close>
>(({ className, ...props }, ref) => (
  <Base.Close
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-muted outline-none",
      "transition-tint duration-fast ease-soft",
      "hover:text-ink focus-visible:ring-focus",
      className,
    )}
    {...props}
  />
));
PopoverClose.displayName = "PopoverClose";

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
});
