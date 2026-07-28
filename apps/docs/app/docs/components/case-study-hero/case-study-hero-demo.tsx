"use client";
import { CaseStudyHero } from "usva/patterns/case-study-hero";
import { Chip } from "usva/primitives/chip";
import { Playground } from "@/components/docs/playground";

const LEVELS = ["h1", "h2", "h3"] as const;

type Config = {
  eyebrow: string;
  kicker: string;
  headline: string;
  headlineAccent: string;
  accentColor: string;
  headingLevel: (typeof LEVELS)[number];
  tagline: string;
  showLink: boolean;
  showMeta: boolean;
  showTags: boolean;
};

const DEFAULT_ACCENT = "#52c989";

const base: Config = {
  eyebrow: "Case study",
  kicker: "Acme University · 2026",
  headline: "Students could not see",
  headlineAccent: "their whole degree.",
  accentColor: DEFAULT_ACCENT,
  headingLevel: "h2",
  tagline:
    "Four registries, one planner. Reconciling the systems nobody wanted to own.",
  showLink: true,
  showMeta: true,
  showTags: true,
};

const templates: Record<string, Config> = {
  "full opener": base,
  "headline only": {
    ...base,
    kicker: "",
    tagline: "",
    showLink: false,
    showMeta: false,
    showTags: false,
  },
  "keyed color": {
    ...base,
    kicker: "Loom · 2025",
    headline: "Shipping felt like",
    headlineAccent: "guesswork.",
    accentColor: "#f0653f",
  },
  "section header": {
    ...base,
    headingLevel: "h3",
    eyebrow: "Selected work",
    kicker: "",
    showLink: false,
  },
};

const metaPairs = [
  { label: "Role", value: "Design engineer" },
  { label: "Timeline", value: "6 weeks" },
  { label: "Surface", value: "Web, extension" },
  { label: "Users", value: "2,400" },
];

const q = (v: string) => JSON.stringify(v);

const snippetFor = (c: Config): string => {
  const lines = [`  eyebrow=${q(c.eyebrow)}`];
  if (c.kicker) lines.push(`  kicker=${q(c.kicker)}`);
  if (c.headingLevel !== "h1")
    lines.push(`  headingLevel=${q(c.headingLevel)}`);
  lines.push(`  headline=${q(c.headline)}`);
  if (c.headlineAccent) lines.push(`  headlineAccent=${q(c.headlineAccent)}`);
  if (c.accentColor && c.accentColor !== DEFAULT_ACCENT)
    lines.push(`  accentColor=${q(c.accentColor)}`);
  if (c.tagline) lines.push(`  tagline=${q(c.tagline)}`);
  if (c.showLink)
    lines.push(
      `  link={{ href: "https://example.com", label: "Visit site", external: true }}`,
    );
  if (c.showMeta)
    lines.push(`  meta={[{ label: "Role", value: "Design engineer" }]}`);

  const imports = [
    `import { CaseStudyHero } from "usva/patterns/case-study-hero";`,
    c.showTags && `import { Chip } from "usva/primitives/chip";`,
  ].filter(Boolean);

  const open = c.showTags ? ">" : "\n/>";
  const body = c.showTags
    ? `\n>\n  <>\n    <Chip>React</Chip>\n    <Chip>Tailwind</Chip>\n  </>\n</CaseStudyHero>`
    : "";

  return `${imports.join("\n")}

<CaseStudyHero
${lines.join("\n")}${c.showTags ? open + body : open}`;
};

export function CaseStudyHeroDemo() {
  return (
    <Playground<Config>
      stageClassName="w-full"
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "headingLevel",
          label: "headingLevel",
          sub: "pick by outline, not size",
          options: LEVELS,
        },
        {
          kind: "color",
          key: "accentColor",
          label: "accentColor",
          sub: "keyed to the study, not a meaning",
        },
        {
          kind: "switch",
          key: "showLink",
          label: "link",
          sub: "external site pill",
        },
        {
          kind: "switch",
          key: "showMeta",
          label: "meta",
          sub: "definition-list facts",
        },
        {
          kind: "switch",
          key: "showTags",
          label: "tags",
          sub: "chip row slot",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <CaseStudyHero
          headingLevel={c.headingLevel}
          eyebrow={c.eyebrow || undefined}
          kicker={c.kicker || undefined}
          headline={c.headline}
          headlineAccent={c.headlineAccent || undefined}
          accentColor={c.accentColor || undefined}
          tagline={c.tagline || undefined}
          link={
            c.showLink
              ? {
                  href: "https://example.com",
                  label: "Visit site",
                  external: true,
                }
              : undefined
          }
          meta={c.showMeta ? metaPairs : undefined}
          tags={
            c.showTags ? (
              <>
                <Chip>React</Chip>
                <Chip>Tailwind</Chip>
                <Chip>Base UI</Chip>
              </>
            ) : undefined
          }
        />
      )}
    />
  );
}
