/**
 * One closed torus knot, sampled into a chain of capsules. Every term is
 * periodic in an integer multiple of the curve parameter, so the last knot
 * lands exactly on the first and the filament has no ends: one continuous
 * ribbon that passes behind and in front of itself.
 */

const TAU = Math.PI * 2;

export interface FilamentParams {
  /** Capsules in the chain. Knots emitted is segments + 1. */
  segments: number;
  /** Major and minor radius of the torus the knot winds around. */
  radius: [number, number];
  /** Windings [about the axis, through the hole]. Keep them coprime, or the
   * knot degenerates into one circle traced several times. */
  winding: [number, number];
  /** Anisotropic scale of the finished figure. */
  scale: [number, number, number];
  /** Slow wander of the curve away from the pure knot. */
  drift: number;
  /** Rate of the wander, and of the roll of the strand around its tube. */
  driftRate: number;
  /** Revolutions per second about the vertical. */
  spin: number;
  /** Fixed tilt of the whole figure, radians. */
  tilt: number;
  /** Radius of the emitting core, world units. */
  thickness: number;
  /** Falloff of exp(-glow * d^2). Larger is thinner and colder. */
  glow: number;
}

export const FILAMENT_DEFAULTS: FilamentParams = {
  segments: 96,
  radius: [2.1, 1.05],
  winding: [2, 3],
  scale: [1.85, 1.12, 1],
  drift: 0.4,
  driftRate: 0.06,
  spin: 0.01,
  tilt: 0.6,
  thickness: 0.16,
  glow: 26,
};

export function resolveFilamentParams(
  overrides: Partial<FilamentParams> = {},
): FilamentParams {
  return { ...FILAMENT_DEFAULTS, ...overrides };
}

/** Flat xyz triples, segments + 1 knots, closed. The drift phase rolls the
 * strand around its tube, so the coil keeps threading through itself without
 * the figure ever changing character. */
export function filamentKnots(time: number, p: FilamentParams): number[] {
  const [major, minor] = p.radius;
  const [pw, qw] = p.winding;
  const [sx, sy, sz] = p.scale;
  const spin = time * p.spin * TAU;
  const cs = Math.cos(spin);
  const ss = Math.sin(spin);
  const ct = Math.cos(p.tilt);
  const st = Math.sin(p.tilt);
  const dt = time * p.driftRate;

  const knots: number[] = [];
  for (let i = 0; i <= p.segments; i++) {
    const u = (i % p.segments) * (TAU / p.segments);
    const tube = minor + p.drift * Math.sin(2 * u + dt * 1.3);
    const roll = qw * u + dt * 0.7;
    const w = major + tube * Math.cos(roll);

    const x = w * Math.cos(pw * u) * sx;
    const y = (w * Math.sin(pw * u) + p.drift * Math.sin(u + dt)) * sy;
    const z = tube * Math.sin(roll) * sz;

    const yt = y * ct - z * st;
    const zt = y * st + z * ct;
    knots.push(x * cs + zt * ss, yt, zt * cs - x * ss);
  }
  return knots;
}
