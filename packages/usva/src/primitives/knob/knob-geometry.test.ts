import { describe, expect, it } from "vitest";
import {
  arcLength,
  arcPath,
  dashForTurn,
  isScrubZone,
  KNOB_SCRUB_TRAVEL,
  KNOB_START_ANGLE,
  KNOB_SWEEP,
  pointerToTurn,
  scrubValue,
  snapToStep,
  stepValue,
  turnToAngle,
  turnToValue,
  valueToTurn,
} from "./knob-geometry.js";

describe("valueToTurn", () => {
  it("maps the range onto 0..1", () => {
    expect(valueToTurn(0, 0, 100)).toBe(0);
    expect(valueToTurn(50, 0, 100)).toBe(0.5);
    expect(valueToTurn(100, 0, 100)).toBe(1);
  });

  it("clamps outside the range", () => {
    expect(valueToTurn(-20, 0, 100)).toBe(0);
    expect(valueToTurn(120, 0, 100)).toBe(1);
  });

  it("survives a zero-width range", () => {
    expect(valueToTurn(5, 5, 5)).toBe(0);
  });

  it("round-trips through turnToValue", () => {
    for (const value of [0, 12, 37.5, 99, 100]) {
      expect(turnToValue(valueToTurn(value, 0, 100), 0, 100)).toBeCloseTo(
        value,
        10,
      );
    }
  });
});

describe("turnToAngle", () => {
  it("starts at bottom-left and ends at bottom-right", () => {
    expect(turnToAngle(0)).toBe(KNOB_START_ANGLE);
    expect(turnToAngle(1)).toBe(KNOB_START_ANGLE + KNOB_SWEEP);
  });

  it("puts the midpoint at twelve o'clock", () => {
    expect(turnToAngle(0.5)).toBe(0);
  });
});

describe("arcPath and dashForTurn", () => {
  it("draws a large arc sweeping clockwise", () => {
    expect(arcPath(30, 32)).toMatch(/^M .+ A 30 30 0 1 1 .+$/);
  });

  it("starts and ends level, on either side of the bottom gap", () => {
    const [, startX, startY, , , , , , , endX, endY] = arcPath(30, 32).split(
      " ",
    );
    expect(Number(startY)).toBeCloseTo(Number(endY), 6);
    expect(Number(startX)).toBeLessThan(32);
    expect(Number(endX)).toBeGreaterThan(32);
  });

  it("covers three quarters of the circle", () => {
    expect(arcLength(30)).toBeCloseTo(2 * Math.PI * 30 * 0.75, 10);
  });

  it("fills the dash proportionally to the turn", () => {
    const full = arcLength(30);
    expect(dashForTurn(0, 30)).toBe(`0 ${full}`);
    expect(dashForTurn(0.5, 30)).toBe(`${full * 0.5} ${full}`);
    expect(dashForTurn(1, 30)).toBe(`${full} ${full}`);
  });
});

describe("pointerToTurn", () => {
  const radius = 50;

  it("rejects the dead zone at the centre", () => {
    expect(pointerToTurn(0, 0, radius, 0.5)).toBeNull();
    expect(pointerToTurn(5, 5, radius, 0.5)).toBeNull();
  });

  it("accepts a pointer beyond the dead zone", () => {
    expect(pointerToTurn(0, -40, radius, 0.5)).toBe(0.5);
  });

  it("reads twelve o'clock as the midpoint", () => {
    expect(pointerToTurn(0, -radius, radius, 0.5)).toBeCloseTo(0.5, 10);
  });

  it("reads the two ends of the sweep", () => {
    expect(pointerToTurn(-35, 35, radius, 0.1)).toBeCloseTo(0, 10);
    expect(pointerToTurn(35, 35, radius, 0.9)).toBeCloseTo(1, 10);
  });

  it("pins to the top of the range rather than crossing the gap", () => {
    expect(pointerToTurn(-5, radius, radius, 0.98)).toBe(1);
  });

  it("pins to the bottom of the range rather than crossing the gap", () => {
    expect(pointerToTurn(5, radius, radius, 0.02)).toBe(0);
  });

  it("jumps straight to the press position when there is no previous turn", () => {
    expect(pointerToTurn(-35, 35, radius, null)).toBeCloseTo(0, 10);
    expect(pointerToTurn(0, -radius, radius, null)).toBeCloseTo(0.5, 10);
  });

  it("still rejects the dead zone with no previous turn", () => {
    expect(pointerToTurn(0, 0, radius, null)).toBeNull();
  });

  it("allows ordinary travel that stays under half a turn", () => {
    expect(pointerToTurn(radius, 0, radius, 0.5)).toBeCloseTo(5 / 6, 10);
  });

  it("reads three and nine o'clock symmetrically about the midpoint", () => {
    const right = pointerToTurn(radius, 0, radius, 0.5) ?? 0;
    const left = pointerToTurn(-radius, 0, radius, 0.5) ?? 0;
    expect(right - 0.5).toBeCloseTo(0.5 - left, 10);
  });
});

