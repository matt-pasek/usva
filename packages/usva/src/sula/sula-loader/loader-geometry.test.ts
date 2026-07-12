import { describe, expect, it } from "vitest";
import { type Blob, MAX_NECKS } from "../sula-core/geometry.js";
import {
  clusterFrame,
  loaderFrame,
  orbitFrame,
  STATIC_PHASES,
  twinFrame,
} from "./loader-geometry.js";

const opts = { size: 48, k: 48 * 0.21 };
const meanRadius = (blobs: Array<{ cx: number; cy: number }>): number => {
  const c = opts.size / 2;
  return (
    blobs.reduce((sum, b) => sum + Math.hypot(b.cx - c, b.cy - c), 0) /
    blobs.length
  );
};

describe("orbitFrame (sling)", () => {
  it("recoils the core away from the extruded bead", () => {
    const { blobs } = orbitFrame(0.18, opts);
    const core = blobs[0] as Blob;
    const bead = blobs[1] as Blob;
    expect(core.cx).toBeLessThan(opts.size / 2);
    expect(bead.cx).toBeGreaterThan(opts.size / 2);
  });

  it("is born and dies inside the loop, leaving the core alone at rest", () => {
    expect((orbitFrame(0.02, opts).blobs[1] as Blob).r).toBeLessThan(0.5);
    expect((orbitFrame(0.5, opts).blobs[1] as Blob).r).toBeGreaterThan(1);
    expect((orbitFrame(0.99, opts).blobs[1] as Blob).r).toBeLessThan(0.5);
  });

  it("snaps once: tethered on extrusion, free in flight, recaptured on return", () => {
    expect(orbitFrame(0.2, opts).necks).toHaveLength(1);
    expect(orbitFrame(0.5, opts).necks).toHaveLength(0);
    expect(orbitFrame(0.8, opts).necks).toHaveLength(1);
  });

  it("drops the tether while the bead is buried, so nothing pops at merge", () => {
    expect(orbitFrame(0.13, opts).necks).toHaveLength(0);
    expect(orbitFrame(0.9, opts).necks).toHaveLength(0);
  });

  it("inflates the core past rest as it swallows the bead", () => {
    const rest = (orbitFrame(0.05, opts).blobs[0] as Blob).r;
    const swallowing = (orbitFrame(0.94, opts).blobs[0] as Blob).r;
    expect(swallowing).toBeGreaterThan(rest);
  });

  it("loops with unit period", () => {
    const a = orbitFrame(0.3, opts).blobs[1] as { cx: number; cy: number };
    const b = orbitFrame(1.3, opts).blobs[1] as { cx: number; cy: number };
    expect(a.cx).toBeCloseTo(b.cx, 6);
    expect(a.cy).toBeCloseTo(b.cy, 6);
  });
});

describe("clusterFrame (bloom)", () => {
  it("keeps three unequal lobes within the neck budget", () => {
    const { blobs, necks } = clusterFrame(0.4, opts);
    expect(blobs).toHaveLength(3);
    expect(new Set(blobs.map((blob) => blob.r.toFixed(3))).size).toBe(3);
    expect(necks.length).toBeLessThanOrEqual(MAX_NECKS);
  });

  it("breathes apart from one mass and collapses back", () => {
    const unified = meanRadius(clusterFrame(0.02, opts).blobs);
    const open = meanRadius(clusterFrame(0.45, opts).blobs);
    const fused = meanRadius(clusterFrame(0.98, opts).blobs);
    expect(unified).toBeLessThan(opts.size * 0.03);
    expect(open).toBeGreaterThan(opts.size * 0.1);
    expect(fused).toBeLessThan(opts.size * 0.03);
  });

  it("opens the lobes far enough to read as a clover", () => {
    const c = opts.size / 2;
    const spread = Math.max(
      ...clusterFrame(0.5, opts).blobs.map((b) =>
        Math.hypot(b.cx - c, b.cy - c),
      ),
    );
    expect(spread).toBeGreaterThan(opts.size * 0.18);
  });

  it("keeps the necks within budget without popping a tether", () => {
    for (const p of [0.2, 0.36, 0.5, 0.66, 0.8]) {
      expect(clusterFrame(p, opts).necks.length).toBeLessThanOrEqual(MAX_NECKS);
    }
  });
});

describe("twinFrame (binary)", () => {
  it("keeps a visibly unequal pair", () => {
    const { blobs } = twinFrame(0, opts);
    expect((blobs[0] as Blob).r).toBeGreaterThan((blobs[1] as Blob).r * 1.3);
  });

  it("exchanges levels through the mutual orbit", () => {
    const before = twinFrame(0, opts).blobs;
    const after = twinFrame(0.5, opts).blobs;
    expect((before[0] as Blob).cy).toBeGreaterThan((before[1] as Blob).cy);
    expect((after[0] as Blob).cy).toBeLessThan((after[1] as Blob).cy);
  });

  it("holds the thread until apogee, then snaps for one breath", () => {
    expect(twinFrame(0.1, opts).necks).toHaveLength(1);
    expect(twinFrame(0.4, opts).necks).toHaveLength(1);
    expect(twinFrame(0.6, opts).necks).toHaveLength(0);
  });

  it("orbits faster at perigee than at apogee (Kepler)", () => {
    const c = opts.size / 2;
    const angleAt = (p: number) => {
      const b = twinFrame(p, opts).blobs[0] as Blob;
      return Math.atan2(b.cy - c, b.cx - c);
    };
    const step = (p: number) => {
      let d = angleAt(p + 0.02) - angleAt(p);
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      return Math.abs(d);
    };
    expect(step(0.15)).toBeGreaterThan(step(0.65));
  });
});

describe("loaderFrame", () => {
  it("dispatches to each motion", () => {
    expect(loaderFrame("orbit", 0, 48).blobs).toHaveLength(2);
    expect(loaderFrame("cluster", 0, 48).blobs).toHaveLength(3);
    expect(loaderFrame("twin", 0, 48).blobs).toHaveLength(2);
  });

  it("freezes every fallback on a legible beat", () => {
    expect(
      orbitFrame(STATIC_PHASES.orbit, opts).necks.length,
    ).toBeLessThanOrEqual(1);
    expect(
      (orbitFrame(STATIC_PHASES.orbit, opts).blobs[1] as Blob).r,
    ).toBeGreaterThan(1);
    expect(
      meanRadius(clusterFrame(STATIC_PHASES.cluster, opts).blobs),
    ).toBeGreaterThan(opts.size * 0.08);
    expect(twinFrame(STATIC_PHASES.twin, opts).necks).toHaveLength(1);
  });
});
