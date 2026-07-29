import { clamp01, easeOutCubic, smoothstep } from "../sula-motion/curves.js";

/** Band width in CSS px when the consumer passes nothing. */
export const DEFAULT_THICKNESS = 2;
/** Corner radius for a fixed viewport frame when none is given, before the
 * width scale. */
export const DEFAULT_RADIUS = 16;

/** CSS-px radius of the disc that goos toward the cursor. */
export const BLOB_RADIUS = 26;
/** CSS-px smooth-min radius merging the pointer disc into the band. Wide enough
 * that the neck reads as surface tension, not a butt-join. */
export const BLOB_K = 42;

/** Idle edge undulation, always on while the frame is visible. */
export const WOBBLE_REST = 0.6;
/** Extra edge displacement added at full hover/focus energy. */
export const WOBBLE_ENERGY = 3.0;

/** Within this CSS distance of the band the pointer goo is at full strength. */
export const EDGE_NEAR = 8;
/** Past this CSS distance the pointer goo has faded out entirely. */
export const EDGE_FAR = 120;

/** Per-frame easing of the pointer position and the energy scalar. */
export const POINTER_EASE = 0.16;
export const ENERGY_EASE = 0.09;
/** Perimeter highlight travel, in turns per second. */
export const SWEEP_SPEED = 0.12;
/** Duration of the one-time intro reveal, in seconds. */
export const INTRO_DELAY_SECONDS = 0.1;
export const INTRO_SECONDS = 4;

/** A rounded-box ring in CSS space: centre, half-extents, corner radius. */
export interface Ring {
  cx: number;
  cy: number;
  hx: number;
  hy: number;
  r: number;
}

export interface IntroFrame {
  progress: number;
  radius: number;
}

/** Geometry for the one-time edge-to-frame flow. The shell front itself is
 * resolved in the shader; the CPU grows the corners on the same eased clock. */
export function introFrame(ring: Ring, progress: number): IntroFrame {
  const eased = easeOutCubic(clamp01(progress));
  return {
    progress: eased,
    radius: ring.r * (0.18 + 0.82 * eased),
  };
}

/** The same ring flattened to device px with Y flipped, ready for the shader. */
export interface PackedRing {
  center: [number, number];
  half: [number, number];
  radius: number;
}

/**
 * Signed distance to a rounded box (Inigo Quilez, MIT). Negative inside, zero on
 * the edge, positive outside. Ported to JS so the pointer gate and the tests can
 * reason about the same edge the shader draws.
 */
export function sdRoundBox(
  px: number,
  py: number,
  bx: number,
  by: number,
  r: number,
): number {
  const qx = Math.abs(px) - bx + r;
  const qy = Math.abs(py) - by + r;
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  return Math.min(Math.max(qx, qy), 0) + outside - r;
}

/**
 * Corner radius for a fixed viewport frame: a gentle scale with width, clamped so
 * a phone still rounds and an ultrawide does not turn into a stadium. Mirrors the
 * frame radius the source LiquidBorder used.
 */
export function fixedRadius(width: number): number {
  return Math.min(Math.max(38, width * 0.02), 78);
}

/**
 * Resolves the corner radius from, in order: an explicit prop, the wrapped box's
 * computed border-radius, or a default (width-scaled in fixed mode). Never
 * negative.
 */
export function resolveRadius(options: {
  explicit?: number;
  computed?: number;
  fixed: boolean;
  width: number;
}): number {
  const { explicit, computed, fixed, width } = options;
  if (typeof explicit === "number") return Math.max(0, explicit);
  if (fixed) return fixedRadius(width);
  if (typeof computed === "number") return Math.max(0, computed);
  return DEFAULT_RADIUS;
}

/**
 * The ring inscribed in a canvas of the given CSS size, pulled in by `inset` and
 * with the radius clamped to what the half-extents can hold.
 */
export function frameRing(box: {
  width: number;
  height: number;
  inset: number;
  radius: number;
}): Ring {
  const hx = Math.max(box.width / 2 - box.inset, 1);
  const hy = Math.max(box.height / 2 - box.inset, 1);
  return {
    cx: box.width / 2,
    cy: box.height / 2,
    hx,
    hy,
    r: Math.max(0, Math.min(box.radius, hx, hy)),
  };
}

/** Flattens a CSS-space ring to device px, flipping Y for `gl_FragCoord`. */
export function packRing(
  ring: Ring,
  dpr: number,
  canvasHeight: number,
): PackedRing {
  return {
    center: [ring.cx * dpr, (canvasHeight - ring.cy) * dpr],
    half: [ring.hx * dpr, ring.hy * dpr],
    radius: ring.r * dpr,
  };
}

/**
 * How hard the pointer goos the nearest edge: `presence` (0 away, 1 hovering)
 * gated by proximity to the band, so a cursor drifting through the middle of a
 * wrapped card never raises a blob, and one grazing the edge raises a full one.
 */
export function pointerStrength(
  px: number,
  py: number,
  ring: Ring,
  presence: number,
): number {
  const dist = Math.abs(
    sdRoundBox(px - ring.cx, py - ring.cy, ring.hx, ring.hy, ring.r),
  );
  const gate = 1 - smoothstep(EDGE_NEAR, EDGE_FAR, dist);
  return clamp01(presence) * gate;
}

/** One pointer disc as a flat vec4 (x, y, radius, strength) in device px, Y flipped. */
export function packBlob(
  px: number,
  py: number,
  radiusCss: number,
  strength: number,
  dpr: number,
  canvasHeight: number,
): [number, number, number, number] {
  return [px * dpr, (canvasHeight - py) * dpr, radiusCss * dpr, strength];
}

/** Idle-plus-energy edge amplitude in CSS px for a given energy scalar. */
export function wobbleFor(energy: number): number {
  return WOBBLE_REST + WOBBLE_ENERGY * clamp01(energy);
}
