import fs from "node:fs";
import { createRequire } from "node:module";

/**
 * bunchee fans out one rollup build per entry through an unbounded Promise.all,
 * which OOMs somewhere above ~14 entries. We have far more. patches/bunchee@<v>.patch
 * pools that fan-out. Without the patch the build dies with a V8 heap trace that
 * says nothing about the real cause, so fail here instead, loudly.
 */
const require = createRequire(import.meta.url);

const pkgPath = require.resolve("bunchee/package.json");
const { version } = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const entry = pkgPath.replace(/package\.json$/, "dist/index.js");

const entryCount = Object.keys(
  JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url)))
    .exports,
).length;

if (!fs.readFileSync(entry, "utf8").includes("runWithConcurrency")) {
  console.error(
    `\nbunchee@${version} is missing the bounded-concurrency patch.\n\n` +
      `Building ${entryCount} entries with bunchee's unbounded Promise.all exhausts the\n` +
      `heap (10 GB is not enough), so the build would fail with an unhelpful\n` +
      `"JavaScript heap out of memory" instead of this message.\n\n` +
      `Fix: run \`bun install\` to reapply patches/bunchee@6.12.0.patch.\n` +
      `If bunchee was upgraded, the patch no longer matches that version:\n` +
      `regenerate it with \`bun patch bunchee\`, or drop it if upstream shipped\n` +
      `a concurrency limit (github.com/huozhi/bunchee, commit 5617aa0).\n`,
  );
  process.exit(1);
}
