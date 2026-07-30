import type { KajastusParams } from "@usva-ui/react/atmospheres/kajastus";
import { Kajastus } from "@usva-ui/react/atmospheres/kajastus";
import { DarkStage } from "@/components/dark-stage";
import { defineStudio } from "./types";

const MODES = ["auto", "emissive", "absorptive"] as const;

type KajastusConfig = {
  speed: number;
  opacity: number;
  mode: (typeof MODES)[number];
  low: string;
  high: string;
  star: string;
  // KajastusParams
  pitch: number;
  curve: number;
  fold: number;
  foldScale: number;
  warp: number;
  offset: number;
  width: number;
  detail: number;
  threshold: number;
  drift: number;
  rayFreq: number;
  raySpeed: number;
  far: number;
  exposure: number;
  stars: number;
  corridor: number;
  corridorY: number;
  corridorH: number;
};

const vault: KajastusConfig = {
  speed: 1,
  opacity: 1,
  mode: "auto",
  low: "",
  high: "",
  star: "",
  pitch: 0.42,
  curve: 0.018,
  fold: 7,
  foldScale: 0.045,
  warp: 9,
  offset: -6,
  width: 1.8,
  detail: 0.5,
  threshold: 0.28,
  drift: 0.06,
  rayFreq: 2.4,
  raySpeed: 0.9,
  far: 0.025,
  exposure: 6.5,
  stars: 0.22,
  corridor: 0.34,
  corridorY: -0.25,
  corridorH: 0.6,
};

const templates: Record<string, KajastusConfig> = {
  "kajo vault": vault,
  "corridor closed": { ...vault, corridor: 0 },
  starfield: { ...vault, stars: 0.9 },
  "stepped back": { ...vault, opacity: 0.55, speed: 0.5 },
};

const params = (c: KajastusConfig): Partial<KajastusParams> => ({
  pitch: c.pitch,
  curve: c.curve,
  fold: c.fold,
  foldScale: c.foldScale,
  warp: c.warp,
  offset: c.offset,
  width: c.width,
  detail: c.detail,
  threshold: c.threshold,
  drift: c.drift,
  rayFreq: c.rayFreq,
  raySpeed: c.raySpeed,
  far: c.far,
  exposure: c.exposure,
  stars: c.stars,
  corridor: c.corridor,
  corridorY: c.corridorY,
  corridorH: c.corridorH,
});

const snippet = (c: KajastusConfig): string => {
  const lines = [`  speed={${c.speed}}`];
  if (c.opacity !== vault.opacity) lines.push(`  opacity={${c.opacity}}`);
  if (c.mode !== "auto") lines.push(`  mode="${c.mode}"`);
  const cols: string[] = [];
  if (c.low) cols.push(`low: "${c.low}"`);
  if (c.high) cols.push(`high: "${c.high}"`);
  if (c.star) cols.push(`star: "${c.star}"`);
  if (cols.length) lines.push(`  colors={{ ${cols.join(", ")} }}`);
  const p: string[] = [];
  if (c.pitch !== vault.pitch) p.push(`pitch: ${c.pitch}`);
  if (c.curve !== vault.curve) p.push(`curve: ${c.curve}`);
  if (c.fold !== vault.fold) p.push(`fold: ${c.fold}`);
  if (c.foldScale !== vault.foldScale) p.push(`foldScale: ${c.foldScale}`);
  if (c.warp !== vault.warp) p.push(`warp: ${c.warp}`);
  if (c.offset !== vault.offset) p.push(`offset: ${c.offset}`);
  if (c.width !== vault.width) p.push(`width: ${c.width}`);
  if (c.detail !== vault.detail) p.push(`detail: ${c.detail}`);
  if (c.threshold !== vault.threshold) p.push(`threshold: ${c.threshold}`);
  if (c.drift !== vault.drift) p.push(`drift: ${c.drift}`);
  if (c.rayFreq !== vault.rayFreq) p.push(`rayFreq: ${c.rayFreq}`);
  if (c.raySpeed !== vault.raySpeed) p.push(`raySpeed: ${c.raySpeed}`);
  if (c.far !== vault.far) p.push(`far: ${c.far}`);
  if (c.exposure !== vault.exposure) p.push(`exposure: ${c.exposure}`);
  if (c.stars !== vault.stars) p.push(`stars: ${c.stars}`);
  if (c.corridor !== vault.corridor) p.push(`corridor: ${c.corridor}`);
  if (c.corridorY !== vault.corridorY) p.push(`corridorY: ${c.corridorY}`);
  if (c.corridorH !== vault.corridorH) p.push(`corridorH: ${c.corridorH}`);
  if (p.length) lines.push(`  params={{ ${p.join(", ")} }}`);
  return `import { Kajastus } from "@usva-ui/react/atmospheres/kajastus";

<Kajastus
${lines.join("\n")}
>
  <Hero />
</Kajastus>`;
};

