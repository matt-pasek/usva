import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  clearspace,
  crescentWidth,
  lensWidth,
  RAILO_CUTS,
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

  it("keeps the shipped icon.svg on the micro cut", () => {
    const svg = readFileSync(join(__dirname, "..", "app", "icon.svg"), "utf8");
    const paths = railoPaths(RAILO_CUTS.micro);
    expect(svg).toContain(paths.left);
    expect(svg).toContain(paths.right);
  });
});

function areaOf(d: string): number {
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
