import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
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
export const MOTION = resolve(here, "../../usva/src/motion");
export const ATMOSPHERES = resolve(here, "../../usva/src/atmospheres");
const OUT = resolve(here, "../../../registry/r");

/**
 * A component ships through the registry by having a `registry.ts` next to its
 * source. Nothing lists the names, so adding a component cannot forget to.
 */
export const discover = (root: string): string[] =>
  readdirSync(root, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        existsSync(join(root, entry.name, "registry.ts")),
    )
    .map((entry) => entry.name)
    .sort();

export const NAMES = discover(PRIMITIVES);
export const PATTERN_NAMES = discover(PATTERNS);
export const SULA_NAMES = discover(SULA);
export const MOTION_NAMES = discover(MOTION);
export const ATMOSPHERE_NAMES = discover(ATMOSPHERES);

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
  for (const name of MOTION_NAMES) await emit(MOTION, name);
  for (const name of ATMOSPHERE_NAMES) await emit(ATMOSPHERES, name);
}

if (import.meta.main) await buildRegistry();
