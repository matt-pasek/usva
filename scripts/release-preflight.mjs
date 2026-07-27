import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const git = (args) => execSync(`git ${args}`, { cwd: root }).toString().trim();

const fail = (message) => {
  console.error(`release blocked: ${message}`);
  process.exit(1);
};

if (git("status --porcelain") !== "")
  fail("the working tree is dirty. publish what is committed, not what is open in an editor.");

const branch = git("rev-parse --abbrev-ref HEAD");
if (branch !== "main" && process.env.USVA_RELEASE_ANY_BRANCH !== "1")
  fail(`on ${branch}, not main. set USVA_RELEASE_ANY_BRANCH=1 if that is deliberate.`);

const pending = readdirSync(resolve(root, ".changeset")).filter(
  (f) => f.endsWith(".md") && f !== "README.md",
);
if (pending.length > 0)
  fail(
    `${pending.length} unconsumed changeset(s). run \`bunx changeset version\` first, or these versions ship unbumped.`,
  );

console.log("preflight ok");
