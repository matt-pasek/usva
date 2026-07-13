import type { Rgb } from "../effects-core/effects-color.js";

/**
 * vare (väre, a ripple) emits from the iso-phase lines of a few broad travelling
 * wavefronts, never from the wave bodies. What you see is a set of drifting
 * luminous boundaries: the folded edges of a curtain, seen from very far away.
 *
 * The failure mode is moire. Every defence against it is a parameter here: the
 * domain warp, the per-front phase jitter, the wavenumber scatter and the
 * thickness noise. Turn them to zero and the interference snaps into a diagram.
 */
export interface VareParams {
  /** Shared travel direction of the front, in radians. */
  angle: number;
  /** Half-width of the k-vector fan around that direction, in radians. */
  spread: number;
  /** Base wavenumber. Each front scatters around it, so no two bands match. */
  wavenumber: number;
  speed: number;
  /** Amplitude of the FBM domain warp that bends the whole field. */
  warp: number;
  warpScale: number;
  /** Per-front phase drift, in band periods. This is what stops two fronts from
   * lining up, since the shared warp bends them all the same way. */
  jitter: number;
  /** Exponent of the cosine ridge. Higher is a narrower boundary; low melts
   * the bands into one another. */
  soft: number;
  /** Frequency of the noise that varies band thickness along a front. */
  detail: number;
  /** Extra light where two fronts cross. */
  node: number;
  gain: number;
  /** Off-frame origin of the fronts, in half-height units, x scaled by aspect. */
  source: [number, number];
  /** Inverse-square arrival from the source. Higher decays to void sooner. */
  falloff: number;
  /** Distance over which the hue completes its front-to-back ramp. */
  span: number;
  /** Strength of the pointer lens in phase space. */
  lens: number;
  lensSigma: number;
}

export const VARE_DEFAULTS: VareParams = {
  angle: 3.64,
  spread: 0.62,
  wavenumber: 3.8,
  speed: 0.9,
  warp: 0.7,
  warpScale: 0.55,
  jitter: 0.7,
  soft: 6.5,
  detail: 1.6,
  node: 0.9,
  gain: 1.15,
  source: [1.15, 0.8],
  falloff: 0.09,
  span: 4,
  lens: 2.2,
  lensSigma: 0.9,
};

export interface VareColors {
  /** The body of the front. */
  body: Rgb;
  /** The oldest, furthest bands. */
  deep: Rgb;
  /** The freshest bands, closest to the source. */
  edge: Rgb;
}

export const POINTER_EASE = 0.06;

export function approach(
  current: number,
  target: number,
  ease: number,
): number {
  return current + (target - current) * ease;
}

export function resolveParams(overrides?: Partial<VareParams>): VareParams {
  return { ...VARE_DEFAULTS, ...overrides };
}
