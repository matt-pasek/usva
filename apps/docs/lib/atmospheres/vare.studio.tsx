import { Vare, type VareParams } from "usva/atmospheres/vare";
import { defineStudio } from "./types";

const MODES = ["auto", "emissive", "absorptive"] as const;

type VareConfig = {
  speed: number;
  opacity: number;
  mode: (typeof MODES)[number];
  interactive: boolean;
  body: string;
  deep: string;
  edge: string;
  // VareParams
  angle: number;
  spread: number;
  wavenumber: number;
  fieldSpeed: number;
  warp: number;
  warpScale: number;
  jitter: number;
  soft: number;
  detail: number;
  node: number;
  gain: number;
  sourceX: number;
  sourceY: number;
  falloff: number;
  span: number;
  lens: number;
  lensSigma: number;
};

const green: VareConfig = {
  speed: 1,
  opacity: 1,
  mode: "auto",
  interactive: true,
  body: "",
  deep: "",
  edge: "",
  angle: 3.64,
  spread: 0.62,
  wavenumber: 3.8,
  fieldSpeed: 0.9,
  warp: 0.7,
  warpScale: 0.55,
  jitter: 0.7,
  soft: 6.5,
  detail: 1.6,
  node: 0.9,
  gain: 1.15,
  sourceX: 1.15,
  sourceY: 0.8,
  falloff: 0.09,
  span: 4,
  lens: 2.2,
  lensSigma: 0.9,
};

const templates: Record<string, VareConfig> = {
  ground: green,
  "dimmed & slow": { ...green, speed: 0.6, opacity: 0.7 },
  "ignores pointer": { ...green, interactive: false },
  faster: { ...green, speed: 1.6 },
};

const params = (c: VareConfig): Partial<VareParams> => ({
  angle: c.angle,
  spread: c.spread,
  wavenumber: c.wavenumber,
  speed: c.fieldSpeed,
  warp: c.warp,
  warpScale: c.warpScale,
  jitter: c.jitter,
  soft: c.soft,
  detail: c.detail,
  node: c.node,
  gain: c.gain,
  source: [c.sourceX, c.sourceY],
  falloff: c.falloff,
  span: c.span,
  lens: c.lens,
  lensSigma: c.lensSigma,
});

const snippet = (c: VareConfig): string => {
  const lines = [`  speed={${c.speed}}`];
  if (c.mode !== "auto") lines.push(`  mode="${c.mode}"`);
  if (c.opacity !== green.opacity) lines.push(`  opacity={${c.opacity}}`);
  if (c.interactive === false) lines.push(`  interactive={false}`);
  const cols: string[] = [];
  if (c.body) cols.push(`body: "${c.body}"`);
  if (c.deep) cols.push(`deep: "${c.deep}"`);
  if (c.edge) cols.push(`edge: "${c.edge}"`);
  if (cols.length) lines.push(`  colors={{ ${cols.join(", ")} }}`);
  const p: string[] = [];
  if (c.angle !== green.angle) p.push(`angle: ${c.angle}`);
  if (c.spread !== green.spread) p.push(`spread: ${c.spread}`);
  if (c.wavenumber !== green.wavenumber) p.push(`wavenumber: ${c.wavenumber}`);
  if (c.fieldSpeed !== green.fieldSpeed) p.push(`speed: ${c.fieldSpeed}`);
  if (c.warp !== green.warp) p.push(`warp: ${c.warp}`);
  if (c.warpScale !== green.warpScale) p.push(`warpScale: ${c.warpScale}`);
  if (c.jitter !== green.jitter) p.push(`jitter: ${c.jitter}`);
  if (c.soft !== green.soft) p.push(`soft: ${c.soft}`);
  if (c.detail !== green.detail) p.push(`detail: ${c.detail}`);
  if (c.node !== green.node) p.push(`node: ${c.node}`);
  if (c.gain !== green.gain) p.push(`gain: ${c.gain}`);
  if (c.sourceX !== green.sourceX || c.sourceY !== green.sourceY)
    p.push(`source: [${c.sourceX}, ${c.sourceY}]`);
  if (c.falloff !== green.falloff) p.push(`falloff: ${c.falloff}`);
  if (c.span !== green.span) p.push(`span: ${c.span}`);
  if (c.lens !== green.lens) p.push(`lens: ${c.lens}`);
  if (c.lensSigma !== green.lensSigma) p.push(`lensSigma: ${c.lensSigma}`);
  if (p.length) lines.push(`  params={{ ${p.join(", ")} }}`);
  return `import { Vare } from "usva/atmospheres/vare";

<Vare
${lines.join("\n")}
>
  <Hero />
</Vare>`;
};

