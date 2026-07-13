import type { Rgb } from "../effects-core/effects-color.js";
import { setUniform, type Uniforms } from "../effects-core/effects-gl.js";

export interface KajastusColors {
  /** Low and distant: oxygen green. */
  low: Rgb;
  /** Climbing the folds: nitrogen violet. */
  high: Rgb;
  /** The cold field behind. */
  star: Rgb;
}

export interface KajastusParams {
  /** How far the eye tilts up, radians. */
  pitch: number;
  /** Curvature of the ceiling. Larger arches it down harder at the edges. */
  curve: number;
  /** How far the ribbon meanders across the sky. */
  fold: number;
  /** Wavelength of the meander; smaller is longer. */
  foldScale: number;
  /** One-axis domain warp, so folds stay folds instead of turning to soup. */
  warp: number;
  /** Where the ribbon sits relative to the eye. */
  offset: number;
  /** Thickness of the sheet. */
  width: number;
  /** Across-ribbon detail. The along-ribbon domain is 8x this. */
  detail: number;
  /** Cuts the noise floor away, which is most of what keeps the frame empty. */
  threshold: number;
  /** Lateral drift of the fine structure. */
  drift: number;
  /** Vertical wavelength of the streaming rays. */
  rayFreq: number;
  /** How fast the rays run up the ribbon. */
  raySpeed: number;
  /** Distance extinction. Also the anti-aliasing budget near the horizon. */
  far: number;
  exposure: number;
  /** Star brightness. Zero for a clean sky. */
  stars: number;
  /** Depth of the corridor cut for the header type, 0..1. */
  corridor: number;
  /** Vertical centre of the corridor in NDC, -1 bottom to 1 top. */
  corridorY: number;
  /** Corridor height. */
  corridorH: number;
}

export const KAJASTUS_DEFAULTS: KajastusParams = {
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

export function resolveKajastusParams(
  overrides: Partial<KajastusParams> = {},
): KajastusParams {
  return { ...KAJASTUS_DEFAULTS, ...overrides };
}

export interface KajastusFrame {
  time: number;
  alpha: number;
  /** 1.0 stains a light ground as pigment, 0.0 emits into a dark one. */
  blend: number;
}

export function kajastusUniforms(
  colors: KajastusColors,
  params: KajastusParams,
): Uniforms {
  return {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uLow: { value: colors.low },
    uHigh: { value: colors.high },
    uStar: { value: colors.star },
    uPitch: { value: params.pitch },
    uCurve: { value: params.curve },
    uFold: { value: params.fold },
    uFoldScale: { value: params.foldScale },
    uWarp: { value: params.warp },
    uOffset: { value: params.offset },
    uWidth: { value: params.width },
    uDetail: { value: params.detail },
    uThreshold: { value: params.threshold },
    uDrift: { value: params.drift },
    uRayFreq: { value: params.rayFreq },
    uRaySpeed: { value: params.raySpeed },
    uFar: { value: params.far },
    uExposure: { value: params.exposure },
    uStars: { value: params.stars },
    uCorridor: { value: params.corridor },
    uCorridorY: { value: params.corridorY },
    uCorridorH: { value: params.corridorH },
    uAlpha: { value: 1 },
    uBlend: { value: 0 },
  };
}

export function setKajastusColors(u: Uniforms, colors: KajastusColors): void {
  setUniform(u, "uLow", colors.low);
  setUniform(u, "uHigh", colors.high);
  setUniform(u, "uStar", colors.star);
}

export function setKajastusParams(u: Uniforms, params: KajastusParams): void {
  setUniform(u, "uPitch", params.pitch);
  setUniform(u, "uCurve", params.curve);
  setUniform(u, "uFold", params.fold);
  setUniform(u, "uFoldScale", params.foldScale);
  setUniform(u, "uWarp", params.warp);
  setUniform(u, "uOffset", params.offset);
  setUniform(u, "uWidth", params.width);
  setUniform(u, "uDetail", params.detail);
  setUniform(u, "uThreshold", params.threshold);
  setUniform(u, "uDrift", params.drift);
  setUniform(u, "uRayFreq", params.rayFreq);
  setUniform(u, "uRaySpeed", params.raySpeed);
  setUniform(u, "uFar", params.far);
  setUniform(u, "uExposure", params.exposure);
  setUniform(u, "uStars", params.stars);
  setUniform(u, "uCorridor", params.corridor);
  setUniform(u, "uCorridorY", params.corridorY);
  setUniform(u, "uCorridorH", params.corridorH);
}

export function setKajastusFrame(u: Uniforms, frame: KajastusFrame): void {
  setUniform(u, "uTime", frame.time);
  setUniform(u, "uAlpha", frame.alpha);
  setUniform(u, "uBlend", frame.blend);
}
