import { Kynnos, type KynnosParams } from "@usva-ui/react/atmospheres/kynnos";
import { defineStudio } from "./types";

type KynnosConfig = {
  speed: number;
  opacity: number;
  mode: "auto" | "emissive" | "absorptive";
  // KynnosLight
  dirX: number;
  dirY: number;
  dirZ: number;
  lightColor: string;
  // KynnosParams
  originX: number;
  originY: number;
  spin: number;
  furrowFreq: number;
  warpAmt: number;
  warpFreq: number;
  breakAmt: number;
  ridgeShape: number;
  depth: number;
  slope: number;
  microScale: number;
  microAmt: number;
  crackScale: number;
  crackAmt: number;
  ao: number;
  rough: number;
  ambient: number;
  key: number;
  drift: number;
  dither: number;
};

const base: KynnosConfig = {
  speed: 1,
  opacity: 1,
  mode: "auto",
  dirX: -0.72,
  dirY: 0.5,
  dirZ: 0.34,
  lightColor: "",
  originX: -1.05,
  originY: 0.78,
  spin: (2 * Math.PI) / 90,
  furrowFreq: 16,
  warpAmt: 2.8,
  warpFreq: 2.1,
  breakAmt: 0.22,
  ridgeShape: 1.9,
  depth: 0.03,
  slope: 1,
  microScale: 180,
  microAmt: 0.34,
  crackScale: 90,
  crackAmt: 0.5,
  ao: 0.9,
  rough: 0.9,
  ambient: 0.42,
  key: 0.78,
  drift: 0.012,
  dither: 0.006,
};

const templates: Record<string, KynnosConfig> = {
  "raked clay": base,
  "forced metal": { ...base, mode: "emissive", lightColor: "#cfe8a0" },
  "key from the right": { ...base, dirX: 0.86, dirY: -0.42, dirZ: 0.28 },
  "deep furrows": { ...base, furrowFreq: 26, breakAmt: 0.4, depth: 0.045 },
  "no grain, no cracks": { ...base, microAmt: 0, crackAmt: 0 },
};

const paramsOf = (c: KynnosConfig): Partial<KynnosParams> => ({
  origin: [c.originX, c.originY],
  spin: c.spin,
  furrowFreq: c.furrowFreq,
  warpAmt: c.warpAmt,
  warpFreq: c.warpFreq,
  breakAmt: c.breakAmt,
  ridgeShape: c.ridgeShape,
  depth: c.depth,
  slope: c.slope,
  microScale: c.microScale,
  microAmt: c.microAmt,
  crackScale: c.crackScale,
  crackAmt: c.crackAmt,
  ao: c.ao,
  rough: c.rough,
  ambient: c.ambient,
  key: c.key,
  drift: c.drift,
  dither: c.dither,
});

const snippet = (c: KynnosConfig): string => {
  const lines: string[] = [];
  if (c.speed !== base.speed) lines.push(`  speed={${c.speed}}`);
  if (c.opacity !== base.opacity) lines.push(`  opacity={${c.opacity}}`);
  if (c.mode !== "auto") lines.push(`  mode="${c.mode}"`);
  const lightParts = [`direction: [${c.dirX}, ${c.dirY}, ${c.dirZ}]`];
  if (c.lightColor) lightParts.push(`color: "${c.lightColor}"`);
  lines.push(`  light={{ ${lightParts.join(", ")} }}`);

  const p: string[] = [];
  if (c.originX !== base.originX || c.originY !== base.originY)
    p.push(`origin: [${c.originX}, ${c.originY}]`);
  if (c.spin !== base.spin) p.push(`spin: ${c.spin}`);
  if (c.furrowFreq !== base.furrowFreq) p.push(`furrowFreq: ${c.furrowFreq}`);
  if (c.warpAmt !== base.warpAmt) p.push(`warpAmt: ${c.warpAmt}`);
  if (c.warpFreq !== base.warpFreq) p.push(`warpFreq: ${c.warpFreq}`);
  if (c.breakAmt !== base.breakAmt) p.push(`breakAmt: ${c.breakAmt}`);
  if (c.ridgeShape !== base.ridgeShape) p.push(`ridgeShape: ${c.ridgeShape}`);
  if (c.depth !== base.depth) p.push(`depth: ${c.depth}`);
  if (c.slope !== base.slope) p.push(`slope: ${c.slope}`);
  if (c.microScale !== base.microScale) p.push(`microScale: ${c.microScale}`);
  if (c.microAmt !== base.microAmt) p.push(`microAmt: ${c.microAmt}`);
  if (c.crackScale !== base.crackScale) p.push(`crackScale: ${c.crackScale}`);
  if (c.crackAmt !== base.crackAmt) p.push(`crackAmt: ${c.crackAmt}`);
  if (c.ao !== base.ao) p.push(`ao: ${c.ao}`);
  if (c.rough !== base.rough) p.push(`rough: ${c.rough}`);
  if (c.ambient !== base.ambient) p.push(`ambient: ${c.ambient}`);
  if (c.key !== base.key) p.push(`key: ${c.key}`);
  if (c.drift !== base.drift) p.push(`drift: ${c.drift}`);
  if (c.dither !== base.dither) p.push(`dither: ${c.dither}`);
  if (p.length) lines.push(`  params={{ ${p.join(", ")} }}`);

  return `import { Kynnos } from "@usva-ui/react/atmospheres/kynnos";

<Kynnos
${lines.join("\n")}
  className="min-h-svh"
>
  <Hero />
</Kynnos>`;
};

