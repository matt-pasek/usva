import { cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

export type SpinnerVariant = "ring" | "dots" | "bars" | "orbit";
export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerTone = "accent" | "current";

export const spinnerVariants = cva(
  cn(
    "inline-block shrink-0 rounded-full",
    "animate-spin motion-reduce:animate-none",
  ),
  {
    variants: {
      size: {
        sm: "h-4 w-4 border-[1.5px]",
        md: "h-6 w-6 border-[1.5px]",
        lg: "h-8 w-8 border-2",
      },
      tone: {
        accent:
          "border-border border-t-accent [filter:drop-shadow(var(--usva-glow-accent))]",
        current: "border-current/25 border-t-current",
      },
    },
    defaultVariants: { size: "md", tone: "accent" },
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

/** `current` inherits the parent's text colour, so it stays legible on a filled surface. */
const fill: Record<SpinnerTone, string> = {
  accent: "bg-accent",
  current: "bg-current",
};

const glow: Record<SpinnerTone, string> = {
  accent: "[filter:drop-shadow(var(--usva-glow-accent))]",
  current: "",
};

const strongGlow: Record<SpinnerTone, string> = {
  accent: "[filter:drop-shadow(var(--usva-glow-accent-strong))]",
  current: "",
};

const track: Record<SpinnerTone, string> = {
  accent: "border-border/60",
  current: "border-current/20",
};

interface RendererProps {
  size: SpinnerSize;
  tone: SpinnerTone;
}

function Ring({ size, tone }: RendererProps) {
  return <span className={spinnerVariants({ size, tone })} />;
}

function Dots({ size, tone }: RendererProps) {
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
            "rounded-full animate-loader-pulse motion-reduce:animate-none",
            fill[tone],
            dot[size],
            glow[tone],
          )}
        />
      ))}
    </span>
  );
}

function Bars({ size, tone }: RendererProps) {
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
            "h-full origin-center rounded-full animate-loader-bar motion-reduce:animate-none",
            fill[tone],
            width,
          )}
        />
      ))}
    </span>
  );
}

function Orbit({ size, tone }: RendererProps) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 animate-spin motion-reduce:animate-none",
        box[size],
      )}
    >
      <span
        className={cn("absolute inset-0 rounded-full border", track[tone])}
      />
      <span
        className={cn(
          "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full",
          fill[tone],
          dot[size],
          strongGlow[tone],
        )}
      />
    </span>
  );
}

const RENDERERS: Record<
  SpinnerVariant,
  (p: RendererProps) => React.ReactElement
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
  tone?: SpinnerTone;
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  (
    {
      className,
      size = "md",
      variant = "ring",
      tone = "accent",
      label = "Loading",
      ...props
    },
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
        <Impl size={size} tone={tone} />
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
  tone?: SpinnerTone;
}

export const PageLoader = React.forwardRef<HTMLDivElement, PageLoaderProps>(
  (
    {
      className,
      label,
      size = "lg",
      variant = "ring",
      tone = "accent",
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex min-h-[12rem] w-full flex-col items-center justify-center gap-3",
        className,
      )}
      {...props}
    >
      <Spinner
        size={size}
        variant={variant}
        tone={tone}
        label={label ?? "Loading"}
      />
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
