"use client";
import { SulaFrame } from "@matt-pasek/usva";

export function SulaFrameDemo({
  fluid = true,
  thickness = 2,
}: {
  fluid?: boolean;
  thickness?: number;
}) {
  return (
    <div className="grid min-h-96 place-items-center rounded-xl bg-bg p-8 sm:p-10">
      <SulaFrame
        fluid={fluid}
        thickness={thickness}
        radius={20}
        className="rounded-[20px] bg-surface px-10 py-9"
      >
        <div className="max-w-xs text-center">
          <h2 className="text-2xl font-semibold text-ink">
            a frame that answers
          </h2>
          <p className="mt-2 text-sm text-muted">
            drag the cursor along the edge, or focus the button, and the border
            leans toward you
          </p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm text-bg"
          >
            focus me
          </button>
        </div>
      </SulaFrame>
    </div>
  );
}
