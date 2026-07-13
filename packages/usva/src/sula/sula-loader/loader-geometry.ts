import { type Blob, bridgeNecks, type Neck } from "../sula-core/geometry.js";
import { clamp01, mix, smoother, smoothstep } from "../sula-motion/curves.js";

export type LoaderMotion = "orbit" | "cluster" | "twin";

export interface LoaderFrame {
  blobs: Blob[];
  necks: Neck[];
  /** The merge radius this beat wants. It rides the frame, not a constant, so a
   * bead can thin the field to tear free and thicken it again to fuse. */
  k: number;
}

export interface LoaderOpts {
  /** The loader's square side in canvas px. Every radius derives from it. */
  size: number;
}

const TAU = Math.PI * 2;

/** Wraps any real number into [0, 1) so a raw accumulated phase is safe to index. */
const wrap = (t: number): number => t - Math.floor(t);

/** A symmetric 0 to 1 to 0 pulse over [a, b], peaking at the midpoint. */
const pulse = (a: number, b: number, p: number): number =>
  Math.sin(clamp01((p - a) / (b - a)) * Math.PI);

function circle(cx: number, cy: number, r: number): Blob {
  return { cx, cy, hw: r, hh: r, r };
}

/**
 * The sling: a core winds up, extrudes a droplet, snaps it free, whips it around
 * a long arc, then reaches out to swallow it with a plop. The field thins to a
 * hair while the bead flies so it reads as a separate drop, and thickens back to
 * fuse it on return. Mass is conserved: the core runs lean while the bead is
 * free and inflates past rest as it absorbs it.
 */
export function orbitFrame(phase: number, { size }: LoaderOpts): LoaderFrame {
  const c = size / 2;
  const coreR = size * 0.17;
  const beadR = size * 0.11;
  const p = wrap(phase);

  const launch = -Math.PI * 0.35;
  const ux = Math.cos(launch);
  const uy = Math.sin(launch);

  const emerge = smoothstep(0.1, 0.22, p);
  const collapse = smoothstep(0.76, 0.92, p);
  const gone = smoothstep(0.92, 1.0, p);

  const f = clamp01((p - 0.22) / (0.76 - 0.22));
  const swept = f + (0.5 * Math.sin(f * TAU)) / TAU;
  const beadAngle = launch - TAU * 0.92 * swept;
  const distOut = size * (0.35 + 0.02 * Math.sin(f * Math.PI));
  const dist = mix(coreR * 0.5, distOut, emerge) * (1 - collapse);
  const bx = c + Math.cos(beadAngle) * dist;
  const by = c + Math.sin(beadAngle) * dist;
  const beadRadius = beadR * emerge * (1 - gone);

  const beadPresent = emerge * (1 - gone);
  const swallow = pulse(0.86, 1.0, p);
  const recoil = smoothstep(0.1, 0.16, p) - smoothstep(0.16, 0.3, p);
  const antic = pulse(0.0, 0.12, p);
  /* Reach toward the returning bead, then let go once it is swallowed. The
   * release must finish before the loop seam, or the stretched width snaps back
   * to rest in a single frame at the wrap. */
  const reach = smoothstep(0.78, 0.88, p) * (1 - smoothstep(0.9, 0.98, p));
  const lean = smoothstep(0.3, 0.6, p) * (1 - smoothstep(0.76, 0.88, p));

  const coreScale = 1 - 0.12 * beadPresent + 0.14 * swallow;
  const bearingX = Math.abs(Math.cos(beadAngle));
  const bearingY = Math.abs(Math.sin(beadAngle));
  const core: Blob = {
    cx:
      c - ux * recoil * size * 0.05 + Math.cos(beadAngle) * lean * size * 0.015,
    cy:
      c - uy * recoil * size * 0.05 + Math.sin(beadAngle) * lean * size * 0.015,
    hw:
      coreR *
      coreScale *
      (1 + 0.12 * reach * bearingX + 0.06 * antic * Math.abs(uy)),
    hh:
      coreR *
      coreScale *
      (1 + 0.12 * reach * bearingY + 0.06 * antic * Math.abs(ux)),
    r: coreR * coreScale * (1 - 0.06 * antic),
  };
  const bead = circle(bx, by, beadRadius);

  /* Fat while the bead is being born or swallowed so those fuse smoothly, thin
   * through the free flight so the drop actually clears the core's merge field. */
  const flight = smoothstep(0.26, 0.32, p) * (1 - smoothstep(0.72, 0.78, p));
  const k = mix(size * 0.16, size * 0.05, flight);

  const dx = bx - core.cx;
  const dy = by - core.cy;
  const len = Math.hypot(dx, dy) || 1;
  const nx = dx / len;
  const ny = dy / len;

  /* Only tether across a real gap. While the bead is still buried in the core
   * (being born, or fully swallowed) the smooth-min carries the fusion and a
   * neck would project a capsule out past the merged surface, popping it. */
  const gap = len - coreR - beadRadius;
  const gapGate = smoothstep(-beadRadius, 0, gap);
  const releaseStr = 1 - smoothstep(0.16, 0.22, p);
  const captureStr = smoothstep(0.78, 0.86, p) * (1 - gone);
  const strength = Math.max(releaseStr, captureStr) * gapGate;
  if (beadRadius <= 0.5 || strength <= 0.01) {
    return { blobs: [core, bead], necks: [], k };
  }
  const neck: Neck = {
    ax: core.cx + nx * coreR,
    ay: core.cy + ny * coreR,
    bx: bx - nx * beadRadius,
    by: by - ny * beadRadius,
    r: beadRadius * 0.72,
    strength,
  };
  return { blobs: [core, bead], necks: [neck], k };
}

