import type { ReactNode } from "react";
import { Lab } from "./lab";

export interface DemoPanelProps {
  label?: string;
  note?: string;
  /** Right side of the bar. Replaces the note, e.g. a template dropdown. */
  action?: ReactNode;
  /** Rendered inside the panel, under the stage. For prop controls. */
  footer?: ReactNode;
  children: ReactNode;
}

export function DemoPanel({
  label = "live demo · try it out",
  note,
  action,
  footer,
  children,
}: DemoPanelProps) {
  return (
    <div className="mt-9 overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border bg-sunken/70 px-4 py-2.5">
        <Lab>{label}</Lab>
        {action ??
          (note && (
            <span className="font-mono text-[0.7rem] text-muted">{note}</span>
          ))}
      </div>
      <div className="bg-bg p-6 sm:p-10">{children}</div>
      {footer && (
        <div className="border-t border-border px-4 py-4">{footer}</div>
      )}
    </div>
  );
}
