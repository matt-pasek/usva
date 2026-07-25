import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { CATALOG } from "./catalog";
import { DL_CHAPTERS } from "./design-language";
import { OG_HOST, ogPaths, ROOT_CARD, resolveCard } from "./og-content";
import {
  auroraPlacement,
  OG_CUT,
  OG_MARK,
  OG_PLATE_FILE,
  OG_PLATE_SCALE,
  OG_SIZE,
} from "./og-plate";
import { RAILO_BOX, RAILO_CUTS } from "./railo-geometry";
import { ogImageUrl, pageMetadata, SITE_ORIGIN } from "./site";

const DOCS = resolve(process.cwd());

function pngSize(file: string): { width: number; height: number } {
  const buf = readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

describe("og plate", () => {
  test("reads its cut from the geometry rather than retyping it", () => {
    expect(OG_CUT).toBe(RAILO_CUTS.display);
  });

  test("is baked, at the scale the card expects", () => {
    expect(pngSize(join(DOCS, OG_PLATE_FILE))).toEqual({
      width: OG_SIZE.width * OG_PLATE_SCALE,
      height: OG_SIZE.height * OG_PLATE_SCALE,
    });
  });
});

describe("og geometry", () => {
  test("keeps the right field off canvas, as cropped", () => {
    const scale = OG_MARK.box / RAILO_BOX;
    const rightFieldStart = OG_MARK.x + scale * (OG_CUT.left + OG_CUT.radius);
    expect(rightFieldStart).toBeGreaterThan(OG_SIZE.width);
  });

  test("lands the aurora's lit band inside the mark", () => {
    const place = auroraPlacement();
    const markTopInFrame = (OG_MARK.y - place.y) / place.height;
    const markBottomInFrame =
      (OG_MARK.y + OG_MARK.box - place.y) / place.height;
    expect(markBottomInFrame).toBeGreaterThan(0.4);
    expect(markTopInFrame).toBeLessThan(markBottomInFrame);
  });
});

describe("og content", () => {
  test("covers every component and every chapter", () => {
    expect(ogPaths()).toHaveLength(CATALOG.length + DL_CHAPTERS.length);
  });

  test("gives every catalog entry its own name and summary", () => {
    for (const entry of CATALOG) {
      const card = resolveCard(["docs", "components", entry.slug]);
      expect({ slug: entry.slug, card }).toMatchObject({
        slug: entry.slug,
        card: { title: entry.name, line: entry.summary, period: false },
      });
    }
  });

  test("gives every chapter its number and blurb", () => {
    for (const chapter of DL_CHAPTERS) {
      const card = resolveCard(["design-language", chapter.slug]);
      expect({ slug: chapter.slug, card }).toMatchObject({
        slug: chapter.slug,
        card: {
          title: chapter.title,
          line: chapter.blurb,
          foot: [`chapter ${chapter.number}`, "npm + registry"],
        },
      });
    }
  });

  test("only the root card carries the wordmark period", () => {
    expect(ROOT_CARD.period).toBe(true);
    expect(resolveCard(["docs", "components", "button"]).period).toBe(false);
  });

  test("falls back to the root card for anything unrecognised", () => {
    for (const path of [
      [],
      ["nope"],
      ["docs", "components"],
      ["docs", "components", "nope"],
    ]) {
      expect(resolveCard(path)).toEqual(ROOT_CARD);
    }
  });

  test("licences honestly", () => {
    expect(ROOT_CARD.foot[1]).toBe("mit + commons clause");
  });

  test("names the host the site actually lives on", () => {
    expect(OG_HOST).toBe(new URL(SITE_ORIGIN).host);
    for (const card of [ROOT_CARD, ...ogPaths().map(resolveCard)]) {
      expect(card.eyebrow.startsWith(OG_HOST)).toBe(true);
    }
  });

  /**
   * The line sits in a 470px column at 34px, which fits five lines before it
   * reaches the foot row. The longest summary today is 108 characters and runs
   * to four. 140 is the bound with a line of headroom left.
   */
  test("keeps every line short enough to clear the foot row", () => {
    const tooLong = ogPaths()
      .map(resolveCard)
      .filter((card) => card.line.length > 140)
      .map((card) => `${card.title}: ${card.line.length}`);
    expect(tooLong).toEqual([]);
  });
});

describe("og metadata", () => {
  test("stamps a card on every page that goes through the door", () => {
    const meta = pageMetadata("/docs/components/button", { title: "Button" });
    expect(meta.openGraph?.images).toEqual([
      {
        url: `${SITE_ORIGIN}/og/docs/components/button`,
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        alt: "Button · usva.",
      },
    ]);
    expect(meta.twitter?.images).toEqual(meta.openGraph?.images);
  });

  test("gives the root the bare card route", () => {
    expect(ogImageUrl("/")).toBe(`${SITE_ORIGIN}/og`);
  });

  test("lets a page override its own card", () => {
    const meta = pageMetadata("/", {
      openGraph: { images: ["https://example.test/other.png"] },
    });
    expect(meta.openGraph?.images).toEqual(["https://example.test/other.png"]);
  });
});
