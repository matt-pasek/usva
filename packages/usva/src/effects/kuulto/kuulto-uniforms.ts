import { setUniform, type Uniforms } from "../effects-core/effects-gl.js";
import type { KuultoColors, KuultoParams } from "./kuulto-field.js";

export interface KuultoFrame {
  time: number;
  /** The key lamp direction after the pointer has swung it. */
  key: [number, number, number];
  alpha: number;
  /** The house law: 1 stains the ground, 0 emits into it. */
  absorb: number;
}

export function kuultoUniforms(
  colors: KuultoColors,
  params: KuultoParams,
): Uniforms {
  return {
    uTime: { value: 0 },
    uResolution: { value: [1, 1] },
    uScale: { value: params.scale },
    uRelief: { value: params.relief },
    uCrease: { value: params.crease },
    uCreaseWidth: { value: params.creaseWidth },
    uDrift: { value: params.drift },
    uDrape: { value: params.drape },
    uDrapeScale: { value: params.drapeScale },
    uSheen: { value: params.sheen },
    uGloss: { value: params.gloss },
    uWrap: { value: params.wrap },
    uContrast: { value: params.contrast },
    uPurity: { value: params.purity },
    uKey: { value: [...params.key] },
    uFill: { value: [...params.fill] },
    uRim: { value: [...params.rim] },
    uGain: { value: params.gain },
    uAlpha: { value: 1 },
    uAbsorb: { value: 0 },
    uKeyColor: { value: [...colors.key] },
    uFillColor: { value: [...colors.fill] },
    uRimColor: { value: [...colors.rim] },
  };
}

export function setKuultoColors(u: Uniforms, colors: KuultoColors): void {
  setUniform(u, "uKeyColor", [...colors.key]);
  setUniform(u, "uFillColor", [...colors.fill]);
  setUniform(u, "uRimColor", [...colors.rim]);
}

export function setKuultoParams(u: Uniforms, params: KuultoParams): void {
  setUniform(u, "uScale", params.scale);
  setUniform(u, "uRelief", params.relief);
  setUniform(u, "uCrease", params.crease);
  setUniform(u, "uCreaseWidth", params.creaseWidth);
  setUniform(u, "uDrift", params.drift);
  setUniform(u, "uDrape", params.drape);
  setUniform(u, "uDrapeScale", params.drapeScale);
  setUniform(u, "uSheen", params.sheen);
  setUniform(u, "uGloss", params.gloss);
  setUniform(u, "uWrap", params.wrap);
  setUniform(u, "uContrast", params.contrast);
  setUniform(u, "uPurity", params.purity);
  setUniform(u, "uFill", [...params.fill]);
  setUniform(u, "uRim", [...params.rim]);
  setUniform(u, "uGain", params.gain);
}

export function setKuultoFrame(u: Uniforms, frame: KuultoFrame): void {
  setUniform(u, "uTime", frame.time);
  setUniform(u, "uKey", [...frame.key]);
  setUniform(u, "uAlpha", frame.alpha);
  setUniform(u, "uAbsorb", frame.absorb);
}
