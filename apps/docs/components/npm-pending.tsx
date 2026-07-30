import { cn } from "@usva-ui/react/cn";
import type { ReactNode } from "react";

export function NpmPending({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
        soon
        <span aria-hidden="true" className="text-faint">
          ·
        </span>
        not on npm yet
      </span>
      <div
        aria-hidden="true"
        className="pointer-events-none select-none opacity-45 grayscale"
      >
        {children}
      </div>
    </div>
  );
}
