#!/usr/bin/env node
export {};
const [cmd, name] = process.argv.slice(2);
if (cmd !== "add" || !name) { console.error("usage: usva add <name>"); process.exit(1); }
const url = `https://usva.dev/r/${name}.json`;
const res = await fetch(url);
if (!res.ok) { console.error(`not found: ${name}`); process.exit(1); }
const item = await res.json() as { files: { target: string; content: string }[] };
const { mkdirSync, writeFileSync } = await import("node:fs");
const { dirname } = await import("node:path");
for (const f of item.files) { mkdirSync(dirname(f.target), { recursive: true }); writeFileSync(f.target, f.content); }
console.log(`added ${name} (${item.files.length} file(s))`);
