"use client";
import { Dialog as Base } from "@base-ui/react/dialog";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  type CardHighlight,
  type CardSurface,
  SURFACE_ELEVATED,
  SURFACE_SKIN,
} from "../card/card.js";

export type DialogProps = Base.Root.Props;

const DialogModalContext = React.createContext<boolean | "trap-focus">(true);

function DialogRoot({ modal = true, ...props }: DialogProps) {
  return (
    <DialogModalContext.Provider value={modal}>
      <Base.Root modal={modal} {...props} />
    </DialogModalContext.Provider>
  );
}
DialogRoot.displayName = "Dialog";

export const DialogTrigger = Base.Trigger;

export type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof Base.Popup
> & {
  backdropClassName?: string;
  /** How the modal sits above the scrim. Defaults to elevated. */
  surface?: CardSurface;
  /** Accent treatment, shared with Card: a wash, a top edge, or a glow ring. */
  highlight?: CardHighlight;
};

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(
  (
    {
      className,
      backdropClassName,
      surface = "elevated",
      highlight = "none",
      children,
      ...props
    },
    ref,
  ) => {
    const modal = React.useContext(DialogModalContext);
    return (
      <Base.Portal>
        {modal === true ? (
          <Base.Backdrop
            className={cn(
              "fixed inset-0 z-overlay transition-opacity duration-base motion-reduce:transition-none",
              "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
              surface === "glass"
                ? "bg-scrim/40 backdrop-blur-[3px]"
                : "bg-scrim backdrop-blur-sm",
              backdropClassName,
            )}
          />
        ) : null}
        <Base.Popup
          ref={ref}
          data-surface={surface}
          data-highlight={highlight !== "none" ? highlight : undefined}
          className={cn(
            "fixed left-1/2 top-1/2 z-overlay w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "isolate rounded-2xl border border-border p-6 text-ink",
            SURFACE_SKIN[surface],
            highlight === "ring"
              ? "glow-ring"
              : SURFACE_ELEVATED[surface] && "shadow-overlay",
            highlight === "wash" && "wash-accent",
            highlight === "edge" &&
              "after:absolute after:inset-x-6 after:top-0 after:h-px after:hairline-accent",
            "transition-enter duration-[350ms] ease-spring motion-reduce:transition-none motion-reduce:transform-none",
            "data-[starting-style]:opacity-0 data-[starting-style]:blur-[4px] data-[starting-style]:scale-[0.96] data-[starting-style]:-translate-x-1/2 data-[starting-style]:-translate-y-[calc(50%-0.75rem)]",
            "data-[ending-style]:opacity-0 data-[ending-style]:scale-[0.98] data-[ending-style]:-translate-x-1/2 data-[ending-style]:-translate-y-[calc(50%-0.25rem)] data-[ending-style]:duration-base data-[ending-style]:ease-soft",
            className,
          )}
          {...props}
        >
          {children}
        </Base.Popup>
      </Base.Portal>
    );
  },
);
DialogContent.displayName = "DialogContent";

export const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof Base.Title>
>(({ className, ...props }, ref) => (
  <Base.Title
    ref={ref}
    className={cn(
      "text-balance text-lg font-semibold tracking-[-0.01em] text-ink",
      className,
    )}
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
    className={cn("text-pretty text-sm text-muted", className)}
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
      "inline-flex items-center justify-center rounded-md text-muted outline-none",
      "transition-control duration-fast ease-soft",
      "hover:bg-surface-2 hover:text-ink active:scale-[0.96] focus-visible:ring-focus",
      "motion-reduce:transition-none motion-reduce:transform-none",
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
