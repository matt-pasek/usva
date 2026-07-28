import { Loimu, type LoimuParams } from "usva/atmospheres/loimu";
import { DarkStage } from "@/components/dark-stage";
import { defineStudio } from "./types";

/** The sisu-plus hero scrim: a vertical crush, a 105-degree diagonal kill, and
 * a radial hole at 24%/43% where the light is allowed to survive. */
const SCRIM = [
  "linear-gradient(to bottom, rgba(13,13,17,0) 42%, rgba(13,13,17,0.72) 78%, #0d0d11 100%)",
  "linear-gradient(105deg, rgba(13,13,17,0) 46%, rgba(13,13,17,0.78) 72%, #0d0d11 92%)",
  "radial-gradient(ellipse 62% 58% at 24% 43%, rgba(13,13,17,0) 0%, rgba(13,13,17,0.55) 58%, rgba(13,13,17,0.9) 100%)",
].join(", ");

const MODES = ["auto", "emissive", "absorptive"] as const;

type LoimuConfig = {
  speed: number;
  opacity: number;
  interactive: boolean;
  mode: (typeof MODES)[number];
  scrim: boolean;
  body: string;
  deep: string;
  edge: string;
  // LoimuParams
  focal: number;
  sheetDist: number;
  sheetSpan: number;
  sigma: number;
  fold: number;
  foldScale: number;
  normalX: number;
  normalY: number;
  normalZ: number;
  flowX: number;
  flowY: number;
  flowZ: number;
  sourceX: number;
  sourceY: number;
  noiseFreq: number;
  stretch: number;
  curlScale: number;
  curlAmt: number;
  flowSpeed: number;
  omega: number;
  threshold: number;
  sharpen: number;
  falloff: number;
  gain: number;
  edgeWeight: number;
  edgeBands: number;
  flowLength: number;
};

const green: LoimuConfig = {
  speed: 1,
  opacity: 1,
  interactive: true,
  mode: "auto",
  scrim: true,
  body: "",
  deep: "",
  edge: "",
  focal: 1.5,
  sheetDist: 3,
  sheetSpan: 1.6,
  sigma: 0.8,
  fold: 0.55,
  foldScale: 0.22,
  normalX: 0.3,
  normalY: 0.4,
  normalZ: 0.87,
  flowX: -0.86,
  flowY: -0.5,
  flowZ: 0,
  sourceX: 1.28,
  sourceY: 0.92,
  noiseFreq: 1.5,
  stretch: 12,
  curlScale: 0.35,
  curlAmt: 0.7,
  flowSpeed: 0.28,
  omega: 1.6,
  threshold: 0.33,
  sharpen: 2.2,
  falloff: 0.045,
  gain: 14,
  edgeWeight: 0.3,
  edgeBands: 2,
  flowLength: 7,
};

const templates: Record<string, LoimuConfig> = {
  ground: green,
  "dimmed & slow": { ...green, speed: 0.6, opacity: 0.7 },
  "ignores pointer": { ...green, interactive: false },
  faster: { ...green, speed: 1.6 },
  "tight streamers": { ...green, stretch: 18, sharpen: 3.2, edgeWeight: 0.5 },
};

