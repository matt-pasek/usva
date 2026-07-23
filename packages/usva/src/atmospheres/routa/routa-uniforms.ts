import { MAX_STAIN } from "../atmospheres-core/atmospheres-color.js";
import {
  setUniform,
  type Uniforms,
} from "../atmospheres-core/atmospheres-gl.js";
import type { RoutaColors, RoutaParams } from "./routa-field.js";

export interface RoutaFrame {
  time: number;
  alpha: number;
  absorb: number;
  light: [number, number, number];
}

export function routaUniforms(
  colors: RoutaColors,
  params: RoutaParams,
  light: [number, number, number],
): Uniforms {
  return {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uCellScale: { value: params.cellScale },
    uHeave: { value: params.heave },
    uCrackWidth: { value: params.crackWidth },
    uCrackDepth: { value: params.crackDepth },
    uUnevenScale: { value: params.unevenScale },
    uUneven: { value: params.uneven },
    uDrift: { value: params.drift },
    uGrowthRate: { value: params.growthRate },
    uSlope: { value: params.slope },
    uRough: { value: params.rough },
    uAmbient: { value: params.ambient },
    uKey: { value: params.key },
    uRelief: { value: params.relief },
    uDither: { value: params.dither },
    uAlpha: { value: 1 },
    uAbsorb: { value: 1 },
    uLightDir: { value: [...light] },
    uPigment: { value: [...colors.pigment] },
    uEmission: { value: [...colors.emission] },
    uBody: { value: [...colors.body] },
    uFissure: { value: [...colors.fissure] },
    uStainFloor: { value: MAX_STAIN },
  };
}

export function setRoutaColors(u: Uniforms, colors: RoutaColors): void {
  setUniform(u, "uPigment", [...colors.pigment]);
  setUniform(u, "uEmission", [...colors.emission]);
  setUniform(u, "uBody", [...colors.body]);
  setUniform(u, "uFissure", [...colors.fissure]);
}

export function setRoutaParams(u: Uniforms, params: RoutaParams): void {
  setUniform(u, "uCellScale", params.cellScale);
  setUniform(u, "uHeave", params.heave);
  setUniform(u, "uCrackWidth", params.crackWidth);
  setUniform(u, "uCrackDepth", params.crackDepth);
  setUniform(u, "uUnevenScale", params.unevenScale);
  setUniform(u, "uUneven", params.uneven);
  setUniform(u, "uDrift", params.drift);
  setUniform(u, "uGrowthRate", params.growthRate);
  setUniform(u, "uSlope", params.slope);
  setUniform(u, "uRough", params.rough);
  setUniform(u, "uAmbient", params.ambient);
  setUniform(u, "uKey", params.key);
  setUniform(u, "uRelief", params.relief);
  setUniform(u, "uDither", params.dither);
}

export function setRoutaFrame(u: Uniforms, frame: RoutaFrame): void {
  setUniform(u, "uTime", frame.time);
  setUniform(u, "uAlpha", frame.alpha);
  setUniform(u, "uAbsorb", frame.absorb);
  setUniform(u, "uLightDir", [...frame.light]);
}
