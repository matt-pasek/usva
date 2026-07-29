import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { describe, expect, test } from "vitest";
import {
  HERO_CARD,
  HERO_FILES,
  HERO_FOOT_WIDTH,
  HERO_INTERNAL,
  HERO_LAYERS,
  HERO_PAD,
  HERO_PANEL,
  HERO_PANEL_PAD,
  HERO_ROW_COLUMN,
  HERO_ROWS,
  HERO_SIZE,
  HERO_SNIPPET,
  HERO_STAT_COLUMN,
  HERO_STATS,
  HERO_TYPE,
} from "./hero.js";

const DOCS = resolve(process.cwd());
const at = (relative: string) => join(DOCS, relative);

describe("hero geometry", () => {
  test("keeps the wide type column clear of the knob card", () => {
    expect(HERO_PAD.left + HERO_TYPE.tagline.maxWidth).toBeLessThanOrEqual(
      HERO_CARD.x,
    );
  });

  test("keeps the footer clear of the floated card", () => {
    expect(HERO_PAD.left + HERO_FOOT_WIDTH).toBeLessThan(HERO_CARD.x);
  });

  test("plants both foreground cards inside the panel", () => {
    const panelRight = HERO_PANEL.x + HERO_PANEL.width;
    const panelBottom = HERO_PANEL.y + HERO_PANEL.height;

    for (const card of [HERO_CARD, HERO_SNIPPET]) {
      expect(card.x).toBeLessThan(panelRight);
      expect(card.x + card.width).toBeGreaterThan(HERO_PANEL.x);
      expect(card.y).toBeGreaterThan(HERO_PANEL.y);
      expect(card.y).toBeLessThan(panelBottom);
    }

    expect(HERO_CARD.x + HERO_CARD.width).toBeGreaterThan(HERO_PANEL.x + 64);
    expect(HERO_SNIPPET.x).toBeLessThan(panelRight - 64);
  });

  test("crops the panel and the snippet on one line", () => {
    expect(HERO_SNIPPET.x + HERO_SNIPPET.width).toBe(
      HERO_PANEL.x + HERO_PANEL.width,
    );
    expect(HERO_PANEL.x + HERO_PANEL.width).toBeGreaterThan(HERO_SIZE.width);
  });

  test("keeps the panel's row column on canvas", () => {
    const rowsLeft = HERO_PANEL.x + HERO_PANEL_PAD + HERO_STAT_COLUMN + 20;
    expect(rowsLeft + HERO_ROW_COLUMN).toBeLessThanOrEqual(HERO_SIZE.width);
  });
});

describe("hero figures", () => {
  const PKG = resolve(DOCS, "../../packages/usva/src");
  const internal = new Set(HERO_INTERNAL);

  const counted = Object.fromEntries(
    HERO_LAYERS.map((layer) => [
      layer,
      readdirSync(join(PKG, layer), { withFileTypes: true }).filter(
        (entry) =>
          entry.isDirectory() &&
          !internal.has(entry.name) &&
          existsSync(join(PKG, layer, entry.name, "index.ts")),
      ).length,
    ]),
  );

  const stat = (label: string) =>
    HERO_STATS.find((entry) => entry.label === label)?.value;

  test("counts components off the package", () => {
    const total = Object.values(counted).reduce((sum, n) => sum + n, 0);
    expect(stat("components")).toBe(String(total));
  });

  test("counts layers off the package", () => {
    expect(stat("layers")).toBe(String(HERO_LAYERS.length));
  });

  test("counts themes off the tokens package", () => {
    const themes = readdirSync(
      resolve(DOCS, "../../packages/tokens/themes"),
    ).filter((file) => file.endsWith(".css"));
    expect(stat("themes")).toBe(String(themes.length));
  });

  test("names only layers the package actually has", () => {
    for (const row of HERO_ROWS) {
      expect(HERO_LAYERS).toContain(row.metaLeft);
    }
  });

  test("names only components the package actually has", () => {
    for (const row of HERO_ROWS) {
      expect(existsSync(join(PKG, row.metaLeft, row.heading))).toBe(true);
    }
  });
});

describe("hero stills", () => {
  for (const { path, width, height } of HERO_FILES) {
    test(`${path} is baked at ${width}x${height}`, async () => {
      expect(existsSync(at(path)), `${path} is missing, run bun run hero`).toBe(
        true,
      );
      const meta = await sharp(at(path)).metadata();
      expect({ width: meta.width, height: meta.height }).toEqual({
        width,
        height,
      });
    });
  }
});