/** Radii of the three bloom lobes, largest first, so the mass is asymmetric. */
const BLOOM_RADII = [0.15, 0.125, 0.105];
const BLOOM_ANGLES = [-Math.PI * 0.56, Math.PI * 0.14, Math.PI * 0.81];

/**
 * The bloom: one mass breathes apart into a three-lobed clover and gathers back
 * into one, mitosis in reverse. The whole gesture rides a single cosine bump,
 * which is zero in both value and velocity at the loop seam, so the clover opens
 * and closes once per loop with no dwell and no jump where it wraps. The lobes
 * divide from the centre so their waists never leave bridge reach.
 */
export function clusterFrame(phase: number, { size }: LoaderOpts): LoaderFrame {
  const c = size / 2;
  const p = wrap(phase);
  const k = size * 0.12;

  const open = smoother(0.5 - 0.5 * Math.cos(p * TAU));
  const spin = Math.sin(p * TAU) * 0.12;

  const distances = [0.22, 0.24, 0.23];
  const blobs = BLOOM_RADII.map((rf, i) => {
    const angle = (BLOOM_ANGLES[i] as number) + spin + open * 0.12 * (i - 1);
    const d = size * (distances[i] as number) * open;
    const rr = size * (rf as number);
    return {
      cx: c + Math.cos(angle) * d,
      cy: c + Math.sin(angle) * d,
      hw: rr * (1 - 0.05 * open),
      hh: rr * (1 + 0.06 * open),
      r: rr * (1 - 0.03 * open),
    } satisfies Blob;
  });

  /* Fade the waists out as the clover gathers: once the lobes are nearly
   * coincident the smooth-min already fuses them, and a neck there would project
   * an oversized capsule out of the merged circle, snapping its silhouette for a
   * frame. Necks only exist while the lobes are genuinely apart. */
  const merge = smoothstep(0.1, 0.5, open);
  const [l0, l1, l2] = blobs as [Blob, Blob, Blob];
  const necks =
    merge <= 0.001
      ? []
      : [
          ...bridgeNecks([l0, l1], k, merge),
          ...bridgeNecks([l1, l2], k, merge),
          ...bridgeNecks([l2, l0], k, merge),
        ];
  return { blobs, necks, k };
}

/**
 * The binary: two unequal masses fall around a shared centre like a binary star.
 * An elliptical separation sweeps the whole expressive range of the neck, from a
 * fused peanut at perigee to a taut glowing thread at apogee, where it snaps for
 * one breath before they slam back together. Kepler timing (fast when close,
 * slow when far) is what reads as gravity instead of a mechanical spin.
 */
export function twinFrame(phase: number, { size }: LoaderOpts): LoaderFrame {
  const c = size / 2;
  const p = wrap(phase);
  const k = size * 0.16;
  const bigR = size * 0.17;
  const smallR = size * 0.12;

  const theta = p * TAU + 0.18 * Math.sin(p * TAU - 0.15 * TAU) - Math.PI * 0.2;
  const sep = size * (0.42 - 0.13 * Math.cos((p - 0.15) * TAU));
  const dirx = Math.cos(theta);
  const diry = Math.sin(theta);

  const bigMass = bigR * bigR;
  const smallMass = smallR * smallR;
  const total = bigMass + smallMass;
  const bigOff = (sep * smallMass) / total;
  const smallOff = (sep * bigMass) / total;

  const snap = 1 - smoothstep(0.55, 0.62, p);
  const reform = smoothstep(0.72, 0.8, p);
  const strength = p < 0.5 ? 1 : Math.max(snap, reform);
  const closeness = clamp01(1 - (sep - size * 0.29) / (size * 0.26));
  const stretch = strength * (1 - closeness);
  const recoil = pulse(0.55, 0.7, p) * 0.02;

  const big: Blob = {
    cx: c - dirx * (bigOff + recoil * size),
    cy: c - diry * (bigOff + recoil * size),
    hw: bigR * (1 + 0.14 * stretch * Math.abs(dirx)),
    hh: bigR * (1 + 0.14 * stretch * Math.abs(diry)),
    r: bigR * (1 - 0.05 * stretch),
  };
  const small: Blob = {
    cx: c + dirx * (smallOff + recoil * size),
    cy: c + diry * (smallOff + recoil * size),
    hw: smallR * (1 + 0.14 * stretch * Math.abs(dirx)),
    hh: smallR * (1 + 0.14 * stretch * Math.abs(diry)),
    r: smallR * (1 - 0.05 * stretch),
  };
  return {
    blobs: [big, small],
    necks: bridgeNecks([big, small], k, strength),
    k,
  };
}

export const LOADER_FRAMES: Record<
  LoaderMotion,
  (phase: number, opts: LoaderOpts) => LoaderFrame
> = {
  orbit: orbitFrame,
  cluster: clusterFrame,
  twin: twinFrame,
};

/** Representative stills for reduced motion and the no-WebGL fallback: each
 * caught at its most legible beat (bead out, clover open, thread taut). */
export const STATIC_PHASES: Record<LoaderMotion, number> = {
  orbit: 0.46,
  cluster: 0.5,
  twin: 0.48,
};

/** Loop period in seconds at speed 1, per motion. One legible beat per loop
 * wants slightly different pacing: the clover breathes slowest. */
export const LOOP_PERIODS: Record<LoaderMotion, number> = {
  orbit: 2.6,
  cluster: 3.0,
  twin: 2.4,
};

/** Default period, kept for callers that do not vary pacing by motion. */
export const LOOP_PERIOD = LOOP_PERIODS.orbit;

export function loaderFrame(
  motion: LoaderMotion,
  phase: number,
  size: number,
): LoaderFrame {
  return LOADER_FRAMES[motion](phase, { size });
}
