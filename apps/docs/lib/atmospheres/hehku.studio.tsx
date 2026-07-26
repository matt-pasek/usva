import type {
  FilamentParams,
  FilamentView,
} from "@matt-pasek/usva/atmospheres/hehku";
import { Hehku } from "@matt-pasek/usva/atmospheres/hehku";
import { DarkStage } from "@/components/dark-stage";
import { defineStudio } from "./types";

const MODES = ["auto", "emissive", "absorptive"] as const;

type HehkuConfig = {
  speed: number;
  opacity: number;
  mode: (typeof MODES)[number];
  cool: string;
  hot: string;
  segments: number;
  radiusMajor: number;
  radiusMinor: number;
  windingP: number;
  windingQ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  drift: number;
  driftRate: number;
  spin: number;
  tilt: number;
  thickness: number;
  glow: number;
  dist: number;
  focal: number;
  offsetX: number;
  offsetY: number;
  bloom: number;
  exposure: number;
};

const kajo: HehkuConfig = {
  speed: 1,
  opacity: 1,
  mode: "auto",
  cool: "",
  hot: "",
  segments: 96,
  radiusMajor: 2.1,
  radiusMinor: 1.05,
  windingP: 2,
  windingQ: 3,
  scaleX: 1.85,
  scaleY: 1.12,
  scaleZ: 1,
  drift: 0.4,
  driftRate: 0.06,
  spin: 0.01,
  tilt: 0.6,
  thickness: 0.16,
  glow: 26,
  dist: 2.9,
  focal: 1,
  offsetX: 1.2,
  offsetY: 1.9,
  bloom: 6,
  exposure: 1.9,
};

const templates: Record<string, HehkuConfig> = {
  "kajo coil": kajo,
  thinner: { ...kajo, thickness: 0.06, glow: 16 },
  "warm bloom": {
    ...kajo,
    cool: "#3a2a6e",
    hot: "#ffb45e",
    bloom: 2.8,
    exposure: 1.7,
  },
  "tight knot": { ...kajo, windingP: 3, windingQ: 5, radiusMinor: 0.8 },
  dimmed: { ...kajo, opacity: 0.6, speed: 0.7 },
};

const params = (c: HehkuConfig): Partial<FilamentParams> => ({
  segments: c.segments,
  radius: [c.radiusMajor, c.radiusMinor],
  winding: [c.windingP, c.windingQ],
  scale: [c.scaleX, c.scaleY, c.scaleZ],
  drift: c.drift,
  driftRate: c.driftRate,
  spin: c.spin,
  tilt: c.tilt,
  thickness: c.thickness,
  glow: c.glow,
});

const view = (c: HehkuConfig): Partial<FilamentView> => ({
  dist: c.dist,
  focal: c.focal,
  offset: [c.offsetX, c.offsetY],
  bloom: c.bloom,
  exposure: c.exposure,
});

const snippet = (c: HehkuConfig): string => {
  const lines = [`  speed={${c.speed}}`];
  if (c.mode !== "auto") lines.push(`  mode="${c.mode}"`);
  if (c.opacity !== kajo.opacity) lines.push(`  opacity={${c.opacity}}`);
  const cols: string[] = [];
  if (c.cool) cols.push(`cool: "${c.cool}"`);
  if (c.hot) cols.push(`hot: "${c.hot}"`);
  if (cols.length) lines.push(`  colors={{ ${cols.join(", ")} }}`);
  const p: string[] = [];
  if (c.segments !== kajo.segments) p.push(`segments: ${c.segments}`);
  if (c.radiusMajor !== kajo.radiusMajor || c.radiusMinor !== kajo.radiusMinor)
    p.push(`radius: [${c.radiusMajor}, ${c.radiusMinor}]`);
  if (c.windingP !== kajo.windingP || c.windingQ !== kajo.windingQ)
    p.push(`winding: [${c.windingP}, ${c.windingQ}]`);
  if (
    c.scaleX !== kajo.scaleX ||
    c.scaleY !== kajo.scaleY ||
    c.scaleZ !== kajo.scaleZ
  )
    p.push(`scale: [${c.scaleX}, ${c.scaleY}, ${c.scaleZ}]`);
  if (c.drift !== kajo.drift) p.push(`drift: ${c.drift}`);
  if (c.driftRate !== kajo.driftRate) p.push(`driftRate: ${c.driftRate}`);
  if (c.spin !== kajo.spin) p.push(`spin: ${c.spin}`);
  if (c.tilt !== kajo.tilt) p.push(`tilt: ${c.tilt}`);
  if (c.thickness !== kajo.thickness) p.push(`thickness: ${c.thickness}`);
  if (c.glow !== kajo.glow) p.push(`glow: ${c.glow}`);
  if (p.length) lines.push(`  params={{ ${p.join(", ")} }}`);
  const v: string[] = [];
  if (c.dist !== kajo.dist) v.push(`dist: ${c.dist}`);
  if (c.focal !== kajo.focal) v.push(`focal: ${c.focal}`);
  if (c.offsetX !== kajo.offsetX || c.offsetY !== kajo.offsetY)
    v.push(`offset: [${c.offsetX}, ${c.offsetY}]`);
  if (c.bloom !== kajo.bloom) v.push(`bloom: ${c.bloom}`);
  if (c.exposure !== kajo.exposure) v.push(`exposure: ${c.exposure}`);
  if (v.length) lines.push(`  view={{ ${v.join(", ")} }}`);
  return `import { Hehku } from "@matt-pasek/usva/atmospheres/hehku";

<Hehku
${lines.join("\n")}
>
  <Hero />
</Hehku>`;
};

