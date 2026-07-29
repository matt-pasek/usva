import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { DEFAULT_THEME, THEMES } from "./catalog";

/**
 * A value imported from a "use client" module reaches a server component as a
 * client reference, not the value. Calling one throws; comparing one just
 * quietly returns false, which is how `doc.id === DEFAULT_THEME` rendered the
 * wrong paragraph on /themes/kajo while being correct on /themes, where the
 * same component happened to run on the client.
 */
const APP = join(import.meta.dirname, "..");
const CLIENT_ONLY = "@/components/theme-provider";

const sources = (dir: string): string[] =>
  readdirSync(join(APP, dir), { withFileTypes: true }).flatMap((entry) => {
    const here = join(dir, entry.name);
    if (entry.isDirectory()) return sources(here);
    return /\.tsx?$/.test(entry.name) && !entry.name.includes(".test.")
      ? [here]
      : [];
  });

const isClientModule = (src: string): boolean =>
  /^\s*["']use client["']/.test(src);

/**
 * A client component is fine to import from a server one: that is the boundary
 * working as intended. It is plain values that break, so PascalCase names are
 * allowed through and everything else is suspect.
 */
const isComponent = (name: string): boolean => /^[A-Z]/.test(name);

/** Named members pulled from the module, minus the ones marked `type`. */
const runtimeImportsOf = (src: string): string[] => {
  const named = [
    ...src.matchAll(
      new RegExp(
        `import\\s+(type\\s+)?\\{([^}]*)\\}\\s*from\\s*["']${CLIENT_ONLY}["']`,
        "g",
      ),
    ),
  ];
  return named.flatMap(([, typeOnly, body]) =>
    typeOnly
      ? []
      : (body ?? "")
          .split(",")
          .map((part) => part.trim())
          .filter(
            (part) =>
              part.length > 0 &&
              !part.startsWith("type ") &&
              !isComponent(part),
          ),
  );
};

describe("the client boundary", () => {
  const files = [...sources("app"), ...sources("components")];

  test("finds something to check", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  test("no server module reads a runtime value out of the theme provider", () => {
    const offenders = files
      .map((file) => ({ file, src: readFileSync(join(APP, file), "utf8") }))
      .filter(({ src }) => !isClientModule(src))
      .map(({ file, src }) => ({ file, imported: runtimeImportsOf(src) }))
      .filter(({ imported }) => imported.length > 0)
      .map(({ file, imported }) => `${file} imports ${imported.join(", ")}`);

    expect(offenders).toEqual([]);
  });

  test("the default theme is a real theme, and readable from a server module", () => {
    expect(THEMES).toContain(DEFAULT_THEME);
    const catalog = readFileSync(join(APP, "lib/catalog.ts"), "utf8");
    expect(isClientModule(catalog)).toBe(false);
  });
});
