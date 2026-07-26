import { ROLE_NAMES } from "@matt-pasek/usva-tokens";
import {
  byLayer,
  type CatalogEntry,
  counts,
  DARK_ONLY,
  INTENSITY_BY_LAYER,
  LAYER_LABEL,
  type Layer,
  subExportsOf,
  THEMES,
} from "@/lib/catalog";
import { PACKAGE_NAME, registryUrl, SITE_ORIGIN } from "@/lib/site";

const LAYERS: Layer[] = [
  "primitive",
  "pattern",
  "motion",
  "sula",
  "atmosphere",
];

/**
 * The layer's directory in the package export map. This is the one mapping in
 * this file that can silently lie: a wrong directory emits an import path that
 * looks right and resolves to nothing, in every project that installs the
 * skill. `agent-skill.test.ts` asserts each emitted path against the real
 * export map for exactly that reason.
 */
const LAYER_DIR: Record<Layer, string> = {
  primitive: "primitives",
  pattern: "patterns",
  motion: "motion",
  sula: "sula",
  atmosphere: "atmospheres",
};

export const importPath = (
  entry: Pick<CatalogEntry, "layer" | "slug">,
): string => `${PACKAGE_NAME}/${LAYER_DIR[entry.layer]}/${entry.slug}`;

const TOKENS_PACKAGE = `${PACKAGE_NAME}-tokens`;

const frontmatter = (): string =>
  [
    "---",
    "name: usva",
    "description: >",
    "  Use when building, restyling, or reviewing any UI in a project that has",
    `  ${PACKAGE_NAME} installed or has copied components from ${SITE_ORIGIN}/r.`,
    "  Covers choosing a component, composing layers, theming by role token, and",
    "  the silent failure modes specific to this library. Also use when the user",
    "  mentions usva, kajo, sisu, savi, sula, or an atmosphere by name.",
    "compatibility: >",
    "  React 18 or 19. Tailwind v4, since the tokens ship as an @theme preset and",
    "  use v4 utility names. Works in the Next.js App Router; most primitives are",
    "  server components, so the client boundary matters.",
    "license: MIT with Commons Clause",
    "metadata:",
    "  author: matt-pasek",
    '  version: "1"',
    "---",
  ].join("\n");

const goldenRules = (): string =>
  [
    "## golden rules",
    "",
    "read these first. if you read nothing else in this file, these are the seven",
    "that make the difference between using usva and merely importing from it.",
    "",
    `1. **import from the subpath, never the barrel.** \`${PACKAGE_NAME}/primitives/button\`,`,
    `   not \`${PACKAGE_NAME}\`. this is not a style preference. the barrel re-exports every`,
    "   atmosphere, all of sula and all of motion, and it costs 170 KiB of `motion` that",
    "   tree-shaking does not give back.",
    "2. **intensity is a property of the layer, not of your taste.** you do not get to decide",
    "   that a component should be louder here.",
    "3. **one sula element per region, at most.** two in one region fight and read as noise.",
    "4. **never a raw hex.** every colour is a role token.",
    "5. **`faint` is decorative.** it must never be the only thing carrying meaning.",
    "6. **never wrap a live atmosphere or sula canvas in an element that animates**",
    "   **`transform` or `clip-path`.** chrome blanks the canvas and nothing errors.",
    "7. **retheme by moving role tokens.** never fork a component to change a colour.",
  ].join("\n");

const whatItIs = (): string =>
  [
    "## what usva is",
    "",
    "an authored React design system: beauty that stays usable. it ships two ways from one",
    `source, and you pick per component. ${counts.total} components, ${counts.themes} themes.`,
    "",
    "| how | command | you get |",
    "| --- | --- | --- |",
    `| package | \`bun add ${PACKAGE_NAME} ${TOKENS_PACKAGE}\` | an import; updates arrive with the package |`,
    `| registry | \`npx shadcn add ${registryUrl("button")}\` | the source, copied in, yours to fork |`,
    "",
    "the registry is generated from the same source that builds the package, so the two",
    "never drift. neither path is the fallback.",
  ].join("\n");

