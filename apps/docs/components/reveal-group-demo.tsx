"use client";
import { RevealGroup, type RevealVariant } from "@usva-ui/react/motion/reveal";
import { Card, CardBody } from "@usva-ui/react/primitives/card";
import { Playground } from "@/components/docs/playground";

const VARIANTS = ["tick", "veil", "cast", "surface", "focus", "lean"] as const;

const CARDS = [
  "Tokens",
  "Themes",
  "Primitives",
  "Patterns",
  "Sula",
  "Atmospheres",
];

type Config = {
  variant: (typeof VARIANTS)[number];
  stagger: number;
};

const base: Config = { variant: "tick", stagger: 0.08 };

const templates: Record<string, Config> = {
  cascade: base,
  brisk: { ...base, stagger: 0.04 },
  slow: { ...base, stagger: 0.16 },
};

const snippetFor = (c: Config): string =>
  `import { RevealGroup } from "@usva-ui/react/motion/reveal";
import { Card } from "@usva-ui/react/primitives/card";

<RevealGroup
  variant="${c.variant}"
  stagger={${c.stagger}}
  className="grid grid-cols-3 gap-3"
>
  <Card>Tokens</Card>
  <Card>Themes</Card>
  <Card>Primitives</Card>
</RevealGroup>`;

export function RevealGroupDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        {
          kind: "select",
          key: "variant",
          label: "variant",
          sub: "the reveal every child runs",
          options: VARIANTS,
        },
        {
          kind: "slider",
          key: "stagger",
          label: "stagger",
          sub: "seconds between children",
          min: 0,
          max: 0.2,
          step: 0.01,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <RevealGroup
          key={`${c.variant}-${c.stagger}`}
          variant={c.variant as RevealVariant}
          stagger={c.stagger}
          force
          className="grid w-full gap-3 sm:grid-cols-3"
        >
          {CARDS.map((label) => (
            <Card key={label}>
              <CardBody>
                <div className="text-sm font-semibold text-ink">{label}</div>
                <div className="mt-1 font-mono text-xs text-muted">layer</div>
              </CardBody>
            </Card>
          ))}
        </RevealGroup>
      )}
    />
  );
}
