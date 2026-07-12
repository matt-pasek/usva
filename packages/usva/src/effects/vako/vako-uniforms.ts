import { setUniform, type Uniforms } from "../effects-core/effects-gl.js";
import type { VakoColors, VakoParams } from "./vako-field.js";

export interface VakoFrame {
  time: number;
  alpha: number;
  absorb: number;
  light: [number, number, number];
}

export function vakoUniforms(
  colors: VakoColors,
  params: VakoParams,
  light: [number, number, number],
): Uniforms {
  return {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uOrigin: { value: [params.origin[0], params.origin[1]] },
    uSpin: { value: params.spin },
    uFurrowFreq: { value: params.furrowFreq },
    uWarpAmt: { value: params.warpAmt },
    uWarpFreq: { value: params.warpFreq },
    uBreakAmt: { value: params.breakAmt },
    uRidgeShape: { value: params.ridgeShape },
    uDepth: { value: params.depth },
    uSlope: { value: params.slope },
    uMicroScale: { value: params.microScale },
    uMicroAmt: { value: params.microAmt },
    uCrackScale: { value: params.crackScale },
    uCrackAmt: { value: params.crackAmt },
    uAo: { value: params.ao },
    uRough: { value: params.rough },
    uAmbient: { value: params.ambient },
    uKey: { value: params.key },
    uDrift: { value: params.drift },
    uDither: { value: params.dither },
    uAlpha: { value: 1 },
    uAbsorb: { value: 1 },
    uMaxLum: { value: colors.maxLum },
    uLightDir: { value: [light[0], light[1], light[2]] },
    uBody: { value: colors.body },
    uRidge: { value: colors.ridge },
    uShadow: { value: colors.shadow },
    uKeyColor: { value: colors.key },
  };
}

export function setVakoColors(u: Uniforms, colors: VakoColors): void {
  setUniform(u, "uBody", colors.body);
  setUniform(u, "uRidge", colors.ridge);
  setUniform(u, "uShadow", colors.shadow);
  setUniform(u, "uKeyColor", colors.key);
  setUniform(u, "uMaxLum", colors.maxLum);
}

export function setVakoParams(u: Uniforms, params: VakoParams): void {
  setUniform(u, "uOrigin", [params.origin[0], params.origin[1]]);
  setUniform(u, "uSpin", params.spin);
  setUniform(u, "uFurrowFreq", params.furrowFreq);
  setUniform(u, "uWarpAmt", params.warpAmt);
  setUniform(u, "uWarpFreq", params.warpFreq);
  setUniform(u, "uBreakAmt", params.breakAmt);
  setUniform(u, "uRidgeShape", params.ridgeShape);
  setUniform(u, "uDepth", params.depth);
  setUniform(u, "uSlope", params.slope);
  setUniform(u, "uMicroScale", params.microScale);
  setUniform(u, "uMicroAmt", params.microAmt);
  setUniform(u, "uCrackScale", params.crackScale);
  setUniform(u, "uCrackAmt", params.crackAmt);
  setUniform(u, "uAo", params.ao);
  setUniform(u, "uRough", params.rough);
  setUniform(u, "uAmbient", params.ambient);
  setUniform(u, "uKey", params.key);
  setUniform(u, "uDrift", params.drift);
  setUniform(u, "uDither", params.dither);
}

export function setVakoFrame(u: Uniforms, frame: VakoFrame): void {
  setUniform(u, "uTime", frame.time);
  setUniform(u, "uAlpha", frame.alpha);
  setUniform(u, "uAbsorb", frame.absorb);
  setUniform(u, "uLightDir", [frame.light[0], frame.light[1], frame.light[2]]);
}
