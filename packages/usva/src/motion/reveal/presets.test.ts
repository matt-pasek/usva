import { describe, expect, it } from "vitest";
import { buildReveal, scrubRanges, springs, variants } from "./presets.js";

describe("motion presets", () => {
  it("exposes a soft spring from tokens", () => {
    expect(springs.soft).toMatchObject({ type: "spring", stiffness: 210 });
  });
  it("fadeUp hides then shows", () => {
    expect(variants.fadeUp.hidden.opacity).toBe(0);
    expect(variants.fadeUp.show.opacity).toBe(1);
  });
});

describe("scrubRanges", () => {
  it("turns a variant into from/to pairs, opacity always included", () => {
    const r = scrubRanges(buildReveal("veil", 1, false));
    expect(r.opacity).toEqual([0, 1]);
    expect(r.y[0]).toBeGreaterThan(0);
    expect(r.y[1]).toBe(0);
  });

  it("parses the blur filter into numbers and marks it present", () => {
    const r = scrubRanges(buildReveal("focus", 1, false));
    expect(r.present.blur).toBe(true);
    expect(r.blur[0]).toBeCloseTo(12, 1);
    expect(r.blur[1]).toBe(0);
  });

  it("marks blur absent when the variant never blurs, so no filter is emitted", () => {
    const r = scrubRanges(buildReveal("tick", 1, false));
    expect(r.present.blur).toBe(false);
    expect(r.blur).toEqual([0, 0]);
  });

  it("marks axes absent when the variant does not move on them", () => {
    const lean = scrubRanges(buildReveal("lean", 1, false));
    expect(lean.present.x).toBe(true);
    expect(lean.present.y).toBe(false);
    expect(lean.present.scale).toBe(false);
  });

  it("drops the blur below the 2px floor, matching buildReveal", () => {
    const r = scrubRanges(buildReveal("veil", 0.1, false));
    expect(r.present.blur).toBe(false);
  });

  it("collapses to a plain crossfade under reduced motion", () => {
    const r = scrubRanges(buildReveal("cast", 1, true));
    expect(r.opacity).toEqual([0, 1]);
    expect(r.present).toEqual({
      x: false,
      y: false,
      scale: false,
      blur: false,
    });
  });

  it("scales travel with intensity", () => {
    const bold = scrubRanges(buildReveal("surface", 1, false));
    const quiet = scrubRanges(buildReveal("surface", 0.45, false));
    expect(Math.abs(quiet.y[0])).toBeLessThan(Math.abs(bold.y[0]));
  });
});
