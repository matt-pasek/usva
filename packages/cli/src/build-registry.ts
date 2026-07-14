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
export const SULA = resolve(here, "../../usva/src/sula");
export const ATMOSPHERES = resolve(here, "../../usva/src/atmospheres");
const OUT = resolve(here, "../../../registry/r");

export const NAMES = [
  "announcement",
  "avatar",
  "button",
  "badge",
  "card",
  "checkbox",
  "chip",
  "color-field",
  "dialog",
  "drawer",
  "dropdown-menu",
  "hint-popover",
  "icon-button",
  "input",
  "label",
  "list",
  "loading-overlay",
  "log-line",
  "notification-badge",
  "popover",
  "progress",
  "radio",
  "select",
  "skeleton",
  "slider",
  "spinner",
  "stat-chip",
  "switch",
  "tabs",
  "toast",
  "toggle-chip",
  "tooltip",
] as const;

export const PATTERN_NAMES = [
  "bento-grid",
  "case-study-hero",
  "checklist-card",
  "cta-banner",
  "dashboard-grid",
  "disclosure-row",
  "empty-state",
  "entity-card",
  "feature-carousel",
  "field-group",
  "footer",
  "hero-split",
  "mockup-showcase",
  "page-header",
  "panel",
  "progress-row",
  "pullquote",
  "roadmap-timeline",
  "section-heading",
  "section-label",
  "segmented-control",
  "stat-bento",
  "stat-card",
  "step-chips",
  "step-list",
  "stripe-card",
  "toolbar",
] as const;

export const SULA_NAMES = [
  "sula-core",
  "sula-fab",
  "sula-field",
  "sula-frame",
  "sula-loader",
  "sula-motion",
  "sula-nav",
  "sula-segmented",
] as const;

export const ATMOSPHERE_NAMES = [
  "atmospheres-core",
  "hehku",
  "kajastus",
  "kuulto",
  "kynnos",
  "loimu",
  "utu",
  "vare",
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
  for (const name of SULA_NAMES) await emit(SULA, name);
  for (const name of ATMOSPHERE_NAMES) await emit(ATMOSPHERES, name);
}

if (import.meta.main) await buildRegistry();
