"use client";
import { Kuulto, type KuultoParams } from "@matt-pasek/usva";

export function KuultoDemo({
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
  colors?: { key?: string; fill?: string; rim?: string };
  params?: Partial<KuultoParams>;
  caption?: string;
}) {
  return (
    <Kuulto
      speed={speed}
      opacity={opacity}
      interactive={interactive}
      colors={colors}
      params={params}
      className="flex min-h-[30rem] items-center rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-md">
        <h2 className="text-3xl font-semibold text-ink">colour is a shadow</h2>
        <p className="mt-3 text-muted">
          {caption ??
            "no palette is sampled here; a fold takes the hue of whichever lamp it turns toward"}
        </p>
      </div>
    </Kuulto>
  );
}
