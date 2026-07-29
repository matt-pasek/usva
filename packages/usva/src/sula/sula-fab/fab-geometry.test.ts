import { describe, expect, it } from "vitest";
import type { Blob } from "../sula-core/geometry.js";
import { fabBridges, fabPhase, fabSlots } from "./fab-geometry.js";

const trigger: Blob = { cx: 100, cy: 100, hw: 24, hh: 24, r: 24 };

const slotsFrom = (offsets: Array<{ x: number; y: number }>): Blob[] =>
  offsets.map((o) => ({
    cx: trigger.cx + o.x,
    cy: trigger.cy + o.y,
    hw: 16,
    hh: 16,
    r: 16,
  }));

const dist = (a: Blob, b: { cx: number; cy: number }) =>
  Math.hypot(a.cx - b.cx, a.cy - b.cy);

const spacing = { triggerR: 28, beadR: 22, gap: 12 };

describe("fabSlots", () => {
  it("stacks a line up with constant edge gaps", () => {
    const slots = fabSlots(3, "line", "up", spacing);
    // bead0 at -(28+22+12) = -62, then a constant step of 2*22+12 = 56.
    expect(slots).toEqual([
      { x: 0, y: -62 },
      { x: 0, y: -118 },
      { x: 0, y: -174 },
    ]);
  });

  it("keeps the trigger and every bead edge gap equal", () => {
    const slots = fabSlots(3, "line", "up", spacing);
    const dists = slots.map((s) => Math.hypot(s.x, s.y));
    const first = dists[0] as number;
    expect(first - spacing.triggerR - spacing.beadR).toBeCloseTo(
      spacing.gap,
      6,
    );
    for (let i = 1; i < dists.length; i++) {
      const edgeGap =
        (dists[i] as number) - (dists[i - 1] as number) - 2 * spacing.beadR;
      expect(edgeGap).toBeCloseTo(spacing.gap, 6);
    }
  });

  it("mirrors the line onto +x when the direction is right", () => {
    const slots = fabSlots(3, "line", "right", spacing);
    expect(slots).toEqual([
      { x: 62, y: 0 },
      { x: 118, y: 0 },
      { x: 174, y: 0 },
    ]);
  });

  it("fans an arc across distinct angles at one radius", () => {
    const radius = spacing.triggerR + spacing.beadR + spacing.gap;
    const slots = fabSlots(3, "arc", "up", spacing);
    for (const slot of slots) {
      expect(Math.hypot(slot.x, slot.y)).toBeCloseTo(radius, 6);
    }
    const angles = slots.map((s) => Math.atan2(s.y, s.x));
    expect(new Set(angles.map((a) => a.toFixed(4))).size).toBe(3);
    // The middle bead sits on the upward axis.
    expect(slots[1]?.x).toBeCloseTo(0, 6);
    expect(slots[1]?.y).toBeCloseTo(-radius, 6);
  });

  it("returns nothing for a count of zero", () => {
    expect(fabSlots(0, "line", "up", spacing)).toEqual([]);
    expect(fabSlots(0, "arc", "up", spacing)).toEqual([]);
  });
});

describe("fabPhase", () => {
  const offsets = fabSlots(3, "line", "up", {
    triggerR: 24,
    beadR: 16,
    gap: 20,
  });
  const slots = slotsFrom(offsets);

  it("lands every staggered arc bead on the same radius at rest", () => {
    const arcOffsets = fabSlots(3, "arc", "up", {
      triggerR: 24,
      beadR: 16,
      gap: 20,
    });
    const arcSlots = slotsFrom(arcOffsets);
    const { blobs } = fabPhase(trigger, arcSlots, 1);

    for (const [i, bead] of blobs.slice(1).entries()) {
      const slot = arcSlots[i] as Blob;
      expect(bead.cx).toBeCloseTo(slot.cx, 6);
      expect(bead.cy).toBeCloseTo(slot.cy, 6);
    }
  });

  it("connects every settled arc bead directly to the trigger", () => {
    const arcSlots = slotsFrom(
      fabSlots(3, "arc", "up", {
        triggerR: 24,
        beadR: 16,
        gap: 12,
      }),
    );
    const { blobs } = fabPhase(trigger, arcSlots, 1);

    expect(fabBridges(blobs, 16, 0.32, "arc")).toHaveLength(3);
  });

  it("chains line actions strongly and ties the trigger weakly", () => {
    const lineSlots = slotsFrom(
      fabSlots(3, "line", "up", {
        triggerR: 24,
        beadR: 16,
        gap: 12,
      }),
    );
    const { blobs } = fabPhase(trigger, lineSlots, 1);
    const bridges = fabBridges(blobs, 16, 0.32, "line");

    expect(bridges).toHaveLength(3);
    expect(bridges[0]?.strength ?? 0).toBeGreaterThan(
      bridges[2]?.strength ?? 1,
    );
    expect(bridges[1]?.strength ?? 0).toBeGreaterThan(
      bridges[2]?.strength ?? 1,
    );
  });

  it("keeps the beads absorbed in the trigger when closed", () => {
    const { blobs } = fabPhase(trigger, slots, 0);
    expect(blobs[0]).toEqual(trigger);
    const beads = blobs.slice(1);
    expect(beads).toHaveLength(3);
    for (const [i, bead] of beads.entries()) {
      const slot = slots[i] as Blob;
      expect(bead.hw).toBeLessThan(slot.hw);
      expect(dist(bead, trigger)).toBeLessThan(60);
    }
  });

  it("settles every bead at its slot with no necks when open", () => {
    const { blobs, necks } = fabPhase(trigger, slots, 1);
    expect(necks).toHaveLength(0);
    const last = blobs[blobs.length - 1] as Blob;
    const lastSlot = slots[slots.length - 1] as Blob;
    expect(last.cx).toBeCloseTo(lastSlot.cx, 4);
    expect(last.cy).toBeCloseTo(lastSlot.cy, 4);
    expect(last.hw).toBeCloseTo(lastSlot.hw, 4);
  });

  it("tethers a travelling bead with a neck mid-open", () => {
    const { necks } = fabPhase(trigger, slots, 0.5);
    expect(necks.length).toBeGreaterThan(0);
  });

  it("overshoots the slot position past 1 with a clamped size", () => {
    const { blobs } = fabPhase(trigger, slots, 1.1);
    const last = blobs[blobs.length - 1] as Blob;
    const lastSlot = slots[slots.length - 1] as Blob;
    // Up axis: overshoot means a smaller y than the slot, and farther out.
    expect(last.cy).toBeLessThan(lastSlot.cy);
    expect(dist(last, trigger)).toBeGreaterThan(dist(lastSlot, trigger));
    expect(last.hw).toBeCloseTo(lastSlot.hw, 4);
  });

  it("never mutates its inputs", () => {
    const frozen = slots.map((s) => ({ ...s }));
    fabPhase(trigger, slots, 0.5);
    expect(slots).toEqual(frozen);
  });
});
