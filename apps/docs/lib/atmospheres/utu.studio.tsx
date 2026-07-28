import type { UtuParams } from "usva/atmospheres/utu";
import { Utu } from "usva/atmospheres/utu";
import { defineStudio } from "./types";

const MODES = ["auto", "emissive", "absorptive"] as const;

type UtuConfig = {
  mode: (typeof MODES)[number];
  speed: number;
  opacity: number;
  bands: number;
  interactive: boolean;
  accentColor: string;
  deep: string;
  mid: string;
  hot: string;
  radius: number;
  swirl: number;
  omega: number;
  noiseFreq: number;
  noiseAmp: number;
  noiseBase: number;
  drift: number;
  wispSigma: number;
  wispAmt: number;
  wispDrift: number;
  absorb: number;
  exposure: number;
  breathAmt: number;
  breathRate: number;
};

const dawn: UtuConfig = {
  mode: "auto",
  speed: 1,
  opacity: 1,
  bands: 5,
  interactive: false,
  accentColor: "",
  deep: "",
  mid: "",
  hot: "",
  radius: 1.65,
  swirl: 2.2,
  omega: 0.12,
  noiseFreq: 1.6,
  noiseAmp: 0.85,
  noiseBase: 0.22,
  drift: 0.08,
  wispSigma: 0.12,
  wispAmt: 0.35,
  wispDrift: 0.2,
  absorb: 1.1,
  exposure: 10,
  breathAmt: 0.06,
  breathRate: 0.05,
};

const templates: Record<string, UtuConfig> = {
  "dawn fog": dawn,
  "savi damp": { ...dawn, mode: "absorptive" },
  "leans on pointer": { ...dawn, interactive: true },
  "dense · 12 bands": { ...dawn, bands: 12 },
  "shedding wisps": { ...dawn, wispAmt: 0.7, wispDrift: 0.45, swirl: 3.4 },
  "sea palette": { ...dawn, deep: "#0f2a4a", mid: "#1f9e8a", hot: "#eaf39a" },
};

const params = (c: UtuConfig): Partial<UtuParams> => ({
  radius: c.radius,
  swirl: c.swirl,
  omega: c.omega,
  noiseFreq: c.noiseFreq,
  noiseAmp: c.noiseAmp,
  noiseBase: c.noiseBase,
  drift: c.drift,
  wispSigma: c.wispSigma,
  wispAmt: c.wispAmt,
  wispDrift: c.wispDrift,
  absorb: c.absorb,
  exposure: c.exposure,
  breathAmt: c.breathAmt,
  breathRate: c.breathRate,
});

const snippet = (c: UtuConfig): string => {
  const cols: string[] = [];
  if (c.deep) cols.push(`deep: "${c.deep}"`);
  if (c.mid) cols.push(`mid: "${c.mid}"`);
  if (c.hot) cols.push(`hot: "${c.hot}"`);
  const lines = [
    c.mode !== "auto" && `  mode="${c.mode}"`,
    c.speed !== 1 && `  speed={${c.speed}}`,
    c.opacity !== 1 && `  opacity={${c.opacity}}`,
    c.bands !== 5 && `  bands={${c.bands}}`,
    c.interactive && "  interactive",
    c.accentColor && `  accentColor="${c.accentColor}"`,
    cols.length && `  colors={{ ${cols.join(", ")} }}`,
  ].filter(Boolean);
  const p: string[] = [];
  if (c.radius !== dawn.radius) p.push(`radius: ${c.radius}`);
  if (c.swirl !== dawn.swirl) p.push(`swirl: ${c.swirl}`);
  if (c.omega !== dawn.omega) p.push(`omega: ${c.omega}`);
  if (c.noiseFreq !== dawn.noiseFreq) p.push(`noiseFreq: ${c.noiseFreq}`);
  if (c.noiseAmp !== dawn.noiseAmp) p.push(`noiseAmp: ${c.noiseAmp}`);
  if (c.noiseBase !== dawn.noiseBase) p.push(`noiseBase: ${c.noiseBase}`);
  if (c.drift !== dawn.drift) p.push(`drift: ${c.drift}`);
  if (c.wispSigma !== dawn.wispSigma) p.push(`wispSigma: ${c.wispSigma}`);
  if (c.wispAmt !== dawn.wispAmt) p.push(`wispAmt: ${c.wispAmt}`);
  if (c.wispDrift !== dawn.wispDrift) p.push(`wispDrift: ${c.wispDrift}`);
  if (c.absorb !== dawn.absorb) p.push(`absorb: ${c.absorb}`);
  if (c.exposure !== dawn.exposure) p.push(`exposure: ${c.exposure}`);
  if (c.breathAmt !== dawn.breathAmt) p.push(`breathAmt: ${c.breathAmt}`);
  if (c.breathRate !== dawn.breathRate) p.push(`breathRate: ${c.breathRate}`);
  const paramsStr = p.length ? `\n  params={{ ${p.join(", ")} }}` : "";
  const attrs = lines.length ? `\n${lines.join("\n")}` : "";
  return `import { Utu } from "usva/atmospheres/utu";

<Utu${attrs}${paramsStr}${attrs || paramsStr ? "\n" : ""}>
  <Hero />
</Utu>`;
};

