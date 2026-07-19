import { Kuulto } from "@matt-pasek/usva";
import { DarkStage } from "@/components/dark-stage";
import { defineStudio } from "./types";

const MODES = ["auto", "emissive", "absorptive"] as const;

type KuultoConfig = {
  speed: number;
  opacity: number;
  mode: (typeof MODES)[number];
  interactive: boolean;
  key: string;
  fill: string;
  rim: string;
  scale: number;
  relief: number;
  crease: number;
  creaseWidth: number;
  drift: number;
  drape: number;
  drapeScale: number;
  sheen: number;
  gloss: number;
  wrap: number;
  contrast: number;
  purity: number;
  keyX: number;
  keyY: number;
  keyZ: number;
  fillX: number;
  fillY: number;
  fillZ: number;
  rimX: number;
  rimY: number;
  rimZ: number;
  tilt: number;
  gain: number;
};

const silk: KuultoConfig = {
  speed: 1,
  opacity: 1,
  mode: "auto",
  interactive: true,
  key: "",
  fill: "",
  rim: "",
  scale: 1.2,
  relief: 3,
  crease: 1.15,
  creaseWidth: 1,
  drift: 0.06,
  drape: 0.45,
  drapeScale: 0.35,
  sheen: 36,
  gloss: 1,
  wrap: 0.08,
  contrast: 4.5,
  purity: 1.9,
  keyX: -0.8,
  keyY: 0.45,
  keyZ: 0.3,
  fillX: 0.85,
  fillY: -0.35,
  fillZ: 0.26,
  rimX: 0.1,
  rimY: 0.95,
  rimZ: 0.22,
  tilt: 0.55,
  gain: 1.35,
};

const templates: Record<string, KuultoConfig> = {
  silk,
  "high relief": { ...silk, relief: 4.5, crease: 1.3 },
  matte: { ...silk, gloss: 0 },
  "still lamps": { ...silk, interactive: false },
  recoloured: {
    ...silk,
    speed: 0.6,
    opacity: 0.75,
    key: "#7c3aed",
    fill: "#155e75",
    rim: "#22c55e",
  },
};

const captionFor = (c: KuultoConfig): string => {
  if (c.gloss === 0)
    return "no specular term: the folds hold, but the silk is gone. gloss is what tells cloth from paper";
  if (!c.interactive)
    return "the lamps hold still and the drape simply drifts; on, the cursor swings the key lamp";
  if (c.relief >= 4.5)
    return "steeper folds sweep the full set of lamps, which is where the chroma comes from";
  return "no palette is sampled here; a fold takes the hue of whichever lamp it turns toward";
};

const params = (c: KuultoConfig) => ({
  scale: c.scale,
  relief: c.relief,
  crease: c.crease,
  creaseWidth: c.creaseWidth,
  drift: c.drift,
  drape: c.drape,
  drapeScale: c.drapeScale,
  sheen: c.sheen,
  gloss: c.gloss,
  wrap: c.wrap,
  contrast: c.contrast,
  purity: c.purity,
  key: [c.keyX, c.keyY, c.keyZ] as [number, number, number],
  fill: [c.fillX, c.fillY, c.fillZ] as [number, number, number],
  rim: [c.rimX, c.rimY, c.rimZ] as [number, number, number],
  tilt: c.tilt,
  gain: c.gain,
});

const snippet = (c: KuultoConfig): string => {
  const lines = [`  speed={${c.speed}}`];
  if (c.mode !== "auto") lines.push(`  mode="${c.mode}"`);
  if (c.opacity !== silk.opacity) lines.push(`  opacity={${c.opacity}}`);
  if (!c.interactive) lines.push(`  interactive={false}`);
  const cols: string[] = [];
  if (c.key) cols.push(`key: "${c.key}"`);
  if (c.fill) cols.push(`fill: "${c.fill}"`);
  if (c.rim) cols.push(`rim: "${c.rim}"`);
  if (cols.length) lines.push(`  colors={{ ${cols.join(", ")} }}`);
  const p: string[] = [];
  if (c.scale !== silk.scale) p.push(`scale: ${c.scale}`);
  if (c.relief !== silk.relief) p.push(`relief: ${c.relief}`);
  if (c.crease !== silk.crease) p.push(`crease: ${c.crease}`);
  if (c.creaseWidth !== silk.creaseWidth)
    p.push(`creaseWidth: ${c.creaseWidth}`);
  if (c.drift !== silk.drift) p.push(`drift: ${c.drift}`);
  if (c.drape !== silk.drape) p.push(`drape: ${c.drape}`);
  if (c.drapeScale !== silk.drapeScale) p.push(`drapeScale: ${c.drapeScale}`);
  if (c.sheen !== silk.sheen) p.push(`sheen: ${c.sheen}`);
  if (c.gloss !== silk.gloss) p.push(`gloss: ${c.gloss}`);
  if (c.wrap !== silk.wrap) p.push(`wrap: ${c.wrap}`);
  if (c.contrast !== silk.contrast) p.push(`contrast: ${c.contrast}`);
  if (c.purity !== silk.purity) p.push(`purity: ${c.purity}`);
  if (c.keyX !== silk.keyX || c.keyY !== silk.keyY || c.keyZ !== silk.keyZ)
    p.push(`key: [${c.keyX}, ${c.keyY}, ${c.keyZ}]`);
  if (
    c.fillX !== silk.fillX ||
    c.fillY !== silk.fillY ||
    c.fillZ !== silk.fillZ
  )
    p.push(`fill: [${c.fillX}, ${c.fillY}, ${c.fillZ}]`);
  if (c.rimX !== silk.rimX || c.rimY !== silk.rimY || c.rimZ !== silk.rimZ)
    p.push(`rim: [${c.rimX}, ${c.rimY}, ${c.rimZ}]`);
  if (c.tilt !== silk.tilt) p.push(`tilt: ${c.tilt}`);
  if (c.gain !== silk.gain) p.push(`gain: ${c.gain}`);
  if (p.length) lines.push(`  params={{ ${p.join(", ")} }}`);
  return `import { Kuulto } from "@matt-pasek/usva";

<Kuulto
${lines.join("\n")}
>
  <Hero />
</Kuulto>`;
};