const fastestPath = (): string =>
  [
    "## the fastest correct path",
    "",
    "```bash",
    `bun add ${PACKAGE_NAME} ${TOKENS_PACKAGE}`,
    "```",
    "",
    "```css",
    "/* globals.css */",
    '@import "tailwindcss";',
    `@import "${TOKENS_PACKAGE}/theme.css";`,
    `@import "${TOKENS_PACKAGE}/themes/kajo.css";`,
    "```",
    "",
    "```tsx",
    `import { Button } from "${PACKAGE_NAME}/primitives/button";`,
    "",
    "export function Save() {",
    '  return <Button variant="primary">save</Button>;',
    "}",
    "```",
    "",
    "that is a correct usva install. everything below is about not getting the next part wrong.",
  ].join("\n");

const theOneRule = (): string =>
  [
    "## the one rule",
    "",
    "intensity is a property of the layer. five layers, five intensities, and the layer you",
    "reach into decides how loud the result is allowed to be.",
    "",
    "| layer | intensity | import root |",
    "| --- | --- | --- |",
    ...LAYERS.map(
      (layer) =>
        `| ${LAYER_LABEL[layer]} | ${INTENSITY_BY_LAYER[layer]} | \`${PACKAGE_NAME}/${LAYER_DIR[layer]}/<slug>\` |`,
    ),
    "",
    "core recedes so the content is the thing you see. patterns structure it. motion guides",
    "the eye. sula asserts, loudly and on purpose. an atmosphere is not a component you place,",
    "it is the room the rest of it stands in.",
    "",
    "**a region** is a bounded area competing for a single attention focus. this is the unit the",
    "sula rule counts. a `SulaFrame` at the viewport edge is ambient and at the boundary; a",
    "`SulaNav` at the top is a focal control surface. they are different regions, they do not",
    "compete, and they ship together. two fluid fields inside one card are one region and they",
    "fight.",
  ].join("\n");

const workflow = (): string =>
  [
    "## the workflow",
    "",
    "1. **name the region and what it is for.** a hero, a settings form, a table someone works",
    "   in all day. this answers the intensity question before you pick anything.",
    "2. **pick the layer that region deserves, then the component inside it.** the index at the",
    "   bottom of this file is grouped by layer for this step.",
    "3. **import from the subpath.** golden rule 1.",
    "4. **colour it with role tokens.** never a hex, never a raw tailwind palette colour.",
    "5. **verify** against the never-list and the gotchas table. most usva mistakes are silent,",
    "   so a green build and a screenshot that looks fine are not evidence.",
  ].join("\n");

const never = (): string =>
  [
    "## never",
    "",
    `- two sula elements in one region. \`SulaFrame\` plus \`SulaNav\` is legal because those are`,
    "  two regions; two fields in one card is not.",
    "- a sula element inside dense, task-bound UI. not a table, not a form, not a dashboard",
    "  someone is working in.",
    "- a raw hex, or a tailwind palette colour like `bg-slate-800`. role tokens only.",
    "- `faint` as the only thing carrying meaning. labels, provenance, IPA, anything readable",
    "  is `muted` at minimum, which clears 4.5:1.",
    "- forking a component to change a colour. move the token.",
    "- the barrel import.",
    "- `vw` units for anything that might get nested. see the gotchas.",
    "- an atmosphere used as decoration on a busy page. it is the room, not an object in it.",
  ].join("\n");

