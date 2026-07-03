"use client";
import { Checkbox as Base } from "@base-ui/react/checkbox";
import { Field } from "@base-ui/react/field";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

const rootVariants = cva(
  "relative flex shrink-0 items-center justify-center rounded-md border border-border bg-surface outline-none transition-[color,background-color,border-color,box-shadow,scale] duration-200 ease-soft before:absolute before:-inset-2.5 before:content-[''] data-[unchecked]:hover:border-border-strong data-[checked]:border-accent data-[checked]:bg-accent data-[checked]:bg-gradient-accent data-[checked]:glow-ring data-[indeterminate]:border-accent data-[indeterminate]:bg-accent data-[indeterminate]:bg-gradient-accent data-[indeterminate]:glow-ring active:scale-[0.98] motion-reduce:transition-none motion-reduce:transform-none focus-visible:border-transparent focus-visible:ring-focus aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const indicatorVariants = cva("text-on-accent", {
  variants: {
    size: {
      sm: "h-3 w-3",
      md: "h-3.5 w-3.5",
    },
  },
  defaultVariants: { size: "md" },
});

export interface CheckboxProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Base.Root>,
      "render" | "className"
    >,
    VariantProps<typeof rootVariants> {
  className?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, size, label, description, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id ?? generatedId;

    return (
      <Field.Root className="flex flex-col gap-1" disabled={disabled}>
        <div className="flex items-center gap-2">
          <Base.Root
            ref={ref}
            id={checkboxId}
            disabled={disabled}
            className={cn(rootVariants({ size }), className)}
            {...props}
          >
            <Base.Indicator
              keepMounted
              className={cn(
                "flex items-center justify-center transition-[scale] duration-200 ease-spring motion-reduce:transition-none motion-reduce:transform-none data-[unchecked]:scale-0 data-[checked]:scale-100 data-[indeterminate]:scale-100",
              )}
            >
              <CheckIcon className={indicatorVariants({ size })} />
            </Base.Indicator>
          </Base.Root>
          {label ? (
            <Field.Label
              htmlFor={checkboxId}
              className="text-sm text-ink select-none"
            >
              {label}
            </Field.Label>
          ) : null}
        </div>
        {description ? (
          <Field.Description className="pl-6 text-xs text-muted">
            {description}
          </Field.Description>
        ) : null}
      </Field.Root>
    );
  },
);
Checkbox.displayName = "Checkbox";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 6.5 5 9l4.5-5.5" />
    </svg>
  );
}
