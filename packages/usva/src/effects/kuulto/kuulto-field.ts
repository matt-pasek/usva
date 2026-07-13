import type { Rgb } from "../effects-core/effects-color.js";

/**
 * kuulto is translucency, the state of being dimly visible: something light passes
 * through or reflects softly. Here that is a vast sheet of silk, creased a few
 * times and lit from three sides. Nothing here samples a
 * palette. The colour is what the lighting does to the surface, so a fold turning
 * toward one lamp reads as that lamp's hue and the same fold rolling away catches
 * the next. The ground is black because no light reaches it, not because it was
 * painted black.
 */
export interface KuultoParams {
  /** Fold size. Smaller values pull the drape further back from the eye. */
  scale: number;
  /** How steeply the normals turn across a fold. The biggest knob on the look. */
  relief: number;
  /** Depth of the pleats folded into the sheet. */
  crease: number;
  /** Gaussian width of a pleat. Wide pleats read as satin, narrow ones as foil. */
  creaseWidth: number;
  /** How far the pleats travel. */
  drift: number;
  /** Weight of the organic wander laid over the pleats. */
  drape: number;
  drapeScale: number;
  /** Specular exponent. High is a tight glint, low is a broad sheen. */
  sheen: number;
  /** Weight of the specular term against the diffuse one. */
  gloss: number;
  /** Lambert wrap. At 0 the terminator is hard; at 1 light bleeds right round. */
  wrap: number;
  /** Power on the wrapped diffuse. High drives the unlit sheet to black. */
  contrast: number;
  /** Gamma on the normalised tint. Above 1 keeps overlapping lamps from
   * greying each other out; 1 leaves the mix alone. */
  purity: number;
  /** Fill and rim directions, in eye space. The key is steered by the pointer. */
  fill: [number, number, number];
  rim: [number, number, number];
  /** Key direction with the pointer at rest. */
  key: [number, number, number];
  /** How far the pointer swings the key light. */
  tilt: number;
  gain: number;
}

export const KUULTO_DEFAULTS: KuultoParams = {
  scale: 1.2,
  relief: 3.0,
  crease: 1.15,
  creaseWidth: 1.0,
  drift: 0.06,
  drape: 0.45,
  drapeScale: 0.35,
  sheen: 36,
  gloss: 1.0,
  wrap: 0.08,
  contrast: 4.5,
  purity: 1.9,
  key: [-0.8, 0.45, 0.3],
  fill: [0.85, -0.35, 0.26],
  rim: [0.1, 0.95, 0.22],
  tilt: 0.55,
  gain: 1.35,
};

export interface KuultoColors {
  /** The key lamp. Whatever faces it takes this hue. */
  key: Rgb;
  /** The fill lamp, opposite the key, holding the shadow side off black. */
  fill: Rgb;
  /** The rim lamp, grazing the sheet so only fold crests catch it. */
  rim: Rgb;
}

export const POINTER_EASE = 0.045;

/** The number of pleats folded into the sheet. Three read as cloth; more read as
 * corrugation, which is the object the background must never become. */
export const CREASES = 3;

export function approach(
  current: number,
  target: number,
  ease: number,
): number {
  return current + (target - current) * ease;
}

export function resolveParams(overrides?: Partial<KuultoParams>): KuultoParams {
  return { ...KUULTO_DEFAULTS, ...overrides };
}

function normalize(v: [number, number, number]): [number, number, number] {
  const len = Math.hypot(v[0], v[1], v[2]);
  if (len < 1e-6) return [0, 0, 1];
  return [v[0] / len, v[1] / len, v[2] / len];
}

/**
 * The key lamp swings with the eased pointer, so the cursor turns the silk in the
 * light rather than dragging a glow across it. The z term is floored: a lamp that
 * swings past the horizon would light the sheet from behind and the folds would
 * flip inside out.
 */
export function keyLight(
  params: KuultoParams,
  mouse: [number, number],
  amount: number,
): [number, number, number] {
  const swing = params.tilt * amount;
  return normalize([
    params.key[0] + mouse[0] * swing,
    params.key[1] + mouse[1] * swing,
    Math.max(params.key[2], 0.25),
  ]);
}
