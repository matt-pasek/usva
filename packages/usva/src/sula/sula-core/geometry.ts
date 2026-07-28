import { clamp01, mix, smoothstep } from "../sula-motion/curves.js";

/** Brand + views + detached satellite fields + the drip's transient reservoir.
 * The shader loops break on the live count, so headroom here costs nothing per
 * fragment; overflowing it silently drops parts, which is far worse. */
export const MAX_BLOBS = 12;
/** Neighbour bridges while a switch fuses the row, the drip tether on load, and
 * one separation neck per part still pulling away from the body. */
export const MAX_NECKS = 8;

/** A rounded box in canvas space: centre, half-extents, corner radius. */
export interface Blob {
  cx: number;
  cy: number;
  hw: number;
  hh: number;
  r: number;
}

/** A capsule from a to b. Round caps read as surface tension; square ones do not. */
export interface Neck {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  r: number;
  /**
   * How much of the neck's smooth-min bridge is applied, 0 to 1. The visible
   * bridge width is set by the merge radius, not by `r`, so a neck cannot be
   * melted by thinning it; fading strength to 0 recedes the bridge from the
   * surface inward instead, which is the only way it melts without snapping.
   * Absent means a solid bridge (1).
   */
  strength?: number;
}

export interface Field {
  blobs: Blob[];
  necks: Neck[];
  k: number;
}

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Default snap distance, as a multiple of the merge radius. */
const BREAK_FACTOR = 0.9;
/** Neck radius at zero separation, as a multiple of the merge radius. A fat neck
 * reads as surface tension; a thin one reads as a stray thread. */
const NECK_THICKNESS = 1.15;
/** Geometric floor for a neck while its field strength melts to zero. The
 * capsule must stay substantial enough to read as a waist; `strength`, not a
 * vanishing radius, owns the continuous attach/detach tail. */
export const NECK_MIN = 1.5;

export function neckBreakDistance(k: number): number {
  return k * BREAK_FACTOR;
}

export function neckRadius(
  distance: number,
  k: number,
  breakDistance: number = neckBreakDistance(k),
): number {
  if (breakDistance <= 0 || distance >= breakDistance) return 0;
  const t = Math.max(0, distance) / breakDistance;
  return k * NECK_THICKNESS * (1 - t) ** 1.1;
}

export function toCanvasSpace(rect: Rect, canvas: Rect): Blob {
  const hw = rect.width / 2;
  const hh = rect.height / 2;
  return {
    cx: rect.left - canvas.left + hw,
    cy: rect.top - canvas.top + hh,
    hw,
    hh,
    r: Math.min(hw, hh),
  };
}

/**
 * Measures each part at its CSS rest position without exposing the temporary
 * transform reset to the next paint. The liquid field owns the inline transform
 * while it animates, but its target geometry must stay transform-free.
 */
export function measureRestBlobs(
  parts: Array<{
    style: { transform: string };
    getBoundingClientRect(): Rect;
  }>,
  canvas: Rect,
): Blob[] {
  const transforms = parts.map((part) => part.style.transform);
  for (const part of parts) part.style.transform = "";
  try {
    return parts.map((part) =>
      toCanvasSpace(part.getBoundingClientRect(), canvas),
    );
  } finally {
    for (const [index, part] of parts.entries()) {
      part.style.transform = transforms[index] ?? "";
    }
  }
}

export function lerpBlob(a: Blob, b: Blob, t: number): Blob {
  return {
    cx: mix(a.cx, b.cx, t),
    cy: mix(a.cy, b.cy, t),
    hw: mix(a.hw, b.hw, t),
    hh: mix(a.hh, b.hh, t),
    r: mix(a.r, b.r, t),
  };
}

/**
 * A spring hands back values past 1. Position may overshoot, because that is the
 * bounce; half-extents may not, because a blob wider than its DOM box paints
 * glass out from under the text.
 */
export function springToBlob(from: Blob, to: Blob, s: number): Blob {
  const clamped = Math.min(1, Math.max(0, s));
  return {
    cx: mix(from.cx, to.cx, s),
    cy: mix(from.cy, to.cy, s),
    hw: mix(from.hw, to.hw, clamped),
    hh: mix(from.hh, to.hh, clamped),
    r: mix(from.r, to.r, clamped),
  };
}

/** How far past the merge radius the goo will still bridge two neighbours. */
export const BRIDGE_REACH = 1.6;
/** Merge at or past this holds the bridge at full strength. Holding a partial
 * strength recedes the bridge into two sharp cusps (the mix of a thin capsule
 * into the round surface never crosses zero mid-gap), so a standing rest pull
 * must be a full-strength smooth-min; only a transient melt may fade below. */
const BRIDGE_FULL = 0.3;

/** The blob's surface reach from its centre along a direction, exact for a
 * rounded box: the core box support plus the corner radius. */
function supportAlong(b: Blob, ux: number, uy: number): number {
  return Math.abs(ux) * (b.hw - b.r) + Math.abs(uy) * (b.hh - b.r) + b.r;
}

/**
 * Surface-tension bridges between adjacent blobs, in whatever direction the pair
 * sits: each neck runs centre-to-centre along the pair's own axis, from surface
 * to surface. Thickness grows with `merge` (REST at rest, 1 at the peak of a
 * transition) and with how close the two sit, so near pairs join in a soft
 * concave waist. At the edge of the reach the capsule holds its geometric floor
 * while its field strength eases from zero, matching the same melt used by
 * authored Sula necks: approaching bodies reach toward each other before joining,
 * and separating bodies flow back into themselves instead of losing a whole neck
 * in one frame. Blobs must be handed in adjacency order.
 */
