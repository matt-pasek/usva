"use client";
import { Tooltip as Base } from "@base-ui/react/tooltip";
import * as React from "react";
import { cn } from "../../cn.js";
import { useScopedTheme } from "../overlay-core/use-scoped-theme.js";

export const TooltipProvider = Base.Provider;
export const Tooltip = Base.Root;
export const TooltipTrigger = Base.Trigger;

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Base.Popup> & { sideOffset?: number }
>(({ className, sideOffset = 6, children, ...props }, ref) => {
  const [probe, theme] = useScopedTheme();

  return (
    <>
      <span ref={probe} hidden />
      <Base.Portal>
        <Base.Positioner
          data-theme={theme}
          sideOffset={sideOffset}
          className="z-overlay"
        >
          <Base.Popup
            ref={ref}
            className={cn(
              "rim-light rounded-md border border-border bg-surface-2 px-2.5 py-1.5 font-mono text-[11px] leading-none text-ink shadow-raised",
              "transition-enter duration-fast ease-soft motion-reduce:transition-none motion-reduce:transform-none",
              "data-[starting-style]:translate-y-0.5 data-[starting-style]:opacity-0",
              "data-[ending-style]:translate-y-0.5 data-[ending-style]:opacity-0",
              className,
            )}
            {...props}
          >
            {children}
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </>
  );
});
TooltipContent.displayName = "TooltipContent";
