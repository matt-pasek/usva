"use client";
import { Select as Base } from "@base-ui/react/select";
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
      "group flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-ink outline-none",
      "transition-control duration-base ease-soft",
      "hover:border-border-strong",
      "focus-visible:border-transparent focus-visible:ring-focus",
      "data-[popup-open]:border-transparent data-[popup-open]:ring-focus",
      "aria-invalid:border-danger",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    <Base.Icon className="text-muted transition-control duration-base ease-soft group-data-[popup-open]:rotate-180">
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
    <Base.Positioner sideOffset={sideOffset} className="z-dropdown">
      <Base.Popup
        ref={ref}
        className={cn(
          "rim-light max-h-[min(24rem,var(--available-height))] min-w-[var(--anchor-width)] overflow-auto rounded-lg border border-border bg-surface-2 p-1 text-sm text-ink shadow-floating",
          "origin-[var(--transform-origin)] transition-enter duration-base ease-spring motion-reduce:transition-none motion-reduce:transform-none",
          "data-[starting-style]:translate-y-1 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 data-[starting-style]:blur-[2px]",
          "data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[ending-style]:duration-fast data-[ending-style]:ease-soft",
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
        "relative flex cursor-default select-none items-center justify-between gap-2 rounded-md px-2.5 py-2 text-muted outline-none",
        "ring-1 ring-inset ring-transparent",
        "before:absolute before:inset-0 before:rounded-[inherit] before:bg-ink/0 before:transition-tint before:duration-fast before:content-[''] motion-reduce:before:transition-none",
        "transition-control duration-fast ease-soft motion-reduce:transition-none",
        "data-[highlighted]:text-ink data-[highlighted]:before:bg-ink/5",
        "data-[selected]:bg-accent/[0.08] data-[selected]:text-ink data-[selected]:ring-accent/30",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <Base.ItemText className="relative">{children}</Base.ItemText>
      <Base.ItemIndicator className="relative text-accent">
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
