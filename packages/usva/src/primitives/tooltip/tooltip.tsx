"use client";
import { Tooltip as Base } from "@base-ui/react/tooltip";
import * as React from "react";
import { cn } from "../../cn.js";

export const TooltipProvider = Base.Provider;
export const Tooltip = Base.Root;
export const TooltipTrigger = Base.Trigger;

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Base.Popup> & { sideOffset?: number }
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <Base.Portal>
    <Base.Positioner sideOffset={sideOffset}>
      <Base.Popup
        ref={ref}
        className={cn(
          "z-50 rounded-md border border-border bg-overlay px-2.5 py-1.5 text-xs text-ink shadow-md",
          className,
        )}
        {...props}
      >
        {children}
      </Base.Popup>
    </Base.Positioner>
  </Base.Portal>
));
TooltipContent.displayName = "TooltipContent";
