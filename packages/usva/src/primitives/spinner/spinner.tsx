import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

export const spinnerVariants = cva(
  cn(
    "inline-block shrink-0 rounded-full border-border border-t-accent",
    "animate-spin motion-reduce:animate-none",
    "[filter:drop-shadow(var(--usva-glow-accent))]",
  ),
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-[1.5px]",
        md: "h-6 w-6 border-[1.5px]",
        lg: "h-8 w-8 border-2",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, label = "Loading", ...props }, ref) => (
    <span
      ref={ref}
      role="status"
      className={cn("inline-flex", className)}
      {...props}
    >
      <span className={spinnerVariants({ size })} />
      <span className="sr-only">{label}</span>
    </span>
  ),
);
Spinner.displayName = "Spinner";

export interface PageLoaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label?: string;
  size?: VariantProps<typeof spinnerVariants>["size"];
}

export const PageLoader = React.forwardRef<HTMLDivElement, PageLoaderProps>(
  ({ className, label, size = "lg", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[12rem] w-full flex-col items-center justify-center gap-3",
        className,
      )}
      {...props}
    >
      <Spinner size={size} label={label ?? "Loading"} />
      {label ? (
        <p
          aria-hidden="true"
          className="animate-reveal font-mono text-xs lowercase tracking-wide text-muted"
        >
          {label}
        </p>
      ) : null}
    </div>
  ),
);
PageLoader.displayName = "PageLoader";
