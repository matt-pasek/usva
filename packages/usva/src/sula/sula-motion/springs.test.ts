import { describe, expect, it } from "vitest";
import {
  barSpring,
  dripRetract,
  sideSpring,
  switchSpring,
  textFade,
} from "./springs.js";

const naturalFrequency = (spring: {
  stiffness: number;
  mass: number;
}): number => Math.sqrt(spring.stiffness / spring.mass);

describe("sula springs", () => {
  it("keep the reveal springs in one register near 4.8 rad/s", () => {
    for (const spring of [barSpring, sideSpring]) {
      const omega = naturalFrequency(spring);
      expect(omega).toBeGreaterThan(4.5);
      expect(omega).toBeLessThan(5.9);
    }
  });

  it("makes the switch spring snappier than the reveal springs", () => {
    expect(naturalFrequency(switchSpring)).toBeGreaterThan(
      naturalFrequency(barSpring),
    );
  });

  it("declares each spring as a spring", () => {
    for (const spring of [barSpring, sideSpring, switchSpring]) {
      expect(spring.type).toBe("spring");
    }
  });

  it("keeps the tweens as bounded eased durations", () => {
    expect(dripRetract.duration).toBeGreaterThan(0);
    expect(dripRetract.ease).toHaveLength(4);
    expect(textFade.duration).toBeGreaterThan(0);
    expect(textFade.ease).toHaveLength(4);
  });
});
