import type { Blob, Neck } from "../sula-core/geometry.js";
import {
  c1Settle,
  clamp01,
  mix,
  smoother,
  smoothstep,
} from "../sula-motion/curves.js";

/** The tether back to the source starts melting once the pill has clearly left. */
const NECK_MELT_START = 0.08;
/** ...and is fully gone by here, well before landing, via strength rather than
 * by thinning: a thinning neck ends as a hard line that snaps out. */
const NECK_MELT_END = 0.55;
/** Mid-flight the pill squashes a little, like liquid stretched by its travel. */
const FLIGHT_SQUASH = 0.16;
const FLIGHT_STRETCH = 0.09;

/** A measured segment rect, relative to the stage box, as a fully rounded pill. */
export function pillFromRect(rect: {
  left: number;
  top: number;
  width: number;
  height: number;
}): Blob {
  const hw = rect.width / 2;
  const hh = rect.height / 2;
  return {
    cx: rect.left + hw,
    cy: rect.top + hh,
    hw,
    hh,
    r: Math.min(hw, hh),
  };
}

/**
 * The indicator mid-transition: one pill that leaves the source, travels in a
 * straight line to the target and merges into it, its size eased continuously
 * from source to target the whole way. A brief fat neck ties it back to the
 * source and melts via strength while the pill is still near, so nothing ever
 * thins into a thread or snaps. `t` runs 0 (source) to 1 (target) and may pass 1
 * for the settle overshoot; overshoot moves position, never size. At rest a
 * caller draws just `[targetPill]`; this covers only the live transition.
 */
export function indicatorPhase(
  source: Blob,
  target: Blob,
  t: number,
): { blobs: Blob[]; neck: Neck | null } {
  const p = clamp01(t);
  const travel = c1Settle(t, 0);
  const sizeT = smoother(p);
  const flight = Math.sin(Math.PI * p);

  const cx = mix(source.cx, target.cx, travel);
  const cy = mix(source.cy, target.cy, travel);
  const hw = mix(source.hw, target.hw, sizeT) * (1 + FLIGHT_STRETCH * flight);
  const hh = mix(source.hh, target.hh, sizeT) * (1 - FLIGHT_SQUASH * flight);
  const pill: Blob = { cx, cy, hw, hh, r: Math.min(hw, hh) };

  const strength = 1 - smoothstep(NECK_MELT_START, NECK_MELT_END, p);
  if (strength <= 0.001) return { blobs: [pill], neck: null };

  const dir = Math.sign(target.cx - source.cx) || 1;
  const neck: Neck = {
    ax: source.cx,
    ay: source.cy,
    bx: cx - dir * hw,
    by: cy,
    r: Math.min(source.hh, hh) * 0.55,
    strength,
  };
  return { blobs: [pill], neck };
}
