/** Brand + up to five views + the drip's transient reservoir/bead. */
export const MAX_BLOBS = 8;
/** Neighbour bridges while a switch fuses the row, or the drip tether on load. */
export const MAX_NECKS = 5;

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

/** The drop separates from the edge across this window of the fall, while its
 * neck is still short, then falls the rest of the way free. Pinching early is
 * what keeps a long thread from ever spanning the gap. */
const SEPARATE_START = 0.5;
const SEPARATE_END = 0.9;
/** The leftover top mass has fully recoiled into the edge by here in the retract. */
const EDGE_HIDE_START = 0.7;

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

const mix = (a: number, b: number, t: number): number => a + (b - a) * t;
const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));
/** Hermite ramp between edges; 0 below `a`, 1 above `b`, eased in between. */
const smoothstep = (a: number, b: number, x: number): number => {
  if (a === b) return x < a ? 0 : 1;
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

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

export interface LoadShape {
  bar: Blob;
  extras: Blob[];
  necks: Neck[];
}

/**
 * The bar is drawn down out of the top edge as a teardrop. A small bulb gathers
 * at the edge, the drop stretches away on a short neck, and it separates early in
 * the fall: the neck pinches off while it is still short and the top bulb recoils
 * into the edge, so the drop finishes falling free rather than trailing a thread.
 * `t` may pass 1: a spring's overshoot carries the bar past its rest line so it
 * lands with a dip and a soft second bob instead of decelerating into a wall.
 */
export function loadPhase(
  barRest: Blob,
  t: number,
  edgeY: number,
  retractT: number = 1,
): LoadShape {
  const p = clamp01(t);
  const retract = clamp01(retractT);
  const cx = barRest.cx;

  const gather = smoothstep(0, 0.14, p);
  const startCy = edgeY + barRest.hh * 0.55;
  /* One continuous fall. The eased launch reaches the rest line at t=1 already
   * moving (slope 1), so the spring's overshoot past 1 flows straight on past the
   * line and back as one motion, instead of the bar easing to a dead stop at the
   * line and only then starting a separate dip. `t` is the raw spring value and
   * carries the overshoot; f is its delayed, unit-landing fall time. */
  const f = Math.max(0, (t - 0.1) / 0.9);
  const fall = f < 1 ? f * f * (2 - f) : f;
  const cy = mix(startCy, barRest.cy, fall);
  const hw = barRest.hw * mix(0.3, 1, smoothstep(0.3, 0.85, p));
  const hh = barRest.hh * mix(0.42, 1, smoothstep(0.2, 0.8, p));
  const bar: Blob = { cx, cy, hw, hh, r: Math.min(hw, hh) };

  if (retract >= 1) return { bar, extras: [], necks: [] };

  /* The drop lets go of the edge early in its fall, while the neck is still
   * short, then falls free; the leftover top mass recoils into the edge as it
   * separates. So nothing ever spans the gap as a long thread. Recoil is driven
   * by the fall itself, and the retract only mops up any remainder. */
  const separate = smoothstep(SEPARATE_START, SEPARATE_END, p);
  const recoil = Math.max(separate, smoothstep(EDGE_HIDE_START, 1, retract));

  /* A wide, shallow fluid lens at the edge that necks down into the bar, not a
   * bead: the width is what reads as a gooey surface being pulled, and it drains
   * to nothing as the drop separates. */
  const swell = mix(0.78, 1, gather);
  const bulbHw = Math.max(barRest.hw * mix(0.52, 0.04, recoil) * swell, 0.5);
  const bulbHh = Math.max(barRest.hh * mix(0.92, 0.05, recoil) * swell, 0.5);
  const reservoir: Blob = {
    cx,
    cy: edgeY + bulbHh * 0.5,
    hw: bulbHw,
    hh: bulbHh,
    r: Math.min(bulbHw, bulbHh),
  };

  /* A fat neck, so the smooth-min bends the surface into a concave funnel with
   * real surface tension instead of a thread. It thins and its strength fades as
   * the drop separates, so the fat column necks in the middle and pinches. */
  const barTop = cy - hh;
  const tetherRadius = barRest.hh * mix(1.15, 0.22, separate);
  const tetherStrength = 1 - separate;
  const necks: Neck[] =
    barTop > edgeY + 2 && tetherStrength > 0.001
      ? [
          {
            ax: cx,
            ay: edgeY,
            bx: cx,
            by: barTop,
            r: tetherRadius,
            strength: tetherStrength,
          },
        ]
      : [];

  return { bar, extras: [reservoir], necks };
}

/** The side first redistributes mass into the bar's shoulder without travelling.
 * A longer swell reads as surface tension: the pill clings and gathers before it
 * lets go, rather than shooting straight out. */
const SIDE_SWELL_END = 0.36;
/** Travel overlaps the end of the swell so the shoulder pours outward. */
const SIDE_TRAVEL_START = 0.3;
/** The side is already home when its tether pinches free. */
const SIDE_PINCH_START = 0.84;
const SIDE_PINCH_END = 0.94;
/** A neck never falls below this before the snap, or the eye misses the tether. */
const NECK_MIN = 1.5;

/**
 * A side emerges the way a drop separates from a larger one. At rest it is fully
 * absorbed inside the bar's end, so nothing pokes out and the closed nav has clean
 * edges. As it opens it first swells out past the end while still merged (the end
 * bulges), then travels out trailing a neck that thins until it snaps. Melting it
 * back runs the same path in reverse, ending flush inside the bar. It never pops.
 */
export function revealSide(
  bar: Blob,
  rest: Blob,
  t: number,
  _k: number,
): { blob: Blob; neck: Neck | null } {
  const p = clamp01(t);
  const dir = Math.sign(rest.cx - bar.cx) || 1;
  const barEnd = bar.cx + bar.hw * dir;

  const swell = smoothstep(0, SIDE_SWELL_END, p);
  /* Travel reaches the rest line at t=1 still moving (slope 1), so an underdamped
   * SIDE_SPRING carries a small settle wobble past the line and back instead of the
   * pill landing hard. Raw t, not clamped p, so the overshoot is not flattened. */
  const g = Math.max(0, (t - SIDE_TRAVEL_START) / (1 - SIDE_TRAVEL_START));
  const travel = g < 1 ? g * g * (2 - g) : g;
  const pinch = smoothstep(SIDE_PINCH_START, SIDE_PINCH_END, p);

  const scale = mix(0.5, 1, swell);
  const hw = rest.hw * scale;
  const hh = rest.hh * scale;

  const startCx = barEnd - dir * rest.hw * 0.62;
  const cx = mix(startCx, rest.cx, travel);
  const cy = mix(bar.cy, rest.cy, travel);
  const blob: Blob = { cx, cy, hw, hh, r: Math.min(hw, hh) };

  if (p >= SIDE_PINCH_END || travel <= 0) return { blob, neck: null };
  const inner = cx - dir * hw;
  const r = Math.max(rest.hh * mix(0.86, 0.08, pinch), NECK_MIN);
  const neck: Neck = { ax: barEnd, ay: bar.cy, bx: inner, by: cy, r };
  return { blob, neck };
}

/** Leading and trailing start merged inside the bar and spring out, each trailing a neck. */
export function revealPhase(
  bar: Blob,
  leadRest: Blob,
  trailRest: Blob,
  t: number,
  k: number,
): { lead: Blob; trail: Blob; necks: Neck[] } {
  const lead = revealSide(bar, leadRest, t, k);
  const trail = revealSide(bar, trailRest, t, k);
  const necks = [lead.neck, trail.neck].filter(
    (neck): neck is Neck => neck !== null,
  );
  return { lead: lead.blob, trail: trail.blob, necks };
}

export function activePillRect(
  items: Blob[],
  activeIndex: number,
): Blob | null {
  return items[activeIndex] ?? null;
}

/** How far past the merge radius the goo will still bridge two neighbours. */
const BRIDGE_REACH = 1.6;

/**
 * While a switch is live the whole row reads as one liquid mass: each pair of
 * adjacent blobs gets a neck whose thickness grows with `merge` (0 at rest, 1 at
 * the peak of the transition) and with how close the two already sit. At rest, or
 * for a pair further apart than the reach, no neck is emitted and the pills stay
 * cleanly separate. Blobs must be handed in left-to-right order.
 */
export function bridgeNecks(blobs: Blob[], k: number, merge: number): Neck[] {
  const m = clamp01(merge);
  if (m <= 0.001 || k <= 0) return [];
  const reach = k * BRIDGE_REACH;
  const necks: Neck[] = [];
  for (let i = 0; i < blobs.length - 1; i++) {
    const a = blobs[i] as Blob;
    const b = blobs[i + 1] as Blob;
    const ax = a.cx + a.hw;
    const bx = b.cx - b.hw;
    const gap = bx - ax;
    if (gap > reach) continue;
    const closeness = 1 - clamp01(gap / reach);
    const thickness = Math.min(a.hh, b.hh) * mix(0.15, 0.85, m) * closeness;
    necks.push({
      ax,
      ay: a.cy,
      bx,
      by: b.cy,
      r: Math.max(thickness, NECK_MIN),
      strength: m,
    });
  }
  return necks;
}

export type SwitchRole = "hide" | "show" | "keep";

/** The collapsing pill's whole morph fits inside this fraction of the switch. */
const HIDE_SPAN = 0.62;
/** The expanding pill holds until this fraction, then fills. */
const SHOW_LAG = 0.24;

const quintic = (t: number): number => {
  const x = clamp01(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/** Decelerating: a wide bar sheds most of its width in the first frames rather
 * than lingering as a long empty slab, which reads as goofy sizing. */
const easeOutCubic = (t: number): number => {
  const inv = 1 - clamp01(t);
  return 1 - inv * inv * inv;
};

const roleSpan = (t: number, role: SwitchRole): number => {
  const x = clamp01(t);
  if (role === "hide") return clamp01(x / HIDE_SPAN);
  if (role === "show") return clamp01((x - SHOW_LAG) / (1 - SHOW_LAG));
  return x;
};

/**
 * A draining pill leads the morph and a filling pill lags it, so the two are
 * never wide at the same moment and the row cannot fuse into one ballooning
 * slab mid-switch. The outgoing bar collapses on a fast ease-out so it never
 * lingers wide; the incoming bar pours out on the gentler quintic. Each blob
 * still moves monotonically between its endpoints.
 */
export function switchProgress(t: number, role: SwitchRole): number {
  const s = roleSpan(t, role);
  return role === "hide" ? easeOutCubic(s) : quintic(s);
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
 * Content is swapped in the DOM the instant the view changes, so each changing
 * part already holds its target label. A monotonic fade-in materialises that new
 * label as the part reshapes; the old 1 to 0 to 1 dip flashed already-correct
 * content for nothing. Width staggers per role, but the fade stays on the gentle
 * quintic so the label never snaps in. Unchanged parts stay lit.
 */
export function switchFade(t: number, role: SwitchRole): number {
  return role === "keep" ? 1 : quintic(roleSpan(t, role));
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
