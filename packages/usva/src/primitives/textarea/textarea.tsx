"use client";
import * as React from "react";
import { cn } from "../../cn.js";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

/** Computed styles come back empty for anything unset, and `normal` is not a number. */
const px = (value: string): number => Number.parseFloat(value) || 0;

/** React 18 types name this event FormEvent and React 19 types name it InputEvent. */
type InputHandler = NonNullable<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>["onInput"]
>;

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Grow with the content instead of scrolling, bounded by minRows and maxRows. */
  autoGrow?: boolean;
  /** Shortest the field ever gets. Also seeds the `rows` attribute under autoGrow. */
  minRows?: number;
  /** Tallest the field gets before it starts scrolling. Unbounded when unset. */
  maxRows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, autoGrow = false, minRows = 2, maxRows, rows, ...props },
    ref,
  ) => {
    const inner = React.useRef<HTMLTextAreaElement | null>(null);

    const attach = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        inner.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const measure = React.useCallback(() => {
      const el = inner.current;
      if (!el || !autoGrow) return;

      const styles = window.getComputedStyle(el);
      const lineHeight =
        px(styles.lineHeight) || px(styles.fontSize) * 1.5 || 20;
      const borders = px(styles.borderTopWidth) + px(styles.borderBottomWidth);
      const chrome = px(styles.paddingTop) + px(styles.paddingBottom) + borders;

      const min = lineHeight * minRows + chrome;
      const max = maxRows
        ? lineHeight * maxRows + chrome
        : Number.POSITIVE_INFINITY;

      el.style.height = "auto";
      const natural = el.scrollHeight + borders;
      el.style.height = `${Math.min(Math.max(natural, min), max)}px`;
      el.style.overflowY = natural > max ? "auto" : "hidden";
    }, [autoGrow, minRows, maxRows]);

    useIsomorphicLayoutEffect(measure, [measure, props.value]);

    const handleInput: InputHandler = (event) => {
      props.onInput?.(event);
      measure();
    };

    return (
      <textarea
        ref={attach}
        rows={rows ?? (autoGrow ? minRows : undefined)}
        className={cn(
          "w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted",
          "outline-none transition-control duration-base ease-soft",
          "hover:border-border-strong",
          "focus-visible:border-transparent focus-visible:ring-focus",
          "aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/40",
          "disabled:cursor-not-allowed disabled:opacity-50",
          autoGrow ? "resize-none" : "resize-y",
          className,
        )}
        {...props}
        onInput={autoGrow ? handleInput : props.onInput}
      />
    );
  },
);
Textarea.displayName = "Textarea";
