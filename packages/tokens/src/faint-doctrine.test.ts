import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const ROOT = fileURLToPath(new URL("../../..", import.meta.url));
const SCAN = ["apps/docs", "packages/usva/src"];
const SKIP = new Set([
  "node_modules",
  "dist",
  ".next",
  ".turbo",
  "storybook-static",
]);

function* tsxFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) yield* tsxFiles(path);
    else if (entry.name.endsWith(".tsx")) yield path;
  }
}

function informationBearingFaint(source: string): number[] {
  const lines: number[] = [];
  for (
    let i = source.indexOf("text-faint");
    i !== -1;
    i = source.indexOf("text-faint", i + 1)
  ) {
    const tag = source.slice(source.lastIndexOf("<", i), i);
    if (!tag.includes("aria-hidden"))
      lines.push(source.slice(0, i).split("\n").length);
  }
  return lines;
}

describe("faint is decorative only", () => {
  const offenders = SCAN.flatMap((dir) =>
    [...tsxFiles(`${ROOT}${dir}`)].flatMap((file) =>
      informationBearingFaint(readFileSync(file, "utf8")).map(
        (line) => `${file.slice(ROOT.length)}:${line}`,
      ),
    ),
  );

  it("is never applied to an element that is not aria-hidden", () => {
    expect(offenders).toEqual([]);
  });

  it("still permits faint on aria-hidden ornament", () => {
    expect(
      informationBearingFaint(
        `<div aria-hidden="true" className={cn("mb-4 text-faint")} />`,
      ),
    ).toEqual([]);
  });

  it("catches faint on an element that carries words", () => {
    expect(
      informationBearingFaint(`<span className="text-faint">{label}</span>`),
    ).toEqual([1]);
  });
});
