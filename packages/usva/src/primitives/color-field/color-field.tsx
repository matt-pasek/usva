"use client";
import * as React from "react";
import { cn } from "../../cn.js";

const HEX = /^#[0-9a-fA-F]{6}$/;

export interface ColorFieldProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  label?: React.ReactNode;
  swatchLabel?: string;
  /** Accessible name for the hex input, used when `label` is absent. */
  textLabel?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const ColorField = React.forwardRef<HTMLInputElement, ColorFieldProps>(
  (
    {
      value,
      defaultValue = "#000000",
      onValueChange,
      label,
      swatchLabel = "Pick a color",
      textLabel = "Hex colour value",
      disabled,
      className,
      id,
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const fieldId = id ?? generatedId;
    const [draft, setDraft] = React.useState(value ?? defaultValue);
    const [lastValue, setLastValue] = React.useState(value);

    // The draft has to outrank a controlled value while typing: "#5" is not a
    // valid hex, so onValueChange never fires for it, so value never comes back
    // and the field would be uneditable.
    if (value !== undefined && value !== lastValue) {
      setLastValue(value);
      setDraft(value);
    }

    const text = draft;
    const invalid = text !== "" && !HEX.test(text);
    const swatch = HEX.test(text) ? text : defaultValue;

    const commit = (next: string) => {
      setDraft(next);
      if (HEX.test(next) || next === "") onValueChange?.(next);
    };

    return (
      <div className={cn("flex items-center gap-2", className)}>
        {label ? (
          <label htmlFor={fieldId} className="text-sm text-ink select-none">
            {label}
          </label>
        ) : null}
        <input
          type="color"
          aria-label={swatchLabel}
          value={swatch}
          disabled={disabled}
          onChange={(e) => commit(e.target.value)}
          className={cn(
            "size-6 shrink-0 cursor-pointer appearance-none rounded-sm border border-border bg-transparent p-0 outline-none",
            "transition-control duration-base ease-soft",
            "hover:border-border-strong",
            "focus-visible:border-transparent focus-visible:ring-focus",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&::-moz-color-swatch]:rounded-[3px] [&::-moz-color-swatch]:border-none",
            "[&::-webkit-color-swatch]:rounded-[3px] [&::-webkit-color-swatch]:border-none",
            "[&::-webkit-color-swatch-wrapper]:p-0",
          )}
        />
        <input
          ref={ref}
          id={fieldId}
          type="text"
          spellCheck={false}
          autoComplete="off"
          value={text}
          disabled={disabled}
          aria-label={label ? undefined : textLabel}
          aria-invalid={invalid || undefined}
          onChange={(e) => commit(e.target.value)}
          className={cn(
            "w-24 rounded-lg border border-border bg-bg px-2 py-1 font-mono text-xs tabular-nums text-ink",
            "outline-none transition-control duration-base ease-soft",
            "hover:border-border-strong",
            "focus-visible:border-transparent focus-visible:ring-focus",
            "aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/40",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />
      </div>
    );
  },
);
ColorField.displayName = "ColorField";
