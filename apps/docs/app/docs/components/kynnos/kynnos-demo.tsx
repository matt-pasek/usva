"use client";
import { Kynnos, type KynnosLight, type KynnosParams } from "@matt-pasek/usva";

export function KynnosDemo({
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
  light?: KynnosLight;
  params?: Partial<KynnosParams>;
  caption?: string;
}) {
  return (
    <Kynnos
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
    </Kynnos>
  );
}