export const vareStudio = defineStudio<VareConfig>({
  name: "vare",
  label: "vare",
  blurb: "broad wavefronts crossing the frame",
  defaultTemplate: "ground",
  stageClassName: "",
  templates,
  snippet,
  render: (c) => (
    <Vare
      speed={c.speed}
      opacity={c.opacity}
      mode={c.mode === "auto" ? undefined : c.mode}
      interactive={c.interactive}
      colors={{
        body: c.body || undefined,
        deep: c.deep || undefined,
        edge: c.edge || undefined,
      }}
      params={params(c)}
      className="flex min-h-[30rem] items-center rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-md">
        <h2 className="text-3xl font-semibold text-ink">bands, not waves</h2>
        <p className="mt-3 text-muted">
          {c.interactive
            ? "move the pointer and the fronts warp as the lens passes"
            : "the fronts travel and ignore the pointer"}
        </p>
      </div>
    </Vare>
  ),
  wallpaper: (c, className) => (
    <Vare
      speed={c.speed}
      opacity={c.opacity}
      mode={c.mode === "auto" ? undefined : c.mode}
      interactive={c.interactive}
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
      sub: "wave rate multiplier",
      min: 0.2,
      max: 2,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "opacity",
      label: "opacity",
      sub: "band strength, 0 to 1",
      min: 0,
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
    {
      kind: "switch",
      key: "interactive",
      label: "interactive",
      sub: "a phase-space lens bends the bands toward the pointer",
    },
    {
      kind: "color",
      key: "body",
      label: "body",
      sub: "the front of the ramp, reads accent",
    },
    {
      kind: "color",
      key: "deep",
      label: "deep",
      sub: "the back of the ramp",
    },
    {
      kind: "color",
      key: "edge",
      label: "edge",
      sub: "the bright nodes where fronts cross",
    },
    {
      kind: "slider",
      key: "angle",
      advanced: true,
      label: "angle",
      sub: "shared travel direction of the fronts, radians",
      min: 0,
      max: 6.28,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "spread",
      advanced: true,
      label: "spread",
      sub: "half-width of the k-vector fan, radians",
      min: 0,
      max: 1.5,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "wavenumber",
      advanced: true,
      label: "wavenumber",
      sub: "base band frequency, each front scatters around it",
      min: 1,
      max: 8,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "fieldSpeed",
      advanced: true,
      label: "field speed",
      sub: "intrinsic travel rate of the fronts",
      min: 0,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "warp",
      advanced: true,
      label: "warp",
      sub: "amplitude of the domain warp that bends the field",
      min: 0,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "warpScale",
      advanced: true,
      label: "warpScale",
      sub: "spatial scale of that warp",
      min: 0.1,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "jitter",
      advanced: true,
      label: "jitter",
      sub: "per-front phase drift, keeps fronts from lining up",
      min: 0,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "soft",
      advanced: true,
      label: "soft",
      sub: "ridge exponent, higher is a narrower boundary",
      min: 1,
      max: 12,
      step: 0.5,
    },
    {
      kind: "slider",
      key: "detail",
      advanced: true,
      label: "detail",
      sub: "frequency of the band-thickness noise",
      min: 0,
      max: 4,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "node",
      advanced: true,
      label: "node",
      sub: "extra light where two fronts cross",
      min: 0,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "gain",
      advanced: true,
      label: "gain",
      sub: "overall brightness of the ramp",
      min: 0.5,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "sourceX",
      advanced: true,
      label: "source · x",
      sub: "off-frame origin x, half-height units by aspect",
      min: -2,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "sourceY",
      advanced: true,
      label: "source · y",
      sub: "off-frame origin y, half-height units",
      min: -2,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "falloff",
      advanced: true,
      label: "falloff",
      sub: "inverse-square decay, higher voids sooner",
      min: 0,
      max: 0.3,
      step: 0.005,
    },
    {
      kind: "slider",
      key: "span",
      advanced: true,
      label: "span",
      sub: "distance over which the hue ramps front to back",
      min: 1,
      max: 8,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "lens",
      advanced: true,
      label: "lens",
      sub: "strength of the pointer lens in phase space",
      min: 0,
      max: 5,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "lensSigma",
      advanced: true,
      label: "lensSigma",
      sub: "reach of that lens",
      min: 0.2,
      max: 2,
      step: 0.05,
    },
  ],
});
