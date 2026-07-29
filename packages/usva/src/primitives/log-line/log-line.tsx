import * as React from "react";
import { cn } from "../../cn.js";

/**
 * Log levels, not semantic roles. Callers think in `warn`; the tokens they
 * resolve to are `warning`, `danger`, `info`, `success`.
 */
export type LogLevel = "error" | "warn" | "info" | "debug" | "success";

const railTone: Record<LogLevel, string> = {
  error: "text-danger",
  warn: "text-warning",
  info: "text-info",
  debug: "text-border-strong",
  success: "text-success",
};

const levelTone: Record<LogLevel, string> = {
  error: "text-danger",
  warn: "text-warning",
  info: "text-info",
  debug: "text-muted",
  success: "text-success",
};

const countTone: Record<LogLevel, string> = {
  error: "border-danger/25 bg-danger/12 text-danger",
  warn: "border-warning/25 bg-warning/12 text-warning",
  info: "border-info/25 bg-info/12 text-info",
  debug: "border-border bg-surface-2 text-muted",
  success: "border-success/25 bg-success/12 text-success",
};

export interface LogLineProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  level: LogLevel;
  /** Endpoint, module, or subsystem the line came from. */
  source?: React.ReactNode;
  /** Repeat collapsing. Values at or below 1 render no chip. */
  count?: number;
  /**
   * Stack trace or payload. Its presence swaps the row element from `div` to
   * `details`, which remounts the row. Treat it as static per log entry.
   */
  details?: React.ReactNode;
  timestamp?: React.ReactNode;
  children: React.ReactNode;
}

export const LogLine = React.forwardRef<HTMLElement, LogLineProps>(
  (
    { className, level, source, count, details, timestamp, children, ...props },
    ref,
  ) => {
    const row = (
      <>
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 left-0 w-[3px] bg-current",
            "shadow-[0_0_12px_-2px_currentColor]",
            railTone[level],
          )}
        />
        {timestamp != null && (
          <span className="shrink-0 text-[0.6875rem] tabular-nums text-muted">
            {timestamp}
          </span>
        )}
        <span
          className={cn(
            "shrink-0 text-[0.625rem] font-semibold uppercase leading-none tracking-[0.1em]",
            levelTone[level],
          )}
        >
          {level}
        </span>
        {source != null && (
          <span className="shrink-0 whitespace-nowrap text-muted">
            {source}
            <span aria-hidden="true" className="text-faint">
              {" ·"}
            </span>
          </span>
        )}
        <span className="min-w-0 flex-1 text-ink">{children}</span>
        {count != null && count > 1 && (
          <span
            data-log-count=""
            className={cn(
              "shrink-0 rounded-full border px-1.5 text-[0.625rem] leading-tight tabular-nums",
              countTone[level],
            )}
          >
            <span aria-hidden="true">{"×"}</span>
            <span className="sr-only">repeated </span>
            {count}
            <span className="sr-only"> times</span>
          </span>
        )}
      </>
    );

    const shell = cn(
      "relative flex items-baseline gap-3 py-2 pl-4 pr-3",
      "font-mono text-xs leading-relaxed",
      "transition-tint hover:bg-surface-2 motion-reduce:transition-none",
      className,
    );

    if (details == null)
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={shell}
          {...props}
        >
          {row}
        </div>
      );

    return (
      <details ref={ref as React.Ref<HTMLDetailsElement>} {...props}>
        <summary
          className={cn(
            shell,
            "cursor-pointer list-none [&::-webkit-details-marker]:hidden",
          )}
        >
          {row}
        </summary>
        <div
          // A scrolling region has to be reachable by keyboard (WCAG 2.1.1), which
          // is the documented exception to this rule.
          // biome-ignore lint/a11y/noNoninteractiveTabindex: see above
          tabIndex={0}
          className="ml-4 overflow-x-auto whitespace-pre border-l-2 border-border-strong py-2 pl-3 font-mono text-[0.6875rem] text-muted outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
        >
          {details}
        </div>
      </details>
    );
  },
);
LogLine.displayName = "LogLine";

export type LogListProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Surface, border, and hairline dividers for a stack of LogLines. Announced as
 * a polite log region, so appended lines reach a screen reader without stealing
 * focus.
 */
export const LogList = React.forwardRef<HTMLDivElement, LogListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="log"
      aria-live="polite"
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-surface",
        "divide-y divide-border",
        className,
      )}
      {...props}
    />
  ),
);
LogList.displayName = "LogList";

export interface InlineErrorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  error: Error | string;
  source?: React.ReactNode;
}

/**
 * A single error LogLine in its own bordered surface, for sitting beside a
 * panel that failed to load. Announced as an alert, unlike LogList's polite
 * region: a failed fetch is worth interrupting for.
 */
export const InlineError = React.forwardRef<HTMLDivElement, InlineErrorProps>(
  ({ className, error, source, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "overflow-hidden rounded-lg border border-danger/25 bg-surface",
        className,
      )}
      {...props}
    >
      <LogLine level="error" source={source}>
        {typeof error === "string" ? error : error.message}
      </LogLine>
    </div>
  ),
);
InlineError.displayName = "InlineError";