const themesAndTokens = (): string =>
  [
    "## themes and tokens",
    "",
    `${ROLE_NAMES.length} semantic roles, and no component reaches outside them:`,
    "",
    "```",
    ROLE_NAMES.join(" · "),
    "```",
    "",
    "`ink` and `muted` clear 4.5:1 on every surface role and carry information. `faint` is",
    "decorative and never load-bearing. as tailwind utilities these are `bg-surface`,",
    "`text-ink`, `border-border` and so on, and as raw variables `var(--usva-surface)`.",
    "",
    `${counts.themes} themes: ${THEMES.join(", ")}. kajo is declared at \`:root\` as well as`,
    '`[data-theme="kajo"]`, so it is what you get by default.',
    "",
    "**subtree theming works.** `theme.css` carries a `[data-theme]` block that remaps every",
    "`--color-*` role from its `--usva-*` source, so this genuinely rethemes the subtree and",
    "`bg-surface` inside it resolves to sisu's surface:",
    "",
    "```tsx",
    '<div data-theme="sisu">',
    "  <Card>…</Card>",
    "</div>",
    "```",
    "",
    "worth stating because it is the kind of thing that is broken in most token systems.",
    "",
    `**${DARK_ONLY.length} atmospheres are dark-only:** ${DARK_ONLY.join(", ")}. on a light theme they`,
    "render wrong. they export `hiddenOnGround` from `atmospheres-core` for exactly this case,",
    "so use that or pick a different atmosphere.",
    "",
    "`prefers-reduced-motion` is handled for you: the GL canvases check it centrally and the",
    "transition utilities in `theme.css` self-guard. you do not need to add a fallback, and you",
    "should not remove theirs.",
  ].join("\n");

const gotchas = (): string =>
  [
    "## gotchas",
    "",
    "every row here is a bug that already happened in this codebase. they share one property:",
    "**they fail quietly.** the build passes, the types pass, and the screenshot often looks",
    "fine. none of them is guessable from a component list, which is why this file exists.",
    "",
    "| trap | why it bites | what to do instead |",
    "| --- | --- | --- |",
    "| the barrel import | the root export pulls every atmosphere, all of sula and all of motion. tree-shaking does not recover it | subpath import, always |",
    '| client boundary | a value imported from a `"use client"` module reaches a server component as a client reference, so a comparison against it silently returns `false`, then behaves correctly once hydrated | never compare a server-side value against an export from a client module |',
    "| animated ancestor | chrome blanks a live GL canvas while an ancestor animates `clip-path` or `transform`. no error, just an empty canvas | reveal it with a sibling cover, never a wrapping animation |",
    "| `whileInView` never fires | `Reveal` uses `viewport={{ once: true }}`. a child parked outside its own `overflow-hidden` mask never intersects, so it stays invisible forever | observe the mask, animate the child |",
    "| `rim-light` on a circle | it is a straight bar across the bounding box, so it cuts a visible seam through anything `rounded-full` | `shadow-raised` |",
    "| scaling a `SulaField` | the simulation runs in field units. a css `transform: scale` makes the pool spill outside its bounds | size the container, never scale the component |",
    "| `vw` sizing | reads correctly at full width and breaks the moment the component is nested in a narrower column | `cqi` inside a `@container` |",
    "| dark-only atmospheres | four of them render wrong on a light theme | `hiddenOnGround`, or choose another |",
  ].join("\n");

const dependencies = (): string =>
  [
    "## what each choice costs",
    "",
    "this is why golden rule 1 is a rule and not a preference. the subpath keeps these scoped",
    "to the components that actually need them:",
    "",
    "| package | pulled in by |",
    "| --- | --- |",
    "| `motion` | `Button`, `FeatureCarousel`, all six sula components, `Reveal`, `PageTransition`, `atmospheres-core` |",
    "| `ogl` | `sula-core`, the atmosphere renderers |",
    "| `@base-ui/react` | `Tabs`, `Drawer`, `Tooltip`, `Radio`, `HintPopover`, `Toast` |",
    "| `@dnd-kit/core` | `DashboardGrid` |",
    "| `highlight.js` | `CodeSnippet` |",
    "",
    "`Button` importing `motion` is the one worth remembering. reach for the most innocuous",
    "primitive in the library through the barrel and you have paid for the whole animation",
    "runtime.",
    "",
    "`cn` has its own entry, `" +
      PACKAGE_NAME +
      "/cn`, so it is not trapped in a client chunk.",
  ].join("\n");

