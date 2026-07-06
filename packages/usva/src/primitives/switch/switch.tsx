"use client";
import { Field } from "@base-ui/react/field";
import { Switch as Base } from "@base-ui/react/switch";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

const trackVariants = cva(
  "relative inline-flex shrink-0 items-center rounded-full border border-border bg-surface-2 outline-none transition-control duration-base ease-soft before:absolute before:content-[''] data-[unchecked]:hover:border-border-strong data-[checked]:border-accent data-[checked]:bg-accent data-[checked]:bg-gradient-accent data-[checked]:glow-ring focus-visible:border-transparent focus-visible:ring-focus aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-5 w-9 before:-inset-y-3 before:-inset-x-1",
        md: "h-6 w-11 before:-inset-y-2.5 before:inset-x-0",
      },
    },
    defaultVariants: { size: "md" },
  },
);

const thumbVariants = cva(
  "block rounded-full bg-ink shadow-raised transition-layout duration-base ease-spring motion-reduce:transition-none motion-reduce:transform-none data-[checked]:bg-on-accent",
  {
    variants: {
      size: {
        sm: "h-4 w-4 translate-x-0.5 data-[checked]:translate-x-4",
        md: "h-5 w-5 translate-x-0.5 data-[checked]:translate-x-5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface SwitchProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Base.Root>,
      "render" | "className"
    >,
    VariantProps<typeof trackVariants> {
  className?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, size, label, description, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const switchId = id ?? generatedId;

    return (
      <Field.Root className="flex flex-col gap-1" disabled={disabled}>
        <div className="flex items-center gap-2">
          <Base.Root
            ref={ref}
            id={switchId}
            disabled={disabled}
            className={cn(trackVariants({ size }), className)}
            {...props}
          >
            <Base.Thumb className={thumbVariants({ size })} />
          </Base.Root>
          {label ? (
            <Field.Label
              htmlFor={switchId}
              className="text-sm text-ink select-none"
            >
              {label}
            </Field.Label>
          ) : null}
        </div>
        {description ? (
          <Field.Description className="pl-2 text-xs text-muted">
            {description}
          </Field.Description>
        ) : null}
      </Field.Root>
    );
  },
);
Switch.displayName = "Switch";
