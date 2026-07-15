import { describe, expect, test } from "vitest";
import { ATMOSPHERE_LINKS } from "./descent-layout";

describe("descent layout", () => {
  test("names every atmosphere in the catalog, lowercase", () => {
    expect(ATMOSPHERE_LINKS.map((entry) => entry.slug).sort()).toEqual([
      "hehku",
      "kajastus",
      "kuulto",
      "kynnos",
      "loimu",
      "utu",
      "vare",
    ]);

    for (const entry of ATMOSPHERE_LINKS) {
      expect(entry.slug).toBe(entry.slug.toLowerCase());
      expect(entry.descriptor).toBe(entry.descriptor.toLowerCase());
    }
  });

  test("keeps the constellation inside the field and off its edges", () => {
    for (const entry of ATMOSPHERE_LINKS) {
      expect(entry.x).toBeGreaterThanOrEqual(10);
      expect(entry.x).toBeLessThanOrEqual(90);
      expect(entry.y).toBeGreaterThanOrEqual(5);
      expect(entry.y).toBeLessThanOrEqual(95);
    }
  });

  test("balances the constellation around the centre", () => {
    const mean =
      ATMOSPHERE_LINKS.reduce((sum, entry) => sum + entry.x, 0) /
      ATMOSPHERE_LINKS.length;
    expect(Math.abs(mean - 50)).toBeLessThan(8);
  });

  test("desynchronises the drift so the names never float as one block", () => {
    const drifts = new Set(ATMOSPHERE_LINKS.map((entry) => entry.drift));
    expect(drifts.size).toBe(ATMOSPHERE_LINKS.length);
  });
});
