import { ROLE_NAMES } from "@matt-pasek/usva-tokens";
import {
  byLayer,
  type CatalogEntry,
  counts,
  INTENSITY_BY_LAYER,
  LAYER_LABEL,
  type Layer,
  subExportsOf,
  THEMES,
} from "@/lib/catalog";
import { PACKAGE_NAME, registryUrl, SITE_ORIGIN } from "@/lib/site";

export const dynamic = "force-static";

const LAYERS: Layer[] = [
  "primitive",
  "pattern",
  "motion",
  "sula",
  "atmosphere",
];

const docsUrl = (slug: string): string =>
  `${SITE_ORIGIN}/docs/components/${slug}`;

const componentBullet = (entry: CatalogEntry): string => {
  const registry = `registry: \`npx shadcn add ${registryUrl(entry.slug)}\`.`;
  const origin = entry.provenance.length
    ? `from ${entry.provenance.join(", ")}.`
    : "authored in usva.";
  const meta = `${registry} layer: ${LAYER_LABEL[entry.layer]}. intensity: ${entry.intensity}. ${origin}`;
  const bullet = `- [${entry.slug} (${entry.name})](${docsUrl(entry.slug)}): ${entry.summary} ${meta}`;
  const rules = entry.rules?.length
    ? entry.rules.map((rule) => `\n    ! ${rule}`).join("")
    : "";
  return `${bullet}${rules}`;
};

const layerSection = (layer: Layer): string => {
  const entries = byLayer(layer);
  const rows = entries.flatMap((entry) => {
    const subs = subExportsOf(entry.slug).map(
      (sub) =>
        `- [${sub.slug} (${sub.name})](${docsUrl(sub.slug)}): ships with ${entry.name}. layer: ${LAYER_LABEL[layer]}. intensity: ${INTENSITY_BY_LAYER[layer]}.`,
    );
    return [componentBullet(entry), ...subs];
  });
  return [
    `## ${LAYER_LABEL[layer]} (${entries.length}) · intensity: ${INTENSITY_BY_LAYER[layer]}`,
    "",
    ...rows,
  ].join("\n");
};

const body = (): string =>
  [
    "# usva.",
    "",
    "> An authored React design system: beauty that stays usable. Dual-distributed as an npm",
    `> package (${PACKAGE_NAME}) and as a shadcn-compatible registry you can copy the source from.`,
    `> ${counts.total} components, ${counts.themes} themes.`,
    "",
    "## Install",
    "",
    `- Package: bun add ${PACKAGE_NAME}`,
    `- Registry: npx shadcn add ${registryUrl("button")}`,
    `- Tokens: bun add ${PACKAGE_NAME}-tokens`,
    "",
    "## The one rule",
    "",
    "Intensity is a property of the layer, not of the item.",
    "Core primitives recede. Patterns structure. Motion guides. Sula asserts. Atmospheres are the room.",
    "At most one sula element per region, where a region is a bounded area competing for a",
    "single attention focus. Never put a sula element inside dense, task-bound UI.",
    "",
    "## Colour",
    "",
    `${ROLE_NAMES.length} semantic role tokens, never a raw hex. \`ink\` and \`muted\` clear 4.5:1 on every surface`,
    "role and carry information. `faint` is decorative and must never be the only thing",
    `carrying meaning. Full table: ${SITE_ORIGIN}/design-language/color`,
    "",
    "## Themes",
    "",
    ...THEMES.map((theme) => `- ${theme}: ${SITE_ORIGIN}/themes/${theme}`),
    "",
    ...LAYERS.map(layerSection),
    "",
    "## Pages",
    "",
    `- [docs](${SITE_ORIGIN}/docs): every component, one page each.`,
    `- [get started](${SITE_ORIGIN}/docs/get-started): install, theme, and the agent brief.`,
    `- [installation](${SITE_ORIGIN}/docs/get-started/installation): add the package or copy from the registry.`,
    `- [theming](${SITE_ORIGIN}/docs/get-started/theming): pick a theme and override the tokens.`,
    `- [for agents](${SITE_ORIGIN}/docs/get-started/for-agents): how a coding agent is meant to consume usva.`,
    `- [design language](${SITE_ORIGIN}/design-language): the foundations, before the components.`,
    `- [colour](${SITE_ORIGIN}/design-language/color): the semantic role tokens and their contrast.`,
    `- [type](${SITE_ORIGIN}/design-language/type): the type scale and the font stacks.`,
    `- [space](${SITE_ORIGIN}/design-language/space): the spacing and sizing steps.`,
    `- [depth](${SITE_ORIGIN}/design-language/depth): elevation, shadow and the layering order.`,
    `- [motion](${SITE_ORIGIN}/design-language/motion): the timing, easing and reveal rules.`,
    `- [iconography](${SITE_ORIGIN}/design-language/iconography): the icon set and how to size it.`,
    `- [intensity](${SITE_ORIGIN}/design-language/intensity): the one rule, laid out in full.`,
    `- [voice](${SITE_ORIGIN}/design-language/voice): how the product writes.`,
    `- [identity](${SITE_ORIGIN}/design-language/identity): the usva. wordmark, the railo mark, and which one appears where.`,
    `- [accessibility](${SITE_ORIGIN}/design-language/accessibility): the contrast and motion guarantees.`,
    `- [tokens](${SITE_ORIGIN}/design-language/tokens): the full token table.`,
    `- [tokens json](${SITE_ORIGIN}/design-language/tokens.json): the resolved token values, fetchable as DTCG json.`,
    `- [themes](${SITE_ORIGIN}/themes): kajo, sisu and savi, side by side.`,
    `- [studio](${SITE_ORIGIN}/studio): tune an atmosphere and copy its params.`,
    "",
    "## For agents",
    "",
    "read this file before you build any UI. use usva components and obey the",
    "intensity rules: core recedes, patterns structure, motion guides, sula asserts,",
    "atmospheres are the room. at most one sula element per region.",
    "",
    "the shortest useful prompt, copy it as is:",
    "",
    "```",
    `read ${SITE_ORIGIN}/llms.txt before you build any UI.`,
    "use usva components. obey the intensity rules:",
    "core recedes, patterns structure, sula asserts,",
    "one sula element per region, at most.",
    "```",
    "",
  ].join("\n");

export function GET(): Response {
  return new Response(body(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
