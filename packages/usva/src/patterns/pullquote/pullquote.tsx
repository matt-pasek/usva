import * as React from "react";
import { cn } from "../../cn.js";

export interface PullquoteProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "cite"> {
  attribution?: React.ReactNode;
  /**
   * Decorative flourish above the quote. kajo passes a FogSphere here, which is
   * Pro-licensed and cannot ship from this package. Keeping it a slot is what
   * lets the quote itself be public.
   */
  ornament?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * A centered pull quote. Renders a `figure` only when attributed, so the
 * attribution is programmatically tied to the quote rather than floating
 * beneath it as a loose paragraph.
 */
export const Pullquote = React.forwardRef<HTMLElement, PullquoteProps>(
  ({ className, attribution, ornament, children, ...props }, ref) => {
    const body = (
      <>
        {ornament != null && (
          <div
            aria-hidden="true"
            data-pullquote-ornament=""
            className="mx-auto mb-4 size-20"
          >
            {ornament}
          </div>
        )}
        <blockquote className="text-balance text-[clamp(1.125rem,2.5vw,1.625rem)] font-bold leading-[1.4] tracking-[-0.01em] text-ink">
          {children}
        </blockquote>
      </>
    );

    const shell = cn("mx-auto max-w-3xl py-4 text-center", className);

    if (attribution == null)
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={shell}
          {...props}
        >
          {body}
        </div>
      );

    return (
      <figure ref={ref as React.Ref<HTMLElement>} className={shell} {...props}>
        {body}
        <figcaption className="mt-3 font-mono text-sm text-muted">
          {attribution}
        </figcaption>
      </figure>
    );
  },
);
Pullquote.displayName = "Pullquote";
