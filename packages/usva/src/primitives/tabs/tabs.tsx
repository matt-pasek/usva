"use client";
import { Tabs as Base } from "@base-ui/react/tabs";
import * as React from "react";
import { cn } from "../../cn.js";

export type TabsVariant = "pill" | "underline";

export type TabsProps = Base.Root.Props;

const TabsRoot = React.forwardRef<HTMLDivElement, TabsProps>((props, ref) => (
  <Base.Root ref={ref} {...props} />
));
TabsRoot.displayName = "Tabs";

export type TabsListProps = React.ComponentPropsWithoutRef<typeof Base.List> & {
  variant?: TabsVariant;
};

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  (
    { className, activateOnFocus = true, variant = "pill", children, ...props },
    ref,
  ) => (
    <Base.List
      ref={ref}
      activateOnFocus={activateOnFocus}
      className={cn(
        "relative isolate flex data-[orientation=vertical]:flex-col",
        variant === "underline"
          ? "gap-4 border-b border-border data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-r"
          : "gap-1",
        className,
      )}
      {...props}
    >
      {children}
      <TabsIndicator variant={variant} />
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
        "relative z-10 rounded-md px-3 py-2 text-sm text-muted outline-none",
        "transition-control duration-fast ease-soft motion-reduce:transition-none",
        "hover:text-ink data-[active]:text-ink",
        "focus-visible:ring-focus",
        "active:scale-[0.98] motion-reduce:transform-none",
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

type TabsIndicatorProps = React.ComponentPropsWithoutRef<
  typeof Base.Indicator
> & { variant?: TabsVariant };

const TabsIndicator = React.forwardRef<HTMLSpanElement, TabsIndicatorProps>(
  ({ className, variant = "pill", ...props }, ref) =>
    variant === "underline" ? (
      <Base.Indicator
        ref={ref}
        className={cn(
          "absolute bottom-0 z-0 h-px w-(--active-tab-width) translate-x-(--active-tab-left) hairline-accent transition-layout duration-slow ease-spring motion-reduce:transition-none",
          "data-[orientation=vertical]:top-0 data-[orientation=vertical]:right-0 data-[orientation=vertical]:bottom-auto data-[orientation=vertical]:h-(--active-tab-height) data-[orientation=vertical]:w-px data-[orientation=vertical]:translate-x-0 data-[orientation=vertical]:translate-y-(--active-tab-top)",
          className,
        )}
        {...props}
      />
    ) : (
      <Base.Indicator
        ref={ref}
        className={cn(
          "absolute top-0 left-0 z-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top) rounded-md bg-surface-2 shadow-raised transition-layout duration-slow ease-spring motion-reduce:transition-none",
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
