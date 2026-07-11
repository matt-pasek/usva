import { describe, expect, it } from "vitest";
import { createEnergyTracker } from "./energy.js";

describe("createEnergyTracker", () => {
  it("bumps to min(1, speed * gain)", () => {
    const tracker = createEnergyTracker();
    expect(tracker.bump(0.01)).toBeCloseTo(0.4, 10);
    expect(tracker.value).toBeCloseTo(0.4, 10);
  });

  it("clamps a fast bump to 1", () => {
    const tracker = createEnergyTracker();
    expect(tracker.bump(5)).toBe(1);
  });

  it("decays by the decay factor when speed is 0", () => {
    const tracker = createEnergyTracker();
    tracker.bump(0.02);
    const before = tracker.value;
    expect(tracker.bump(0)).toBeCloseTo(before * 0.9, 10);
  });

  it("parks once energy falls below the threshold", () => {
    const tracker = createEnergyTracker();
    tracker.bump(0.02);
    expect(tracker.parked()).toBe(false);
    for (let i = 0; i < 40; i++) tracker.bump(0);
    expect(tracker.parked()).toBe(true);
  });

  it("honours custom options", () => {
    const tracker = createEnergyTracker({ gain: 10, parkBelow: 0.5 });
    expect(tracker.bump(0.03)).toBeCloseTo(0.3, 10);
    expect(tracker.parked()).toBe(true);
  });
});