export const kynnosStudio = defineStudio<KynnosConfig>({
  name: "kynnos",
  label: "kynnos",
  blurb: "freshly turned earth on a slow wheel",
  defaultTemplate: "raked clay",
  stageClassName: "",
  templates,
  snippet,
  render: (c) => (
    <Kynnos
      speed={c.speed}
      opacity={c.opacity}
      mode={c.mode === "auto" ? undefined : c.mode}
      light={{
        direction: [c.dirX, c.dirY, c.dirZ],
        color: c.lightColor || undefined,
      }}
      params={paramsOf(c)}
      className="flex min-h-[30rem] items-end rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-md">
        <h2 className="text-3xl font-semibold text-ink">thrown, not printed</h2>
        <p className="mt-3 text-muted">
          furrows turning on a wheel at about ninety seconds a revolution
        </p>
      </div>
    </Kynnos>
  ),
  wallpaper: (c, className) => (
    <Kynnos
      speed={c.speed}
      opacity={c.opacity}
      mode={c.mode === "auto" ? undefined : c.mode}
      light={{
        direction: [c.dirX, c.dirY, c.dirZ],
        color: c.lightColor || undefined,
      }}
      params={paramsOf(c)}
      className={className}
    />
  ),
  fields: [
    {
      kind: "slider",
      key: "speed",
      label: "speed",
      sub: "wheel and drift rate",
      min: 0.2,
      max: 3,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "opacity",
      label: "opacity",
      sub: "surface strength, 0 to 1",
      min: 0.1,
      max: 1,
      step: 0.05,
    },
    {
      kind: "select",
      key: "mode",
      label: "mode",
      sub: "auto lets the ground decide clay or metal",
      options: ["auto", "emissive", "absorptive"],
    },
    {
      kind: "slider",
      key: "dirX",
      advanced: true,
      label: "light.x",
      sub: "key azimuth, left to right",
      min: -1,
      max: 1,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "dirY",
      advanced: true,
      label: "light.y",
      sub: "key azimuth, up to down",
      min: -1,
      max: 1,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "dirZ",
      advanced: true,
      label: "light.z",
      sub: "grazing height, keep it low",
      min: 0.1,
      max: 0.9,
      step: 0.02,
    },
    {
      kind: "color",
      key: "lightColor",
      advanced: true,
      label: "light.color",
      sub: "the key colour",
    },
    {
      kind: "slider",
      key: "originX",
      advanced: true,
      label: "origin · x",
      sub: "wheel origin, forced off-frame",
      min: -2,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "originY",
      advanced: true,
      label: "origin · y",
      sub: "wheel origin, y up",
      min: -2,
      max: 2,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "spin",
      advanced: true,
      label: "spin",
      sub: "radians per second about the origin",
      min: 0,
      max: 0.2,
      step: 0.005,
    },
    {
      kind: "slider",
      key: "furrowFreq",
      advanced: true,
      label: "furrowFreq",
      sub: "furrows per unit radius",
      min: 8,
      max: 32,
      step: 1,
    },
    {
      kind: "slider",
      key: "warpAmt",
      advanced: true,
      label: "warpAmt",
      sub: "radial warp in furrow spacings, 2 to 4.5",
      min: 2,
      max: 4.5,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "warpFreq",
      advanced: true,
      label: "warpFreq",
      sub: "spatial frequency of the warp noise",
      min: 0.5,
      max: 6,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "breakAmt",
      advanced: true,
      label: "breakAmt",
      sub: "how readily a furrow breaks",
      min: 0,
      max: 0.5,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "ridgeShape",
      advanced: true,
      label: "ridgeShape",
      sub: "profile exponent, above 1 pinches the crest",
      min: 1,
      max: 4,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "depth",
      advanced: true,
      label: "depth",
      sub: "furrow depth",
      min: 0.01,
      max: 0.06,
      step: 0.005,
    },
    {
      kind: "slider",
      key: "slope",
      advanced: true,
      label: "slope",
      sub: "gain on the height gradient",
      min: 0.2,
      max: 3,
      step: 0.1,
    },
    {
      kind: "slider",
      key: "microScale",
      advanced: true,
      label: "microScale",
      sub: "grain frequency",
      min: 40,
      max: 400,
      step: 10,
    },
    {
      kind: "slider",
      key: "microAmt",
      advanced: true,
      label: "microAmt",
      sub: "grain on the normal only",
      min: 0,
      max: 0.6,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "crackScale",
      advanced: true,
      label: "crackScale",
      sub: "craquelure cell frequency",
      min: 20,
      max: 200,
      step: 5,
    },
    {
      kind: "slider",
      key: "crackAmt",
      advanced: true,
      label: "crackAmt",
      sub: "craquelure strength",
      min: 0,
      max: 1,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "ao",
      advanced: true,
      label: "ao",
      sub: "crevice occlusion strength",
      min: 0,
      max: 1.5,
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
      step: 0.05,
    },
    {
      kind: "slider",
      key: "ambient",
      advanced: true,
      label: "ambient",
      sub: "ambient fill",
      min: 0,
      max: 1,
      step: 0.02,
    },
    {
      kind: "slider",
      key: "key",
      advanced: true,
      label: "key",
      sub: "key light strength",
      min: 0,
      max: 1.5,
      step: 0.05,
    },
    {
      kind: "slider",
      key: "drift",
      advanced: true,
      label: "drift",
      sub: "how fast the noise fields evolve on their own",
      min: 0,
      max: 0.1,
      step: 0.002,
    },
    {
      kind: "slider",
      key: "dither",
      advanced: true,
      label: "dither",
      sub: "dither amplitude against banding",
      min: 0,
      max: 0.03,
      step: 0.002,
    },
  ],
});
