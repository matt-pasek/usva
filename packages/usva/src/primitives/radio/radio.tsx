"use client";
import { Field } from "@base-ui/react/field";
import { Radio as Base } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

export interface RadioGroupProps<Value = string>
  extends Omit<BaseRadioGroup.Props<Value>, "className"> {
  className?: string;
  orientation?: "horizontal" | "vertical";
  children?: React.ReactNode;
}

function RadioGroupImpl<Value = string>(
  { className, orientation = "vertical", ...props }: RadioGroupProps<Value>,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <BaseRadioGroup
      ref={ref}
      aria-orientation={orientation}
      className={cn(
        "flex gap-3",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className,
      )}
      {...props}
    />
  );
}

export const RadioGroup = React.forwardRef(RadioGroupImpl) as <Value = string>(
  props: RadioGroupProps<Value> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;
(RadioGroup as { displayName?: string }).displayName = "RadioGroup";

const rootVariants = cva(
  "relative flex shrink-0 items-center justify-center rounded-full border border-border bg-surface outline-none transition-[color,background-color,border-color,box-shadow,scale] duration-200 ease-soft before:absolute before:-inset-2.5 before:content-[''] data-[unchecked]:hover:border-border-strong data-[checked]:border-accent data-[checked]:glow-ring active:scale-[0.98] motion-reduce:transition-none motion-reduce:transform-none focus-visible:border-transparent focus-visible:ring-focus aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-50",
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

const indicatorVariants = cva("rounded-full bg-accent bg-gradient-accent", {
  variants: {
    size: {
      sm: "h-2 w-2",
      md: "h-2.5 w-2.5",
    },
  },
  defaultVariants: { size: "md" },
});

export interface RadioProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Base.Root>,
      "render" | "className"
    >,
    VariantProps<typeof rootVariants> {
  className?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLButtonElement, RadioProps>(
  ({ className, size, label, description, id, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const radioId = id ?? generatedId;

    return (
      <Field.Root className="flex flex-col gap-1" disabled={disabled}>
        <div className="flex items-center gap-2">
          <Base.Root
            ref={ref}
            id={radioId}
            disabled={disabled}
            className={cn(rootVariants({ size }), className)}
            {...props}
          >
            <Base.Indicator
              keepMounted
              className={cn(
                "flex items-center justify-center transition-[scale] duration-200 ease-spring motion-reduce:transition-none motion-reduce:transform-none data-[unchecked]:scale-0 data-[checked]:scale-100",
              )}
            >
              <span className={indicatorVariants({ size })} />
            </Base.Indicator>
          </Base.Root>
          {label ? (
            <Field.Label
              htmlFor={radioId}
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
Radio.displayName = "Radio";
