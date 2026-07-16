"use client";
import { Vare, type VareParams } from "@matt-pasek/usva";

export function VareDemo({
  speed,
  opacity,
  interactive,
  colors,
  params,
  caption,
}: {
  speed?: number;
  opacity?: number;
  interactive?: boolean;
  colors?: { body?: string; deep?: string; edge?: string };
  params?: Partial<VareParams>;
  caption?: string;
}) {
  return (
    <Vare
      speed={speed}
      opacity={opacity}
      interactive={interactive}
      colors={colors}
      params={params}
      className="flex min-h-[30rem] items-center rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-md">
        <h2 className="text-3xl font-semibold text-ink">bands, not waves</h2>
        <p className="mt-3 text-muted">
          {caption ??
            "on dark ground the crests emit; on savi the troughs hold damp pigment"}
        </p>
      </div>
    </Vare>
  );
}
