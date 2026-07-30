import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROLE_NAMES } from "@usva-ui/tokens";
import { describe, expect, test } from "vitest";
import { agentSkill, importPath } from "./agent-skill";
import { CATALOG, counts, DARK_ONLY, SUB_EXPORTS, THEMES } from "./catalog";
import { PACKAGE_NAME, TOKENS_PACKAGE } from "./site";

const body = agentSkill();

const packageExports = (): Set<string> => {
  const manifest = resolve(process.cwd(), "../../packages/usva/package.json");
  const parsed = JSON.parse(readFileSync(manifest, "utf8")) as {
    exports: Record<string, unknown>;
  };
  return new Set(Object.keys(parsed.exports));
};

const manifestName = (dir: string): string => {
  const manifest = resolve(process.cwd(), `../../packages/${dir}/package.json`);
  return (JSON.parse(readFileSync(manifest, "utf8")) as { name: string }).name;
};

describe("agent skill", () => {
  test("names both packages exactly as their manifests do", () => {
    expect(PACKAGE_NAME).toBe(manifestName("usva"));
    expect(TOKENS_PACKAGE).toBe(manifestName("tokens"));
    expect(body).toContain(`bun add ${PACKAGE_NAME} ${TOKENS_PACKAGE}`);
    expect(body).not.toContain(`${PACKAGE_NAME}-tokens`);
  });

  /**
   * The load-bearing test. The layer-to-directory mapping in agent-skill.ts is
   * the one thing that can emit an import path which looks right and resolves
   * to nothing, and it would do so in every project that installed the skill.
   */
  test("every emitted import path is a real subpath export", () => {
    const exports = packageExports();
    for (const entry of CATALOG) {
      const path = importPath(entry);
      expect(path.startsWith(`${PACKAGE_NAME}/`)).toBe(true);
      const key = `.${path.slice(PACKAGE_NAME.length)}`;
      expect(exports, `${entry.name} -> ${path}`).toContain(key);
    }
  });

  test("covers every component subpath export, none left behind", () => {
    const emitted = new Set(CATALOG.map((entry) => importPath(entry)));
    const componentExports = [...packageExports()].filter(
      (key) => ![".", "./cn", "./package.json"].includes(key),
    );
    for (const key of componentExports) {
      expect(emitted).toContain(`${PACKAGE_NAME}${key.slice(1)}`);
    }
    expect(emitted.size).toBe(componentExports.length);
  });

  test("opens with parseable frontmatter carrying name and description", () => {
    expect(body.startsWith("---\n")).toBe(true);
    const end = body.indexOf("\n---", 4);
    expect(end).toBeGreaterThan(0);
    const front = body.slice(4, end);
    expect(front).toMatch(/^name: usva$/m);
    expect(front).toMatch(/^description: >$/m);
    expect(front).toMatch(/^compatibility: >$/m);
  });

  test("names every component exactly once in the index", () => {
    for (const entry of CATALOG) {
      const occurrences = body.split(`- ${entry.name} · `).length - 1;
      expect(occurrences, entry.name).toBe(1);
    }
  });

  test("states the real component count", () => {
    expect(body).toContain(`## the index (${counts.total})`);
    expect(body).toContain(
      `${counts.total} components, ${counts.themes} themes`,
    );
  });

  test("lists every sub-export under its parent", () => {
    for (const sub of SUB_EXPORTS) {
      expect(body).toContain(`- ${sub.name} · ships with`);
    }
  });

  test("carries the sula prohibitions verbatim from the catalog", () => {
    const sula = CATALOG.filter((entry) => entry.layer === "sula");
    const rules = sula[0]?.rules ?? [];
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) expect(body).toContain(rule);
  });

  test("never shows a raw hex", () => {
    expect(body).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });

  test("names every role token and every theme", () => {
    for (const role of ROLE_NAMES) expect(body).toContain(role);
    for (const theme of THEMES) expect(body).toContain(theme);
  });

  test("names exactly the dark-only atmospheres", () => {
    expect(body).toContain(`${DARK_ONLY.length} atmospheres are dark-only`);
    for (const name of DARK_ONLY) expect(body).toContain(name);
  });

  test("tells the agent to avoid the barrel, and never demonstrates it", () => {
    expect(body).toContain("import from the subpath, never the barrel");
    expect(body).not.toMatch(
      new RegExp(`from "${PACKAGE_NAME.replace("/", "\\/")}"`),
    );
  });

  test("keeps the house voice: no em dashes", () => {
    expect(body).not.toContain("—");
  });
});
