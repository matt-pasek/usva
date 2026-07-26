import {
  Routa,
  type RoutaLight,
  type RoutaParams,
} from "@matt-pasek/usva/atmospheres/routa";
import { defineStudio } from "./types";

type RoutaConfig = {
  speed: number;
  opacity: number;
  mode: string;
  // RoutaParams
  cellScale: number;
  heave: number;
  crackWidth: number;
  crackDepth: number;
  unevenScale: number;
  uneven: number;
  drift: number;
  growthRate: number;
  slope: number;
  rough: number;
  ambient: number;
  key: number;
  relief: number;
  dither: number;
  // RoutaLight
  dirX: number;
  dirY: number;
  dirZ: number;
  lightColor: string;
};

const base: RoutaConfig = {
  speed: 1,
  opacity: 1,
  mode: "auto",
  cellScale: 3.8,
  heave: 0.075,
  crackWidth: 0.055,
  crackDepth: 0.045,
  unevenScale: 0.72,
  uneven: 0.34,
  drift: 0.0025,
  growthRate: 0.028,
  slope: 1.35,
  rough: 0.92,
  ambient: 0.32,
  key: 0.88,
  relief: 0.18,
  dither: 0.005,
  dirX: -0.68,
  dirY: 0.46,
  dirZ: 0.38,
  lightColor: "",
};

const templates: Record<string, RoutaConfig> = {
  ground: base,
  "dark key": { ...base, mode: "emissive" },
  "finer frost": { ...base, cellScale: 5.2, crackWidth: 0.038, uneven: 0.5 },
  "heavy heave": { ...base, heave: 0.12, cellScale: 2.9 },
};

const modeProp = (c: RoutaConfig): "emissive" | "absorptive" | undefined =>
  c.mode === "auto" ? undefined : (c.mode as "emissive" | "absorptive");

const params = (c: RoutaConfig): Partial<RoutaParams> => ({
  cellScale: c.cellScale,
  heave: c.heave,
  crackWidth: c.crackWidth,
  crackDepth: c.crackDepth,
  unevenScale: c.unevenScale,
  uneven: c.uneven,
  drift: c.drift,
  growthRate: c.growthRate,
  slope: c.slope,
  rough: c.rough,
  ambient: c.ambient,
  key: c.key,
  relief: c.relief,
  dither: c.dither,
});

const light = (c: RoutaConfig): RoutaLight => ({
  direction: [c.dirX, c.dirY, c.dirZ],
  ...(c.lightColor ? { color: c.lightColor } : {}),
});

const caption = (c: RoutaConfig): string =>
  c.mode === "emissive"
    ? "on dark ground the heave is caught only where the low key rakes it"
    : "the fissures hold the dark at every frozen seam";

const snippet = (c: RoutaConfig): string => {
  const lines: string[] = [];
  if (c.speed !== base.speed) lines.push(`  speed={${c.speed}}`);
  if (c.opacity !== base.opacity) lines.push(`  opacity={${c.opacity}}`);
  if (c.mode !== base.mode) lines.push(`  mode="${c.mode}"`);
  const p: string[] = [];
  if (c.cellScale !== base.cellScale) p.push(`cellScale: ${c.cellScale}`);
  if (c.heave !== base.heave) p.push(`heave: ${c.heave}`);
  if (c.crackWidth !== base.crackWidth) p.push(`crackWidth: ${c.crackWidth}`);
  if (c.crackDepth !== base.crackDepth) p.push(`crackDepth: ${c.crackDepth}`);
  if (c.unevenScale !== base.unevenScale)
    p.push(`unevenScale: ${c.unevenScale}`);
  if (c.uneven !== base.uneven) p.push(`uneven: ${c.uneven}`);
  if (c.drift !== base.drift) p.push(`drift: ${c.drift}`);
  if (c.growthRate !== base.growthRate) p.push(`growthRate: ${c.growthRate}`);
  if (c.slope !== base.slope) p.push(`slope: ${c.slope}`);
  if (c.rough !== base.rough) p.push(`rough: ${c.rough}`);
  if (c.ambient !== base.ambient) p.push(`ambient: ${c.ambient}`);
  if (c.key !== base.key) p.push(`key: ${c.key}`);
  if (c.relief !== base.relief) p.push(`relief: ${c.relief}`);
  if (c.dither !== base.dither) p.push(`dither: ${c.dither}`);
  if (p.length) lines.push(`  params={{ ${p.join(", ")} }}`);
  const l: string[] = [];
  if (c.dirX !== base.dirX || c.dirY !== base.dirY || c.dirZ !== base.dirZ)
    l.push(`direction: [${c.dirX}, ${c.dirY}, ${c.dirZ}]`);
  if (c.lightColor) l.push(`color: "${c.lightColor}"`);
  if (l.length) lines.push(`  light={{ ${l.join(", ")} }}`);
  const attrs = lines.length ? `\n${lines.join("\n")}\n` : "";
  return `import { Routa } from "@matt-pasek/usva/atmospheres/routa";

<Routa${attrs}>
  <Article />
</Routa>`;
};

