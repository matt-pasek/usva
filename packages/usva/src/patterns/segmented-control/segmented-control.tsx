"use client";
import * as React from "react";
import { cn } from "../../cn.js";

export interface SegmentedControlItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  items: SegmentedControlItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md";
}

const sizeClasses: Record<
  NonNullable<SegmentedControlProps["size"]>,
  string
> = {
  sm: "h-8 px-3",
  md: "h-9 px-4",
};

export const SegmentedControl = React.forwardRef<
  HTMLDivElement,
  SegmentedControlProps
>(
  (
    {
      items,
      value,
      defaultValue,
      onValueChange,
      size = "md",
      className,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(
      () => defaultValue ?? items[0]?.value,
    );
    const current = isControlled ? value : uncontrolled;

    const segmentRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
    const [indicator, setIndicator] = React.useState({
      left: 0,
      width: 0,
      ready: false,
    });

    const activeIndex = Math.max(
      0,
      items.findIndex((item) => item.value === current),
    );

    const measure = React.useCallback(() => {
      const el = segmentRefs.current[activeIndex];
      if (!el) return;
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
    }, [activeIndex]);

    React.useLayoutEffect(() => {
      measure();
    }, [measure]);

    React.useEffect(() => {
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(() => measure());
      for (const el of segmentRefs.current) {
        if (el) observer.observe(el);
      }
      return () => observer.disconnect();
    }, [measure]);

    const select = React.useCallback(
      (next: string) => {
        if (!isControlled) setUncontrolled(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const focusIndex = (index: number) => {
      const clamped = (index + items.length) % items.length;
      const target = items[clamped];
      if (!target) return;
      segmentRefs.current[clamped]?.focus();
      select(target.value);
    };

    const onKeyDown = (event: React.KeyboardEvent, index: number) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          focusIndex(index + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          focusIndex(index - 1);
          break;
        case "Home":
          event.preventDefault();
          focusIndex(0);
          break;
        case "End":
          event.preventDefault();
          focusIndex(items.length - 1);
          break;
        default:
          break;
      }
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={cn(
          "relative inline-flex items-center rounded-full border border-border bg-surface p-1",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-surface-2 shadow-raised",
            "[filter:drop-shadow(var(--usva-glow-accent))]",
            "transition-[transform,width] duration-300 ease-spring motion-reduce:transition-none",
            !indicator.ready && "opacity-0",
          )}
          style={{
            width: indicator.width,
            transform: `translateX(${indicator.left}px)`,
          }}
        />
        {items.map((item, index) => {
          const checked = item.value === current;
          return (
            // biome-ignore lint/a11y/useSemanticElements: segmented control needs a button with a roving tabindex and a custom indicator; a native radio input can't render this pattern
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              ref={(node) => {
                segmentRefs.current[index] = node;
              }}
              onClick={() => select(item.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full text-sm whitespace-nowrap outline-none",
                sizeClasses[size],
                "text-muted transition-colors duration-150 ease-soft",
                "hover:text-ink aria-checked:text-ink",
                "focus-visible:ring-focus",
              )}
            >
              {item.icon ? (
                <span className="inline-flex shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
              ) : null}
              {item.label}
            </button>
          );
        })}
      </div>
    );
  },
);
SegmentedControl.displayName = "SegmentedControl";
