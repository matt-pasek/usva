import type {
  SulaBlob,
  SulaFieldBounds,
  SulaFieldDrive,
  SulaNeck,
} from "@usva-ui/react/sula/sula-field";

/**
 * The lava lamp's cycle, as a pure function of time.
 *
 * Wax rests in a pool on the floor. Heat swells a dome out of it, the dome
 * stretches into a column, the column necks, the neck pinches, and a body tears
 * free while the pool surface snaps back. The body rises, meets its neighbours
 * and fuses with them, flattens against the ceiling, hangs, cools, sinks, and
 * rejoins the pool. Four bodies run it on their own periods and their own
 * phases, so the glass is never a metronome.
 */

const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));
const smoother = (t: number): number => {
  const x = clamp01(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const smoothstep = (a: number, b: number, x: number): number => {
  if (a === b) return x < a ? 0 : 1;
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Cycle fractions. Rising owns a third of the cycle; the tear is the beat. */
const SWELL_END = 0.16;
const TEAR_END = 0.3;
const RISE_END = 0.6;
const SPREAD_END = 0.7;
const HANG_END = 0.76;
const SINK_END = 0.98;
const LOBE_RELEASE_END = 0.84;

/** Depth of the molten pool, as a fraction of the glass. It is never empty. */
const POOL_DEPTH = 0.15;
interface Cell {
  /** Lane centre, as a fraction of the width. */
  lane: number;
  /** Body radius, as a fraction of the short side. */
  size: number;
  /** Seconds for one full pool-to-ceiling-to-pool cycle. */
  period: number;
  /** Where in that cycle the body starts, so no two are ever in step. */
  phase: number;
  /** Lateral sway amplitude, as a fraction of the width. */
  sway: number;
}

/** Bigger bodies carry more heat and rise faster, so their period is shorter. */
const CELLS: readonly Cell[] = [
  { lane: 0.38, size: 0.15, period: 27, phase: 0, sway: 0.04 },
  { lane: 0.63, size: 0.12, period: 34, phase: 0.31, sway: 0.05 },
  { lane: 0.5, size: 0.17, period: 23, phase: 0.58, sway: 0.03 },
  { lane: 0.7, size: 0.1, period: 41, phase: 0.79, sway: 0.06 },
];

interface Body extends SulaBlob {
  hw: number;
  hh: number;
  /** The body's own radius, before any stretch or spread. */
  base: number;
  /** 0 while still part of the pool, 1 once fully separated. */
  free: number;
}

const cycle = (time: number, cell: Cell): number => {
  const u = (time / cell.period + cell.phase) % 1;
  return u < 0 ? u + 1 : u;
};

/** The pool's own surface, before the cells push it about. */
const poolSurface = (height: number): number => height * (1 - POOL_DEPTH);

/**
 * How far this cell's swell lifts the pool under it, and the rebound that snaps
 * the surface back once the neck lets go. The rebound is a damped cosine, so the
 * pool overshoots down and settles rather than stepping back to flat.
 */
function poolResponse(u: number): number {
  const swell = Math.sin(Math.PI * clamp01(u / SWELL_END)) * 0.35;
  if (u < TEAR_END) {
    const pull = smoothstep(SWELL_END, TEAR_END, u);
    return swell + pull * 0.45;
  }
  const since = clamp01((u - TEAR_END) / 0.14);
  if (since >= 1) return 0;
  const settle = 0.45 * (1 - smoother(since));
  const rebound = -0.22 * Math.sin(Math.PI * since) ** 2 * (1 - since * 0.45);
  return settle + rebound;
}

const shape = (b: Body): Body => ({
  ...b,
  r: Math.min(b.r, b.hw, b.hh),
});

function risingBody(
  u: number,
  s: number,
  cell: Cell,
  bounds: SulaFieldBounds,
  base: number,
): Body {
  const { width, height } = bounds;
  const surface = poolSurface(height);
  const x = width * cell.lane;
  const wobble = Math.sin(u * Math.PI * 6 + cell.phase * 9);
  const arrivalWobble = Math.sin(RISE_END * Math.PI * 6 + cell.phase * 9);
  const arrivalHh = base * (1 - 0.04 * arrivalWobble);

  return {
    cx: x + width * cell.sway * wobble * s,
    cy: mix(surface - base * 1.75, arrivalHh, s),
    r: base,
    hw: base * (1 + 0.05 * wobble * s),
    hh: base * (1 - 0.04 * wobble * s),
    base,
    free: 1,
  };
}

function landingCharacter(cell: Cell): { impact: number; variation: number } {
  const size = clamp01((cell.size - 0.1) / 0.07);
  const pace = clamp01((41 - cell.period) / 18);
  const impact = (size + pace) * 0.5;
  const variation = clamp01(
    0.5 + 0.5 * Math.sin(cell.phase * 11 + cell.lane * 7),
  );
  return { impact, variation };
}

function landingBody(cell: Cell, bounds: SulaFieldBounds, base: number): Body {
  const arrival = risingBody(RISE_END, 1, cell, bounds, base);
  const { impact } = landingCharacter(cell);
  const radius = base * mix(0.82, 0.7, impact);

  return {
    cx: arrival.cx + bounds.width * cell.sway * 0.12 * (0.5 - impact),
    cy: radius,
    r: radius,
    hw: radius,
    hh: radius,
    base,
    free: 1,
  };
}

function landingLobe(u: number, cell: Cell, body: Body): SulaNeck | null {
  if (u <= RISE_END || u >= LOBE_RELEASE_END) return null;

  const strength =
    u < SPREAD_END
      ? smoother((u - RISE_END) / (SPREAD_END - RISE_END))
      : u < HANG_END
        ? 1
        : 1 - smoother((u - HANG_END) / (LOBE_RELEASE_END - HANG_END));
  if (strength <= 0) return null;

  const { impact, variation } = landingCharacter(cell);
  const radius = body.base * mix(0.5, 0.68, (impact + variation) * 0.5);
  const direction = Math.sin(cell.phase * 13 + cell.lane * 5) >= 0 ? 1 : -1;
  const targetX = body.cx + direction * body.base * mix(0.35, 0.62, variation);
  const cx = mix(body.cx, targetX, strength);
  const cy = mix(body.cy, radius, strength);

  return {
    ax: cx,
    ay: cy,
    bx: cx,
    by: cy,
    r: radius,
    strength,
  };
}

function bodyAt(u: number, cell: Cell, bounds: SulaFieldBounds): Body {
  const { width, height } = bounds;
  const short = Math.min(width, height);
  const base = short * cell.size;
  const surface = poolSurface(height);
  const x = width * cell.lane;

  if (u < SWELL_END) {
    const s = smoother(u / SWELL_END);
    return {
      cx: x,
      cy: surface + base * 0.5 - s * base * 0.75,
      r: mix(base * 0.5, base, s),
      hw: mix(base * 0.75, base, s),
      hh: mix(base * 0.35, base, s),
      base,
      free: 0,
    };
  }

  if (u < TEAR_END) {
    const s = smoother((u - SWELL_END) / (TEAR_END - SWELL_END));
    const stretch = Math.sin(Math.PI * s);
    return {
      cx: x,
      cy: surface - base * 0.25 - s * base * 1.5,
      r: base * (1 - 0.12 * stretch),
      hw: base * (1 - 0.2 * stretch),
      hh: base * (1 + 0.32 * stretch),
      base,
      free: s,
    };
  }

  if (u < RISE_END) {
    const s = smoother((u - TEAR_END) / (RISE_END - TEAR_END));
    return risingBody(u, s, cell, bounds, base);
  }

  const arrival = risingBody(RISE_END, 1, cell, bounds, base);
  const landing = landingBody(cell, bounds, base);
  if (u < HANG_END) {
    const s = smoother(clamp01((u - RISE_END) / (SPREAD_END - RISE_END)));
    return {
      cx: mix(arrival.cx, landing.cx, s),
      cy: mix(arrival.cy, landing.cy, s),
      r: mix(arrival.r, landing.r, s),
      hw: mix(arrival.hw, landing.hw, s),
      hh: mix(arrival.hh, landing.hh, s),
      base,
      free: 1,
    };
  }

  if (u < SINK_END) {
    const s = smoothstep(HANG_END, SINK_END, u);
    return {
      cx: mix(landing.cx, x, s),
      cy: mix(landing.cy, surface + base * 0.15, s),
      r: mix(landing.r, base * 0.9, s),
      hw: mix(landing.hw, base * 0.95, s),
      hh: mix(landing.hh, base * 0.9, s),
      base,
      free: 1 - smoothstep(0.82, 1, s),
    };
  }

  const s = smoother((u - SINK_END) / (1 - SINK_END));
  return {
    cx: x,
    cy: surface + base * (0.15 + 0.35 * s),
    r: mix(base * 0.9, base * 0.5, s),
    hw: mix(base * 0.95, base * 0.75, s),
    hh: mix(base * 0.9, base * 0.35, s),
    base,
    free: 0,
  };
}

/** The tether that holds a body to the pool: fat under a swell, pinched to
 * nothing at the tear, and re-formed as it sinks home. Thinning a neck cannot
 * melt it, so the pinch fades `strength` to zero rather than the radius alone. */
function poolNeck(u: number, body: Body, height: number): SulaNeck | null {
  const surface = poolSurface(height);
  const tethered = u < TEAR_END || u >= HANG_END;
  if (!tethered) return null;
  const grip =
    u < TEAR_END
      ? 1 - smoothstep(SWELL_END + 0.02, TEAR_END, u)
      : smoothstep(SINK_END - 0.06, SINK_END + 0.02, u);
  if (grip <= 0.01) return null;
  const r = body.base * mix(0.16, 0.62, grip);
  const foot = surface + body.base * 0.25;
  const head = body.cy + body.hh * 0.5;
  if (head >= foot) return null;
  return {
    ax: body.cx,
    ay: foot,
    bx: body.cx,
    by: head,
    r,
    strength: smoothstep(0, 0.35, grip),
  };
}

/** The molten pool: two overlapping slabs the merge radius fuses into one body
 * with a meniscus, breathing with whatever the cells are doing to it. */
function pool(time: number, bounds: SulaFieldBounds, lift: number): SulaBlob[] {
  const { width, height } = bounds;
  const depth = height * POOL_DEPTH;
  const surface = poolSurface(height);
  const breathe = Math.sin(time * 0.21) * depth * 0.03;
  return [0.3, 0.72].map((lane, i) => {
    const swell = depth * 0.22 * lift + breathe * (i === 0 ? 1 : -1);
    const hh = depth * 0.62 + swell;
    return {
      cx: width * lane,
      cy: surface + depth * 0.55 - swell * 0.5,
      hw: width * 0.42,
      hh,
      r: Math.min(depth * 0.5, width * 0.42),
    };
  });
}

/**
 * Merge radius. Fat, because this is wax: bodies should join in a thick waist,
 * not touch at a point.
 */
const MERGE = 0.15;

export const convection: SulaFieldDrive = (time, bounds) => {
  const short = Math.min(bounds.width, bounds.height);
  const phases = CELLS.map((cell) => cycle(time, cell));
  const bodies = phases.map((u, i) =>
    shape(bodyAt(u, CELLS[i] as Cell, bounds)),
  );
  const lift = phases.reduce((sum, u) => sum + poolResponse(u), 0);

  const necks: SulaNeck[] = [];
  for (const [i, body] of bodies.entries()) {
    const neck = poolNeck(phases[i] as number, body, bounds.height);
    if (neck) necks.push(neck);
  }
  for (const [i, body] of bodies.entries()) {
    const lobe = landingLobe(phases[i] as number, CELLS[i] as Cell, body);
    if (lobe) necks.push(lobe);
  }

  return {
    front: [
      ...pool(time, bounds, lift),
      ...bodies.map(({ base: _base, free: _free, ...blob }) => blob),
    ],
    necks,
    mergeRadius: short * MERGE,
  };
};
