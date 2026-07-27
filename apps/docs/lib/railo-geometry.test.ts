import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  clearspace,
  crescentWidth,
  lensWidth,
  RAILO_BOX,
  RAILO_CUTS,
  railoInkBox,
  railoLens,
  railoLensBox,
  railoPaths,
} from "./railo-geometry";

const lensArea = (r: number, d: number) =>
  2 * r * r * Math.acos(d / (2 * r)) - (d / 2) * Math.sqrt(4 * r * r - d * d);

describe("railo geometry", () => {
  it("keeps the fields overlapping in every cut", () => {
    for (const cut of Object.values(RAILO_CUTS)) {
      expect(crescentWidth(cut)).toBeLessThan(2 * cut.radius);
      expect(lensWidth(cut)).toBeGreaterThan(0);
    }
  });

  it("balances crescent against lens in the micro cut", () => {
    const micro = RAILO_CUTS.micro;
    expect(crescentWidth(micro)).toBe(lensWidth(micro));
  });

  it("leaves the display cut gap-dominant", () => {
    const display = RAILO_CUTS.display;
    expect(lensWidth(display)).toBeGreaterThan(crescentWidth(display));
  });

  it("clearspace is one lens width", () => {
    for (const cut of Object.values(RAILO_CUTS)) {
      expect(clearspace(cut)).toBe(lensWidth(cut));
    }
  });

  it("emits arcs that enclose the true crescent area", () => {
    for (const cut of Object.values(RAILO_CUTS)) {
      const expected =
        Math.PI * cut.radius ** 2 - lensArea(cut.radius, crescentWidth(cut));
      for (const d of Object.values(railoPaths(cut))) {
        expect(areaOf(d)).toBeCloseTo(expected, 1);
      }
    }
  });

  it("draws the lens with the true lens area", () => {
    for (const cut of Object.values(RAILO_CUTS)) {
      const expected = lensArea(cut.radius, crescentWidth(cut));
      expect(areaOf(railoLens(cut))).toBeCloseTo(expected, 1);
    }
  });

  it("meets the crescents at both crossings", () => {
    for (const cut of Object.values(RAILO_CUTS)) {
      const lens = railoLens(cut);
      const { left, right } = railoPaths(cut);
      const start = lens.slice(0, lens.indexOf("A"));

      expect(left.startsWith(start)).toBe(true);
      expect(right.startsWith(start)).toBe(true);

      const crossing = /A[\d.]+ [\d.]+ 0 \d \d ([\d.]+) ([\d.]+)/.exec(lens);
      expect(left).toContain(`${crossing?.[1]} ${crossing?.[2]}`);
    }
  });

  it("boxes the lens exactly, one lens width wide", () => {
    for (const cut of Object.values(RAILO_CUTS)) {
      const box = railoLensBox(cut);
      expect(box.width).toBe(lensWidth(cut));

      const points = pointsOf(railoLens(cut));
      const xs = points.map(([x]) => x);
      const ys = points.map(([, y]) => y);

      expect(Math.min(...xs)).toBeCloseTo(box.x, 3);
      expect(Math.max(...xs)).toBeCloseTo(box.x + box.width, 3);
      expect(Math.min(...ys)).toBeCloseTo(box.y, 3);
      expect(Math.max(...ys)).toBeCloseTo(box.y + box.height, 3);
    }
  });

  it("boxes the ink to the painted fields", () => {
    for (const cut of Object.values(RAILO_CUTS)) {
      const box = railoInkBox(cut);
      const painted = Object.values(railoPaths(cut)).flatMap(pointsOf);

      expect(Math.min(...painted.map(([x]) => x))).toBeCloseTo(box.x, 3);
      expect(Math.max(...painted.map(([x]) => x))).toBeCloseTo(
        box.x + box.width,
        3,
      );
      expect(Math.min(...painted.map(([, y]) => y))).toBeCloseTo(box.y, 3);
      expect(Math.max(...painted.map(([, y]) => y))).toBeCloseTo(
        box.y + box.height,
        3,
      );
    }
  });

  it("bleeds the micro cut past the viewBox on both sides", () => {
    const box = railoInkBox(RAILO_CUTS.micro);
    expect(box.x).toBe(-1);
    expect(box.x + box.width).toBe(RAILO_BOX + 1);
  });

  it("keeps the shipped icon.svg on the micro cut", () => {
    const svg = readFileSync(join(__dirname, "..", "app", "icon.svg"), "utf8");
    const paths = railoPaths(RAILO_CUTS.micro);
    expect(svg).toContain(paths.left);
    expect(svg).toContain(paths.right);
  });
});

function pointsOf(d: string): [number, number][] {
  const n = d.match(/-?[\d.]+/g)?.map(Number) ?? [];
  const at = (i: number): number => n[i] ?? Number.NaN;
  let [cx, cy] = [at(0), at(1)];
  const points: [number, number][] = [];

  for (const base of [2, 9]) {
    const [x, y] = [at(base + 5), at(base + 6)];
    points.push(
      ...sampleArc(cx, cy, x, y, at(base), at(base + 3), at(base + 4)),
    );
    [cx, cy] = [x, y];
  }
  return points;
}

function areaOf(d: string): number {
  const points = pointsOf(d);

  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i] as [number, number];
    const [x2, y2] = points[(i + 1) % points.length] as [number, number];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

function sampleArc(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  r: number,
  large: number,
  sweep: number,
  steps = 2000,
): [number, number][] {
  const mx = (x1 - x2) / 2;
  const my = (y1 - y2) / 2;
  const scale =
    Math.sqrt(Math.max(0, (r * r - mx * mx - my * my) / (mx * mx + my * my))) *
    (large === sweep ? -1 : 1);
  const cx = scale * my + (x1 + x2) / 2;
  const cy = -scale * mx + (y1 + y2) / 2;

  const from = Math.atan2(y1 - cy, x1 - cx);
  let span = Math.atan2(y2 - cy, x2 - cx) - from;
  if (sweep && span < 0) span += 2 * Math.PI;
  if (!sweep && span > 0) span -= 2 * Math.PI;

  return Array.from({ length: steps + 1 }, (_, i) => {
    const angle = from + (span * i) / steps;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as [
      number,
      number,
    ];
  });
}
