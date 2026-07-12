"use client";
import { Holvi, type VaultParams } from "@matt-pasek/usva";

export function HolviDemo({
  speed,
  opacity,
  colors,
  params,
  caption,
}: {
  speed?: number;
  opacity?: number;
  colors?: { low?: string; high?: string; star?: string };
  params?: Partial<VaultParams>;
  caption?: string;
}) {
  return (
    <Holvi
      speed={speed}
      opacity={opacity}
      colors={colors}
      params={params}
      className="flex min-h-[30rem] items-end rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-md">
        <h2 className="text-3xl font-semibold text-ink">under the vault</h2>
        <p className="mt-3 text-muted">
          {caption ??
            "the field thins into a corridor where the type sits, so the words keep their ground"}
        </p>
      </div>
    </Holvi>
  );
}
