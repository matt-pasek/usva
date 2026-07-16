"use client";
import { Utu } from "@matt-pasek/usva";

export function UtuDemo({
  interactive = false,
  bands,
  opacity,
  mode,
  accentColor,
  colors,
  caption,
}: {
  interactive?: boolean;
  bands?: number;
  opacity?: number;
  mode?: "emissive" | "absorptive";
  accentColor?: string;
  colors?: { deep?: string; mid?: string; hot?: string };
  caption?: string;
}) {
  return (
    <Utu
      interactive={interactive}
      bands={bands}
      opacity={opacity}
      mode={mode}
      accentColor={accentColor}
      colors={colors}
      className="grid min-h-[28rem] place-items-center rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-sm text-center">
        <h2 className="text-3xl font-semibold text-ink">a faint glow</h2>
        <p className="mt-3 text-muted">
          {caption ??
            (interactive
              ? "move the cursor and the volume leans into it"
              : "fog that turns and breathes, and leaves the words clear")}
        </p>
      </div>
    </Utu>
  );
}