const snippet = (c: LoimuConfig): string => {
  const lines = [
    `  speed={${c.speed}}`,
    `  opacity={${c.opacity}}`,
    `  interactive={${c.interactive}}`,
  ];
  if (c.mode !== "auto") lines.push(`  mode="${c.mode}"`);
  const cols: string[] = [];
  if (c.body) cols.push(`body: "${c.body}"`);
  if (c.deep) cols.push(`deep: "${c.deep}"`);
  if (c.edge) cols.push(`edge: "${c.edge}"`);
  if (cols.length) lines.push(`  colors={{ ${cols.join(", ")} }}`);
  const p: string[] = [];
  if (c.focal !== green.focal) p.push(`focal: ${c.focal}`);
  if (c.sheetDist !== green.sheetDist) p.push(`sheetDist: ${c.sheetDist}`);
  if (c.sheetSpan !== green.sheetSpan) p.push(`sheetSpan: ${c.sheetSpan}`);
  if (c.sigma !== green.sigma) p.push(`sigma: ${c.sigma}`);
  if (c.fold !== green.fold) p.push(`fold: ${c.fold}`);
  if (c.foldScale !== green.foldScale) p.push(`foldScale: ${c.foldScale}`);
  if (
    c.normalX !== green.normalX ||
    c.normalY !== green.normalY ||
    c.normalZ !== green.normalZ
  )
    p.push(`normal: [${c.normalX}, ${c.normalY}, ${c.normalZ}]`);
  if (
    c.flowX !== green.flowX ||
    c.flowY !== green.flowY ||
    c.flowZ !== green.flowZ
  )
    p.push(`flow: [${c.flowX}, ${c.flowY}, ${c.flowZ}]`);
  if (c.sourceX !== green.sourceX || c.sourceY !== green.sourceY)
    p.push(`source: [${c.sourceX}, ${c.sourceY}]`);
  if (c.noiseFreq !== green.noiseFreq) p.push(`noiseFreq: ${c.noiseFreq}`);
  if (c.stretch !== green.stretch) p.push(`stretch: ${c.stretch}`);
  if (c.curlScale !== green.curlScale) p.push(`curlScale: ${c.curlScale}`);
  if (c.curlAmt !== green.curlAmt) p.push(`curlAmt: ${c.curlAmt}`);
  if (c.flowSpeed !== green.flowSpeed) p.push(`flowSpeed: ${c.flowSpeed}`);
  if (c.omega !== green.omega) p.push(`omega: ${c.omega}`);
  if (c.threshold !== green.threshold) p.push(`threshold: ${c.threshold}`);
  if (c.sharpen !== green.sharpen) p.push(`sharpen: ${c.sharpen}`);
  if (c.falloff !== green.falloff) p.push(`falloff: ${c.falloff}`);
  if (c.gain !== green.gain) p.push(`gain: ${c.gain}`);
  if (c.edgeWeight !== green.edgeWeight) p.push(`edge: ${c.edgeWeight}`);
  if (c.edgeBands !== green.edgeBands) p.push(`edgeBands: ${c.edgeBands}`);
  if (c.flowLength !== green.flowLength) p.push(`flowLength: ${c.flowLength}`);
  if (p.length) lines.push(`  params={{ ${p.join(", ")} }}`);
  return `import { Loimu } from "usva/atmospheres/loimu";

<Loimu
${lines.join("\n")}
>
${
  c.scrim
    ? `  <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: SCRIM }} />
`
    : ""
}  <Hero />
</Loimu>`;
};

const colors = (c: LoimuConfig) => ({
  body: c.body || undefined,
  deep: c.deep || undefined,
  edge: c.edge || undefined,
});

const params = (c: LoimuConfig): Partial<LoimuParams> => ({
  focal: c.focal,
  sheetDist: c.sheetDist,
  sheetSpan: c.sheetSpan,
  sigma: c.sigma,
  fold: c.fold,
  foldScale: c.foldScale,
  normal: [c.normalX, c.normalY, c.normalZ],
  flow: [c.flowX, c.flowY, c.flowZ],
  source: [c.sourceX, c.sourceY],
  noiseFreq: c.noiseFreq,
  stretch: c.stretch,
  curlScale: c.curlScale,
  curlAmt: c.curlAmt,
  flowSpeed: c.flowSpeed,
  omega: c.omega,
  threshold: c.threshold,
  sharpen: c.sharpen,
  falloff: c.falloff,
  gain: c.gain,
  edge: c.edgeWeight,
  edgeBands: c.edgeBands,
  flowLength: c.flowLength,
});

