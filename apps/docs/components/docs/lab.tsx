import type { ReactNode } from "react";

/** The small mono caption every docs panel leads with. */
export function Lab({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
      {children}
    </span>
  );
}
