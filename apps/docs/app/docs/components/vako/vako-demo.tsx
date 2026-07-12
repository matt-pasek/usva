"use client";
import { Vako, type VakoLight, type VakoParams } from "@matt-pasek/usva";

export function VakoDemo({
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
  light?: VakoLight;
  params?: Partial<VakoParams>;
  caption?: string;
}) {
  return (
    <Vako
      speed={speed}
      opacity={opacity}
      mode={mode}
      light={light}
      params={params}
      className="flex min-h-[30rem] items-end rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-md">
        <h2 className="text-3xl font-semibold text-ink">thrown, not printed</h2>
        <p className="mt-3 text-muted">
          {caption ??
            "furrows turning on a wheel at about ninety seconds a revolution"}
        </p>
      </div>
    </Vako>
  );
}