describe("snapToStep", () => {
  it("snaps onto the step grid", () => {
    expect(snapToStep(37, 0, 100, 5)).toBe(35);
    expect(snapToStep(38, 0, 100, 5)).toBe(40);
  });

  it("measures the grid from min, not from zero", () => {
    expect(snapToStep(6, 1, 100, 5)).toBe(6);
    expect(snapToStep(8, 1, 100, 5)).toBe(6);
  });

  it("clamps to the range", () => {
    expect(snapToStep(-10, 0, 100, 1)).toBe(0);
    expect(snapToStep(140, 0, 100, 1)).toBe(100);
  });

  it("never returns a floating point tail", () => {
    expect(snapToStep(0.3, 0, 1, 0.1)).toBe(0.3);
    expect(stepValue(0.2, 1, 0, 1, 0.2)).toBe(0.4);
    expect(stepValue(0.7, 1, 0, 1, 0.1)).toBe(0.8);
  });

  it("passes through when the step is zero", () => {
    expect(snapToStep(37.4, 0, 100, 0)).toBe(37.4);
  });
});

describe("isScrubZone", () => {
  const radius = 50;

  it("claims the dial body", () => {
    expect(isScrubZone(0, 0, radius)).toBe(true);
    expect(isScrubZone(20, 0, radius)).toBe(true);
  });

  it("leaves the ring to the arc", () => {
    expect(isScrubZone(0, -radius, radius)).toBe(false);
    expect(isScrubZone(45, 0, radius)).toBe(false);
  });
});

describe("scrubValue", () => {
  it("covers the whole range over one travel distance", () => {
    expect(scrubValue(0, KNOB_SCRUB_TRAVEL, 0, 100, 1)).toBe(100);
    expect(scrubValue(100, -KNOB_SCRUB_TRAVEL, 0, 100, 1)).toBe(0);
  });

  it("moves proportionally to horizontal travel", () => {
    expect(scrubValue(0, KNOB_SCRUB_TRAVEL / 2, 0, 100, 1)).toBe(50);
    expect(scrubValue(50, -KNOB_SCRUB_TRAVEL / 4, 0, 100, 1)).toBe(25);
  });

  it("measures from where the press started, not from zero", () => {
    expect(scrubValue(30, KNOB_SCRUB_TRAVEL / 10, 0, 100, 1)).toBe(40);
  });

  it("quarters the distance when fine", () => {
    expect(scrubValue(0, KNOB_SCRUB_TRAVEL, 0, 100, 1, true)).toBe(25);
  });

  it("clamps and snaps like every other path", () => {
    expect(scrubValue(90, KNOB_SCRUB_TRAVEL, 0, 100, 1)).toBe(100);
    expect(scrubValue(0, KNOB_SCRUB_TRAVEL / 2, 0, 100, 30)).toBe(60);
  });

  it("respects a range that does not start at zero", () => {
    expect(scrubValue(0, KNOB_SCRUB_TRAVEL / 2, -12, 12, 1)).toBe(12);
  });
});

describe("stepValue", () => {
  it("moves by whole steps in both directions", () => {
    expect(stepValue(40, 1, 0, 100, 5)).toBe(45);
    expect(stepValue(40, -1, 0, 100, 5)).toBe(35);
    expect(stepValue(40, 10, 0, 100, 1)).toBe(50);
  });

  it("stops at the ends", () => {
    expect(stepValue(100, 1, 0, 100, 5)).toBe(100);
    expect(stepValue(0, -1, 0, 100, 5)).toBe(0);
  });
});
