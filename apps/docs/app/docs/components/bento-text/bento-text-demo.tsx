"use client";
import {
  BentoCard,
  BentoGrid,
  BentoText,
} from "@usva-ui/react/patterns/bento-grid";
import { Playground } from "@/components/docs/playground";

type Config = {
  label: string;
  title: string;
  body: string;
};

const base: Config = {
  label: "Problem",
  title: "Students could not see their whole degree.",
  body: "Requirements were spread across four systems, none of which agreed with the others.",
};

const templates: Record<string, Config> = {
  problem: { ...base },
  "no label": { ...base, label: "" },
  "title only": { ...base, label: "", body: "" },
  outcome: {
    label: "Outcome",
    title: "One page, every requirement.",
    body: "Advising sessions stopped opening with a reconciliation.",
  },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.label && `\n  label="${c.label}"`,
    `\n  title="${c.title}"`,
    c.body && `\n  body="${c.body}"`,
  ]
    .filter(Boolean)
    .join("");
  return `import { BentoText } from "@usva-ui/react/patterns/bento-grid";

<BentoText${attrs}\n/>`;
};

export function BentoTextDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "mono eyebrow, empty to drop it",
        },
        { kind: "text", key: "title", label: "title", sub: "the heading" },
        {
          kind: "text",
          key: "body",
          label: "body",
          sub: "paragraph under the heading",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <BentoGrid columns={2} className="w-full">
          <BentoCard span={2}>
            <BentoText
              label={c.label || undefined}
              title={c.title}
              body={c.body || undefined}
            />
          </BentoCard>
        </BentoGrid>
      )}
    />
  );
}
