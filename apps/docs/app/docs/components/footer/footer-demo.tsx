"use client";
import { Footer } from "usva/patterns/footer";
import { Playground } from "@/components/docs/playground";

const VARIANTS = ["full", "compact"] as const;

type Config = {
  variant: (typeof VARIANTS)[number];
  brand: string;
  tagline: string;
  copyright: string;
  note: string;
  glow: boolean;
};

const columns = [
  {
    title: "Index",
    links: [
      { label: "About", href: "#about" },
      { label: "Work", href: "#work" },
      { label: "Currently", href: "#currently" },
    ],
  },
  {
    title: "Elsewhere",
    tone: "accent-alt" as const,
    links: [
      { label: "GitHub", href: "https://github.com/matt-pasek" },
      { label: "Email", href: "mailto:contact@matt-pasek.dev" },
    ],
  },
];

const base: Config = {
  variant: "full",
  brand: "usva.",
  tagline: "Designer by eye, dev by hand. Currently in Lahti.",
  copyright: "© 2026 Mateusz Pasek",
  note: "quality > quantity",
  glow: false,
};

const templates: Record<string, Config> = {
  "full · titled columns": base,
  "compact · one row": {
    ...base,
    variant: "compact",
    brand: "sisu+",
    tagline: "",
    note: "",
  },
  glow: { ...base, glow: true },
};

const indent = (block: string): string =>
  block
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");

const snippetFor = (c: Config): string => {
  const columnsLiteral = `columns={[
  {
    title: "Index",
    links: [
      { label: "About", href: "#about" },
      { label: "Work", href: "#work" },
      { label: "Currently", href: "#currently" },
    ],
  },
  {
    title: "Elsewhere",
    tone: "accent-alt",
    links: [
      { label: "GitHub", href: "https://github.com/matt-pasek" },
      { label: "Email", href: "mailto:contact@matt-pasek.dev" },
    ],
  },
]}`;

  const attrs = [
    c.variant !== "full" && `variant="${c.variant}"`,
    `brand={<span className="text-2xl font-black">${c.brand}</span>}`,
    c.tagline && `tagline="${c.tagline}"`,
    columnsLiteral,
    c.copyright && `copyright="${c.copyright}"`,
    c.note && `note="${c.note}"`,
    c.glow && "glow",
  ].filter(Boolean) as string[];

  return `import { Footer } from "usva/patterns/footer";

<Footer
${indent(attrs.join("\n"))}
/>`;
};

export function FooterDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "variant",
          label: "variant",
          sub: "full titled columns or one flat row",
          options: VARIANTS,
        },
        {
          kind: "text",
          key: "brand",
          label: "brand",
          sub: "the wordmark slot",
        },
        {
          kind: "text",
          key: "tagline",
          label: "tagline",
          sub: "the line under the brand",
        },
        {
          kind: "text",
          key: "copyright",
          label: "copyright",
          sub: "left of the bottom bar",
        },
        {
          kind: "text",
          key: "note",
          label: "note",
          sub: "right of the bottom bar",
        },
        {
          kind: "switch",
          key: "glow",
          label: "glow",
          sub: "two radial washes, assume a dark page",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Footer
          className="w-full px-0 py-8 sm:px-0"
          variant={c.variant}
          brand={
            <span className="text-2xl font-black tracking-tight text-ink">
              {c.brand}
            </span>
          }
          tagline={c.tagline || undefined}
          columns={columns}
          copyright={c.copyright || undefined}
          note={c.note || undefined}
          glow={c.glow}
        />
      )}
    />
  );
}
