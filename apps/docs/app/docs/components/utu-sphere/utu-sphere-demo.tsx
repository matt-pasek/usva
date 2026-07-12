"use client";
import { UtuSphere } from "@matt-pasek/usva";

export function UtuSphereDemo({
  interactive = false,
  bands,
  opacity,
  accentColor,
  colors,
}: {
  interactive?: boolean;
  bands?: number;
  opacity?: number;
  accentColor?: string;
  colors?: { deep?: string; mid?: string; hot?: string };
}) {
  return (
    <UtuSphere
      interactive={interactive}
      bands={bands}
      opacity={opacity}
      accentColor={accentColor}
      colors={colors}
      className="grid min-h-[28rem] place-items-center rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-sm text-center">
        <h2 className="text-3xl font-semibold text-ink">a faint glow</h2>
        <p className="mt-3 text-muted">
          {interactive
            ? "move the cursor and the volume leans into it"
            : "fog that turns and breathes, and leaves the words clear"}
        </p>
      </div>
    </UtuSphere>
  );
}
