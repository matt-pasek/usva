import type { Blob, Neck } from "../sula-core/geometry.js";
import {
  BACK_K_FRACTION,
  FRONT_K_FRACTION,
  fieldFrame,
} from "./field-geometry.js";

/**
 * How many bodies each depth plane may hold, and how many necks the whole frame
 * may hold. The shader's uniform arrays are fixed, so these are hard ceilings:
 * a drive that hands back more is clamped to the first N, and told so once in
 * development. Silently dropping the tail is how a tear ends up with no neck.
 */
export const MAX_FIELD_BLOBS = 12;
export const MAX_FIELD_NECKS = 8;

/** A rounded box of fluid, in CSS pixels from the field's top-left corner. */
export interface SulaBlob {
  cx: number;
  cy: number;
  /** Corner radius. A body with hw = hh = r is a circle. */
  r: number;
  /** Half-width. Defaults to `r`. */
  hw?: number;
  /** Half-height. Defaults to `r`. */
  hh?: number;
}

/**
 * A capsule joining two points: the tether of a tear, or the waist of a merge.
 * `strength` fades the bridge back into the surface without thinning it, which
 * is the only way a neck melts instead of snapping. Defaults to a solid bridge.
 */
export interface SulaNeck {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  r: number;
  strength?: number;
}

/** The field's box, in CSS pixels, plus the seed the consumer was handed. */
export interface SulaFieldBounds {
  width: number;
  height: number;
  seed: number;
}

/**
 * What the fluid is doing at one instant. The consumer says what the material is
 * doing; the field decides how to paint it.
 */
export interface SulaDriveFrame {
  /** Matte bodies behind everything, drawn without a rim. Depth, not actors. */
  back?: SulaBlob[];
  /** The lit bodies. */
  front?: SulaBlob[];
  /** Bridges among the front bodies. */
  necks?: SulaNeck[];
  /** Merge radius of the front plane, in px. Defaults to 11% of the short side. */
  mergeRadius?: number;
  /** Merge radius of the back plane, in px. Defaults to 20% of the short side. */
  backMergeRadius?: number;
}

/**
 * A pure function of time. Given the seconds elapsed (already scaled by `speed`)
 * and the field's bounds, it returns the frame. Deterministic by contract: the
 * same time and bounds must give the same frame, so a drive can be unit-tested
 * and a still frame under reduced motion is just the frame at t = 0.
 */
export type SulaFieldDrive = (
  time: number,
  bounds: SulaFieldBounds,
) => SulaDriveFrame;

export interface ResolvedDriveFrame {
  back: Blob[];
  front: Blob[];
  necks: Neck[];
  kFront: number;
  kBack: number;
  /** True when the drive handed back more than a plane can hold. */
  clamped: boolean;
}

const toBlob = (b: SulaBlob): Blob => ({
  cx: b.cx,
  cy: b.cy,
  hw: b.hw ?? b.r,
  hh: b.hh ?? b.r,
  r: b.r,
});

/**
 * Turns whatever the drive said into exactly what the renderer can take: plane
 * budgets enforced, half-extents filled in, merge radii defaulted off the short
 * side so a drive never has to know the field's pixel size to look right.
 */
export function resolveDriveFrame(
  frame: SulaDriveFrame,
  bounds: SulaFieldBounds,
): ResolvedDriveFrame {
  const short = Math.min(bounds.width, bounds.height);
  const back = frame.back ?? [];
  const front = frame.front ?? [];
  const necks = frame.necks ?? [];
  return {
    back: back.slice(0, MAX_FIELD_BLOBS).map(toBlob),
    front: front.slice(0, MAX_FIELD_BLOBS).map(toBlob),
    necks: necks.slice(0, MAX_FIELD_NECKS).map((n) => ({ ...n })),
    kFront: frame.mergeRadius ?? short * FRONT_K_FRACTION,
    kBack: frame.backMergeRadius ?? short * BACK_K_FRACTION,
    clamped:
      back.length > MAX_FIELD_BLOBS ||
      front.length > MAX_FIELD_BLOBS ||
      necks.length > MAX_FIELD_NECKS,
  };
}

/** The built-in choreography: the ambient drift the field has always had. */
export const ambientDrift: SulaFieldDrive = (time, bounds) => {
  const { back, front, necks } = fieldFrame(time, bounds);
  return { back, front, necks };
};