export const kuultoStudio = defineStudio<KuultoConfig>({
  name: "kuulto",
  label: "kuulto",
  blurb: "lamplight raking across slow folds of silk",
  defaultTemplate: "silk",
  stageClassName: "",
  templates,
  snippet,
  render: (c) => (
    <DarkStage>
      <Kuulto
        speed={c.speed}
        opacity={c.opacity}
        mode={c.mode === "auto" ? undefined : c.mode}
        interactive={c.interactive}
        colors={{
          key: c.key || undefined,
          fill: c.fill || undefined,
          rim: c.rim || undefined,
        }}
        params={params(c)}
        className="flex min-h-[30rem] items-center rounded-xl bg-bg p-8 sm:p-10"
      >
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold text-ink">
            colour is a shadow
          </h2>
          <p className="mt-3 text-muted">{captionFor(c)}</p>
        </div>
      </Kuulto>
    </DarkStage>
  ),
  wallpaper: (c, className) => (
    <Kuulto
      speed={c.speed}
      opacity={c.opacity}
      mode={c.mode === "auto" ? undefined : c.mode}
      interactive={c.interactive}
      colors={{
        key: c.key || undefined,
        fill: c.fill || undefined,
        rim: c.rim || undefined,
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
      sub: "drift and drape rate",
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
      sub: "the cursor swings the key lamp",
    },
    {
      kind: "color",
      key: "key",
      label: "key",
      sub: "the main lamp, reads accent",
    },
    {
      kind: "color",
      key: "fill",
      label: "fill",
      sub: "the shadow side, reads accent-2",
    },
    {
      kind: "color",
      key: "rim",
      label: "rim",
      sub: "the grazing lamp on the crests",
    },
    {
      kind: "slider",
      key: "relief",
      label: "relief",
      sub: "how steeply a fold turns through the lamps",
      min: 1,
      max: 5,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "crease",
      label: "crease",
      sub: "depth of the pleats",
      min: 0.2,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "gloss",
      label: "gloss",
      sub: "specular weight, silk vs paper",
      min: 0,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "scale",
      advanced: true,
      label: "scale",
      sub: "fold size, smaller pulls the drape back",
      min: 0.3,
      max: 3,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "creaseWidth",
      advanced: true,
      label: "creaseWidth",
      sub: "pleat width, wide is satin, narrow is foil",
      min: 0.2,
      max: 3,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "drift",
      advanced: true,
      label: "drift",
      sub: "how far the pleats travel",
      min: 0,
      max: 0.5,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "drape",
      advanced: true,
      label: "drape",
      sub: "weight of the organic wander over the pleats",
      min: 0,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "drapeScale",
      advanced: true,
      label: "drapeScale",
      sub: "size of that wander",
      min: 0.05,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "sheen",
      advanced: true,
      label: "sheen",
      sub: "specular exponent, high is a tight glint",
      min: 4,
      max: 120,
      step: 1,
    },
    {
      kind: "slider",
      key: "wrap",
      advanced: true,
      label: "wrap",
      sub: "lambert wrap, 0 hard terminator to 1 bled round",
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "contrast",
      advanced: true,
      label: "contrast",
      sub: "power on the wrapped diffuse, high drives to black",
      min: 1,
      max: 10,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "purity",
      advanced: true,
      label: "purity",
      sub: "gamma on the tint, above 1 keeps lamps from greying",
      min: 0.5,
      max: 4,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "keyX",
      advanced: true,
      label: "key · x",
      sub: "key lamp direction, x in eye space",
      min: -1.5,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "keyY",
      advanced: true,
      label: "key · y",
      sub: "key lamp direction, y in eye space",
      min: -1.5,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "keyZ",
      advanced: true,
      label: "key · z",
      sub: "key lamp direction, z toward the eye",
      min: -1.5,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "fillX",
      advanced: true,
      label: "fill · x",
      sub: "fill lamp direction, x in eye space",
      min: -1.5,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "fillY",
      advanced: true,
      label: "fill · y",
      sub: "fill lamp direction, y in eye space",
      min: -1.5,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "fillZ",
      advanced: true,
      label: "fill · z",
      sub: "fill lamp direction, z toward the eye",
      min: -1.5,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "rimX",
      advanced: true,
      label: "rim · x",
      sub: "rim lamp direction, x in eye space",
      min: -1.5,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "rimY",
      advanced: true,
      label: "rim · y",
      sub: "rim lamp direction, y in eye space",
      min: -1.5,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "rimZ",
      advanced: true,
      label: "rim · z",
      sub: "rim lamp direction, z toward the eye",
      min: -1.5,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "tilt",
      advanced: true,
      label: "tilt",
      sub: "how far the pointer swings the key light",
      min: 0,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "gain",
      advanced: true,
      label: "gain",
      sub: "overall brightness of the lit sheet",
      min: 0.2,
      max: 3,
      step: 0.05,
    },
  ],
});