export const routaStudio = defineStudio<RoutaConfig>({
  name: "routa",
  label: "routa",
  blurb: "ground frost heaving low cells from underneath",
  defaultTemplate: "ground",
  stageClassName: "",
  templates,
  snippet,
  render: (c) => (
    <Routa
      speed={c.speed}
      opacity={c.opacity}
      mode={modeProp(c)}
      light={light(c)}
      params={params(c)}
      className="flex min-h-[30rem] items-end rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-md">
        <h2 className="text-3xl font-semibold text-ink">
          cold from underneath
        </h2>
        <p className="mt-3 text-muted">
          {caption(c) ??
            "the ground lifts into low cells, then holds the dark at every frozen seam"}
        </p>
      </div>
    </Routa>
  ),
  wallpaper: (c, className) => (
    <Routa
      speed={c.speed}
      opacity={c.opacity}
      mode={modeProp(c)}
      light={light(c)}
      params={params(c)}
      className={className}
    />
  ),
  fields: [
    {
      kind: "select",
      key: "mode",
      label: "mode",
      sub: "auto reads the ground, or force stain / key",
      options: ["auto", "absorptive", "emissive"],
    },
    {
      kind: "slider",
      key: "speed",
      label: "speed",
      sub: "domain drift, barely perceptible",
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
      kind: "slider",
      key: "cellScale",
      advanced: true,
      label: "cellScale",
      sub: "frost cells across the short side",
      min: 1.5,
      max: 7,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "heave",
      advanced: true,
      label: "heave",
      sub: "how high the cell interiors lift",
      min: 0,
      max: 0.16,
      step: 0.005,
    },
    {
      kind: "slider",
      key: "crackWidth",
      advanced: true,
      label: "crackWidth",
      sub: "width of the fissure at each wall",
      min: 0.005,
      max: 0.2,
      step: 0.005,
    },
    {
      kind: "slider",
      key: "crackDepth",
      advanced: true,
      label: "crackDepth",
      sub: "how far the walls fall below the surface",
      min: 0,
      max: 0.15,
      step: 0.005,
    },
    {
      kind: "slider",
      key: "unevenScale",
      advanced: true,
      label: "unevenScale",
      sub: "frequency of the broad ground swell",
      min: 0.1,
      max: 2,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "uneven",
      advanced: true,
      label: "uneven",
      sub: "how differently neighbours lift",
      min: 0,
      max: 0.8,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "drift",
      advanced: true,
      label: "drift",
      sub: "domain travel per second, near still",
      min: 0,
      max: 0.02,
      step: 0.0005,
    },
    {
      kind: "slider",
      key: "growthRate",
      advanced: true,
      label: "growthRate",
      sub: "one-shot fissure propagation per second",
      min: 0,
      max: 0.1,
      step: 0.002,
    },
    {
      kind: "slider",
      key: "slope",
      advanced: true,
      label: "slope",
      sub: "height-gradient gain before the normal",
      min: 0.5,
      max: 3,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "rough",
      advanced: true,
      label: "rough",
      sub: "Oren-Nayar roughness, 0 to 1",
      min: 0,
      max: 1,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "ambient",
      advanced: true,
      label: "ambient",
      sub: "fill under the raking key",
      min: 0,
      max: 1,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "key",
      advanced: true,
      label: "key",
      sub: "strength of the raking key",
      min: 0,
      max: 2,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "relief",
      advanced: true,
      label: "relief",
      sub: "damp held in the lee of a heave, light grounds only",
      min: 0,
      max: 0.35,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "dither",
      advanced: true,
      label: "dither",
      sub: "dither amplitude for dark-ground emission",
      min: 0,
      max: 0.05,
      step: 0.001,
    },
    {
      kind: "slider",
      key: "dirX",
      advanced: true,
      label: "light · x",
      sub: "lateral rake of the key across the ground",
      min: -1,
      max: 1,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "dirY",
      advanced: true,
      label: "light · y",
      sub: "vertical rake of the key",
      min: 0,
      max: 1,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "dirZ",
      advanced: true,
      label: "light · z",
      sub: "keep low so the key stays grazing",
      min: 0,
      max: 1,
      step: 0.02,
    },
    {
      kind: "color",
      key: "lightColor",
      advanced: true,
      label: "light · color",
      sub: "optional cold key for the dark ground",
    },
  ],
});
