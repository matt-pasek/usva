"use client";
import { Dialog as Base } from "@base-ui/react/dialog";
import * as React from "react";
import { cn } from "../../cn.js";

export type DialogProps = Base.Root.Props;

function DialogRoot(props: DialogProps) {
  return <Base.Root {...props} />;
}
DialogRoot.displayName = "Dialog";

export const DialogTrigger = Base.Trigger;

export type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof Base.Popup
> & {
  backdropClassName?: string;
};

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ className, backdropClassName, children, ...props }, ref) => (
  <Base.Portal>
    <Base.Backdrop
      className={cn(
        "fixed inset-0 z-overlay bg-scrim backdrop-blur-sm",
        "transition-opacity duration-200 motion-reduce:transition-none",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        backdropClassName,
      )}
    />
    <Base.Popup
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-overlay w-full max-w-md -translate-x-1/2 -translate-y-1/2",
        "rounded-lg border border-border bg-surface p-6 text-ink shadow-lg",
        "transition-[opacity,transform] duration-200 motion-reduce:transition-none motion-reduce:transform-none",
        "data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:-translate-x-1/2 data-[starting-style]:-translate-y-[calc(50%-0.5rem)]",
        "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
        className,
      )}
      {...props}
    >
      {children}
    </Base.Popup>
  </Base.Portal>
));
DialogContent.displayName = "DialogContent";

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof Base.Title>
>(({ className, ...props }, ref) => (
  <Base.Title
    ref={ref}
    className={cn("text-lg font-semibold text-ink", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof Base.Description>
>(({ className, ...props }, ref) => (
  <Base.Description
    ref={ref}
    className={cn("text-sm text-muted", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

export const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Base.Close>
>(({ className, ...props }, ref) => (
  <Base.Close
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-muted outline-none transition-colors",
      "hover:text-ink focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
    {...props}
  />
));
DialogClose.displayName = "DialogClose";

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});
