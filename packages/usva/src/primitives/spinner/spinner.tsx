import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

export type SpinnerVariant = "ring" | "dots" | "bars" | "orbit";
export type SpinnerSize = "sm" | "md" | "lg";

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

const box: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const dot: Record<SpinnerSize, string> = {
  sm: "size-1",
  md: "size-1.5",
  lg: "size-2",
};

const glow = "[filter:drop-shadow(var(--usva-glow-accent))]";

function Ring({ size }: { size: SpinnerSize }) {
  return <span className={spinnerVariants({ size })} />;
}

function Dots({ size }: { size: SpinnerSize }) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        size === "lg" ? "gap-2" : "gap-1",
      )}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 160}ms` }}
          className={cn(
            "rounded-full bg-accent animate-loader-pulse motion-reduce:animate-none",
            dot[size],
            glow,
          )}
        />
      ))}
    </span>
  );
}

function Bars({ size }: { size: SpinnerSize }) {
  const width = size === "sm" ? "w-0.5" : size === "lg" ? "w-1" : "w-[3px]";
  return (
    <span
      className={cn(
        "inline-flex items-center",
        box[size],
        size === "sm" ? "gap-0.5" : "gap-1",
      )}
    >
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 130}ms` }}
          className={cn(
            "h-full origin-center rounded-full bg-accent animate-loader-bar motion-reduce:animate-none",
            width,
          )}
        />
      ))}
    </span>
  );
}

function Orbit({ size }: { size: SpinnerSize }) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 animate-spin motion-reduce:animate-none",
        box[size],
      )}
    >
      <span className="absolute inset-0 rounded-full border border-border/60" />
      <span
        className={cn(
          "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent",
          dot[size],
          "[filter:drop-shadow(var(--usva-glow-accent-strong))]",
        )}
      />
    </span>
  );
}

const RENDERERS: Record<
  SpinnerVariant,
  (p: { size: SpinnerSize }) => React.ReactElement
> = {
  ring: Ring,
  dots: Dots,
  bars: Bars,
  orbit: Orbit,
};

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    { className, size = "md", variant = "ring", label = "Loading", ...props },
    ref,
  ) => {
    const Impl = RENDERERS[variant];
    return (
      <span
        ref={ref}
        role="status"
        className={cn("inline-flex", className)}
        {...props}
      >
        <Impl size={size} />
        <span className="sr-only">{label}</span>
      </span>
    );
  },
);
Spinner.displayName = "Spinner";

export interface PageLoaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label?: string;
  size?: SpinnerSize;
  variant?: SpinnerVariant;
}

export const PageLoader = React.forwardRef<HTMLDivElement, PageLoaderProps>(
  ({ className, label, size = "lg", variant = "ring", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[12rem] w-full flex-col items-center justify-center gap-3",
        className,
      )}
      {...props}
    >
      <Spinner size={size} variant={variant} label={label ?? "Loading"} />
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
