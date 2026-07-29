import { type Blob, bridgeNecks, type Neck } from "../sula-core/geometry.js";
import { clamp01, smoother } from "../sula-motion/curves.js";

export interface DriftOpts {
  width: number;
  height: number;
  /** Feeds every path phase, so a seed reproduces the same wander. */
  seed: number;
}

export interface FieldGeometry {
  /** Two huge, dark, shoulder-off-canvas masses: the atmosphere, no rim. */
  back: Blob[];
  /** Lit actors and glints that drift, kiss and part in front. */
  front: Blob[];
  /** Scheduled-kiss bridges among the front actors. */
  necks: Neck[];
}

const TAU = Math.PI * 2;

/** The full loop closes at 96 s: every band's cycle count is an integer, so the
 * whole field returns to its start seamlessly and deterministically. */
export const LOOP_T = 96;

/** Fraction of the short side used as the front merge radius. Higher than the
 * old single-pass k so a kiss reads as a fat waist, not a thread. */
export const FRONT_K_FRACTION = 0.11;
/** The back pass merges soupy and huge, so its two anchors read as one cloud. */
export const BACK_K_FRACTION = 0.2;

/** Eased approach of the pointer lean, per frame. */
export const POINTER_EASE = 0.08;
/** The heavy wake that drags a blob toward the cursor is slower still: a liquid
 * has mass, so it lags. */
export const WAKE_EASE = 0.03;

/**
 * A deterministic hash in [0, 1) from an integer stream and the seed. Only has to
 * look unpatterned and stay identical across renders so the drift is stable for
 * SSR and tests.
 */