export const hehkuStudio = defineStudio<HehkuConfig>({
  name: "hehku",
  label: "hehku",
  blurb: "one incandescent filament coiling through the dark",
  defaultTemplate: "kajo coil",
  stageClassName: "",
  templates,
  snippet,
  render: (c) => (
    <DarkStage>
      <Hehku
        speed={c.speed}
        opacity={c.opacity}
        mode={c.mode === "auto" ? undefined : c.mode}
        colors={{ cool: c.cool || undefined, hot: c.hot || undefined }}
        params={params(c)}
        view={view(c)}
        className="grid min-h-[30rem] place-items-center rounded-xl bg-bg p-8 sm:p-10"
      >
        <div className="max-w-sm text-center">
          <h2 className="text-3xl font-semibold text-ink">one long coil</h2>
          <p className="mt-3 text-muted">
            a single closed curve, cold where it runs thin and bright where it
            bunches
          </p>
        </div>
      </Hehku>
    </DarkStage>
  ),
  wallpaper: (c, className) => (
    <Hehku
      speed={c.speed}
      opacity={c.opacity}
      mode={c.mode === "auto" ? undefined : c.mode}
      colors={{ cool: c.cool || undefined, hot: c.hot || undefined }}
      params={params(c)}
      view={view(c)}
      className={className}
    />
  ),
  fields: [
    {
      kind: "slider",
      key: "speed",
      label: "speed",
      sub: "wander and spin rate, keep it slow",
      min: 0.2,
      max: 2,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "opacity",
      label: "opacity",
      sub: "overall strength, 0 to 1",
      min: 0.1,
      max: 1,
      step: 0.05,
    },
    {
      kind: "select",
      key: "mode",
      label: "mode",
      sub: "auto reads the ground, or force emit / stain",
      options: MODES,
    },
    { kind: "color", key: "cool", label: "cool", sub: "the thin cold runs" },
    {
      kind: "color",
      key: "hot",
      label: "hot",
      sub: "where the coil bunches and blooms",
    },
    {
      kind: "slider",
      key: "segments",
      advanced: true,
      label: "segments",
      sub: "capsules in the chain, more is smoother",
      min: 24,
      max: 160,
      step: 4,
    },
    {
      kind: "slider",
      key: "radiusMajor",
      advanced: true,
      label: "radius · major",
      sub: "size of the torus the knot winds around",
      min: 0.5,
      max: 3.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "radiusMinor",
      advanced: true,
      label: "radius · minor",
      sub: "thickness of that torus",
      min: 0.3,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "windingP",
      advanced: true,
      label: "winding · p",
      sub: "turns about the axis, coprime with q",
      min: 1,
      max: 6,
      step: 1,
    },
    {
      kind: "slider",
      key: "windingQ",
      advanced: true,
      label: "winding · q",
      sub: "turns through the hole, coprime with p",
      min: 1,
      max: 7,
      step: 1,
    },
    {
      kind: "slider",
      key: "scaleX",
      advanced: true,
      label: "scale · x",
      sub: "width of the finished figure",
      min: 0.5,
      max: 3,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "scaleY",
      advanced: true,
      label: "scale · y",
      sub: "height of the finished figure",
      min: 0.5,
      max: 3,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "scaleZ",
      advanced: true,
      label: "scale · z",
      sub: "depth of the finished figure",
      min: 0.5,
      max: 3,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "drift",
      advanced: true,
      label: "drift",
      sub: "wander of the curve away from the pure knot",
      min: 0,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "driftRate",
      advanced: true,
      label: "driftRate",
      sub: "how fast that wander and roll move",
      min: 0,
      max: 0.3,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "spin",
      advanced: true,
      label: "spin",
      sub: "revolutions per second about the vertical",
      min: 0,
      max: 0.2,
      step: 0.005,
    },
    {
      kind: "slider",
      key: "tilt",
      advanced: true,
      label: "tilt",
      sub: "fixed lean of the whole figure, radians",
      min: -1.5,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "thickness",
      label: "thickness",
      sub: "radius of the emitting core",
      min: 0.04,
      max: 0.3,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "glow",
      label: "glow",
      sub: "falloff, larger is thinner and colder",
      min: 8,
      max: 40,
      step: 1,
    },
    {
      kind: "slider",
      key: "dist",
      advanced: true,
      label: "dist",
      sub: "eye distance from the coil",
      min: 1.5,
      max: 5,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "focal",
      advanced: true,
      label: "focal",
      sub: "lens length, higher is flatter",
      min: 0.5,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "offsetX",
      advanced: true,
      label: "offset · x",
      sub: "lateral eye position, crops the coil",
      min: -3,
      max: 3,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "offsetY",
      advanced: true,
      label: "offset · y",
      sub: "vertical eye position",
      min: -3,
      max: 3,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "bloom",
      label: "bloom",
      sub: "halo level counted as looking through coil",
      min: 1,
      max: 10,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "exposure",
      label: "exposure",
      sub: "brightness of the ramp",
      min: 0.5,
      max: 3,
      step: 0.1,
    },
  ],
});
