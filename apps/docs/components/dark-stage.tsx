"use client";
import { Badge } from "@matt-pasek/usva";
import type { ReactNode } from "react";
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
    <div className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
      <Badge tone="neutral" mono className="shrink-0 whitespace-nowrap">
        dark grounds only
      </Badge>
      <p className="text-sm text-muted">
        {name} is light in a void, and clay gives it nothing to be brighter
        than. On savi it renders nothing at all, so the demos below keep a dark
        ground of their own. Reach for kynnös or väre on this theme.
      </p>
    </div>
  );
}
