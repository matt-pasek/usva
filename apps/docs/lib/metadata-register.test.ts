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

const entries = pages(APP).flatMap((file) => {
  const body = readFileSync(file, "utf8").match(
    /export const metadata:\s*Metadata\s*=\s*\{([\s\S]*?)\n\};/,
  )?.[1];
  if (!body) return [];
  return [
    {
      file: relative(APP, file),
      title: field(body, "title"),
      description: field(body, "description"),
    },
  ];
});

/**
 * On-page copy is lowercase, metadata is Sentence case. Metadata renders in a
 * tab, a search result or a link unfurl, with none of the site around it to
 * show that the lowercase is deliberate.
 */
describe("metadata register", () => {
  test("finds every page's metadata", () => {
    expect(entries.length).toBeGreaterThan(90);
  });

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
