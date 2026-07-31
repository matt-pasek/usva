#!/usr/bin/env node
/**
 * Packs both public packages, installs the tarballs into a throwaway consumer,
 * and imports every public export.
 *
 * `bun run build` proves the monorepo compiles; it says nothing about what npm
 * actually ships. The two answers were completely different before the `files`
 * whitelists landed: the tarball carried 465 source files and zero `dist`.
 */
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(import.meta.url), "../..");

/**
 * Only the JS/TS entrypoints. The css and json exports are assets, and attw
 * reads a non-resolving type declaration as a failure for every one. Read from
 * the manifest so the ~76 component subpaths are all covered without a second
 * list here to fall out of date.
 */
const jsEntrypoints = (dir) =>
  Object.keys(
    JSON.parse(readFileSync(join(ROOT, dir, "package.json"), "utf8")).exports,
  )
    .filter((key) => !/\.(css|json)$/.test(key))
    .map((key) => (key === "." ? "." : key.replace(/^\.\//, "")));

const tarballName = (dir) => {
  const { name, version } = JSON.parse(
    readFileSync(join(ROOT, dir, "package.json"), "utf8"),
  );
  return `${name.replace("@", "").replace("/", "-")}-${version}.tgz`;
};

const PACKAGES = [
  {
    dir: "packages/usva",
    tarball: tarballName("packages/usva"),
    entrypoints: jsEntrypoints("packages/usva"),
  },
  {
    dir: "packages/tokens",
    tarball: tarballName("packages/tokens"),
    entrypoints: jsEntrypoints("packages/tokens"),
  },
];

// The package is ESM-only on purpose, so "a CJS consumer must use dynamic
// import" is the designed behaviour rather than a finding.
const ATTW_IGNORE = "cjs-resolves-to-esm";

const run = (cmd, args, cwd) =>
  execFileSync(cmd, args, { cwd, stdio: "inherit", encoding: "utf8" });

const CHECK = `import { createRequire } from "node:module";
import { existsSync } from "node:fs";
const require = createRequire(import.meta.url);

let bad = 0;
const fail = (m) => { console.log("FAIL", m); bad++; };

const usva = await import("@usva-ui/react");
const names = Object.keys(usva);
console.log("root exports:", names.length);
if (names.length < 100) fail(\`root barrel only exported \${names.length} names\`);
for (const n of names) if (usva[n] === undefined) fail(\`root export \${n} is undefined\`);
for (const n of ["Button", "Card", "CodeSnippet", "registerCodeLanguage", "Reveal", "cn"])
  if (!(n in usva)) fail(\`expected root export missing: \${n}\`);

const { cn } = await import("@usva-ui/react/cn");
if (cn("a", "b") !== "a b") fail("cn subpath broken");

if (!Object.keys(await import("@usva-ui/tokens")).length) fail("tokens root empty");

// A component subpath is the lean way in, so prove one resolves and carries the
// component rather than trusting the exports map to be more than a promise.
const { Badge } = await import("@usva-ui/react/primitives/badge");
if (typeof Badge === "undefined") fail("primitives/badge subpath broken");

for (const sub of [
  "@usva-ui/tokens/theme.css",
  "@usva-ui/tokens/themes/kajo.css",
  "@usva-ui/tokens/themes/sisu.css",
  "@usva-ui/tokens/themes/savi.css",
  "@usva-ui/tokens/roles-safelist.css",
  "@usva-ui/tokens/tokens.dtcg.json",
  "@usva-ui/tokens/tokens.studio.json",
]) {
  try {
    if (!existsSync(require.resolve(sub))) fail(\`\${sub} resolves to a missing file\`);
  } catch (e) { fail(\`\${sub} does not resolve: \${e.code ?? e.message}\`); }
}

const root = new URL("./node_modules/@usva-ui/react/", import.meta.url);
for (const t of ["dist/index.d.ts", "dist/cn.d.ts"])
  if (!existsSync(new URL(t, root))) fail(\`missing types: \${t}\`);

console.log(bad ? \`\\n\${bad} failure(s)\` : "\\nall exports resolve");
process.exit(bad ? 1 : 0);
`;

const REACT_18_APP = `import * as React from "react";
import * as usva from "@usva-ui/react";
import { Button, CodeSnippet } from "@usva-ui/react";
import { cn } from "@usva-ui/react/cn";

// naming the namespace keeps the whole declaration graph in the program
export const surface: keyof typeof usva = "Button";

export function App() {
  const ref = React.useRef<HTMLButtonElement>(null);
  return (
    <div className={cn("a", "b")}>
      <Button ref={ref} variant="solid" size="md" onClick={() => undefined}>
        Save
      </Button>
      <Button status="success" successText="Saved">
        Save
      </Button>
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>
      <CodeSnippet code="const a = 1;" language="ts" />
    </div>
  );
}
`;

const work = mkdtempSync(join(tmpdir(), "usva-pkg-"));
try {
  for (const { dir } of PACKAGES) {
    console.log(`\n=== pack ${dir} ===`);
    run("npm", ["pack", "--pack-destination", work], join(ROOT, dir));
    console.log(`\n=== publint ${dir} ===`);
    run("bunx", ["publint"], join(ROOT, dir));
  }

  // `npm publish` ships the manifest byte-for-byte; unlike bun and pnpm it does
  // not rewrite `workspace:` ranges. 1.0.0 and 1.0.1 both went out carrying
  // `"@usva-ui/tokens": "workspace:*"`, which every consumer install rejects
  // with EUNSUPPORTEDPROTOCOL. Read it back off the tarball, not the source
  // tree, so this asserts against the bytes that actually reach the registry.
  console.log("\n=== no workspace: ranges in the packed manifests ===");
  for (const { tarball } of PACKAGES) {
    const manifest = JSON.parse(
      execFileSync("tar", ["-xOf", tarball, "package/package.json"], {
        cwd: work,
        encoding: "utf8",
      }),
    );
    for (const field of ["dependencies", "peerDependencies", "optionalDependencies"]) {
      for (const [dep, range] of Object.entries(manifest[field] ?? {})) {
        if (String(range).startsWith("workspace:")) {
          throw new Error(
            `${tarball}: ${field}.${dep} is "${range}". npm publishes this verbatim and the install fails. Pin a real range.`,
          );
        }
      }
    }
    console.log(`${tarball}: clean`);
  }

  for (const { tarball, entrypoints } of PACKAGES) {
    console.log(`\n=== attw ${tarball} ===`);
    run(
      "bunx",
      [
        "@arethetypeswrong/cli",
        "--pack",
        tarball,
        "--ignore-rules",
        ATTW_IGNORE,
        "--entrypoints",
        ...entrypoints,
      ],
      work,
    );
  }

  console.log("\n=== install tarballs into a clean consumer ===");
  const consumer = join(work, "consumer");
  mkdirSync(consumer);
  // The override forces the react tarball onto the tokens tarball built in this
  // same run, so the fixture proves the two local builds agree. Without it the
  // pinned range would resolve tokens from the registry and the freshly packed
  // one would never be exercised.
  const tokensTarball = `file:${join(work, PACKAGES[1].tarball)}`;
  writeFileSync(
    join(consumer, "package.json"),
    `${JSON.stringify(
      {
        name: "usva-tarball-fixture",
        private: true,
        type: "module",
        dependencies: {
          "@usva-ui/react": `file:${join(work, PACKAGES[0].tarball)}`,
          "@usva-ui/tokens": tokensTarball,
          react: "^19",
          "react-dom": "^19",
        },
        overrides: { "@usva-ui/tokens": tokensTarball },
      },
      null,
      2,
    )}\n`,
  );
  run("bun", ["install"], consumer);

  writeFileSync(join(consumer, "check.mjs"), CHECK);
  console.log("\n=== import every public export ===");
  run("node", ["check.mjs"], consumer);

  // CI's react-18 leg swaps only the runtime; the repo still develops against
  // React 19 types, so nothing yet proves the shipped .d.ts compiles for an
  // 18 consumer. Install the matching 18 type packages and compile against them.
  console.log("\n=== typecheck a React 18 consumer ===");
  const ts18 = join(work, "react18");
  mkdirSync(ts18);
  writeFileSync(
    join(ts18, "package.json"),
    `${JSON.stringify(
      {
        name: "usva-react18-fixture",
        private: true,
        dependencies: {
          "@usva-ui/react": `file:${join(work, PACKAGES[0].tarball)}`,
          "@usva-ui/tokens": tokensTarball,
          react: "^18",
          "react-dom": "^18",
        },
        devDependencies: {
          "@types/react": "^18",
          "@types/react-dom": "^18",
          typescript: "^5.7.2",
        },
        overrides: { "@usva-ui/tokens": tokensTarball },
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(
    join(ts18, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          strict: true,
          noEmit: true,
          jsx: "react-jsx",
          module: "esnext",
          moduleResolution: "bundler",
          target: "es2022",
          lib: ["es2022", "dom", "dom.iterable"],
          skipLibCheck: false,
        },
        include: ["app.tsx"],
      },
      null,
      2,
    )}\n`,
  );
  writeFileSync(join(ts18, "app.tsx"), REACT_18_APP);
  run("bun", ["install"], ts18);
  run("bunx", ["tsc", "--noEmit", "-p", "."], ts18);

  console.log("\npackages are shippable");
} finally {
  rmSync(work, { recursive: true, force: true });
}
