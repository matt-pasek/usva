import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG = join(HERE, "..");
const DIST = join(PKG, "dist");
const TYPES = join(DIST, "_types");

const CANDIDATES = ["/index.ts", "/index.tsx", ".ts", ".tsx"];

const pkg = JSON.parse(readFileSync(join(PKG, "package.json"), "utf8"));

const subpaths = Object.entries(pkg.exports).flatMap(([name, entry]) =>
  typeof entry === "string" || !entry.types ? [] : [[name, entry.types]],
);

execFileSync("bunx", ["tsc", "-p", "tsconfig.build.json"], {
  cwd: PKG,
  stdio: "inherit",
});

function sourceOf(name) {
  const base = name === "." ? "src/index" : `src/${name.slice(2)}`;
  for (const ext of CANDIDATES) {
    if (existsSync(join(PKG, base + ext))) return base + ext;
  }
  throw new Error(`no source for export "${name}"`);
}

let written = 0;

for (const [name, target] of subpaths) {
  const source = sourceOf(name);
  const mirrored = join(
    TYPES,
    `${source.replace(/^src\//, "").replace(/\.tsx?$/, "")}.d.ts`,
  );

  if (!existsSync(mirrored)) {
    throw new Error(`tsc emitted no declaration for ${source}`);
  }

  const shim = join(PKG, target);
  const to = relative(dirname(shim), mirrored)
    .replace(/\.d\.ts$/, ".js")
    .replace(/^(?!\.)/, "./");

  const hasDefault = /^export default |^export \{[^}]*\bdefault\b/m.test(
    readFileSync(join(PKG, source), "utf8"),
  );

  mkdirSync(dirname(shim), { recursive: true });
  writeFileSync(
    shim,
    `export * from "${to}";\n${hasDefault ? `export { default } from "${to}";\n` : ""}`,
  );
  written += 1;
}

console.log(`types: 1 pass, ${written} entry declarations`);
