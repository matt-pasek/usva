/**
 * Pure math for Utu: the static field parameters, the slow breathing and
 * pointer-lean easing, and the plum -> orchid -> hot-magenta colour ramp. No DOM
 * and no sula imports, so the atmosphere stays genuinely standalone (its motion never
 * settles, so it borrows none of sula's spring/energy machinery either).
 */

export type Rgb = [number, number, number];

const TAU = Math.PI * 2;

export function clamp01(t: number): number {
  return Math.min(1, Math.max(0, t));
}

/** Quintic smootherstep, the same easing the shader uses for its radial falloff. */
export function smoother(t: number): number {
  const c = clamp01(t);
  return c * c * c * (c * (c * 6 - 15) + 10);
}

/** Eased approach toward a target, per frame. Used for the pointer lean. */
export function approach(
  current: number,
  target: number,
  ease: number,
): number {
  return current + (target - current) * ease;
}

/** How quickly the volume leans toward the cursor. Slow, so it drifts. */
export const LEAN_EASE = 0.06;

/**
 * A very slow sine around a base value: the body inhales, its radius and band
 * count drifting so the contours never sit perfectly still.
 */
export function breathe(
  elapsed: number,
  base: number,
  amount: number,
  rate: number,
): number {
  return base * (1 + amount * Math.sin(TAU * rate * elapsed));
}

/** The static field description handed to the shader once, not per frame. */
export interface UtuParams {
  /** Sphere radius in normalized (short-side) units. */
  radius: number;
  /** Contour count: how many glowing shells stack through the body. */
  bands: number;
  /** Twist per unit height, the helix strength. */
  swirl: number;
  /** Rotation speed of the whole body, rad/s. Slow. */
  omega: number;
  noiseFreq: number;
  noiseAmp: number;
  /** Floor density inside the body so fills stay dim-but-present. */
  noiseBase: number;
  /** How fast the noise field advects, so the texture travels with the twist. */
  drift: number;
  /** Vertical width of the equator wisp mask. */
  wispSigma: number;
  /** How far density leaks past the sphere into the tails. */
  wispAmt: number;
  /** Sideways drift speed of the wisps, so they read as shedding. */
  wispDrift: number;
  /** Beer-Lambert self-occlusion strength. */
  absorb: number;
  /** Tone-map exposure; hot cores clip toward white-magenta. */
  exposure: number;
  breathAmt: number;
  breathRate: number;
}

export const DEFAULT_PARAMS: UtuParams = {
  radius: 1.65,
  bands: 5,
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

export function resolveParams(overrides?: Partial<UtuParams>): UtuParams {
  return { ...DEFAULT_PARAMS, ...overrides };
}

function clampChannel(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/** Scale an rgb toward black, for the deep valley colour. */
export function scaleRgb(color: Rgb, factor: number): Rgb {
  return [
    clampChannel(color[0] * factor),
    clampChannel(color[1] * factor),
    clampChannel(color[2] * factor),
  ];
}

/** Push an rgb toward white, for the blown-out hot rim. */
export function mixWhite(color: Rgb, amount: number): Rgb {
  const a = clamp01(amount);
  return [
    clampChannel(color[0] + (1 - color[0]) * a),
    clampChannel(color[1] + (1 - color[1]) * a),
    clampChannel(color[2] + (1 - color[2]) * a),
  ];
}

export interface UtuEmissionColors {
  deep: Rgb;
  mid: Rgb;
  hot: Rgb;
}

export interface UtuColors extends UtuEmissionColors {
  /** kosteus: the hue the clay takes where the damp is deepest. */
  pigment: Rgb;
}

/**
 * The default emission ramp: a dawn/dusk horizon sweep. Cool violet in the
 * valleys, magenta-rose through the body, warm gold at the hot cores, so the
 * sphere reads as a glow on the horizon rather than one flat tint.
 */
export const DAWN: UtuEmissionColors = {
  deep: [0.2, 0.13, 0.42],
  mid: [0.8, 0.3, 0.72],
  hot: [1.0, 0.72, 0.52],
};

/** The dawn ramp with any stop overridden. Omitted stops keep the dawn colour. */
export function buildRamp(
  overrides?: Partial<UtuEmissionColors>,
): UtuEmissionColors {
  return {
    deep: overrides?.deep ?? DAWN.deep,
    mid: overrides?.mid ?? DAWN.mid,
    hot: overrides?.hot ?? DAWN.hot,
  };
}

/**
 * A single-hue ramp from one accent, for callers who want the sphere to match a
 * brand colour instead of the dawn gradient. Deep sinks toward black, mid holds
 * the accent, hot blows toward white for the clipping cores.
 */
export function monoRamp(accent: Rgb): UtuEmissionColors {
  return {
    deep: scaleRgb(accent, 0.3),
    mid: scaleRgb(accent, 0.95),
    hot: mixWhite(accent, 0.3),
  };
}
