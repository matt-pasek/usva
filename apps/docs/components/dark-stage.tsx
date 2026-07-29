"use client";
import type { ReactNode } from "react";
import { Lab } from "@/components/docs/lab";
import { useTheme } from "@/components/theme-provider";

export function DarkStage({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  if (theme !== "savi") return <>{children}</>;

  return (
    <div data-theme="kajo" className="rounded-xl bg-bg">
      {children}
    </div>
  );
}

export function GroundNote({ name }: { name: string }) {
  const { theme } = useTheme();
  if (theme !== "savi") return null;

  return (
    <div className="mt-9 overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="flex items-center border-b border-border bg-sunken/70 px-4 py-2.5">
        <Lab>dark grounds only</Lab>
      </div>
      <div className="p-6 sm:p-10">
        <p className="text-sm text-muted">
          {name} is light in a void, and clay gives it nothing to be brighter
          than. on savi it renders nothing at all, so the demos below keep a
          dark ground of their own. reach for kynnös or väre on this theme.
        </p>
      </div>
    </div>
  );
}
