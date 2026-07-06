import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../cn.js";

const badgeTone = cva("", {
  variants: {
    tone: {
      live: "bg-live text-on-accent",
      accent: "bg-accent text-on-accent",
      "accent-alt": "bg-accent-alt text-on-accent",
      success: "bg-success text-on-accent",
      warning: "bg-warning text-on-accent",
      danger: "bg-danger text-on-accent",
    },
  },
  defaultVariants: { tone: "live" },
});

export type AnnouncementTone = NonNullable<
  VariantProps<typeof badgeTone>["tone"]
>;

interface AnnouncementOwnProps {
  /** Text of the solid leading badge, e.g. "NEW". */
  badge: React.ReactNode;
  /** Color of the leading badge. Defaults to the live green. */
  tone?: AnnouncementTone;
  /** Render as a link. When set, a trailing arrow and hover glow appear. */
  href?: string;
}

export type AnnouncementProps = AnnouncementOwnProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  React.HTMLAttributes<HTMLElement>;

export const Announcement = React.forwardRef<HTMLElement, AnnouncementProps>(
  ({ className, badge, tone = "live", href, children, ...props }, ref) => {
    const interactive = href != null;
    const shell = cn(
      "group inline-flex h-9 items-center gap-2.5 rounded-full border border-border bg-surface-2/60 pr-4 pl-1 text-sm text-muted",
      "transition-control duration-base ease-soft motion-reduce:transition-none",
      "hover:border-border-strong hover:text-ink hover:glow-accent",
      interactive && "outline-none focus-visible:ring-focus",
      className,
    );

    const inner = (
      <>
        <span
          className={cn(
            "inline-flex h-7 items-center rounded-full px-2.5 font-semibold text-[0.6875rem] uppercase leading-none tracking-[0.08em]",
            "transition-control duration-base ease-soft group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:transform-none",
            badgeTone({ tone }),
          )}
        >
          {badge}
        </span>
        <span className="truncate">{children}</span>
        {interactive ? (
          <ArrowIcon className="text-muted transition-control duration-base ease-soft group-hover:translate-x-0.5 group-hover:text-ink motion-reduce:transition-none" />
        ) : null}
      </>
    );

    if (interactive) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={shell}
          {...props}
        >
          {inner}
        </a>
      );
    }

    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={shell}
        {...props}
      >
        {inner}
      </span>
    );
  },
);
Announcement.displayName = "Announcement";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-3.5 w-3.5 shrink-0", className)}
      aria-hidden="true"
    >
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}
