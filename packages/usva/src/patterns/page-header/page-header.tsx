"use client";
import * as React from "react";
import { cn } from "../../cn.js";

export type PageHeaderSize = "default" | "compact";
export type PageHeaderHeadingLevel = "h1" | "h2" | "h3";

export interface PageHeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Mono line above the title. A status word, a breadcrumb, a period label. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  /** Second phrase of the title, carrying the accent color. */
  titleAccent?: React.ReactNode;
  /** Categorical: any CSS color. Falls back to the accent token. */
  accentColor?: string;
  headingLevel?: PageHeaderHeadingLevel;
  /** Line under the title. Dates, counts, a status dot. */
  meta?: React.ReactNode;
  /** The right-hand column. A PageHeaderMetric, a row of stat panels, or a chart. */
  aside?: React.ReactNode;
  /** Control pinned to the top right. An icon-only Button toggling `controlsOpen`. */
  action?: React.ReactNode;
  /** Revealed under the copy column while `controlsOpen`. Pass ToggleChipGroups. */
  controls?: React.ReactNode;
  controlsOpen?: boolean;
  /** Spans both columns. A Progress, a ProgressRow, a segmented bar. */
  progress?: React.ReactNode;
  /** Small print along the bottom edge. */
  footer?: React.ReactNode;
  /** Painted behind everything, under a scrim. Any color, gradient or canvas. */
  background?: React.ReactNode;
  size?: PageHeaderSize;
  /** Stat row under the meta line. Pass PageHeaderStats. */
  children?: React.ReactNode;
}

const titleSizes: Record<PageHeaderSize, string> = {
  // Sized against the header, not the viewport, so it survives a narrow column.
  default: "text-[clamp(2rem,5.5cqi,3.5rem)]",
  compact: "text-[clamp(1.375rem,3cqi,1.875rem)]",
};

const padding: Record<PageHeaderSize, string> = {
  default: "px-6 py-8 @3xl:px-10 @3xl:py-10",
  compact: "px-6 py-6 @3xl:px-7",
};

export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(
  (
    {
      className,
      eyebrow,
      title,
      titleAccent,
      accentColor,
      headingLevel: Heading = "h1",
      meta,
      aside,
      action,
      controls,
      controlsOpen = false,
      progress,
      footer,
      background,
      size = "default",
      children,
      ...props
    },
    ref,
  ) => (
    <section
      ref={ref}
      data-page-header-size={size}
      className={cn(
        "@container relative isolate overflow-hidden rounded-2xl border border-border bg-surface",
        className,
      )}
      {...props}
    >
      {background != null && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          {background}
          <div
            data-page-header-scrim=""
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(100deg, color-mix(in oklab, var(--color-surface) 92%, transparent), color-mix(in oklab, var(--color-surface) 55%, transparent) 55%, color-mix(in oklab, var(--color-surface) 88%, transparent))",
            }}
          />
        </div>
      )}

      <div className={cn("relative flex flex-col gap-6", padding[size])}>
        <div
          className={cn(
            "flex flex-col gap-6 @2xl:flex-row @2xl:justify-between",
            size === "compact" ? "@2xl:items-center" : "@2xl:items-start",
            action != null && "pr-12",
          )}
        >
          <div className="flex min-w-0 flex-col gap-3">
            {eyebrow != null && (
              <p className="flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted">
                {eyebrow}
              </p>
            )}

            <Heading
              className={cn(
                "font-bold leading-[1.02] text-balance text-ink",
                titleSizes[size],
              )}
            >
              {title}
              {titleAccent != null && (
                <>
                  {" "}
                  <span style={{ color: accentColor ?? "var(--color-accent)" }}>
                    {titleAccent}
                  </span>
                </>
              )}
            </Heading>

            {meta != null && (
              <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
                {meta}
              </p>
            )}

            {children != null && <div className="mt-2">{children}</div>}

            {controls != null && (
              <PageHeaderControls open={controlsOpen}>
                {controls}
              </PageHeaderControls>
            )}
          </div>

          {aside != null && (
            <div className="shrink-0 @2xl:text-right">{aside}</div>
          )}
        </div>

        {progress != null && <div>{progress}</div>}

        {footer != null && (
          <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
            {footer}
          </p>
        )}
      </div>

      {action != null && (
        <div className="absolute right-4 top-4 z-10">{action}</div>
      )}
    </section>
  ),
);
PageHeader.displayName = "PageHeader";

