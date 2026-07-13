import type { BlendMode, Rgb } from "../effects-core/effects-color.js";

export interface KynnosParams {
  /** Wheel origin in normalized units, y up, relative to the container centre. */
  origin: [number, number];
  /** Radians per second. One revolution per ~90s at the default. */
  spin: number;
  /** Furrows per unit radius. */
  furrowFreq: number;
  /** Radial domain warp, measured in furrow spacings, not in radius units. */
  warpAmt: number;
  /** Spatial frequency of the warp noise. */
  warpFreq: number;
  /** How readily a furrow thins out and breaks, 0..0.5. */
  breakAmt: number;
  /** Ridge profile exponent. Above 1 the floor broadens and the crest pinches. */
  ridgeShape: number;
  /** Furrow depth in normalized units. */
  depth: number;
  /** Gain on the height gradient before the normal is built. */
  slope: number;
  /** Grain frequency. */
  microScale: number;
  /** Grain strength. Perturbs the normal only, never the height. */
  microAmt: number;
  /** Craquelure cell frequency. */
  crackScale: number;
  /** Craquelure strength. */
  crackAmt: number;
  /** Crevice occlusion strength. */
  ao: number;
  /** Oren-Nayar roughness. Clay is near-Lambertian and then some. */
  rough: number;
  /** Ambient fill. */
  ambient: number;
  /** Key light strength. */
  key: number;
  /** How fast the noise fields evolve on their own, apart from the wheel. */
  drift: number;
  /** Dither amplitude. Banding is visible on light grounds. */
  dither: number;
}

export const KYNNOS_DEFAULTS: KynnosParams = {
  origin: [-1.05, 0.78],
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

/**
 * Concentric circles are one bad parameter from a vinyl record, so the two
 * defences are floored here rather than left to whoever tunes the props next.
 *
 * The warp is in furrow spacings and the shader's warp field is normalized to
 * about [-1, 1], so a peak displacement of MIN_WARP_TURNS grooves is what the
 * number actually buys. Below ~2 the rings merely wobble and stay legible as
 * rings. Well above ~4 the warp gradient overtakes the radial one, grooves fold
 * back on themselves and the surface turns to mush.
 */
export const MIN_WARP_TURNS = 2;
export const MAX_WARP_TURNS = 4.5;

/**
 * The wheel origin has to sit outside the frame or its convergence point is
 * visible, and a visible convergence point is the vinyl label. Whichever axis is
 * the shorter one spans exactly [-0.5, 0.5] in shader units, so forcing both
 * components past that puts the origin off-frame at every aspect ratio.
 */
export const MIN_ORIGIN_OFFSET = 0.62;

function offFrame(v: number): number {
  const sign = v < 0 ? -1 : 1;
  return sign * Math.max(Math.abs(v), MIN_ORIGIN_OFFSET);
}

export function resolveParams(
  overrides: Partial<KynnosParams> = {},
): KynnosParams {
  const merged = { ...KYNNOS_DEFAULTS, ...overrides };
  return {
    ...merged,
    origin: [offFrame(merged.origin[0]), offFrame(merged.origin[1])],
    furrowFreq: Math.max(merged.furrowFreq, 1),
    warpAmt: Math.min(Math.max(merged.warpAmt, MIN_WARP_TURNS), MAX_WARP_TURNS),
    ridgeShape: Math.max(merged.ridgeShape, 1),
    breakAmt: Math.min(Math.max(merged.breakAmt, 0), 0.5),
    rough: Math.min(Math.max(merged.rough, 0), 1),
  };
}

/** The furrow profile: 0 in the floor, 1 on the crest. */
export function ridge(x: number, shape: number): number {
  const phase = x - Math.floor(x);
  const tri = 1 - Math.abs(phase * 2 - 1);
  return tri ** shape;
}

/** Non-linear luma, matching the clamp the shader applies in sRGB space. */
export function luma([r, g, b]: Rgb): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export type KynnosRole =
  | "bg"
  | "surface"
  | "surface-2"
  | "ink"
  | "accent"
  | "accent-alt";

export const KYNNOS_ROLES = [
  "bg",
  "surface",
  "surface-2",
  "ink",
  "accent",
  "accent-alt",
] as const;

export interface KynnosColors {
  /** The clay itself, the value most of the frame sits at. */
  body: Rgb;
  /** The dry pale crest. The brightest pixel the effect is allowed. */
  ridge: Rgb;
  /** The warm crescent inside the groove. */
  shadow: Rgb;
  /** Key light colour. Only the dark-ground material tints by it. */
  key: Rgb;
  /** Hard ceiling on output luma. */
  maxLum: number;
}

/**
 * The theme swap flips the lighting model, not the shader. On a light ground the
 * clay is pigment: nothing brighter than surface-2, nothing darker than an
 * occlusion shadow. On a dark ground the same relief becomes brushed metal, lit
 * by a grazing accent key that only the crests catch.
 */
export function buildColors(
  roles: Record<KynnosRole, Rgb>,
  mode: BlendMode,
  keyColor?: Rgb,
): KynnosColors {
  if (mode === "absorptive") {
    const warm = mix(roles["accent-alt"], roles.ink, 0.55);
    const shadow = mix(mix(roles.bg, warm, 0.62), roles.accent, 0.12);
    const ridge = roles["surface-2"];
    return {
      body: mix(roles.bg, roles.surface, 0.35),
      ridge,
      shadow,
      key: keyColor ?? ridge,
      maxLum: luma(ridge),
    };
  }
  return {
    body: roles.bg,
    ridge: mix(roles.bg, roles.accent, 0.9),
    shadow: mix(roles.bg, [0, 0, 0], 0.45),
    key: keyColor ?? roles.accent,
    maxLum: 1,
  };
}

/** A raking key. Low z is what makes a 2cm groove throw a shadow. */
export const DEFAULT_LIGHT: [number, number, number] = [-0.72, 0.5, 0.34];