const serverAndClient = (): string =>
  [
    "## server and client",
    "",
    "usva components are **not** uniformly client components, which is unusual and worth",
    'knowing: a little over a third of the primitives carry `"use client"`, and most do not.',
    "so most primitives render on the server, and you should not reflexively push a boundary",
    "down to use one.",
    "",
    "all of motion, and every sula and atmosphere component that owns a canvas, is a client",
    "component. in the Next.js App Router you can import any of them from a server component",
    'and the framework handles the boundary. never delete a `"use client"` directive.',
  ].join("\n");

const componentLine = (entry: CatalogEntry): string => {
  const base = `${entry.name} · ${entry.intensity} · \`${importPath(entry)}\``;
  const summary = entry.summary.replace(/\s+/g, " ").trim();
  return `- ${base}\n  ${summary}`;
};

const subExportLines = (entry: CatalogEntry): string[] =>
  subExportsOf(entry.slug).map(
    (sub) => `  - ${sub.name} · ships with ${entry.name}, same import path`,
  );

const layerIndex = (layer: Layer): string => {
  const entries = byLayer(layer);
  const rules =
    layer === "sula"
      ? [
          "",
          "the sula rules apply to every entry below, not to some of them:",
          "",
          ...(entries[0]?.rules ?? []).map((rule) => `> ! ${rule}`),
          "",
        ]
      : [""];
  return [
    `### ${LAYER_LABEL[layer]} (${entries.length}) · ${INTENSITY_BY_LAYER[layer]}`,
    ...rules,
    ...entries.flatMap((entry) => [
      componentLine(entry),
      ...subExportLines(entry),
    ]),
  ].join("\n");
};

const index = (): string =>
  [
    `## the index (${counts.total})`,
    "",
    "grouped by layer, because the layer is the decision. the import path is complete as",
    "written: append nothing, and the named export matches the component name.",
    "",
    ...LAYERS.map(layerIndex),
  ].join("\n\n");

const negativeScope = (): string =>
  [
    "## when not to reach for usva",
    "",
    "- when the host app already owns the component. usva is not a reason to replace a working",
    "  form field.",
    "- when the region wants a plain surface. `bg-surface` and a border is a legitimate answer,",
    "  and it is usually the right one. an atmosphere is not an upgrade.",
    "- for generic shadcn/ui primitives that usva does not ship. check the index first.",
    "- to add visual interest to a page that is already busy. the fix there is subtraction.",
  ].join("\n");

const whereNext = (): string =>
  [
    "## where to look next",
    "",
    `- \`${SITE_ORIGIN}/docs/components/<slug>\`: one page per component, props and all.`,
    `- \`${SITE_ORIGIN}/llms.txt\`: the same index with summaries, as plain text.`,
    `- \`${SITE_ORIGIN}/design-language\`: the foundations, before the components.`,
    `- \`${SITE_ORIGIN}/design-language/tokens.json\`: resolved token values as DTCG json.`,
    `- \`${SITE_ORIGIN}/studio\`: tune an atmosphere and copy its params.`,
  ].join("\n");

export const agentSkill = (): string =>
  [
    frontmatter(),
    "",
    "# usva.",
    "",
    "a React design system with a design language attached. this file is the language: the",
    "rules about what to reach for, what to leave alone, and the handful of ways this library",
    "fails silently if you guess.",
    "",
    goldenRules(),
    "",
    whatItIs(),
    "",
    fastestPath(),
    "",
    theOneRule(),
    "",
    workflow(),
    "",
    never(),
    "",
    themesAndTokens(),
    "",
    gotchas(),
    "",
    dependencies(),
    "",
    serverAndClient(),
    "",
    negativeScope(),
    "",
    index(),
    "",
    whereNext(),
    "",
  ].join("\n");
