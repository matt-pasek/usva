#!/usr/bin/env node
import { registryUrl } from "./config.js";

const [cmd, name] = process.argv.slice(2);
if (cmd !== "add" || !name) {
  console.error("usage: usva add <name>");
  process.exit(1);
}
const url = registryUrl(name);
const res = await fetch(url);
if (!res.ok) {
  console.error(`not found: ${name}`);
  process.exit(1);
}
const item = (await res.json()) as {
  files: { target: string; content: string }[];
};
const { mkdirSync, writeFileSync } = await import("node:fs");
const { dirname, relative, resolve } = await import("node:path");

const cwd = process.cwd();
const contained = (target: string): string => {
  const abs = resolve(cwd, target);
  const rel = relative(cwd, abs);
  if (rel.startsWith("..") || resolve(rel) === abs) {
    console.error(`refusing to write outside the project: ${target}`);
    process.exit(1);
  }
  return abs;
};

for (const f of item.files) {
  const abs = contained(f.target);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, f.content);
}
console.log(`added ${name} (${item.files.length} file(s))`);