export function bridgeNecks(blobs: Blob[], k: number, merge: number): Neck[] {
  const m = clamp01(merge);
  if (m <= 0.001 || k <= 0) return [];
  const reach = k * BRIDGE_REACH;
  const necks: Neck[] = [];
  for (let i = 0; i < blobs.length - 1; i++) {
    const a = blobs[i] as Blob;
    const b = blobs[i + 1] as Blob;
    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;
    const supA = supportAlong(a, ux, uy);
    const supB = supportAlong(b, ux, uy);
    const gap = dist - supA - supB;
    if (gap > reach) continue;
    const closeness = 1 - clamp01(Math.max(gap, 0) / reach);
    const base = Math.min(a.hw, a.hh, b.hw, b.hh);
    const thickness = base * mix(0.25, 0.9, m) * closeness;
    const mergeStrength = smoothstep(0, BRIDGE_FULL, m);
    const distanceStrength = smoothstep(0, BRIDGE_FULL, closeness);
    necks.push({
      ax: a.cx + ux * supA,
      ay: a.cy + uy * supA,
      bx: b.cx - ux * supB,
      by: b.cy - uy * supB,
      r: Math.max(thickness, NECK_MIN),
      strength: mergeStrength * distanceStrength,
    });
  }
  return necks;
}

export function activePillRect(
  items: Blob[],
  activeIndex: number,
): Blob | null {
  return items[activeIndex] ?? null;
}

/**
 * Position and size move on separate clocks. The whole row glides to its new
 * layout on one shared `posT` so it stays coherent and never tears a gap, while
 * each part's width follows its own staggered `sizeT` so a collapsing bar can
 * shed width fast without the row lagging behind it.
 */
export function morphBlob(
  from: Blob,
  to: Blob,
  posT: number,
  sizeT: number,
): Blob {
  return {
    cx: mix(from.cx, to.cx, posT),
    cy: mix(from.cy, to.cy, posT),
    hw: mix(from.hw, to.hw, sizeT),
    hh: mix(from.hh, to.hh, sizeT),
    r: mix(from.r, to.r, sizeT),
  };
}

/**
 * True when any part moved or resized past the tolerance. A webfont swap or
 * rounding jitter re-measures within it, and applying that would twitch a bar
 * that already looks settled.
 */
export function restDiffers(a: Blob[], b: Blob[], eps = 0.5): boolean {
  if (a.length !== b.length) return true;
  return a.some((blob, i) => {
    const other = b[i];
    if (!other) return true;
    return (
      Math.abs(blob.cx - other.cx) > eps ||
      Math.abs(blob.cy - other.cy) > eps ||
      Math.abs(blob.hw - other.hw) > eps ||
      Math.abs(blob.hh - other.hh) > eps
    );
  });
}

/** Radius of the cursor wave in CSS px. Broad enough to bend a section of a long
 * pill, while remaining local enough that neighbouring parts stay calm. */
const HOVER_SPREAD = 90;

export interface PackedHover {
  point: [number, number];
  amount: number;
  spread: number;
}

/** Flattens the hover focus the way packUniforms does: device px, Y flipped. */
export function packHover(
  blob: Blob,
  amount: number,
  dpr: number,
  canvasHeight: number,
  point?: { x: number; y: number },
): PackedHover {
  const focus = point ?? { x: blob.cx, y: blob.cy };
  return {
    point: [focus.x * dpr, (canvasHeight - focus.y) * dpr],
    amount: amount * dpr,
    spread: HOVER_SPREAD * dpr,
  };
}

export interface PackedField {
  blobs: number[];
  radii: number[];
  necks: number[];
  neckRadii: number[];
  neckStrengths: number[];
  blobCount: number;
  neckCount: number;
}

/**
 * Flattens to device pixels and flips Y, because `gl_FragCoord` counts up from the
 * bottom. These stay plain arrays, not Float32Arrays: ogl gates array uniforms on
 * `Array.isArray`, and a typed array fails it and uploads nothing at all.
 */
export function packUniforms(
  field: Field,
  dpr: number,
  canvasHeight: number,
): PackedField {
  const blobs = new Array<number>(MAX_BLOBS * 4).fill(0);
  const radii = new Array<number>(MAX_BLOBS).fill(0);
  const necks = new Array<number>(MAX_NECKS * 4).fill(0);
  const neckRadii = new Array<number>(MAX_NECKS).fill(0);
  const neckStrengths = new Array<number>(MAX_NECKS).fill(0);

  const blobCount = Math.min(field.blobs.length, MAX_BLOBS);
  for (let i = 0; i < blobCount; i++) {
    const b = field.blobs[i] as Blob;
    blobs[i * 4] = b.cx * dpr;
    blobs[i * 4 + 1] = (canvasHeight - b.cy) * dpr;
    blobs[i * 4 + 2] = b.hw * dpr;
    blobs[i * 4 + 3] = b.hh * dpr;
    radii[i] = b.r * dpr;
  }

  const neckCount = Math.min(field.necks.length, MAX_NECKS);
  for (let i = 0; i < neckCount; i++) {
    const n = field.necks[i] as Neck;
    necks[i * 4] = n.ax * dpr;
    necks[i * 4 + 1] = (canvasHeight - n.ay) * dpr;
    necks[i * 4 + 2] = n.bx * dpr;
    necks[i * 4 + 3] = (canvasHeight - n.by) * dpr;
    neckRadii[i] = n.r * dpr;
    neckStrengths[i] = n.strength ?? 1;
  }

  return {
    blobs,
    radii,
    necks,
    neckRadii,
    neckStrengths,
    blobCount,
    neckCount,
  };
}
