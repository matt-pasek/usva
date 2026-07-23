import {
  type BlendMode,
  pigmentFor,
  type Rgb,
} from "../atmospheres-core/atmospheres-color.js";

export interface RoutaParams {
  /** Frost cells across one short-side unit. */
  cellScale: number;
  /** Height of the heaved cell interiors. */
  heave: number;
  /** Width of the fissure at each cell wall. */
  crackWidth: number;
  /** How far the cell walls fall below the heaved surface. */
  crackDepth: number;
  /** Spatial frequency of the broad unevenness under the frost. */
  unevenScale: number;
  /** How differently neighbouring cells lift. */
  uneven: number;
  /** Domain travel per second. Deliberately close to still. */
  drift: number;
  /** One-shot fissure propagation per second. */
  growthRate: number;
  /** Height-gradient gain before the normal is built. */
  slope: number;
  /** Oren-Nayar roughness. */
  rough: number;
  /** Ambient fill under the raking key. */
  ambient: number;
  /** Strength of the raking key. */
  key: number;
  /** Dither amplitude for dark-ground emission. */
  dither: number;
}

export const ROUTA_DEFAULTS: RoutaParams = {
  cellScale: 3.8,
  heave: 0.075,
  crackWidth: 0.055,
  crackDepth: 0.045,
  unevenScale: 0.72,
  uneven: 0.34,
  drift: 0.0025,
  growthRate: 0.028,
  slope: 1.35,
  rough: 0.92,
  ambient: 0.32,
  key: 0.88,
  dither: 0.005,
};

export function resolveParams(
  overrides: Partial<RoutaParams> = {},
): RoutaParams {
  const merged = { ...ROUTA_DEFAULTS, ...overrides };
  return {
    ...merged,
    cellScale: Math.max(merged.cellScale, 0.5),
    heave: Math.max(merged.heave, 0),
    crackWidth: Math.min(Math.max(merged.crackWidth, 0.005), 0.2),
    crackDepth: Math.max(merged.crackDepth, 0),
    uneven: Math.min(Math.max(merged.uneven, 0), 0.8),
    drift: Math.max(merged.drift, 0),
    growthRate: Math.max(merged.growthRate, 0),
    rough: Math.min(Math.max(merged.rough, 0), 1),
  };
}

export const ROUTA_ROLES = ["bg", "ink", "accent", "accent-alt"] as const;

export type RoutaRole = (typeof ROUTA_ROLES)[number];

export interface RoutaColors {
  /** The dark pigment held in the fissures on clay. */
  pigment: Rgb;
  /** The cold raking key caught by heaved crests on a dark ground. */
  emission: Rgb;
  /** The frozen surface itself on a dark ground. */
  body: Rgb;
  /** Under the surface: the fissures, and ground the key never reaches. */
  fissure: Rgb;
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

/**
 * The theme swap changes the material, not the shader, the way kynnös already
 * does it. On clay the fissures hold pigment and the frost is what is left of
 * the ground. On a dark ground it is black ice: a surface that is always there,
 * a grazing key that only the heaved crests catch, and fissures cut below it.
 *
 * The body is the whole point. Without one the shader painted crests and left
 * everything between them transparent, so the relief had nothing to sit on and
 * read as lumps of glow rather than frozen earth.
 */
export function buildColors(
  roles: Record<RoutaRole, Rgb>,
  mode: BlendMode,
  keyColor?: Rgb,
): RoutaColors {
  const hue = mode === "absorptive" ? roles.accent : roles["accent-alt"];
  return {
    pigment: pigmentFor(hue, roles.ink),
    emission: keyColor ?? mix(roles.accent, roles.ink, 0.55),
    body: mix(roles.bg, roles.ink, 0.09),
    fissure: mix(roles.bg, [0, 0, 0], 0.55),
  };
}

/** A low raking key, cold and long across the broken ground. */
export const DEFAULT_LIGHT: [number, number, number] = [-0.68, 0.46, 0.38];