function PageHeaderControls({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  // A closed region still has focusable chips in it, and `hidden` would kill the
  // height transition, so it goes inert instead. React 18 and 19 disagree on how
  // an `inert` prop serializes, and one of them warns either way. Setting the
  // attribute on the node sidesteps the disagreement.
  const ref = React.useRef<HTMLDivElement>(null);
  const useIsomorphicLayoutEffect =
    typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
  useIsomorphicLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open) node.removeAttribute("inert");
    else node.setAttribute("inert", "");
  }, [open]);

  return (
    <div
      ref={ref}
      data-page-header-controls=""
      data-open={open ? "" : undefined}
      className={cn(
        "-mx-1 grid px-1 transition-[grid-template-rows,opacity] duration-base ease-soft motion-reduce:transition-none",
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      )}
    >
      <div className="overflow-hidden">
        <div className="flex flex-col gap-2 pt-3">{children}</div>
      </div>
    </div>
  );
}

export type PageHeaderStatsProps = React.HTMLAttributes<HTMLDListElement>;

export const PageHeaderStats = React.forwardRef<
  HTMLDListElement,
  PageHeaderStatsProps
>(({ className, children, ...props }, ref) => (
  <dl
    ref={ref}
    className={cn("flex w-fit flex-wrap items-stretch gap-2", className)}
    {...props}
  >
    {children}
  </dl>
));
PageHeaderStats.displayName = "PageHeaderStats";

export type PageHeaderStatTone = "default" | "accent" | "warning" | "danger";
export type PageHeaderStatVariant = "plain" | "featured" | "panel";

export interface PageHeaderStatProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Caption under the value. */
  sub?: React.ReactNode;
  tone?: PageHeaderStatTone;
  /**
   * `plain` sits on the header itself, `featured` is the tinted first tile,
   * `panel` is a standalone card for the aside column.
   */
  variant?: PageHeaderStatVariant;
}

const statValueTones: Record<PageHeaderStatTone, string> = {
  default: "text-ink",
  accent: "text-accent",
  warning: "text-warning",
  danger: "text-danger",
};

const statFills: Record<PageHeaderStatTone, string> = {
  default: "bg-ink/[0.05] ring-1 ring-inset ring-ink/10",
  accent: "bg-accent/[0.08] ring-1 ring-inset ring-accent/20",
  warning: "bg-warning/10 ring-1 ring-inset ring-warning/25",
  danger: "bg-danger/10 ring-1 ring-inset ring-danger/25",
};

export const PageHeaderStat = React.forwardRef<
  HTMLDivElement,
  PageHeaderStatProps
>(
  (
    {
      className,
      label,
      value,
      sub,
      tone = "default",
      variant = "plain",
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      data-page-header-stat={variant}
      className={cn(
        "relative min-w-28 px-4 py-3.5 text-left",
        variant === "plain"
          ? // The hairline is a child, not a left border, so the first tile in a
            // wrapped row does not grow one when it reflows to a new line.
            "before:absolute before:inset-y-2 before:left-0 before:w-px before:bg-border before:content-['']"
          : "rounded-xl backdrop-blur-sm",
        variant === "featured" && statFills[tone],
        variant === "panel" && "bg-sunken/60 ring-1 ring-inset ring-ink/10",
        className,
      )}
      {...props}
    >
      <dt className="font-mono text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-2 font-bold text-2xl leading-none tabular-nums",
          statValueTones[tone],
        )}
      >
        {value}
      </dd>
      {sub != null && <dd className="mt-1.5 text-xs text-muted">{sub}</dd>}
    </div>
  ),
);
PageHeaderStat.displayName = "PageHeaderStat";

export interface PageHeaderMetricProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: React.ReactNode;
  /** Renders as `value / total`, at roughly half the size. */
  total?: React.ReactNode;
  caption?: React.ReactNode;
}

export const PageHeaderMetric = React.forwardRef<
  HTMLDivElement,
  PageHeaderMetricProps
>(({ className, value, total, caption, ...props }, ref) => (
  <div ref={ref} className={cn("shrink-0", className)} {...props}>
    <p className="font-mono font-bold text-[clamp(2.5rem,8cqi,4rem)] leading-none text-ink tabular-nums">
      {value}
      {total != null && (
        <span className="font-semibold text-[0.46em] text-muted">
          {" "}
          / {total}
        </span>
      )}
    </p>
    {caption != null && <p className="mt-2 text-sm text-muted">{caption}</p>}
  </div>
));
PageHeaderMetric.displayName = "PageHeaderMetric";
