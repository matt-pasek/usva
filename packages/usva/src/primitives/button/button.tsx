"use client";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

export const buttonVariants = cva(
  cn(
    "relative isolate inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium tracking-[-0.01em] outline-none",
    "transition-[color,background-color,box-shadow,border-color,scale,filter] duration-150 ease-soft",
    "active:scale-[0.96] motion-reduce:transition-none motion-reduce:transform-none",
    "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-transparent before:transition-colors before:duration-150",
    "focus-visible:ring-focus",
    "disabled:pointer-events-none disabled:opacity-50 disabled:saturate-[0.7]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ),
  {
    variants: {
      variant: {
        solid:
          "bg-accent bg-gradient-accent font-semibold text-on-accent shadow-raised hover:glow-ring hover:before:bg-ink/10 active:before:bg-ink/5",
        soft: "bg-surface-2 text-ink shadow-raised hover:before:bg-ink/5",
        ghost: "bg-transparent text-muted hover:text-ink hover:before:bg-ink/5",
        outline:
          "border border-border bg-transparent text-ink hover:border-border-strong hover:before:bg-ink/5 focus-visible:border-transparent",
      },
      size: {
        sm: "h-8 gap-1.5 rounded-md px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 rounded-xl px-6 text-[0.9375rem]",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

function Slot({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  if (!React.isValidElement<React.HTMLAttributes<HTMLElement>>(children))
    return null;
  const childProps = children.props;
  return React.cloneElement(children, {
    ...props,
    ...childProps,
    className: cn(className, childProps.className),
  });
}
