"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../cn.js";
import { Spinner } from "../spinner/spinner.js";

export type ButtonStatus = "idle" | "loading" | "success" | "error";

export const buttonVariants = cva(
  cn(
    "relative isolate inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium tracking-[-0.01em] outline-none",
    "transition-control duration-fast ease-soft",
    "active:scale-[0.96] motion-reduce:transition-none motion-reduce:transform-none",
    "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-transparent before:transition-tint before:duration-fast",
    "after:absolute after:inset-x-0 after:content-['']",
    "focus-visible:ring-focus",
    "disabled:pointer-events-none disabled:opacity-50 disabled:saturate-[0.7]",
    "data-[status=loading]:pointer-events-none",
    "data-[status=success]:bg-none data-[status=success]:bg-success data-[status=success]:text-on-accent",
    "data-[status=error]:bg-none data-[status=error]:bg-danger data-[status=error]:text-on-accent",
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
        sm: "h-8 gap-1.5 rounded-md px-3 text-xs after:-inset-y-1.5",
        md: "h-10 px-4 text-sm after:-inset-y-0.5",
        lg: "h-12 rounded-xl px-6 text-[0.9375rem] after:inset-y-0",
      },
    },
    defaultVariants: { variant: "solid", size: "md" },
  },
);

const SPINNER_SIZE = { sm: "sm", md: "sm", lg: "md" } as const;

type MotionConflicts =
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onDrag"
  | "onDragStart"
  | "onDragEnd";

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, MotionConflicts>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  status?: ButtonStatus;
  loadingText?: React.ReactNode;
  successText?: React.ReactNode;
  errorText?: React.ReactNode;
  /** How long `success` / `error` hold before the button settles back to idle. */
  settleDelay?: number;
  onSettle?: () => void;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = "md",
      asChild,
      status = "idle",
      loadingText = "Loading",
      successText,
      errorText,
      settleDelay = 1200,
      onSettle,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const reduce = useReducedMotion();
    const display = useSettlingStatus(status, settleDelay, onSettle);
    const busy = display === "loading";

    if (asChild)
      return (
        <Slot className={cn(buttonVariants({ variant, size }), className)}>
          {children}
        </Slot>
      );

    const content: Record<ButtonStatus, React.ReactNode> = {
      idle: children,
      loading: (
        <>
          <Spinner
            aria-hidden="true"
            label=""
            tone="current"
            size={SPINNER_SIZE[size ?? "md"]}
          />
          {loadingText}
        </>
      ),
      success: (
        <>
          <CheckIcon />
          {successText}
        </>
      ),
      error: (
        <>
          <AlertIcon />
          {errorText}
        </>
      ),
    };

    return (
      <motion.button
        ref={ref}
        layout={!reduce}
        data-status={display}
        aria-busy={busy || undefined}
        whileTap={reduce ? undefined : { scale: 0.96 }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 420, damping: 34 }
        }
        onClick={busy ? undefined : onClick}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={display}
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 500, damping: 40 }
            }
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            {content[display]}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    );
  },
);
Button.displayName = "Button";

/**
 * `success` and `error` are momentary: they hold for `settleDelay`, then the button
 * returns to idle on its own. The callback lives in a ref so an inline `onSettle`
 * doesn't restart the timer on every render.
 */
function useSettlingStatus(
  status: ButtonStatus,
  settleDelay: number,
  onSettle?: () => void,
): ButtonStatus {
  const [display, setDisplay] = React.useState<ButtonStatus>(status);
  const settle = React.useRef(onSettle);

  React.useEffect(() => {
    settle.current = onSettle;
  }, [onSettle]);

  React.useEffect(() => {
    setDisplay(status);
    if (status !== "success" && status !== "error") return;
    const timer = setTimeout(() => {
      setDisplay("idle");
      settle.current?.();
    }, settleDelay);
    return () => clearTimeout(timer);
  }, [status, settleDelay]);

  return display;
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
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M2.5 6.5 5 9l4.5-5.5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M6 3v3.5" />
      <path d="M6 8.75h.01" />
    </svg>
  );
}

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
