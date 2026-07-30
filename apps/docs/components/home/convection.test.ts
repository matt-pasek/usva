import type {
  SulaBlob,
  SulaFieldBounds,
  SulaNeck,
} from "@usva-ui/react/sula/sula-field";
import { describe, expect, test } from "vitest";
import { convection } from "./convection";

const BOUNDS: SulaFieldBounds = { width: 240, height: 448, seed: 12 };
const EPSILON_SECONDS = 0.00001;
const CONTINUITY_TOLERANCE = 0.05;

const CELLS = [
  { period: 27, phase: 0 },
  { period: 34, phase: 0.31 },
  { period: 23, phase: 0.58 },
  { period: 41, phase: 0.79 },
] as const;

const PHASE_BOUNDARIES = [0.16, 0.3, 0.6, 0.76, 0.98, 1] as const;

function timeAt(cell: (typeof CELLS)[number], phase: number): number {
  return cell.period * (phase - cell.phase + 2);
}

function bodyAt(time: number, cellIndex: number) {
  const body = convection(time, BOUNDS).front?.[2 + cellIndex];
  expectBlob(body);
  return body;
}

function landingLobeAt(time: number, cellIndex: number) {
  const body = bodyAt(time, cellIndex);
  const lobes = (convection(time, BOUNDS).necks ?? []).filter(
    (neck) => Math.hypot(neck.bx - neck.ax, neck.by - neck.ay) < 0.001,
  );
  return lobes.sort(
    (a, b) =>
      Math.hypot(a.ax - body.cx, a.ay - body.cy) -
      Math.hypot(b.ax - body.cx, b.ay - body.cy),
  )[0];
}

function lobeStrength(lobe: SulaNeck | undefined): number {
  return lobe?.strength ?? 0;
}

type FullBlob = SulaBlob & { hh: number; hw: number };

function expectBlob(blob: SulaBlob | undefined): asserts blob is FullBlob {
  expect(blob).toBeDefined();
  expect(blob?.hw).toBeTypeOf("number");
  expect(blob?.hh).toBeTypeOf("number");
  if (!blob || blob.hw === undefined || blob.hh === undefined) {
    throw new Error("Kuohu bodies must provide both half-extents");
  }
}

function expectContinuous(before: FullBlob, after: FullBlob) {
  for (const key of ["cx", "cy", "r", "hw", "hh"] as const) {
    expect(Math.abs(before[key] - after[key]), key).toBeLessThan(
      CONTINUITY_TOLERANCE,
    );
  }
}

describe("Kuohu convection", () => {
  test("keeps every body continuous across phase handoffs and cycle wrap", () => {
    for (const [cellIndex, cell] of CELLS.entries()) {
      for (const phase of PHASE_BOUNDARIES) {
        const at = timeAt(cell, phase);
        expectContinuous(
          bodyAt(at - EPSILON_SECONDS, cellIndex),
          bodyAt(at + EPSILON_SECONDS, cellIndex),
        );
      }
    }
  });

  test("keeps the pool continuous when a body tears free", () => {
    for (const cell of CELLS) {
      const tear = timeAt(cell, 0.3);
      const before = convection(tear - EPSILON_SECONDS, BOUNDS).front?.slice(
        0,
        2,
      );
      const after = convection(tear + EPSILON_SECONDS, BOUNDS).front?.slice(
        0,
        2,
      );
      expect(before).toBeDefined();
      expect(after).toBeDefined();
      if (!before || !after) continue;

      for (const [index, poolBefore] of before.entries()) {
        const poolAfter = after[index];
        expectBlob(poolBefore);
        expectBlob(poolAfter);
        expect(Math.abs(poolBefore.cy - poolAfter.cy)).toBeLessThan(
          CONTINUITY_TOLERANCE,
        );
        expect(Math.abs(poolBefore.hh - poolAfter.hh)).toBeLessThan(
          CONTINUITY_TOLERANCE,
        );
      }
    }
  });

  test("lands bodies on the top glass edge", () => {
    for (const [cellIndex, cell] of CELLS.entries()) {
      const body = bodyAt(timeAt(cell, 0.7), cellIndex);
      expect(body.cy - body.hh).toBeCloseTo(0, 4);
    }
  });

  test("forms varied top silhouettes from fused round lobes", () => {
    const landingShapes = CELLS.map((cell, cellIndex) => {
      const at = timeAt(cell, 0.7);
      const body = bodyAt(timeAt(cell, 0.7), cellIndex);
      const lobe = landingLobeAt(at, cellIndex);

      expect(lobe).toBeDefined();
      if (!lobe) throw new Error("Landing must provide a round fused lobe");
      expect(body.hw).toBeCloseTo(body.r, 4);
      expect(body.hh).toBeCloseTo(body.r, 4);
      expect(lobe.r).toBeGreaterThan(0);

      return {
        size: (lobe.r / body.r).toFixed(2),
        offset: ((lobe.ax - body.cx) / body.r).toFixed(2),
      };
    });

    expect(
      new Set(landingShapes.map(({ size }) => size)).size,
    ).toBeGreaterThanOrEqual(3);
    expect(
      new Set(landingShapes.map(({ offset }) => offset)).size,
    ).toBeGreaterThanOrEqual(3);
  });

  test("fades landing lobes in and out without phase jumps", () => {
    for (const [cellIndex, cell] of CELLS.entries()) {
      const appearing = landingLobeAt(timeAt(cell, 0.601), cellIndex);
      const disappearing = landingLobeAt(timeAt(cell, 0.839), cellIndex);

      expect(lobeStrength(appearing)).toBeLessThan(0.001);
      expect(lobeStrength(disappearing)).toBeLessThan(0.001);
    }
  });

  test("keeps the fastest body above the pool four seconds into its fall", () => {
    const fastestCellIndex = 2;
    const fastestCell = CELLS[fastestCellIndex];
    const fallStart = timeAt(fastestCell, 0.76);
    const body = bodyAt(fallStart + 4, fastestCellIndex);

    expect(body.cy).toBeLessThan(BOUNDS.height * 0.8);
  });

  test("uses the persistent metaball union for body-to-body merges", () => {
    for (let time = 0; time <= 120; time += 1 / 60) {
      const bodyBridges = (convection(time, BOUNDS).necks ?? []).filter(
        (neck) => Math.abs(neck.bx - neck.ax) > 0.001,
      );

      expect(
        bodyBridges,
        `transient body bridge at t=${time.toFixed(3)}`,
      ).toEqual([]);
    }
  });
});
