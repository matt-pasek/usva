import { describe, expect, it } from "vitest";
import { createEnergyTracker } from "./energy.js";

describe("createEnergyTracker", () => {
  it("eases toward min(1, speed * gain)", () => {
    const tracker = createEnergyTracker();
    expect(tracker.bump(0.01)).toBeCloseTo(0.4 * 0.18, 10);
    expect(tracker.value).toBeCloseTo(0.4 * 0.18, 10);
  });

  it("eases into a fast bump instead of jumping to full energy", () => {
    const tracker = createEnergyTracker();
    const first = tracker.bump(5);
    expect(first).toBeGreaterThan(0);
    expect(first).toBeLessThan(0.3);
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
    const tracker = createEnergyTracker({
      attack: 0.5,
      gain: 10,
      parkBelow: 0.5,
    });
    expect(tracker.bump(0.03)).toBeCloseTo(0.15, 10);
    expect(tracker.parked()).toBe(true);
  });
});
