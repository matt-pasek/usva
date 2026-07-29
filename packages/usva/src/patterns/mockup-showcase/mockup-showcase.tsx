import * as React from "react";
import { cn } from "../../cn.js";

export type MockupFrame = "browser" | "device" | "none";

export interface MockupShowcaseProps
  extends React.HTMLAttributes<HTMLDivElement> {
  frame?: MockupFrame;
  /** Decorative text in the browser chrome's address bar. */
  url?: string;
  /** Any CSS aspect-ratio value, or `"auto"` to let live children set the
   * height instead of locking a ratio and cropping them to cover. */
  aspect?: string;
}

/**
 * Device and browser chrome around arbitrary media.
 *
 * There is no image abstraction on purpose: children may be a next/image, a
 * bare img, a video, or a live iframe. The well stretches whatever it gets, so
 * an unknown child element still fills the frame.
 */
export const MockupShowcase = React.forwardRef<
  HTMLDivElement,
  MockupShowcaseProps
>(
  (
    { className, frame = "browser", url, aspect = "16/10", children, ...props },
    ref,
  ) => {
    const fluidHeight = aspect === "auto";
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden border border-border bg-surface shadow-floating",
          frame === "device" ? "rounded-[1.75rem] p-2" : "rounded-xl",
          className,
        )}
        {...props}
      >
        {frame === "browser" && (
          <div
            aria-hidden="true"
            className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2.5"
          >
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-border-strong" />
              <span className="size-2.5 rounded-full bg-border-strong" />
              <span className="size-2.5 rounded-full bg-border-strong" />
            </span>
            {url != null && (
              <span className="ml-2 flex-1 truncate rounded-md bg-sunken px-2.5 py-1 font-mono text-[0.6875rem] text-muted">
                {url}
              </span>
            )}
          </div>
        )}

        {frame === "device" && (
          <div
            aria-hidden="true"
            className="mx-auto mb-2 h-1.5 w-24 rounded-full bg-border-strong"
          />
        )}

        <div
          data-testid="mockup-well"
          style={fluidHeight ? undefined : { aspectRatio: aspect }}
          className={cn(
            "relative w-full overflow-hidden bg-sunken",
            fluidHeight
              ? "[&>*]:w-full"
              : "[&>*]:h-full [&>*]:w-full [&>*]:object-cover",
            frame === "device" && "rounded-[1.25rem]",
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);
MockupShowcase.displayName = "MockupShowcase";
