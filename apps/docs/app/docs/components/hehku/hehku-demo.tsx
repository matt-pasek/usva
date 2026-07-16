"use client";
import {
  type FilamentParams,
  type FilamentView,
  Hehku,
} from "@matt-pasek/usva";
import { DarkStage } from "@/components/dark-stage";

export function HehkuDemo({
  speed,
  opacity,
  colors,
  params,
  view,
  caption,
}: {
  speed?: number;
  opacity?: number;
  colors?: { cool?: string; hot?: string };
  params?: Partial<FilamentParams>;
  view?: Partial<FilamentView>;
  caption?: string;
}) {
  return (
    <DarkStage>
      <Hehku
        speed={speed}
        opacity={opacity}
        colors={colors}
        params={params}
        view={view}
        className="grid min-h-[30rem] place-items-center rounded-xl bg-bg p-8 sm:p-10"
      >
        <div className="max-w-sm text-center">
          <h2 className="text-3xl font-semibold text-ink">one long coil</h2>
          <p className="mt-3 text-muted">
            {caption ??
              "a single closed curve, cold where it runs thin and bright where it bunches"}
          </p>
        </div>
      </Hehku>
    </DarkStage>
  );
}
