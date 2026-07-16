"use client";
import { Routa, type RoutaLight, type RoutaParams } from "@matt-pasek/usva";

export function RoutaDemo({
  speed,
  opacity,
  mode,
  light,
  params,
  caption,
}: {
  speed?: number;
  opacity?: number;
  mode?: "emissive" | "absorptive";
  light?: RoutaLight;
  params?: Partial<RoutaParams>;
  caption?: string;
}) {
  return (
    <Routa
      speed={speed}
      opacity={opacity}
      mode={mode}
      light={light}
      params={params}
      className="flex min-h-[30rem] items-end rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-md">
        <h2 className="text-3xl font-semibold text-ink">
          cold from underneath
        </h2>
        <p className="mt-3 text-muted">
          {caption ??
            "the ground lifts into low cells, then holds the dark at every frozen seam"}
        </p>
      </div>
    </Routa>
  );
}
