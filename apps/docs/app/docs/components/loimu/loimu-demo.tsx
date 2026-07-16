"use client";
import { Loimu, type LoimuParams } from "@matt-pasek/usva";
import * as React from "react";
import { DarkStage } from "@/components/dark-stage";

/** The sisu-plus hero scrim: a vertical crush, a 105-degree diagonal kill, and
 * a radial hole at 24%/43% where the light is allowed to survive. */
const SCRIM = [
  "linear-gradient(to bottom, rgba(13,13,17,0) 42%, rgba(13,13,17,0.72) 78%, #0d0d11 100%)",
  "linear-gradient(105deg, rgba(13,13,17,0) 46%, rgba(13,13,17,0.78) 72%, #0d0d11 92%)",
  "radial-gradient(ellipse 62% 58% at 24% 43%, rgba(13,13,17,0) 0%, rgba(13,13,17,0.55) 58%, rgba(13,13,17,0.9) 100%)",
].join(", ");

export function LoimuDemo({
  speed,
  opacity,
  interactive,
  colors,
  params,
  scrim = true,
  caption,
}: {
  speed?: number;
  opacity?: number;
  interactive?: boolean;
  colors?: { body?: string; deep?: string; edge?: string };
  params?: Partial<LoimuParams>;
  scrim?: boolean;
  caption?: string;
}) {
  return (
    <DarkStage>
      <Loimu
        speed={speed}
        opacity={opacity}
        interactive={interactive}
        colors={colors}
        params={params}
        className="relative flex min-h-[30rem] items-center rounded-xl bg-bg p-8 sm:p-10"
      >
        {scrim ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{ backgroundImage: SCRIM }}
          />
        ) : null}
        <div className="relative max-w-md">
          <h2 className="text-3xl font-semibold text-ink">
            light from off-frame
          </h2>
          <p className="mt-3 text-muted">
            {caption ??
              "move the pointer and the streamers bend toward it from a distance"}
          </p>
        </div>
      </Loimu>
    </DarkStage>
  );
}

export function LoimuScrimDemo() {
  const [scrim, setScrim] = React.useState(true);
  return (
    <div className="flex flex-col gap-3">
      <LoimuDemo
        scrim={scrim}
        caption={
          scrim
            ? "the scrim keeps one diagonal wedge and destroys the rest"
            : "unmasked, the sheet fills the frame and lies about where the light should live"
        }
      />
      <button
        type="button"
        onClick={() => setScrim((on) => !on)}
        className="self-start rounded-md border border-border px-3 py-1.5 text-xs text-ink"
      >
        {scrim ? "Turn the scrim off" : "Turn the scrim on"}
      </button>
    </div>
  );
}
