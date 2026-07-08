"use client";
import * as React from "react";
import { cn } from "../../cn.js";

export interface DisclosureRowProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onToggle"> {
  /** The row itself. A ProgressRow, a title, whatever the panel is about. */
  summary: React.ReactNode;
  /** Categorical: any CSS color for the left rail. Omit it and no rail draws. */
  railColor?: string;
  /** Trailing content inside the button, after the summary. Counts, badges. */
  aside?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** Names the button for assistive tech when the summary is not plain text. */
  buttonLabel?: string;
  children?: React.ReactNode;
}

export const DisclosureRow = React.forwardRef<
  HTMLDivElement,
  DisclosureRowProps
>(
  (
    {
      className,
      summary,
      railColor,
      aside,
      open,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      buttonLabel,
      children,
      ...props
    },
    ref,
  ) => {
    const panelId = React.useId();
    const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
    const isOpen = open ?? uncontrolled;

    const toggle = () => {
      const next = !isOpen;
      if (open === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    };

    return (
      <div
        ref={ref}
        data-open={isOpen ? "" : undefined}
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-ink/[0.02]",
          className,
        )}
        {...props}
      >
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-label={buttonLabel}
          disabled={disabled}
          onClick={toggle}
          className={cn(
            "group flex min-h-16 w-full items-center gap-4 px-4 py-3 text-left outline-none",
            "transition-control duration-fast ease-soft focus-visible:ring-focus",
            disabled
              ? "cursor-not-allowed opacity-55"
              : "cursor-pointer hover:bg-ink/[0.03]",
          )}
        >
          {railColor != null && (
            <span
              aria-hidden="true"
              className="min-h-11 w-1 shrink-0 self-stretch rounded-full"
              style={{ backgroundColor: railColor }}
            />
          )}

          <ChevronIcon />

          <span className="min-w-0 flex-1">{summary}</span>

          {aside != null && (
            <span className="shrink-0 text-right">{aside}</span>
          )}
        </button>

        <DisclosurePanel id={panelId} open={isOpen}>
          {children}
        </DisclosurePanel>
      </div>
    );
  },
);
DisclosureRow.displayName = "DisclosureRow";

function DisclosurePanel({
  id,
  open,
  children,
}: {
  id: string;
  open: boolean;
  children: React.ReactNode;
}) {
  // A closed panel keeps its content mounted so the height can transition, which
  // leaves its links and buttons focusable. React 18 and 19 disagree on how an
  // `inert` prop serializes, so the attribute goes on the node instead.
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
      id={id}
      data-disclosure-panel=""
      className={cn(
        "grid transition-[grid-template-rows] duration-base ease-soft motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        "size-3.5 shrink-0 text-muted transition-transform duration-fast ease-soft",
        "group-aria-expanded:rotate-90 motion-reduce:transition-none",
      )}
    >
      <path d="M5 3l4 4-4 4" />
    </svg>
  );
}
