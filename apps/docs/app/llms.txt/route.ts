import { ROLE_NAMES } from "@matt-pasek/usva-tokens";
import {
  byLayer,
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

const layerSection = (layer: Layer): string => {
  const entries = byLayer(layer);
  const rows = entries.map((entry) => {
    const provenance = entry.provenance.length
      ? ` [extracted from ${entry.provenance.join(", ")}]`
      : "";
    const rules = entry.rules?.length
      ? entry.rules.map((rule) => `\n    ! ${rule}`).join("")
      : "";
    const subs = subExportsOf(entry.slug)
      .map(
        (sub) =>
          `\n    + ${sub.name}, included with this one: ${SITE_ORIGIN}/docs/components/${sub.slug}`,
      )
      .join("");
    return `- ${entry.slug} (${entry.name}): ${entry.summary}${provenance}\n    docs: ${SITE_ORIGIN}/docs/components/${entry.slug}\n    registry: ${registryUrl(entry.slug)}${subs}${rules}`;
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
    `- ${SITE_ORIGIN}/docs`,
    `- ${SITE_ORIGIN}/docs/get-started`,
    `- ${SITE_ORIGIN}/docs/get-started/installation`,
    `- ${SITE_ORIGIN}/docs/get-started/theming`,
    `- ${SITE_ORIGIN}/docs/get-started/for-agents`,
    `- ${SITE_ORIGIN}/design-language`,
    `- ${SITE_ORIGIN}/design-language/color`,
    `- ${SITE_ORIGIN}/design-language/type`,
    `- ${SITE_ORIGIN}/design-language/space`,
    `- ${SITE_ORIGIN}/design-language/depth`,
    `- ${SITE_ORIGIN}/design-language/motion`,
    `- ${SITE_ORIGIN}/design-language/iconography`,
    `- ${SITE_ORIGIN}/design-language/intensity`,
    `- ${SITE_ORIGIN}/design-language/voice`,
    `- ${SITE_ORIGIN}/design-language/wordmark`,
    `- ${SITE_ORIGIN}/design-language/accessibility`,
    `- ${SITE_ORIGIN}/design-language/tokens`,
    `- ${SITE_ORIGIN}/themes`,
    `- ${SITE_ORIGIN}/studio`,
    "",
  ].join("\n");

export function GET(): Response {
  return new Response(body(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
