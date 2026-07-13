import type { Rgb } from "../effects-core/effects-color.js";

/**
 * loimu is a blaze: a light sheet hanging in space, lit from a source the size
 * of a weather system sitting just past the top right corner. Nothing here is a
 * vignette. The source is a real point in front of the sheet, the streamers are
 * anisotropic noise advected by a divergence-free curl field, and the hue rides
 * the distance already travelled along the streamline.
 */
export interface LoimuParams {
  /** Camera focal length. Larger flattens the perspective. */
  focal: number;
  /** Distance from the eye to the sheet plane along its normal. */
  sheetDist: number;
  /** Half depth of the marched neighbourhood around the sheet. */
  sheetSpan: number;
  /** Gaussian thickness of the sheet. */
  sigma: number;
  /** How far the low-frequency fold bends the sheet out of plane. */
  fold: number;
  foldScale: number;
  /** Sheet plane normal, normalised in the shader. */
  normal: [number, number, number];
  /** Flow axis. Projected onto the sheet plane in the shader. */
  flow: [number, number, number];
  /** Emission source, in half-height units of screen space, x scaled by aspect. */
  source: [number, number];
  noiseFreq: number;
  /** Domain stretch along the flow axis. Below ~4 this stops reading as aurora. */
  stretch: number;
  curlScale: number;
  curlAmt: number;
  flowSpeed: number;
  /** Strength of the pointer vortex added to the curl field. */
  omega: number;
  threshold: number;
  sharpen: number;
  /** Inverse-square arrival from the source. Higher decays to void sooner. */
  falloff: number;
  gain: number;
  /** Weight of the thin leading line where one streamer edge slides over another. */
  edge: number;
  edgeBands: number;
  /** Distance along the flow over which the hue completes its ramp. */
  flowLength: number;
}

export const LOIMU_DEFAULTS: LoimuParams = {
  focal: 1.5,
  sheetDist: 3,
  sheetSpan: 1.6,
  sigma: 0.8,
  fold: 0.55,
  foldScale: 0.22,
  normal: [0.3, 0.4, 0.87],
  flow: [-0.86, -0.5, 0],
  source: [1.28, 0.92],
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
  edge: 0.3,
  edgeBands: 2,
  flowLength: 7,
};

export interface LoimuColors {
  /** The body of the sheet. */
  body: Rgb;
  /** Where the light is oldest and thinnest. */
  deep: Rgb;
  /** The thin line on a streamer's leading edge. */
  edge: Rgb;
}

export const POINTER_EASE = 0.05;

export function approach(
  current: number,
  target: number,
  ease: number,
): number {
  return current + (target - current) * ease;
}

export function resolveParams(overrides?: Partial<LoimuParams>): LoimuParams {
  return { ...LOIMU_DEFAULTS, ...overrides };
}
