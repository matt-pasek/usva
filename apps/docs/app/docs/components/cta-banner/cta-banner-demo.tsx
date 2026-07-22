"use client";
import { Button, Chip, CtaBanner } from "@matt-pasek/usva";
import { Playground } from "@/components/docs/playground";

const HEADING_LEVELS = ["h2", "h3", "h4"] as const;

type Config = {
  title: string;
  body: string;
  headingLevel: (typeof HEADING_LEVELS)[number];
  ctaLabel: string;
  footer: boolean;
  footerLabel: string;
};

const base: Config = {
  title: "Have something in mind?",
  body: "Design engineering for teams that sweat the details. A short call is the fastest way to start.",
  headingLevel: "h2",
  ctaLabel: "Start a project",
  footer: true,
  footerLabel: "Recent work",
};

const templates: Record<string, Config> = {
  hire: { ...base },
  bare: {
    ...base,
    title: "Ready when you are.",
    body: "",
    ctaLabel: "Get in touch",
    footer: false,
  },
  product: {
    ...base,
    title: "add usva to your stack.",
    body: "one source, shipped two ways: an installed package and a copy-paste registry.",
    ctaLabel: "read the docs",
    footer: false,
  },
};

const PROOF = ["Fintech", "Health", "Developer tools"];

const snippetFor = (c: Config): string => {
  const lines = [`  title="${c.title}"`];
  if (c.body) lines.push(`  body="${c.body}"`);
  if (c.headingLevel !== "h2") lines.push(`  headingLevel="${c.headingLevel}"`);
  lines.push(`  action={<Button>${c.ctaLabel}</Button>}`);
  if (c.footer) {
    if (c.footerLabel) lines.push(`  footerLabel="${c.footerLabel}"`);
    lines.push(`  footer={<><Chip>Fintech</Chip><Chip>Health</Chip></>}`);
  }
  const imports = c.footer ? "Button, Chip, CtaBanner" : "Button, CtaBanner";
  return `import { ${imports} } from "@matt-pasek/usva";

<CtaBanner
${lines.join("\n")}
/>`;
};

export function CtaBannerDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "headingLevel",
          label: "headingLevel",
          sub: "match the page outline",
          options: HEADING_LEVELS,
        },
        {
          kind: "switch",
          key: "footer",
          label: "footer",
          sub: "trailing proof row, drawn under a rule",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <CtaBanner
          title={c.title}
          body={c.body || undefined}
          headingLevel={c.headingLevel}
          action={<Button>{c.ctaLabel}</Button>}
          footerLabel={c.footer ? c.footerLabel || undefined : undefined}
          footer={
            c.footer
              ? PROOF.map((label) => <Chip key={label}>{label}</Chip>)
              : undefined
          }
        />
      )}
    />
  );
}
