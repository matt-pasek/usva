import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";
import { describe, expect, test } from "vitest";
import {
  HERO_CARD,
  HERO_FILES,
  HERO_INTERNAL,
  HERO_LAYERS,
  HERO_PAD,
  HERO_ROWS,
  HERO_SAFE,
  HERO_SIZE,
  HERO_SQUARE,
  HERO_SQUARE_X,
  HERO_STATS,
  HERO_THEMES,
  HERO_TYPE,
  heroFiles,
} from "./hero.js";

const DOCS = resolve(process.cwd());
const at = (relative: string) => join(DOCS, relative);

describe("hero geometry", () => {
  test("keeps the whole type column inside the square's window", () => {
    expect(HERO_PAD.left).toBeGreaterThanOrEqual(HERO_SAFE.left);
    expect(HERO_PAD.left + HERO_TYPE.tagline.maxWidth).toBeLessThanOrEqual(
      HERO_SAFE.right,
    );
  });

  test("keeps the floated card's leading edge inside the window", () => {
    expect(HERO_CARD.x).toBeGreaterThan(HERO_PAD.left);
    expect(HERO_CARD.x).toBeLessThan(HERO_SAFE.right);
  });

  test("keeps the footer clear of the floated card", () => {
    expect(HERO_PAD.left + (HERO_CARD.x - HERO_PAD.left - 16)).toBeLessThan(
      HERO_CARD.x,
    );
  });

  test("takes the square window from inside the wide frame", () => {
    expect(HERO_SQUARE_X).toBeGreaterThanOrEqual(0);
    expect(HERO_SQUARE_X + HERO_SQUARE).toBeLessThanOrEqual(HERO_SIZE.width);
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

  for (const theme of HERO_THEMES) {
    test(`${theme}'s square is a window onto the wide`, async () => {
      const files = heroFiles(theme);
      const wide = await sharp(at(files.wide))
        .raw()
        .toBuffer({ resolveWithObject: true });
      const square = await sharp(at(files.square))
        .raw()
        .toBuffer({ resolveWithObject: true });

      const channels = square.info.channels;
      const margin = 8;
      const worst = { diff: 0, x: 0, y: 0 };

      for (let y = margin; y < HERO_SQUARE - margin; y += 30) {
        for (let x = margin; x < HERO_SQUARE - margin; x += 30) {
          const a =
            (y * wide.info.width + x + HERO_SQUARE_X) * wide.info.channels;
          const b = (y * square.info.width + x) * channels;
          for (let c = 0; c < 3; c += 1) {
            const diff = Math.abs(
              (wide.data[a + c] ?? 0) - (square.data[b + c] ?? 0),
            );
            if (diff > worst.diff) Object.assign(worst, { diff, x, y });
          }
        }
      }

      expect(worst).toMatchObject({ diff: expect.any(Number) });
      expect(worst.diff).toBeLessThanOrEqual(6);
    });
  }
});
