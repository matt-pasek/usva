"use client";
import * as React from "react";
import { cn } from "../../cn.js";

export type ToggleChipGroupType = "single" | "multiple";

interface GroupContext {
  values: string[];
  disabled: boolean;
  toggle: (value: string) => void;
  isLocked: (value: string) => boolean;
}

const ToggleChipGroupContext = React.createContext<GroupContext | null>(null);

interface ToggleChipGroupBaseProps
  extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, "onChange"> {
  /** Names the group for assistive tech. Falls back to a string `label`. */
  ariaLabel?: string;
  /** Mono eyebrow rendered before the chips. */
  label?: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleChipGroupSingleProps extends ToggleChipGroupBaseProps {
  type: "single";
  /** The pressed id. Controlled. */
  value: string;
  onValueChange?: (value: string) => void;
}

export interface ToggleChipGroupMultipleProps extends ToggleChipGroupBaseProps {
  type?: "multiple";
  /** The pressed ids. Controlled. */
  value: string[];
  onValueChange?: (value: string[]) => void;
  /** Refuse to deselect below this many. */
  min?: number;
  /** Refuse to select beyond this many. */
  max?: number;
}

export type ToggleChipGroupProps =
  | ToggleChipGroupSingleProps
  | ToggleChipGroupMultipleProps;

export const ToggleChipGroup = React.forwardRef<
  HTMLFieldSetElement,
  ToggleChipGroupProps
>((allProps, ref) => {
  const {
    className,
    ariaLabel,
    label,
    disabled = false,
    children,
    type: _type,
    value: _value,
    onValueChange: _onValueChange,
    min: _min,
    max: _max,
    ...props
  } = allProps as ToggleChipGroupMultipleProps;

  const values = allProps.type === "single" ? [allProps.value] : allProps.value;

  const context: GroupContext = {
    values,
    disabled,
    isLocked: (id) => {
      if (allProps.type === "single") return false;
      const { min, max } = allProps;
      if (values.includes(id)) return min != null && values.length <= min;
      return max != null && values.length >= max;
    },
    toggle: (id) => {
      if (allProps.type === "single") {
        allProps.onValueChange?.(id);
        return;
      }
      allProps.onValueChange?.(
        values.includes(id)
          ? values.filter((current) => current !== id)
          : [...values, id],
      );
    },
  };

  return (
    <ToggleChipGroupContext.Provider value={context}>
      <fieldset
        ref={ref}
        disabled={disabled}
        aria-label={
          ariaLabel ?? (typeof label === "string" ? label : undefined)
        }
        className={cn(
          "flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-border bg-sunken/60 p-2 backdrop-blur-md",
          className,
        )}
        {...props}
      >
        {label != null && (
          <span className="px-1 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted">
            {label}
          </span>
        )}
        {children}
      </fieldset>
    </ToggleChipGroupContext.Provider>
  );
});
ToggleChipGroup.displayName = "ToggleChipGroup";

export interface ToggleChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
}

export const ToggleChip = React.forwardRef<HTMLButtonElement, ToggleChipProps>(
  ({ className, value, disabled, onClick, children, ...props }, ref) => {
    const group = React.useContext(ToggleChipGroupContext);
    if (!group)
      throw new Error("ToggleChip must be rendered inside a ToggleChipGroup");

    const selected = group.values.includes(value);
    const isDisabled = disabled || group.disabled || group.isLocked(value);

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        disabled={isDisabled}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) group.toggle(value);
        }}
        className={cn(
          "relative inline-flex min-h-9 items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-none",
          "transition-control duration-fast ease-soft focus-visible:ring-focus",
          "active:scale-[0.96] motion-reduce:transform-none motion-reduce:transition-none",
          // The chip is 36px tall to keep the rows dense, so it borrows the 44px
          // target from a pseudo-element rather than from its own box.
          "before:absolute before:-inset-y-1 before:inset-x-0 before:content-['']",
          selected
            ? "bg-accent/15 text-accent"
            : "bg-ink/[0.06] text-muted hover:text-ink",
          isDisabled
            ? "cursor-not-allowed opacity-55"
            : "cursor-pointer hover:bg-ink/10",
          className,
        )}
        {...props}
      >
        <span className="grid size-4 shrink-0 place-items-center rounded-full bg-sunken/70">
          {selected && <CheckIcon />}
        </span>
        {children}
      </button>
    );
  },
);
ToggleChip.displayName = "ToggleChip";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3"
      aria-hidden="true"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}
