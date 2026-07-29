import type { Rgb } from "../atmospheres-core/atmospheres-color.js";
import {
  setUniform,
  type Uniforms,
} from "../atmospheres-core/atmospheres-gl.js";
import type { FilamentParams } from "./filament-curve.js";
import { MAX_FILAMENT_SEGMENTS } from "./filament-shader.js";

export interface FilamentColors {
  /** The thin cold runs. */
  cool: Rgb;
  /** Where the coil bunches and light accumulates. */
  hot: Rgb;
}

export interface FilamentView {
  /** Eye distance along +z. */
  dist: number;
  focal: number;
  /** Lateral eye position. Off-axis, so the coil crops at the frame instead
   * of sitting whole in the middle of it. */
  offset: [number, number];
  /** Halo level above which a ray counts as looking through bunched coil. */
  bloom: number;
  exposure: number;
}

export const FILAMENT_VIEW: FilamentView = {
  dist: 2.9,
  focal: 1,
  offset: [1.2, 1.9],
  bloom: 6,
  exposure: 1.9,
};

export function resolveFilamentView(
  overrides: Partial<FilamentView> = {},
): FilamentView {
  return { ...FILAMENT_VIEW, ...overrides };
}

/** The thin runs sink well under the token: deep cold violet, not lavender. */
export function coolFrom(accent: Rgb): Rgb {
  return [accent[0] * 0.5, accent[1] * 0.3, accent[2] * 0.9];
}

/** Green heated toward white: the bunched passes are the only bright thing. */
export function hotFrom(accentAlt: Rgb): Rgb {
  const lift = (c: number) => c + (1 - c) * 0.35;
  return [lift(accentAlt[0]), lift(accentAlt[1]), lift(accentAlt[2])];
}

/** ogl reads array uniforms only when Array.isArray passes, so the knots reach
 * the GPU as a plain flat number[]. A Float32Array uploads nothing at all. */
function padKnots(knots: readonly number[]): number[] {
  const size = (MAX_FILAMENT_SEGMENTS + 1) * 3;
  const out = knots.slice(0, size);
  const tail = out.slice(-3);
  while (out.length < size) out.push(...(tail.length === 3 ? tail : [0, 0, 0]));
  return out;
}

export interface FilamentFrame {
  knots: readonly number[];
  segments: number;
  alpha: number;
  blend: number;
}

export function filamentUniforms(
  colors: FilamentColors,
  params: FilamentParams,
  view: FilamentView,
): Uniforms {
  return {
    uResolution: { value: [1, 1] },
    uKnots: { value: padKnots([]) },
    uSegments: { value: Math.min(params.segments, MAX_FILAMENT_SEGMENTS) },
    uDist: { value: view.dist },
    uFocal: { value: view.focal },
    uOffset: { value: [view.offset[0], view.offset[1]] },
    uThickness: { value: params.thickness },
    uGlow: { value: params.glow },
    uBloom: { value: view.bloom },
    uCool: { value: colors.cool },
    uHot: { value: colors.hot },
    uExposure: { value: view.exposure },
    uAlpha: { value: 1 },
    uBlend: { value: 0 },
  };
}

export function setFilamentColors(u: Uniforms, colors: FilamentColors): void {
  setUniform(u, "uCool", colors.cool);
  setUniform(u, "uHot", colors.hot);
}

export function setFilamentShape(
  u: Uniforms,
  params: FilamentParams,
  view: FilamentView,
): void {
  setUniform(u, "uThickness", params.thickness);
  setUniform(u, "uGlow", params.glow);
  setUniform(u, "uDist", view.dist);
  setUniform(u, "uFocal", view.focal);
  setUniform(u, "uOffset", [view.offset[0], view.offset[1]]);
  setUniform(u, "uBloom", view.bloom);
  setUniform(u, "uExposure", view.exposure);
}

export function setFilamentFrame(u: Uniforms, frame: FilamentFrame): void {
  setUniform(u, "uKnots", padKnots(frame.knots));
  setUniform(u, "uSegments", Math.min(frame.segments, MAX_FILAMENT_SEGMENTS));
  setUniform(u, "uAlpha", frame.alpha);
  setUniform(u, "uBlend", frame.blend);
}