function hash(n: number, seed: number): number {
  const x = Math.sin((n + 1) * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const clamp = (v: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, v));

/** Three incommensurate sine bands with descending weight. Integer cycle counts
 * over LOOP_T keep it seamless; the coprime-ish triples keep the period from
 * ever visibly repeating inside two minutes. */
const BAND_WEIGHTS = [0.6, 0.3, 0.1];
function drift(
  time: number,
  amp: number,
  cycles: readonly [number, number, number],
  phase: number,
): number {
  let s = 0;
  for (let j = 0; j < 3; j++) {
    const f = ((cycles[j] as number) * TAU) / LOOP_T;
    s += (BAND_WEIGHTS[j] as number) * Math.sin(time * f + phase + j * 2.399);
  }
  return amp * s;
}

interface Spec {
  baseX: number;
  baseY: number;
  r: number;
  amp: number;
  cyclesX: readonly [number, number, number];
  cyclesY: readonly [number, number, number];
  breath: number;
  offCanvas: boolean;
}

function place(spec: Spec, time: number, opts: DriftOpts, id: number): Blob {
  const { width, height, seed } = opts;
  const px = hash(id * 16 + 6, seed) * TAU;
  const py = hash(id * 16 + 7, seed) * TAU;
  const breathe =
    1 +
    spec.breath *
      Math.sin((time * TAU) / LOOP_T + hash(id * 16 + 8, seed) * TAU);
  const r = spec.r * breathe;
  const dx = drift(time, spec.amp, spec.cyclesX, px);
  const dy = drift(time, spec.amp, spec.cyclesY, py);
  const slackX = spec.offCanvas ? 0.35 * r : r;
  const slackY = spec.offCanvas ? 0.35 * r : r;
  const cx = clamp(spec.baseX * width + dx, -slackX, width + slackX);
  const cy = clamp(spec.baseY * height + dy, -slackY, height + slackY);
  return { cx, cy, hw: r, hh: r, r };
}

/** One scheduled encounter: which two front actors meet, when in the loop, and
 * how wide the window is (as loop fractions). */
const KISSES: ReadonlyArray<{
  i: number;
  j: number;
  at: number;
  half: number;
}> = [
  { i: 0, j: 1, at: 0.22, half: 0.06 },
  { i: 1, j: 2, at: 0.61, half: 0.06 },
  { i: 0, j: 2, at: 0.87, half: 0.05 },
];

export function fieldFrame(time: number, opts: DriftOpts): FieldGeometry {
  const { width, height } = opts;
  const short = Math.min(width, height);

  const backSpecs: Spec[] = [
    {
      baseX: 0.16,
      baseY: 0.84,
      r: short * 0.45,
      amp: short * 0.04,
      cyclesX: [1, 3, 7],
      cyclesY: [2, 5, 11],
      breath: 0.06,
      offCanvas: true,
    },
    {
      baseX: 0.86,
      baseY: 0.2,
      r: short * 0.34,
      amp: short * 0.045,
      cyclesX: [3, 7, 13],
      cyclesY: [1, 5, 9],
      breath: 0.06,
      offCanvas: true,
    },
  ];

  const midSpecs: Spec[] = [
    { baseX: 0.3, baseY: 0.68, r: short * 0.16 },
    { baseX: 0.52, baseY: 0.5, r: short * 0.13 },
    { baseX: 0.68, baseY: 0.36, r: short * 0.11 },
  ].map((s) => ({
    ...s,
    amp: short * 0.12,
    cyclesX: [2, 5, 11],
    cyclesY: [3, 8, 13],
    breath: 0.05,
    offCanvas: false,
  }));

  const glintSpecs: Spec[] = [
    { baseX: 0.72, baseY: 0.72, r: short * 0.05 },
    { baseX: 0.34, baseY: 0.24, r: short * 0.035 },
  ].map((s) => ({
    ...s,
    amp: short * 0.18,
    cyclesX: [3, 8, 13],
    cyclesY: [5, 13, 21],
    breath: 0.04,
    offCanvas: false,
  }));

  const back = backSpecs.map((s, i) => place(s, time, opts, i));
  const mid = midSpecs.map((s, i) => place(s, time, opts, 10 + i));
  const glints = glintSpecs.map((s, i) => place(s, time, opts, 20 + i));

  const k = short * FRONT_K_FRACTION;
  const loopPhase = (((time % LOOP_T) + LOOP_T) % LOOP_T) / LOOP_T;
  const necks: Neck[] = [];
  for (const kiss of KISSES) {
    const w = 1 - clamp01(Math.abs(loopPhase - kiss.at) / kiss.half);
    if (w <= 0) continue;
    const ramp = smoother(w);
    const a = mid[kiss.i] as Blob;
    const b = mid[kiss.j] as Blob;
    const dx = b.cx - a.cx;
    const dy = b.cy - a.cy;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;
    const midX = (a.cx + b.cx) / 2;
    const midY = (a.cy + b.cy) / 2;
    const pull = ramp * 0.92;
    a.cx += (midX - ux * (a.r + 0.15 * k) - a.cx) * pull;
    a.cy += (midY - uy * (a.r + 0.15 * k) - a.cy) * pull;
    b.cx += (midX + ux * (b.r + 0.15 * k) - b.cx) * pull;
    b.cy += (midY + uy * (b.r + 0.15 * k) - b.cy) * pull;
    const stretch = 1 + 0.1 * ramp;
    a.hw *= stretch;
    b.hw *= stretch;
    necks.push(...bridgeNecks([a, b], k, ramp));
  }

  return { back, front: [...mid, ...glints], necks };
}

/** Finds the surface under pressure, rather than making the whole veil follow
 * the pointer through its first (and largest) blob. */
export function nearestBlob(
  blobs: Blob[],
  point: { x: number; y: number },
): Blob | undefined {
  let nearest: Blob | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;
  for (const blob of blobs) {
    const distance =
      Math.hypot(blob.cx - point.x, blob.cy - point.y) -
      Math.max(blob.hw, blob.hh);
    if (distance < nearestDistance) {
      nearest = blob;
      nearestDistance = distance;
    }
  }
  return nearest;
}
