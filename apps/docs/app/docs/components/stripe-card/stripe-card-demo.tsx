"use client";
import { StripeCard } from "@usva-ui/react/patterns/stripe-card";
import { Badge } from "@usva-ui/react/primitives/badge";
import { Playground } from "@/components/docs/playground";

const SURFACES = ["elevated", "flat", "glass", "outline"] as const;

type Config = {
  heading: string;
  metaLeft: string;
  metaRight: string;
  badge: string;
  footer: string;
  stripeColor: string;
  wash: boolean;
  surface: (typeof SURFACES)[number];
  selected: boolean;
};

const base: Config = {
  heading: "Algorithms & Data Structures",
  metaLeft: "CS-201",
  metaRight: "5 cr",
  badge: "enrolled",
  footer: "Autumn 2026 · Prof. Turing",
  stripeColor: "#a78bfa",
  wash: false,
  surface: "elevated",
  selected: false,
};

const templates: Record<string, Config> = {
  course: base,
  minimal: {
    ...base,
    heading: "Discrete Mathematics",
    metaLeft: "MA-140",
    metaRight: "4 cr",
    badge: "",
    footer: "",
    stripeColor: "#52c989",
    surface: "flat",
  },
  selected: {
    ...base,
    heading: "Operating Systems",
    metaLeft: "CS-320",
    metaRight: "6 cr",
    badge: "",
    footer: "",
    stripeColor: "#52c989",
    wash: false,
    surface: "glass",
    selected: true,
  },
  neutral: {
    ...base,
    heading: "Undeclared elective",
    metaLeft: "TBD",
    metaRight: "",
    badge: "",
    footer: "",
    stripeColor: "",
    surface: "outline",
  },
};

const snippetFor = (c: Config): string => {
  const lines = [`  heading="${c.heading}"`];
  if (c.metaLeft) lines.push(`  metaLeft="${c.metaLeft}"`);
  if (c.metaRight) lines.push(`  metaRight="${c.metaRight}"`);
  if (c.stripeColor) lines.push(`  stripeColor="${c.stripeColor}"`);
  if (c.wash) lines.push(`  wash`);
  if (c.surface !== "elevated") lines.push(`  surface="${c.surface}"`);
  if (c.badge)
    lines.push(`  badge={<Badge tone="accent-alt">${c.badge}</Badge>}`);
  if (c.footer) lines.push(`  footer="${c.footer}"`);
  if (c.selected) lines.push(`  selected`);
  const importLine = c.badge
    ? `import { StripeCard } from "@usva-ui/react/patterns/stripe-card";
import { Badge } from "@usva-ui/react/primitives/badge";`
    : `import { StripeCard } from "@usva-ui/react/patterns/stripe-card";`;
  return `${importLine}

<StripeCard
${lines.join("\n")}
/>`;
};

export function StripeCardDemo() {
  return (
    <Playground<Config>
      stageClassName="mx-auto w-full max-w-xs"
      templates={templates}
      fields={[
        {
          kind: "color",
          key: "stripeColor",
          label: "stripeColor",
          sub: "keyed to a category",
        },
        {
          kind: "switch",
          key: "wash",
          label: "wash",
          sub: "a faint wash in the stripe's color",
        },
        {
          kind: "select",
          key: "surface",
          label: "surface",
          sub: "how it sits on the page",
          options: SURFACES,
        },
        {
          kind: "switch",
          key: "selected",
          label: "selected",
          sub: "swaps hover lift for the accent ring",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <StripeCard
          heading={c.heading}
          metaLeft={c.metaLeft || undefined}
          metaRight={c.metaRight || undefined}
          badge={
            c.badge ? <Badge tone="accent-alt">{c.badge}</Badge> : undefined
          }
          footer={c.footer || undefined}
          stripeColor={c.stripeColor || undefined}
          wash={c.wash}
          surface={c.surface}
          selected={c.selected}
        />
      )}
    />
  );
}
