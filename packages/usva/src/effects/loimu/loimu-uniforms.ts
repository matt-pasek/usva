import { setUniform, type Uniforms } from "../effects-core/effects-gl.js";
import type { LoimuColors, LoimuParams } from "./loimu-field.js";

export interface LoimuFrame {
  time: number;
  /** Eased pointer in half-height screen units, y up. */
  mouse: [number, number];
  /** Fades the vortex in and out, 0..1. */
  pointer: number;
  alpha: number;
  /** The house law: 1 stains the ground, 0 emits into it. */
  absorb: number;
}

export function loimuUniforms(
  colors: LoimuColors,
  params: LoimuParams,
): Uniforms {
  return {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uMouse: { value: [0, 0] },
    uPointer: { value: 0 },
    uFocal: { value: params.focal },
    uSheetDist: { value: params.sheetDist },
    uSheetSpan: { value: params.sheetSpan },
    uSigma: { value: params.sigma },
    uFold: { value: params.fold },
    uFoldScale: { value: params.foldScale },
    uNormal: { value: [...params.normal] },
    uFlow: { value: [...params.flow] },
    uSource: { value: [...params.source] },
    uNoiseFreq: { value: params.noiseFreq },
    uStretch: { value: params.stretch },
    uCurlScale: { value: params.curlScale },
    uCurlAmt: { value: params.curlAmt },
    uFlowSpeed: { value: params.flowSpeed },
    uOmega: { value: params.omega },
    uThreshold: { value: params.threshold },
    uSharpen: { value: params.sharpen },
    uFalloff: { value: params.falloff },
    uGain: { value: params.gain },
    uEdge: { value: params.edge },
    uEdgeBands: { value: params.edgeBands },
    uFlowLength: { value: params.flowLength },
    uAlpha: { value: 1 },
    uAbsorb: { value: 0 },
    uBody: { value: [...colors.body] },
    uDeep: { value: [...colors.deep] },
    uEdgeColor: { value: [...colors.edge] },
  };
}

export function setLoimuColors(u: Uniforms, colors: LoimuColors): void {
  setUniform(u, "uBody", [...colors.body]);
  setUniform(u, "uDeep", [...colors.deep]);
  setUniform(u, "uEdgeColor", [...colors.edge]);
}

export function setLoimuParams(u: Uniforms, params: LoimuParams): void {
  setUniform(u, "uFocal", params.focal);
  setUniform(u, "uSheetDist", params.sheetDist);
  setUniform(u, "uSheetSpan", params.sheetSpan);
  setUniform(u, "uSigma", params.sigma);
  setUniform(u, "uFold", params.fold);
  setUniform(u, "uFoldScale", params.foldScale);
  setUniform(u, "uNormal", [...params.normal]);
  setUniform(u, "uFlow", [...params.flow]);
  setUniform(u, "uSource", [...params.source]);
  setUniform(u, "uNoiseFreq", params.noiseFreq);
  setUniform(u, "uStretch", params.stretch);
  setUniform(u, "uCurlScale", params.curlScale);
  setUniform(u, "uCurlAmt", params.curlAmt);
  setUniform(u, "uFlowSpeed", params.flowSpeed);
  setUniform(u, "uOmega", params.omega);
  setUniform(u, "uThreshold", params.threshold);
  setUniform(u, "uSharpen", params.sharpen);
  setUniform(u, "uFalloff", params.falloff);
  setUniform(u, "uGain", params.gain);
  setUniform(u, "uEdge", params.edge);
  setUniform(u, "uEdgeBands", params.edgeBands);
  setUniform(u, "uFlowLength", params.flowLength);
}

export function setLoimuFrame(u: Uniforms, frame: LoimuFrame): void {
  setUniform(u, "uTime", frame.time);
  setUniform(u, "uMouse", [...frame.mouse]);
  setUniform(u, "uPointer", frame.pointer);
  setUniform(u, "uAlpha", frame.alpha);
  setUniform(u, "uAbsorb", frame.absorb);
}
