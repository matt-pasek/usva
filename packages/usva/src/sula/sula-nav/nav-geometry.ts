import { type Blob, NECK_MIN, type Neck } from "../sula-core/geometry.js";
import {
  c1Settle,
  clamp01,
  easeOutCubic,
  mix,
  smoother,
  smoothstep,
} from "../sula-motion/curves.js";

/** The drop separates from the edge across this window of the fall, while its
 * neck is still short, then falls the rest of the way free. Pinching early is
 * what keeps a long thread from ever spanning the gap. */
const SEPARATE_START = 0.5;
const SEPARATE_END = 0.9;
/** The leftover top mass has fully recoiled into the edge by here in the retract. */
const EDGE_HIDE_START = 0.7;

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
  const fall = c1Settle(t, 0.1);
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
  k: number,
): { blob: Blob; neck: Neck | null } {
  const p = clamp01(t);
  const dir = Math.sign(rest.cx - bar.cx) || 1;
  const barEnd = bar.cx + bar.hw * dir;

  const swell = smoothstep(0, SIDE_SWELL_END, p);
  /* Travel reaches the rest line at t=1 still moving (slope 1), so an underdamped
   * SIDE_SPRING carries a small settle wobble past the line and back instead of the
   * pill landing hard. Raw t, not clamped p, so the overshoot is not flattened. */
  const travel = c1Settle(t, SIDE_TRAVEL_START);
  const pinch = smoothstep(SIDE_PINCH_START, SIDE_PINCH_END, p);

  const scale = mix(0.5, 1, swell);
  const hw = rest.hw * scale;
  const hh = rest.hh * scale;

  const startCx = barEnd - dir * rest.hw * 0.62;
  const rawCx = mix(startCx, rest.cx, travel);
  /* Keep the spring's outer turn inside the standing bridge's safe reach. At
   * the turning point velocity briefly hits zero, so the live merge radius also
   * relaxes; an uncapped overshoot can otherwise disconnect for one frame and
   * reconnect on the rebound. */
  const maxOvershoot = k * 0.25;
  const cx =
    dir > 0
      ? Math.min(rawCx, rest.cx + maxOvershoot)
      : Math.max(rawCx, rest.cx - maxOvershoot);
  const cy = mix(bar.cy, rest.cy, travel);
  const blob: Blob = { cx, cy, hw, hh, r: Math.min(hw, hh) };

  if (p >= SIDE_PINCH_END || travel <= 0) return { blob, neck: null };
  const inner = cx - dir * hw;
  const r = Math.max(rest.hh * mix(0.86, 0.08, pinch), NECK_MIN);
  const neck: Neck = {
    ax: barEnd,
    ay: bar.cy,
    bx: inner,
    by: cy,
    r,
    strength: 1 - pinch,
  };
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

export type SwitchRole = "hide" | "show" | "keep";

/** The collapsing pill's whole morph fits inside this fraction of the switch. */
const HIDE_SPAN = 0.62;
/** The expanding pill holds until this fraction, then fills. */
const SHOW_LAG = 0.24;

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
  return role === "hide" ? easeOutCubic(s) : smoother(s);
}

/**
 * Content is swapped in the DOM the instant the view changes, so each changing
 * part already holds its target label. A monotonic fade-in materialises that new
 * label as the part reshapes; the old 1 to 0 to 1 dip flashed already-correct
 * content for nothing. Width staggers per role, but the fade stays on the gentle
 * quintic so the label never snaps in. Unchanged parts stay lit.
 */
export function switchFade(t: number, role: SwitchRole): number {
  return role === "keep" ? 1 : smoother(roleSpan(t, role));
}
