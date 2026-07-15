import { describe, expect, test } from "vitest";
import {
  crestApex,
  crestLine,
  crestPath,
  KUOHU_ARGUMENT,
  KUOHU_NAMING,
  KUOHU_SCENE,
  PROPORTION_DIM,
  PROPORTION_SCENE,
  type Span,
} from "./home-motion";

const spans = (record: Record<string, unknown>): Span[] =>
  Object.values(record).filter(
    (value): value is Span => Array.isArray(value) && value.length === 2,
  );

describe("kuohu scene", () => {
  test("every beat stays inside the section and runs forward", () => {
    for (const [from, to] of spans(KUOHU_SCENE)) {
      expect(from).toBeGreaterThanOrEqual(0);
      expect(to).toBeLessThanOrEqual(1);
      expect(to).toBeGreaterThan(from);
    }
  });

  test("the lamp is alone before anything is said about it", () => {
    const [, watchEnd] = KUOHU_SCENE.watch;
    for (const key of [...KUOHU_NAMING, ...KUOHU_ARGUMENT]) {
      expect(KUOHU_SCENE[key][0]).toBeGreaterThanOrEqual(watchEnd);
    }
  });

  test("the lamp is named before it is argued for", () => {
    for (const naming of KUOHU_NAMING) {
      for (const line of KUOHU_ARGUMENT) {
        expect(KUOHU_SCENE[line][0]).toBeGreaterThan(KUOHU_SCENE[naming][0]);
      }
    }
  });

  test("the naming has cleared before the lamp reaches its column", () => {
    expect(KUOHU_SCENE.recede[1]).toBeLessThanOrEqual(KUOHU_SCENE.glide[1]);
    expect(KUOHU_SCENE.recede[0]).toBeGreaterThanOrEqual(KUOHU_SCENE.gloss[0]);
  });

  test("the copy is dealt out in reading order", () => {
    for (let i = 1; i < KUOHU_ARGUMENT.length; i++) {
      const prev = KUOHU_ARGUMENT[i - 1] as (typeof KUOHU_ARGUMENT)[number];
      const next = KUOHU_ARGUMENT[i] as (typeof KUOHU_ARGUMENT)[number];
      expect(KUOHU_SCENE[next][0]).toBeGreaterThan(KUOHU_SCENE[prev][0]);
    }
  });

  test("the scene finishes with held time after the last line", () => {
    expect(KUOHU_SCENE.link[1]).toBeLessThanOrEqual(0.9);
  });
});

describe("proportion scene", () => {
  test("the grid is fully laid before the emphasis starts", () => {
    expect(PROPORTION_SCENE.dim[0]).toBeGreaterThan(PROPORTION_SCENE.lay[1]);
  });

  test("the verdict lands inside the emphasis, not after it", () => {
    expect(PROPORTION_SCENE.verdict[0]).toBeGreaterThanOrEqual(
      PROPORTION_SCENE.dim[0],
    );
    expect(PROPORTION_SCENE.verdict[1]).toBeLessThanOrEqual(
      PROPORTION_SCENE.dim[1],
    );
  });

  test("dimmed squares stay readable", () => {
    expect(PROPORTION_DIM).toBeGreaterThanOrEqual(0.2);
    expect(PROPORTION_DIM).toBeLessThan(0.6);
  });
});

describe("crest", () => {
  test("the path is a closed shape spanning the full width", () => {
    const path = crestPath(1440, 96);
    expect(path.startsWith("M0 96")).toBe(true);
    expect(path.endsWith("Z")).toBe(true);
    expect(path).toContain("L1440 96");
  });

  test("the arc is shallow: a horizon, not a circle", () => {
    const height = 96;
    const apex = crestApex(height);
    const edge = height * 0.82;
    expect(apex).toBeGreaterThan(0);
    expect(apex).toBeLessThan(height * 0.25);
    expect(edge - apex).toBeGreaterThan(height * 0.5);
  });

  test("the rim line traces the same arc as the fill's leading edge", () => {
    const fill = crestPath(1440, 96);
    const line = crestLine(1440, 96);
    expect(fill).toContain(line.replace("M0 ", "L0 "));
  });
});
