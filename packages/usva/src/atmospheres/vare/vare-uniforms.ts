import {
  setUniform,
  type Uniforms,
} from "../atmospheres-core/atmospheres-gl.js";
import type { VareColors, VareParams } from "./vare-field.js";

export interface VareFrame {
  time: number;
  /** Eased pointer in half-height screen units, y up. */
  mouse: [number, number];
  /** Fades the phase lens in and out, 0..1. */
  pointer: number;
  alpha: number;
  /** The house law: 1 stains the ground, 0 emits into it. */
  absorb: number;
}

export function vareUniforms(colors: VareColors, params: VareParams): Uniforms {
  return {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uMouse: { value: [0, 0] },
    uPointer: { value: 0 },
    uAngle: { value: params.angle },
    uSpread: { value: params.spread },
    uWavenumber: { value: params.wavenumber },
    uSpeed: { value: params.speed },
    uWarp: { value: params.warp },
    uWarpScale: { value: params.warpScale },
    uJitter: { value: params.jitter },
    uSoft: { value: params.soft },
    uDetail: { value: params.detail },
    uNode: { value: params.node },
    uGain: { value: params.gain },
    uSource: { value: [...params.source] },
    uFalloff: { value: params.falloff },
    uSpan: { value: params.span },
    uLens: { value: params.lens },
    uLensSigma: { value: params.lensSigma },
    uAlpha: { value: 1 },
    uAbsorb: { value: 0 },
    uBody: { value: [...colors.body] },
    uDeep: { value: [...colors.deep] },
    uEdgeColor: { value: [...colors.edge] },
  };
}

export function setVareColors(u: Uniforms, colors: VareColors): void {
  setUniform(u, "uBody", [...colors.body]);
  setUniform(u, "uDeep", [...colors.deep]);
  setUniform(u, "uEdgeColor", [...colors.edge]);
}

export function setVareParams(u: Uniforms, params: VareParams): void {
  setUniform(u, "uAngle", params.angle);
  setUniform(u, "uSpread", params.spread);
  setUniform(u, "uWavenumber", params.wavenumber);
  setUniform(u, "uSpeed", params.speed);
  setUniform(u, "uWarp", params.warp);
  setUniform(u, "uWarpScale", params.warpScale);
  setUniform(u, "uJitter", params.jitter);
  setUniform(u, "uSoft", params.soft);
  setUniform(u, "uDetail", params.detail);
  setUniform(u, "uNode", params.node);
  setUniform(u, "uGain", params.gain);
  setUniform(u, "uSource", [...params.source]);
  setUniform(u, "uFalloff", params.falloff);
  setUniform(u, "uSpan", params.span);
  setUniform(u, "uLens", params.lens);
  setUniform(u, "uLensSigma", params.lensSigma);
}

export function setVareFrame(u: Uniforms, frame: VareFrame): void {
  setUniform(u, "uTime", frame.time);
  setUniform(u, "uMouse", [...frame.mouse]);
  setUniform(u, "uPointer", frame.pointer);
  setUniform(u, "uAlpha", frame.alpha);
  setUniform(u, "uAbsorb", frame.absorb);
}
