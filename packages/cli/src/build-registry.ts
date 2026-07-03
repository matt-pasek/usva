import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

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
const PRIMITIVES = resolve(here, "../../usva/src/primitives");
const OUT = resolve(here, "../../../registry/r");
export const NAMES = [
  "button",
  "badge",
  "card",
  "checkbox",
  "dialog",
  "input",
  "radio",
  "select",
  "switch",
  "tooltip",
] as const;

export async function buildRegistry(): Promise<void> {
  mkdirSync(OUT, { recursive: true });
  for (const name of NAMES) {
    const mod = (await import(`${PRIMITIVES}/${name}/registry.ts`)) as Record<
      string,
      RegistryItem
    >;
    const item = mod[`${name}Registry`] ?? Object.values(mod)[0];
    if (!item) throw new Error(`no registry export found for ${name}`);
    const files = item.files.map((f) => ({
      ...f,
      content: readFileSync(`${PRIMITIVES}/${name}/${f.path}`, "utf8"),
    }));
    writeFileSync(
      `${OUT}/${name}.json`,
      JSON.stringify({ ...item, files }, null, 2),
    );
  }
}

if (import.meta.main) await buildRegistry();
