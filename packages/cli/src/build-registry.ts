import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { rewriteImports } from "./rewrite-imports.js";

export interface RegistryFile {
  path: string;
  target: string;
  content?: string;
}
export interface RegistryItem {
  name: string;
  type: "registry:ui";
  dependencies: string[];
  registryDependencies: string[];
  files: RegistryFile[];
}

const here = dirname(fileURLToPath(import.meta.url));
export const PRIMITIVES = resolve(here, "../../usva/src/primitives");
export const PATTERNS = resolve(here, "../../usva/src/patterns");
const OUT = resolve(here, "../../../registry/r");

export const NAMES = [
  "announcement",
  "avatar",
  "button",
  "badge",
  "card",
  "checkbox",
  "chip",
  "dialog",
  "drawer",
  "dropdown-menu",
  "hint-popover",
  "icon-button",
  "input",
  "label",
  "notification-badge",
  "popover",
  "progress",
  "radio",
  "select",
  "skeleton",
  "spinner",
  "stat-chip",
  "switch",
  "tabs",
  "toast",
  "tooltip",
] as const;

export const PATTERN_NAMES = [
  "bento-grid",
  "empty-state",
  "entity-card",
  "feature-carousel",
  "field-group",
  "panel",
  "section-label",
  "segmented-control",
  "stat-card",
  "step-list",
  "stripe-card",
  "toolbar",
] as const;

async function emit(dir: string, name: string): Promise<void> {
  const mod = (await import(`${dir}/${name}/registry.ts`)) as Record<
    string,
    RegistryItem
  >;
  const item = mod[`${name}Registry`] ?? Object.values(mod)[0];
  if (!item) throw new Error(`no registry export found for ${name}`);
  const files = item.files.map((f) => ({
    ...f,
    content: rewriteImports(readFileSync(`${dir}/${name}/${f.path}`, "utf8")),
  }));
  writeFileSync(
    `${OUT}/${name}.json`,
    JSON.stringify({ ...item, files }, null, 2),
  );
}

export async function buildRegistry(): Promise<void> {
  mkdirSync(OUT, { recursive: true });
  for (const name of NAMES) await emit(PRIMITIVES, name);
  for (const name of PATTERN_NAMES) await emit(PATTERNS, name);
}

if (import.meta.main) await buildRegistry();