export const kajastusStudio = defineStudio<KajastusConfig>({
  name: "kajastus",
  label: "kajastus",
  blurb: "a curved roof of folded light over the viewport",
  defaultTemplate: "kajo vault",
  stageClassName: "",
  templates,
  snippet,
  render: (c) => (
    <DarkStage>
      <Kajastus
        speed={c.speed}
        opacity={c.opacity}
        mode={c.mode === "auto" ? undefined : c.mode}
        colors={{
          low: c.low || undefined,
          high: c.high || undefined,
          star: c.star || undefined,
        }}
        params={params(c)}
        className="flex min-h-[30rem] items-end rounded-xl bg-bg p-8 sm:p-10"
      >
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold text-ink">under the vault</h2>
          <p className="mt-3 text-muted">
            {c.corridor > 0
              ? "the field thins into a corridor where the type sits, so the words keep their ground"
              : "no corridor, and the type has to fight the field for contrast"}
          </p>
        </div>
      </Kajastus>
    </DarkStage>
  ),
  wallpaper: (c, className) => (
    <Kajastus
      speed={c.speed}
      opacity={c.opacity}
      mode={c.mode === "auto" ? undefined : c.mode}
      colors={{
        low: c.low || undefined,
        high: c.high || undefined,
        star: c.star || undefined,
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
      sub: "ray and fold drift rate",
      min: 0.2,
      max: 2,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "opacity",
      label: "opacity",
      sub: "vault strength, 0 to 1",
      min: 0.1,
      max: 1,
      step: 0.05,
    },
    {
      kind: "select",
      key: "mode",
      label: "mode",
      sub: "dark grounds emit, light grounds stain",
      options: MODES,
    },
    {
      kind: "color",
      key: "low",
      label: "low",
      sub: "green low and distant, reads accent-alt",
    },
    {
      kind: "color",
      key: "high",
      label: "high",
      sub: "violet climbing the folds, reads accent",
    },
    {
      kind: "color",
      key: "star",
      label: "star",
      sub: "the cold field behind, reads ink",
    },
    {
      kind: "slider",
      key: "corridor",
      label: "corridor",
      sub: "depth of the low-density cut for the type",
      min: 0,
      max: 1,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "stars",
      label: "stars",
      sub: "cold field behind, 0 for a clean sky",
      min: 0,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "pitch",
      advanced: true,
      label: "pitch",
      sub: "how far the eye tilts up, radians",
      min: 0,
      max: 1.5,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "curve",
      advanced: true,
      label: "curve",
      sub: "curvature of the ceiling, arches the edges down",
      min: 0,
      max: 0.1,
      step: 0.002,
    },
    {
      kind: "slider",
      key: "fold",
      advanced: true,
      label: "fold",
      sub: "how far the ribbon meanders across the sky",
      min: 0,
      max: 20,
      step: 0.5,
    },
    {
      kind: "slider",
      key: "foldScale",
      advanced: true,
      label: "foldScale",
      sub: "wavelength of the meander, smaller is longer",
      min: 0.01,
      max: 0.2,
      step: 0.005,
    },
    {
      kind: "slider",
      key: "warp",
      advanced: true,
      label: "warp",
      sub: "one-axis domain warp so folds stay folds",
      min: 0,
      max: 20,
      step: 0.5,
    },
    {
      kind: "slider",
      key: "offset",
      advanced: true,
      label: "offset",
      sub: "where the ribbon sits relative to the eye",
      min: -15,
      max: 5,
      step: 0.5,
    },
    {
      kind: "slider",
      key: "width",
      advanced: true,
      label: "width",
      sub: "thickness of the sheet",
      min: 0.5,
      max: 4,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "detail",
      advanced: true,
      label: "detail",
      sub: "across-ribbon detail, along is 8x this",
      min: 0.1,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "threshold",
      advanced: true,
      label: "threshold",
      sub: "cuts the noise floor that keeps the frame empty",
      min: 0,
      max: 1,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "drift",
      advanced: true,
      label: "drift",
      sub: "lateral drift of the fine structure",
      min: 0,
      max: 0.5,
      step: 0.01,
    },
    {
      kind: "slider",
      key: "rayFreq",
      advanced: true,
      label: "rayFreq",
      sub: "vertical wavelength of the streaming rays",
      min: 0,
      max: 8,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "raySpeed",
      advanced: true,
      label: "raySpeed",
      sub: "how fast the rays run up the ribbon",
      min: 0,
      max: 3,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "far",
      advanced: true,
      label: "far",
      sub: "distance extinction and the horizon AA budget",
      min: 0.005,
      max: 0.1,
      step: 0.005,
    },
    {
      kind: "slider",
      key: "exposure",
      advanced: true,
      label: "exposure",
      sub: "brightness of the field",
      min: 1,
      max: 15,
      step: 0.5,
    },
    {
      kind: "slider",
      key: "corridorY",
      advanced: true,
      label: "corridorY",
      sub: "vertical centre of the corridor, -1 to 1",
      min: -1,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "corridorH",
      advanced: true,
      label: "corridorH",
      sub: "corridor height",
      min: 0.1,
      max: 2,
      step: 0.05,
    },
  ],
});