export const loimuStudio = defineStudio<LoimuConfig>({
  name: "loimu",
  label: "loimu",
  blurb: "light from something enormous and off-frame",
  defaultTemplate: "ground",
  stageClassName: "",
  templates,
  snippet,
  render: (c) => {
    const caption = c.scrim
      ? "the scrim keeps one diagonal wedge and destroys the rest"
      : "unmasked, the raw sheet fills the frame";
    return (
      <DarkStage>
        <Loimu
          speed={c.speed}
          opacity={c.opacity}
          interactive={c.interactive}
          mode={c.mode === "auto" ? undefined : c.mode}
          colors={colors(c)}
          params={params(c)}
          className="relative flex min-h-[30rem] items-center rounded-xl bg-bg p-8 sm:p-10"
        >
          {c.scrim ? (
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
            <p className="mt-3 text-muted">{caption}</p>
          </div>
        </Loimu>
      </DarkStage>
    );
  },
  wallpaper: (c, className) => (
    <Loimu
      speed={c.speed}
      opacity={c.opacity}
      interactive={c.interactive}
      mode={c.mode === "auto" ? undefined : c.mode}
      colors={{
        body: c.body || undefined,
        deep: c.deep || undefined,
        edge: c.edge || undefined,
      }}
      params={params(c)}
      className={className}
    />
  ),
  fields: [
    {
      kind: "slider",
      key: "speed",
      label: "speed",
      sub: "flow and fold rate",
      min: 0.2,
      max: 2,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "opacity",
      label: "opacity",
      sub: "sheet strength, 0 to 1",
      min: 0.1,
      max: 1,
      step: 0.05,
    },
    {
      kind: "switch",
      key: "interactive",
      label: "interactive",
      sub: "streamers bend toward the pointer",
    },
    {
      kind: "select",
      key: "mode",
      label: "mode",
      sub: "auto reads the ground, or force emit / stain",
      options: MODES,
    },
    {
      kind: "switch",
      key: "scrim",
      label: "scrim",
      sub: "the three-layer CSS mask on top",
    },
    {
      kind: "color",
      key: "body",
      label: "body",
      sub: "the sheet, reads accent",
    },
    {
      kind: "color",
      key: "deep",
      label: "deep",
      sub: "where the light is oldest",
    },
    {
      kind: "color",
      key: "edge",
      label: "edge",
      sub: "the leading lines",
    },
    {
      kind: "slider",
      key: "focal",
      advanced: true,
      label: "focal",
      sub: "camera focal length, larger flattens",
      min: 0.5,
      max: 3,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "sheetDist",
      advanced: true,
      label: "sheetDist",
      sub: "eye to sheet plane along its normal",
      min: 1,
      max: 6,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "sheetSpan",
      advanced: true,
      label: "sheetSpan",
      sub: "half depth of the marched neighbourhood",
      min: 0.5,
      max: 3,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "sigma",
      advanced: true,
      label: "sigma",
      sub: "gaussian thickness of the sheet",
      min: 0.2,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "fold",
      advanced: true,
      label: "fold",
      sub: "how far the low fold bends it out of plane",
      min: 0,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "foldScale",
      advanced: true,
      label: "foldScale",
      sub: "spatial frequency of that fold",
      min: 0.05,
      max: 1,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "normalX",
      advanced: true,
      label: "normal · x",
      sub: "sheet plane normal, x",
      min: -1,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "normalY",
      advanced: true,
      label: "normal · y",
      sub: "sheet plane normal, y",
      min: -1,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "normalZ",
      advanced: true,
      label: "normal · z",
      sub: "sheet plane normal, z",
      min: -1,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "flowX",
      advanced: true,
      label: "flow · x",
      sub: "flow axis projected onto the plane, x",
      min: -1,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "flowY",
      advanced: true,
      label: "flow · y",
      sub: "flow axis projected onto the plane, y",
      min: -1,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "flowZ",
      advanced: true,
      label: "flow · z",
      sub: "flow axis projected onto the plane, z",
      min: -1,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "sourceX",
      advanced: true,
      label: "source · x",
      sub: "emission source, half-height units, x",
      min: -2,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "sourceY",
      advanced: true,
      label: "source · y",
      sub: "emission source, half-height units, y",
      min: -2,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "noiseFreq",
      advanced: true,
      label: "noiseFreq",
      sub: "base frequency of the streamer noise",
      min: 0.5,
      max: 4,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "stretch",
      advanced: true,
      label: "stretch",
      sub: "domain stretch along flow, below 4 loses aurora",
      min: 4,
      max: 24,
      step: 1,
    },
    {
      kind: "slider",
      key: "curlScale",
      advanced: true,
      label: "curlScale",
      sub: "spatial scale of the curl field",
      min: 0.05,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "curlAmt",
      advanced: true,
      label: "curlAmt",
      sub: "strength of the curl advection",
      min: 0,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "flowSpeed",
      advanced: true,
      label: "flowSpeed",
      sub: "base advection speed along the flow",
      min: 0,
      max: 1,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "omega",
      advanced: true,
      label: "omega",
      sub: "strength of the pointer vortex",
      min: 0,
      max: 4,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "threshold",
      advanced: true,
      label: "threshold",
      sub: "cutoff below which the sheet is void",
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "sharpen",
      advanced: true,
      label: "sharpen",
      sub: "contrast on the streamer edges",
      min: 0.5,
      max: 5,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "falloff",
      advanced: true,
      label: "falloff",
      sub: "inverse-square arrival, higher decays sooner",
      min: 0.01,
      max: 0.2,
      step: 0.005,
    },
    {
      kind: "slider",
      key: "gain",
      advanced: true,
      label: "gain",
      sub: "overall emission gain",
      min: 4,
      max: 30,
      step: 1,
    },
    {
      kind: "slider",
      key: "edgeWeight",
      advanced: true,
      label: "edge",
      sub: "weight of the thin leading line",
      min: 0,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "edgeBands",
      advanced: true,
      label: "edgeBands",
      sub: "how many leading lines per streamer",
      min: 1,
      max: 6,
      step: 1,
    },
    {
      kind: "slider",
      key: "flowLength",
      advanced: true,
      label: "flowLength",
      sub: "distance over which the hue completes",
      min: 1,
      max: 15,
      step: 0.5,
    },
  ],
});
