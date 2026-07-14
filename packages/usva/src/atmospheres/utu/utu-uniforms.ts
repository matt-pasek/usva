import {
  setUniform,
  type Uniforms,
} from "../atmospheres-core/atmospheres-gl.js";
import type { UtuColors, UtuParams } from "./utu-field.js";

/** The per-frame values: everything else is set on change, not per frame. */
export interface UtuFrame {
  /** Seconds since start. */
  time: number;
  /** Breathing radius for this frame. */
  radius: number;
  /** Breathing band count for this frame. */
  bands: number;
  /** Eased pointer offset in normalized units; [0,0] when not interacting. */
  lean: [number, number];
  /** Fades the lean in and out, 0..1. */
  leanAmt: number;
  alpha: number;
}

export function utuUniforms(colors: UtuColors, params: UtuParams): Uniforms {
  return {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uRadius: { value: params.radius },
    uBands: { value: params.bands },
    uSwirl: { value: params.swirl },
    uOmega: { value: params.omega },
    uNoiseFreq: { value: params.noiseFreq },
    uNoiseAmp: { value: params.noiseAmp },
    uNoiseBase: { value: params.noiseBase },
    uDrift: { value: params.drift },
    uWispSigma: { value: params.wispSigma },
    uWispAmt: { value: params.wispAmt },
    uWispDrift: { value: params.wispDrift },
    uAbsorb: { value: params.absorb },
    uExposure: { value: params.exposure },
    uDeep: { value: colors.deep },
    uMid: { value: colors.mid },
    uHot: { value: colors.hot },
    uAlpha: { value: 1 },
    uLean: { value: [0, 0] },
    uLeanAmt: { value: 0 },
  };
}

export function setUtuColors(u: Uniforms, colors: UtuColors): void {
  setUniform(u, "uDeep", colors.deep);
  setUniform(u, "uMid", colors.mid);
  setUniform(u, "uHot", colors.hot);
}

export function setUtuParams(u: Uniforms, params: UtuParams): void {
  setUniform(u, "uSwirl", params.swirl);
  setUniform(u, "uOmega", params.omega);
  setUniform(u, "uNoiseFreq", params.noiseFreq);
  setUniform(u, "uNoiseAmp", params.noiseAmp);
  setUniform(u, "uNoiseBase", params.noiseBase);
  setUniform(u, "uDrift", params.drift);
  setUniform(u, "uWispSigma", params.wispSigma);
  setUniform(u, "uWispAmt", params.wispAmt);
  setUniform(u, "uWispDrift", params.wispDrift);
  setUniform(u, "uAbsorb", params.absorb);
  setUniform(u, "uExposure", params.exposure);
}

export function setUtuFrame(u: Uniforms, frame: UtuFrame): void {
  setUniform(u, "uTime", frame.time);
  setUniform(u, "uRadius", frame.radius);
  setUniform(u, "uBands", frame.bands);
  setUniform(u, "uLean", frame.lean);
  setUniform(u, "uLeanAmt", frame.leanAmt);
  setUniform(u, "uAlpha", frame.alpha);
}