const caption = (c: UtuConfig): string =>
  c.mode === "absorptive"
    ? "the same density read as quiet damp soaking into the clay"
    : c.interactive
      ? "move the cursor and the volume leans into it"
      : "fog that turns and breathes, and leaves the words clear";

export const utuStudio = defineStudio<UtuConfig>({
  name: "utu",
  label: "utu",
  blurb: "morning fog made into a luminous field",
  defaultTemplate: "dawn fog",
  stageClassName: "",
  templates,
  snippet,
  render: (c) => (
    <Utu
      mode={c.mode === "auto" ? undefined : c.mode}
      speed={c.speed}
      opacity={c.opacity}
      bands={c.bands}
      interactive={c.interactive}
      accentColor={c.accentColor || undefined}
      colors={{
        deep: c.deep || undefined,
        mid: c.mid || undefined,
        hot: c.hot || undefined,
      }}
      params={params(c)}
      className="grid min-h-[28rem] place-items-center rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-sm text-center">
        <h2 className="text-3xl font-semibold text-ink">a faint glow</h2>
        <p className="mt-3 text-muted">{caption(c)}</p>
      </div>
    </Utu>
  ),
  wallpaper: (c, className) => (
    <Utu
      mode={c.mode === "auto" ? undefined : c.mode}
      speed={c.speed}
      opacity={c.opacity}
      bands={c.bands}
      interactive={c.interactive}
      accentColor={c.accentColor || undefined}
      colors={{
        deep: c.deep || undefined,
        mid: c.mid || undefined,
        hot: c.hot || undefined,
      }}
      params={params(c)}
      className={className}
    />
  ),
  fields: [
    {
      kind: "select",
      key: "mode",
      label: "mode",
      sub: "auto reads the ground; force emit or damp stain",
      options: MODES,
    },
    {
      kind: "slider",
      key: "speed",
      label: "speed",
      sub: "rotation and breath rate",
      min: 0.2,
      max: 2,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "opacity",
      label: "opacity",
      sub: "fog strength, 0 to 1",
      min: 0.1,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "bands",
      label: "bands",
      sub: "glowing contour-shells through the body",
      min: 2,
      max: 16,
      step: 1,
    },
    {
      kind: "switch",
      key: "interactive",
      label: "interactive",
      sub: "the volume leans toward the pointer",
    },
    {
      kind: "color",
      key: "accentColor",
      label: "accentColor",
      sub: "collapses the dawn gradient to one brand colour",
    },
    {
      kind: "color",
      key: "deep",
      label: "deep",
      sub: "the valleys, oldest fog",
    },
    {
      kind: "color",
      key: "mid",
      label: "mid",
      sub: "the body of the glow",
    },
    {
      kind: "color",
      key: "hot",
      label: "hot",
      sub: "the blown-out cores",
    },
    {
      kind: "slider",
      key: "radius",
      advanced: true,
      label: "radius",
      sub: "sphere size in short-side units",
      min: 0.8,
      max: 2.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "swirl",
      advanced: true,
      label: "swirl",
      sub: "twist per unit height, the helix strength",
      min: 0,
      max: 6,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "omega",
      advanced: true,
      label: "omega",
      sub: "rotation speed of the whole body",
      min: 0,
      max: 0.5,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "noiseFreq",
      advanced: true,
      label: "noiseFreq",
      sub: "scale of the interior texture",
      min: 0.2,
      max: 4,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "noiseAmp",
      advanced: true,
      label: "noiseAmp",
      sub: "strength of that texture",
      min: 0,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "noiseBase",
      advanced: true,
      label: "noiseBase",
      sub: "floor density so fills stay present",
      min: 0,
      max: 1,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "drift",
      advanced: true,
      label: "drift",
      sub: "how fast the noise field advects",
      min: 0,
      max: 0.5,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "wispSigma",
      advanced: true,
      label: "wispSigma",
      sub: "vertical width of the equator wisp",
      min: 0.02,
      max: 0.4,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "wispAmt",
      advanced: true,
      label: "wispAmt",
      sub: "how far density leaks into the tails",
      min: 0,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "wispDrift",
      advanced: true,
      label: "wispDrift",
      sub: "sideways shedding speed of the wisps",
      min: 0,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "absorb",
      advanced: true,
      label: "absorb",
      sub: "self-occlusion strength",
      min: 0,
      max: 3,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "exposure",
      advanced: true,
      label: "exposure",
      sub: "tone-map exposure, hot cores clip to white",
      min: 2,
      max: 20,
      step: 0.5,
    },
    {
      kind: "slider",
      key: "breathAmt",
      advanced: true,
      label: "breathAmt",
      sub: "depth of the slow breath",
      min: 0,
      max: 0.3,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "breathRate",
      advanced: true,
      label: "breathRate",
      sub: "rate of the slow breath",
      min: 0,
      max: 0.3,
      step: 0.01,
    },
  ],
});
