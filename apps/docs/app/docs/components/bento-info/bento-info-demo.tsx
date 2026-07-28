"use client";
import { BentoCard, BentoGrid, BentoInfo } from "usva/patterns/bento-grid";
import { Chip } from "usva/primitives/chip";
import { Playground } from "@/components/docs/playground";

const SHAPES = ["chips", "prose", "list"] as const;

type Config = {
  label: string;
  shape: (typeof SHAPES)[number];
};

const templates: Record<string, Config> = {
  stack: { label: "Stack", shape: "chips" },
  role: { label: "Role", shape: "prose" },
  scope: { label: "Scope", shape: "list" },
};

const BODIES: Record<Config["shape"], string> = {
  chips: `<Chip>React</Chip>
      <Chip>Tailwind</Chip>
      <Chip>Base UI</Chip>`,
  prose: `Design and build, start to finish.`,
  list: `<ul>
        <li>Audit</li>
        <li>Rebuild</li>
      </ul>`,
};

const snippetFor = (c: Config): string =>
  `import { BentoInfo } from "usva/patterns/bento-grid";

<BentoInfo label="${c.label}">
  ${BODIES[c.shape]}
</BentoInfo>`;

function Body({ shape }: { shape: Config["shape"] }) {
  if (shape === "chips") {
    return (
      <div className="flex flex-wrap gap-1.5">
        <Chip>React</Chip>
        <Chip>Tailwind</Chip>
        <Chip>Base UI</Chip>
      </div>
    );
  }
  if (shape === "list") {
    return (
      <ul className="list-disc pl-4">
        <li>Audit</li>
        <li>Rebuild</li>
      </ul>
    );
  }
  return <>Design and build, start to finish.</>;
}

export function BentoInfoDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "mono eyebrow above the body",
        },
        {
          kind: "select",
          key: "shape",
          label: "children",
          sub: "whatever the cell has to hold",
          options: SHAPES,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <BentoGrid columns={2} className="w-full">
          <BentoCard>
            <BentoInfo label={c.label}>
              <Body shape={c.shape} />
            </BentoInfo>
          </BentoCard>
          <BentoCard>
            <BentoInfo label="Timeline">
              Six weeks, two of them research.
            </BentoInfo>
          </BentoCard>
        </BentoGrid>
      )}
    />
  );
}
