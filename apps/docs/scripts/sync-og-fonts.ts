/**
 * Copies the three faces the OG card needs out of fontsource and into
 * assets/fonts, which is a generated directory like public/og.
 *
 * Satori needs the bytes, and Turbopack cannot trace a `createRequire().resolve`
 * call: it fails the build with "expression is too dynamic". Reading from
 * `join(process.cwd(), "assets", ...)` is the pattern that traces, so the faces
 * have to sit inside the app rather than be resolved out of node_modules.
 *
 *   bun apps/docs/scripts/sync-og-fonts.ts
 */

import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { OG_FONT_DIR, OG_FONTS } from "../lib/og-fonts.js";

const require_ = createRequire(import.meta.url);
const DOCS = join(dirname(new URL(import.meta.url).pathname), "..");

const sync = () => {
  const dir = join(DOCS, OG_FONT_DIR);
  mkdirSync(dir, { recursive: true });

  for (const font of OG_FONTS) {
    copyFileSync(require_.resolve(font.source), join(dir, font.file));
    console.log(`${font.file} <- ${font.source}`);
  }
};

sync();
