"use client";
import { Dialog as Base } from "@base-ui/react/dialog";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  type CardSurface,
  SURFACE_ELEVATED,
  SURFACE_SKIN,
} from "../card/card.js";

export type DrawerSide = "top" | "right" | "bottom" | "left";
export type DrawerSize = "sm" | "md" | "lg";

export type DrawerProps = Base.Root.Props;

function DrawerRoot(props: DrawerProps) {
  return <Base.Root {...props} />;
}
DrawerRoot.displayName = "Drawer";

export const DrawerTrigger = Base.Trigger;

/** Edge anchoring, plus the border and radius on the inner edge only. */
const sideAnchor: Record<DrawerSide, string> = {
  right: "inset-y-0 right-0 h-full border-l rounded-l-2xl",
  left: "inset-y-0 left-0 h-full border-r rounded-r-2xl",
  top: "inset-x-0 top-0 w-full border-b rounded-b-2xl",
  bottom: "inset-x-0 bottom-0 w-full border-t rounded-t-2xl",
};

/** Inline size on the vertical edges, block size on the horizontal ones. */
const sideSize: Record<DrawerSide, Record<DrawerSize, string>> = {
  right: {
    sm: "w-full max-w-xs",
    md: "w-full max-w-md",
    lg: "w-full max-w-2xl",
  },
  left: {
    sm: "w-full max-w-xs",
    md: "w-full max-w-md",
    lg: "w-full max-w-2xl",
  },
  top: { sm: "max-h-[30vh]", md: "max-h-[50vh]", lg: "max-h-[80vh]" },
  bottom: { sm: "max-h-[30vh]", md: "max-h-[50vh]", lg: "max-h-[80vh]" },
};

const sideEnter: Record<DrawerSide, string> = {
  right:
    "data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
  left: "data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full",
  top: "data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full",
  bottom:
    "data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
};

export type DrawerContentProps = React.ComponentPropsWithoutRef<
  typeof Base.Popup
> & {
  side?: DrawerSide;
  size?: DrawerSize;
  backdropClassName?: string;
  /** How the panel sits above the scrim. Defaults to elevated. */
  surface?: CardSurface;
};

/**
 * Base UI owns focus trap, scroll lock, Esc, and portalling. This adds only the
 * edge anchoring and the slide, both CSS. kajo's slide-up sheet is side="bottom".
 */
export const DrawerContent = React.forwardRef<
  HTMLDivElement,
  DrawerContentProps
>(
  (
    {
      className,
      backdropClassName,
      side = "right",
      size = "md",
      surface = "elevated",
      children,
      ...props
    },
    ref,
  ) => (
    <Base.Portal>
      <Base.Backdrop
        className={cn(
          "fixed inset-0 z-overlay bg-scrim backdrop-blur-sm",
          "transition-opacity duration-base motion-reduce:transition-none",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          backdropClassName,
        )}
      />
      <Base.Popup
        ref={ref}
        data-side={side}
        data-surface={surface}
        className={cn(
          "fixed z-overlay flex flex-col overflow-y-auto",
          "wash-accent isolate border-border p-6 text-ink",
          sideAnchor[side],
          sideSize[side][size],
          SURFACE_SKIN[surface],
          SURFACE_ELEVATED[surface] && "shadow-overlay",
          "transition-enter duration-[350ms] ease-spring",
          "motion-reduce:transition-none motion-reduce:transform-none",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
          "data-[ending-style]:duration-base data-[ending-style]:ease-soft",
          sideEnter[side],
          className,
        )}
        {...props}
      >
        {children}
      </Base.Popup>
    </Base.Portal>
  ),
);
DrawerContent.displayName = "DrawerContent";

export const DrawerTitle = React.forwardRef<
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
DrawerTitle.displayName = "DrawerTitle";

export const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof Base.Description>
>(({ className, ...props }, ref) => (
  <Base.Description
    ref={ref}
    className={cn("mt-1 text-pretty text-sm text-muted", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export const DrawerClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Base.Close>
>(({ className, ...props }, ref) => (
  <Base.Close
    ref={ref}
    className={cn(
      "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted outline-none",
      "transition-control duration-fast ease-soft",
      "hover:bg-surface-2 hover:text-ink active:scale-[0.96] focus-visible:ring-focus",
      "motion-reduce:transition-none motion-reduce:transform-none",
      className,
    )}
    {...props}
  />
));
DrawerClose.displayName = "DrawerClose";

export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
});
