import * as React from "react";
import { cn } from "../../cn.js";

export interface SectionLabelProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  index?: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
}

export const SectionLabel = React.forwardRef<HTMLDivElement, SectionLabelProps>(
  ({ className, index, title, aside, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center gap-3.5", className)}
      {...props}
    >
      {index != null && (
        <span className="font-mono text-[0.7rem] font-medium uppercase leading-none tracking-[0.2em] tabular-nums text-accent [filter:drop-shadow(var(--usva-glow-accent-strong))]">
          {index}
        </span>
      )}
      <h2 className="text-balance text-sm font-medium lowercase leading-none tracking-[0.01em] text-ink">
        {title}
      </h2>
      <span aria-hidden="true" className="hairline-accent h-px flex-1" />
      {aside != null && (
        <span className="shrink-0 font-mono text-[0.7rem] leading-none tabular-nums text-faint">
          {aside}
        </span>
      )}
    </div>
  ),
);
SectionLabel.displayName = "SectionLabel";
