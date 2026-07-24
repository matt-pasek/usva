import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, test } from "vitest";

const APP = resolve(process.cwd(), "app");

function pages(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === ".next" ? [] : pages(full);
    return entry.name === "page.tsx" ? [full] : [];
  });
}

function field(block: string, name: string): string | null {
  const m = block.match(
    new RegExp(`${name}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`),
  );
  return m?.[1] ?? null;
}

function routeOf(file: string): string {
  return `/${relative(APP, file).replace(/\/page\.tsx$/, "")}`;
}

const entries = pages(APP).flatMap((file) => {
  const source = readFileSync(file, "utf8");
  const canonicalPath = source.match(
    /export const metadata:\s*Metadata\s*=\s*pageMetadata\(\s*"([^"]+)"/,
  )?.[1];
  if (canonicalPath === undefined) return [];
  return [
    {
      file: relative(APP, file),
      route: routeOf(file),
      canonicalPath,
      title: field(source, "title"),
      description: field(source, "description"),
    },
  ];
});

/**
 * Two invariants. Every page routes its metadata through pageMetadata, so no
 * page can ship without a canonical url and none can disagree about which url
 * it is. And on-page copy is lowercase while metadata is Sentence case, because
 * metadata renders in a tab or a search result with none of the site around it
 * to show that the lowercase is deliberate.
 */
describe("metadata register", () => {
  test("finds every page's metadata", () => {
    expect(entries.length).toBeGreaterThan(90);
  });

  for (const { file, route, canonicalPath } of entries) {
    test(`${file} routes metadata through pageMetadata with its own canonical`, () => {
      expect({ file, canonicalPath }).toMatchObject({ canonicalPath: route });
    });
  }

  for (const { file, title, description } of entries) {
    test(`${file} opens its metadata in Sentence case`, () => {
      for (const value of [title, description]) {
        if (!value) continue;
        // The brand keeps its own casing anywhere it appears, including first.
        if (value.startsWith("usva")) continue;
        expect({ file, value }).toMatchObject({
          value: expect.stringMatching(/^[A-Z]/),
        });
      }
    });
  }

  test("never capitalises the brand", () => {
    for (const { file, title, description } of entries) {
      expect({ file, text: `${title} ${description}` }).toMatchObject({
        text: expect.not.stringMatching(/\bUsva\b/),
      });
    }
  });
});
