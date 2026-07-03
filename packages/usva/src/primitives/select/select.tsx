"use client";
import { Select as Base } from "@base-ui/react/select";
import { Z_LAYERS } from "@matt-pasek/usva-tokens";
import * as React from "react";
import { cn } from "../../cn.js";

export type SelectProps<Value = string> = Base.Root.Props<Value>;

function SelectImpl<Value = string>(
  props: SelectProps<Value>,
  ref: React.Ref<HTMLInputElement>,
) {
  return <Base.Root inputRef={ref} {...props} />;
}

const SelectRoot = React.forwardRef(SelectImpl) as (<Value = string>(
  props: SelectProps<Value> & { ref?: React.Ref<HTMLInputElement> },
) => React.ReactElement) & {
  displayName?: string;
};
SelectRoot.displayName = "Select";

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Base.Trigger>
>(({ className, children, ...props }, ref) => (
  <Base.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-border bg-surface px-3 text-sm text-ink outline-none transition-colors",
      "focus-visible:ring-2 focus-visible:ring-ring",
      "aria-invalid:border-danger aria-invalid:ring-danger",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    <Base.Icon className="text-muted">
      <ChevronIcon />
    </Base.Icon>
  </Base.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = Base.Value;

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Base.Popup> & { sideOffset?: number }
>(({ className, sideOffset = 6, children, ...props }, ref) => (
  <Base.Portal>
    <Base.Positioner
      sideOffset={sideOffset}
      style={{ zIndex: Z_LAYERS.dropdown }}
    >
      <Base.Popup
        ref={ref}
        className={cn(
          "max-h-64 overflow-auto rounded-md border border-border bg-overlay py-1 text-sm text-ink shadow-md",
          className,
        )}
        {...props}
      >
        <Base.List>{children}</Base.List>
      </Base.Popup>
    </Base.Positioner>
  </Base.Portal>
));
SelectContent.displayName = "SelectContent";

export type SelectItemProps = React.ComponentPropsWithoutRef<typeof Base.Item>;

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => (
    <Base.Item
      ref={ref}
      className={cn(
        "flex cursor-default items-center justify-between gap-2 px-3 py-1.5 outline-none",
        "data-[highlighted]:bg-surface-2",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <Base.ItemText>{children}</Base.ItemText>
      <Base.ItemIndicator className="text-accent">
        <CheckIcon />
      </Base.ItemIndicator>
    </Base.Item>
  ),
);
SelectItem.displayName = "SelectItem";

export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
});

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M3 4.5 6 7.5 9 4.5" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M2.5 6.5 5 9l4.5-5.5" />
    </svg>
  );
}
