"use client";
import { Tabs as Base } from "@base-ui/react/tabs";
import * as React from "react";
import { cn } from "../../cn.js";

export type TabsProps = Base.Root.Props;

const TabsRoot = React.forwardRef<HTMLDivElement, TabsProps>((props, ref) => (
  <Base.Root ref={ref} {...props} />
));
TabsRoot.displayName = "Tabs";

export type TabsListProps = React.ComponentPropsWithoutRef<typeof Base.List>;

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, activateOnFocus = true, children, ...props }, ref) => (
    <Base.List
      ref={ref}
      activateOnFocus={activateOnFocus}
      className={cn(
        "relative flex gap-4 border-b border-border data-[orientation=vertical]:flex-col data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-r",
        className,
      )}
      {...props}
    >
      {children}
      <TabsIndicator />
    </Base.List>
  ),
);
TabsList.displayName = "TabsList";

export type TabsTabProps = React.ComponentPropsWithoutRef<typeof Base.Tab>;

export const TabsTab = React.forwardRef<HTMLButtonElement, TabsTabProps>(
  ({ className, ...props }, ref) => (
    <Base.Tab
      ref={ref}
      className={cn(
        "px-3 py-2 text-sm text-muted outline-none transition-colors",
        "data-[selected]:text-ink",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
TabsTab.displayName = "TabsTab";

export type TabsPanelProps = React.ComponentPropsWithoutRef<typeof Base.Panel>;

export const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ className, ...props }, ref) => (
    <Base.Panel
      ref={ref}
      className={cn("pt-4 text-sm text-ink outline-none", className)}
      {...props}
    />
  ),
);
TabsPanel.displayName = "TabsPanel";

type TabsIndicatorProps = React.ComponentPropsWithoutRef<typeof Base.Indicator>;

const TabsIndicator = React.forwardRef<HTMLSpanElement, TabsIndicatorProps>(
  ({ className, ...props }, ref) => (
    <Base.Indicator
      ref={ref}
      className={cn(
        "absolute bottom-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left) bg-accent transition-[transform,width] duration-200 ease-out motion-reduce:transition-none",
        "data-[orientation=vertical]:top-0 data-[orientation=vertical]:right-0 data-[orientation=vertical]:bottom-auto data-[orientation=vertical]:h-(--active-tab-height) data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:translate-x-0 data-[orientation=vertical]:translate-y-(--active-tab-top)",
        className,
      )}
      {...props}
    />
  ),
);
TabsIndicator.displayName = "TabsIndicator";

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});
