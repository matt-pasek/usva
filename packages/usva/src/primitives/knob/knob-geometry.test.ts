import { describe, expect, it } from "vitest";
import {
  arcLength,
  arcPath,
  dashForTurn,
  dragValue,
  KNOB_DRAG_TRAVEL,
  KNOB_START_ANGLE,
  KNOB_SWEEP,
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

describe("dragValue", () => {
  it("covers the whole range over one travel distance", () => {
    expect(dragValue(0, KNOB_DRAG_TRAVEL, 0, 0, 100, 1)).toBe(100);
    expect(dragValue(100, -KNOB_DRAG_TRAVEL, 0, 0, 100, 1)).toBe(0);
  });

  it("reads up and right as the same rise", () => {
    expect(dragValue(0, KNOB_DRAG_TRAVEL / 2, 0, 0, 100, 1)).toBe(50);
    expect(dragValue(0, 0, -KNOB_DRAG_TRAVEL / 2, 0, 100, 1)).toBe(50);
  });

  it("reads down and left as the same fall", () => {
    expect(dragValue(100, -KNOB_DRAG_TRAVEL / 2, 0, 0, 100, 1)).toBe(50);
    expect(dragValue(100, 0, KNOB_DRAG_TRAVEL / 2, 0, 100, 1)).toBe(50);
  });

  it("adds the two axes, so a diagonal moves further than either", () => {
    const half = KNOB_DRAG_TRAVEL / 2;
    expect(dragValue(0, half, -half, 0, 100, 1)).toBe(100);
  });

  it("cancels a drag that goes up and left in equal measure", () => {
    const d = KNOB_DRAG_TRAVEL / 2;
    expect(dragValue(40, -d, -d, 0, 100, 1)).toBe(40);
  });

  it("measures from where the press started, not from zero", () => {
    expect(dragValue(30, KNOB_DRAG_TRAVEL / 10, 0, 0, 100, 1)).toBe(40);
  });

  it("quarters the distance when fine", () => {
    expect(dragValue(0, KNOB_DRAG_TRAVEL, 0, 0, 100, 1, true)).toBe(25);
  });

  it("clamps and snaps like every other path", () => {
    expect(dragValue(90, KNOB_DRAG_TRAVEL, 0, 0, 100, 1)).toBe(100);
    expect(dragValue(0, KNOB_DRAG_TRAVEL / 2, 0, 0, 100, 30)).toBe(60);
  });

  it("respects a range that does not start at zero", () => {
    expect(dragValue(0, KNOB_DRAG_TRAVEL / 2, 0, -12, 12, 1)).toBe(12);
  });

  /** The old arc mode died at the bottom of the sweep. Nothing is dead now. */
  it("keeps moving wherever the pointer has wandered", () => {
    const far = KNOB_DRAG_TRAVEL * 4;
    expect(dragValue(50, 0, far, 0, 100, 1)).toBe(0);
    expect(dragValue(50, 0, -far, 0, 100, 1)).toBe(100);
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
