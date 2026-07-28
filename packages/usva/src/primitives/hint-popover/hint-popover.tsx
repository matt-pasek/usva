"use client";
import { Popover as Base } from "@base-ui/react/popover";
import * as React from "react";
import { cn } from "../../cn.js";
import { useScopedTheme } from "../overlay-core/use-scoped-theme.js";

export type HintTone =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

const toneSkin: Record<HintTone, string> = {
  neutral: "border-border bg-surface-2",
  accent: "border-accent/25 bg-accent/12",
  success: "border-success/25 bg-success/12",
  warning: "border-warning/25 bg-warning/12",
  danger: "border-danger/25 bg-danger/12",
  info: "border-info/25 bg-info/12",
};

const toneInk: Record<HintTone, string> = {
  neutral: "text-muted",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
};

export interface HintPopoverProps {
  /** The element the hint hangs off. Rendered as the popover trigger. */
  trigger: React.ReactNode;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  /** Interactive footer, typically a dismiss Button. */
  action?: React.ReactNode;
  tone?: HintTone;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  /** Hover dwell before opening. Guards against drive-by pointers. */
  openDelay?: number;
  /**
   * Grace period after the pointer leaves. Without it the panel closes while
   * the pointer crosses the gap, and the action inside becomes unclickable.
   */
  closeDelay?: number;
  className?: string;
}

/**
 * A hover-and-focus popover that may contain interactive content.
 *
 * This is not a Tooltip and must not be one: a tooltip is announced through
 * `aria-describedby` and its contents are unreachable by keyboard, so a dismiss
 * button inside one is a trap. Base UI's Popover has no hover trigger of its
 * own, so the open state is controlled here.
 */
export function HintPopover({
  trigger,
  title,
  icon,
  action,
  tone = "neutral",
  children,
  side = "top",
  openDelay = 120,
  closeDelay = 200,
  className,
}: HintPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [probe, scopedTheme] = useScopedTheme();
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  /**
   * A pointer press focuses the trigger before Base UI's click handler toggles
   * it. Without this, opening on focus would open the panel and the click would
   * immediately close it again.
   */
  const focusFromPointer = React.useRef(false);
  const hovering = React.useRef(false);
  /**
   * Closing restores focus to the trigger, which would re-open it on focus.
   * Dismissing has to stick until focus genuinely leaves and comes back.
   */
  const suppressFocusOpen = React.useRef(false);

  const cancel = React.useCallback(() => {
    if (timer.current != null) clearTimeout(timer.current);
    timer.current = undefined;
  }, []);

  React.useEffect(() => cancel, [cancel]);

  const schedule = React.useCallback(
    (next: boolean, delay: number) => {
      cancel();
      timer.current = setTimeout(() => setOpen(next), delay);
    },
    [cancel],
  );

  const hoverIn = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    hovering.current = true;
    schedule(true, openDelay);
  };
  const hoverOut = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    hovering.current = false;
    schedule(false, closeDelay);
  };

  return (
    <Base.Root
      open={open}
      onOpenChange={(next, details) => {
        cancel();
        // A mouse press lands on a panel hover already opened, and Base UI's
        // trigger toggles. While the pointer is over the trigger, hover owns
        // closing, otherwise the click that opens it also shuts it.
        if (!next && details.reason === "trigger-press" && hovering.current)
          return;
        if (!next) suppressFocusOpen.current = true;
        setOpen(next);
      }}
    >
      <Base.Trigger
        render={trigger as React.ReactElement}
        onPointerEnter={hoverIn}
        onPointerLeave={hoverOut}
        onPointerDown={() => {
          focusFromPointer.current = true;
        }}
        onFocus={() => {
          if (focusFromPointer.current) {
            focusFromPointer.current = false;
            return;
          }
          if (suppressFocusOpen.current) return;
          cancel();
          setOpen(true);
        }}
        onBlur={() => {
          suppressFocusOpen.current = false;
        }}
      />
      <span ref={probe} hidden />
      <Base.Portal>
        <Base.Positioner
          data-theme={scopedTheme}
          side={side}
          sideOffset={8}
          className="z-overlay"
        >
          <Base.Popup
            onPointerEnter={cancel}
            onPointerLeave={hoverOut}
            className={cn(
              "rim-light max-w-72 rounded-xl border p-3 shadow-floating",
              "origin-[var(--transform-origin)] transition-enter duration-base ease-spring",
              "motion-reduce:transition-none motion-reduce:transform-none",
              "data-[starting-style]:translate-y-1 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 data-[starting-style]:blur-[2px]",
              "data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[ending-style]:duration-fast data-[ending-style]:ease-soft",
              toneSkin[tone],
              className,
            )}
          >
            <div className="flex gap-2.5">
              {icon != null && (
                <span
                  className={cn(
                    "mt-0.5 shrink-0 [&_svg]:size-3.5",
                    toneInk[tone],
                  )}
                >
                  {icon}
                </span>
              )}
              <div className="min-w-0 flex-1">
                {title != null && (
                  <Base.Title className="text-xs font-semibold leading-snug text-ink">
                    {title}
                  </Base.Title>
                )}
                <Base.Description className="text-xs leading-snug text-muted">
                  {children}
                </Base.Description>
                {action != null && <div className="mt-2">{action}</div>}
              </div>
            </div>
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}
HintPopover.displayName = "HintPopover";
