import { describe, expect, test } from "vitest";
import { byLayer } from "@/lib/catalog";
import { LEXICON } from "@/lib/lexicon";
import { ATMOSPHERE_LINKS } from "./descent-layout";

describe("descent layout", () => {
  test("names every atmosphere in the catalog, lowercase", () => {
    expect(ATMOSPHERE_LINKS.map((entry) => entry.slug).sort()).toEqual(
      byLayer("atmosphere")
        .map((entry) => entry.slug)
        .sort(),
    );

    for (const entry of ATMOSPHERE_LINKS) {
      expect(entry.slug).toBe(entry.slug.toLowerCase());
      expect(entry.word).toBe(entry.word.toLowerCase());
      expect(entry.descriptor).toBe(entry.descriptor.toLowerCase());
    }
  });

  test("shows the lexicon's gloss rather than a second copy of it", () => {
    for (const entry of ATMOSPHERE_LINKS) {
      const lexeme = LEXICON.find((item) => item.word === entry.word);
      expect(lexeme?.labels).toBe(entry.descriptor);
    }
  });

  test("keeps the word's diacritics while the href stays ascii", () => {
    const kynnos = ATMOSPHERE_LINKS.find((entry) => entry.slug === "kynnos");
    const vare = ATMOSPHERE_LINKS.find((entry) => entry.slug === "vare");

    expect(kynnos?.word).toBe("kynnös");
    expect(vare?.word).toBe("väre");
    for (const entry of ATMOSPHERE_LINKS) {
      expect(entry.slug).toMatch(/^[a-z-]+$/);
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
