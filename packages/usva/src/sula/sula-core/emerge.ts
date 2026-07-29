import { c1Settle, clamp01, mix, smoothstep } from "../sula-motion/curves.js";
import { type Blob, NECK_MIN, type Neck } from "./geometry.js";

export interface EmergeOptions {
  swellEnd?: number;
  travelStart?: number;
  pinchStart?: number;
  pinchEnd?: number;
  startScale?: number;
}

/**
 * A droplet separating from a parent blob and settling at a target: it swells out
 * while still absorbed, then travels trailing a neck that thins and pinches. `t`
 * is 0 (absorbed in the parent) to 1 (settled at target). Travel runs through
 * c1Settle so an underdamped spring lands it with a settle wobble rather than a
 * hard stop; raw t past 1 overshoots position, not size.
 *
 * Generalizes the nav's `revealSide` from its bar/side axis to any parent->target
 * vector: the travel axis is the unit vector between centres, so a droplet can
 * emerge in any direction rather than only along x.
 */
export function emergeDroplet(
  parent: Blob,
  target: Blob,
  t: number,
  options: EmergeOptions = {},
): { blob: Blob; neck: Neck | null } {
  const {
    swellEnd = 0.36,
    travelStart = 0.3,
    pinchStart = 0.84,
    pinchEnd = 0.94,
    startScale = 0.5,
  } = options;

  const p = clamp01(t);

  const dx = target.cx - parent.cx;
  const dy = target.cy - parent.cy;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;

  const swell = smoothstep(0, swellEnd, p);
  /* Travel reaches the rest line at t=1 still moving (slope 1), so an underdamped
   * spring carries a small settle wobble past the line and back instead of the
   * droplet landing hard. Raw t, not clamped p, so the overshoot is not flattened. */
  const travel = c1Settle(t, travelStart);
  const pinch = smoothstep(pinchStart, pinchEnd, p);

  const scale = mix(startScale, 1, swell);
  const hw = target.hw * scale;
  const hh = target.hh * scale;

  /* The parent's box boundary along the travel axis, and a start point pulled
   * just inside it so the droplet is absorbed at rest. */
  const edgeX = parent.cx + ux * parent.hw;
  const edgeY = parent.cy + uy * parent.hh;
  const back = Math.abs(ux) * target.hw + Math.abs(uy) * target.hh;
  const startX = edgeX - ux * back * 0.62;
  const startY = edgeY - uy * back * 0.62;

  const cx = mix(startX, target.cx, travel);
  const cy = mix(startY, target.cy, travel);
  const blob: Blob = { cx, cy, hw, hh, r: Math.min(hw, hh) };

  if (p >= pinchEnd || travel <= 0) return { blob, neck: null };

  const trailX = cx - ux * hw;
  const trailY = cy - uy * hh;
  const r = Math.max(target.hh * mix(0.86, 0.08, pinch), NECK_MIN);
  const neck: Neck = {
    ax: edgeX,
    ay: edgeY,
    bx: trailX,
    by: trailY,
    r,
    strength: 1 - pinch,
  };
  return { blob, neck };
}
