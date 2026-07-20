"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../cn.js";
import { Spinner } from "../spinner/spinner.js";

export type ButtonStatus = "idle" | "loading" | "success" | "error";

export const buttonVariants = cva(
  cn(
    "relative isolate inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium tracking-[-0.01em] outline-none",
    "transition-control duration-fast ease-soft",
    "hover:-translate-y-px active:scale-[0.96] motion-reduce:transition-none motion-reduce:transform-none",
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
        onSurface:
          "border border-ink/10 bg-ink/[0.055] font-semibold text-ink hover:border-ink/20 hover:before:bg-ink/5",
        glass:
          "border border-white/15 bg-black/40 text-white/90 shadow-raised backdrop-blur-sm hover:bg-black/55 hover:before:bg-white/5",
      },
      size: {
        sm: "h-8 gap-1.5 rounded-md px-3 text-xs after:-inset-y-1.5",
        md: "h-10 px-4 text-sm after:-inset-y-0.5",
        lg: "h-12 rounded-xl px-6 text-[0.9375rem] after:inset-y-0",
      },
      iconOnly: { true: "px-0", false: "" },
      active: { true: "glow-ring text-accent", false: "" },
      shape: { rounded: "", pill: "" },
    },
    compoundVariants: [
      // the `after` inset expands the hit area to 44px without growing the box,
      // so it has to scale inversely with the visual size
      {
        iconOnly: true,
        size: "sm",
        class: "w-8 rounded-lg after:-inset-1.5 [&_svg]:size-4",
      },
      {
        iconOnly: true,
        size: "md",
        class: "w-10 rounded-xl after:-inset-0.5 [&_svg]:size-[1.15rem]",
      },
      { iconOnly: true, size: "lg", class: "w-12 [&_svg]:size-5" },
      // icon-only outline keeps the quiet reading the old IconButton had
      {
        iconOnly: true,
        variant: "outline",
        active: false,
        class: "bg-surface text-muted hover:text-ink",
      },
      { active: true, variant: "outline", class: "border-transparent" },
      { shape: "pill", class: "rounded-full" },
    ],
    defaultVariants: {
      variant: "solid",
      size: "md",
      iconOnly: false,
      active: false,
      shape: "rounded",
    },
  },
);

const TOOLTIP_SIDE: Record<string, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
  left: "right-full top-1/2 mr-2 -translate-y-1/2",
  right: "left-full top-1/2 ml-2 -translate-y-1/2",
};

const SPINNER_SIZE = { sm: "sm", md: "sm", lg: "md" } as const;

const GRID_STYLE: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
};
const CELL_STYLE: React.CSSProperties = { gridArea: "1 / 1" };
const SIZER_STYLE: React.CSSProperties = {
  ...CELL_STYLE,
  visibility: "hidden",
};

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
  /** Optional visible tooltip on hover/focus. */
  tooltip?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = "md",
      iconOnly = false,
      active = false,
      shape,
      asChild,
      status = "idle",
      loadingText,
      successText,
      errorText,
      settleDelay = 1200,
      onSettle,
      tooltip,
      side = "top",
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const reduce = useReducedMotion();
    const display = useSettlingStatus(status, settleDelay, onSettle);
    const tooltipId = React.useId();
    const busy = display === "loading";

    if (
      process.env.NODE_ENV !== "production" &&
      iconOnly &&
      !props["aria-label"] &&
      !props["aria-labelledby"]
    ) {
      throw new Error("usva: an icon-only Button needs an aria-label.");
    }

    if (asChild)
      return (
        <Slot
          className={cn(
            buttonVariants({ variant, size, iconOnly, active, shape }),
            className,
          )}
        >
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
          {loadingText ?? (iconOnly ? null : "Loading")}
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

    // The lift is declared twice on purpose. Motion writes an inline transform on the
    // first press and never gives it back, which outranks the `hover:-translate-y-px`
    // class from here on. That class is what the motion-free `asChild` path uses.
    const button = (
      <motion.button
        ref={ref}
        data-status={display}
        aria-busy={busy || undefined}
        aria-describedby={tooltip ? tooltipId : undefined}
        whileHover={reduce ? undefined : { y: -1 }}
        whileTap={reduce ? undefined : { scale: 0.96, y: 0 }}
        transition={
          reduce
            ? { duration: 0 }
            : { type: "spring", stiffness: 420, damping: 34 }
        }
        onClick={busy ? undefined : onClick}
        className={cn(
          buttonVariants({ variant, size, iconOnly, active, shape }),
          className,
        )}
        {...props}
      >
        {/* Every state is stacked in one grid cell so the button reserves the widest
            state's width up front and never reshapes between them. Only the active
            label is shown; the rest are hidden sizers. Grid placement is inline-styled,
            not Tailwind, so a consumer's build can never tree-shake the layout away. */}
        <span style={GRID_STYLE}>
          {(Object.keys(content) as ButtonStatus[]).map((s) => (
            <span
              key={s}
              aria-hidden
              style={SIZER_STYLE}
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              {content[s]}
            </span>
          ))}
          <motion.span
            key={display}
            style={CELL_STYLE}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
            }
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            {content[display]}
          </motion.span>
        </span>
      </motion.button>
    );

    if (!tooltip) return button;
    return (
      <span className="group relative isolate inline-flex">
        {button}
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            "pointer-events-none absolute z-overlay whitespace-nowrap rounded-md border border-border bg-overlay px-2 py-1 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-ink shadow-floating",
            "opacity-0 transition-opacity duration-fast ease-soft group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none",
            TOOLTIP_SIDE[side],
          )}
        >
          {tooltip}
        </span>
      </span>
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
