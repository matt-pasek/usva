"use client";
import { DisclosureRow } from "@matt-pasek/usva";
import { Playground } from "@/components/docs/playground";

type Config = {
  summary: string;
  rail: boolean;
  railColor: string;
  defaultOpen: boolean;
  disabled: boolean;
};

const base: Config = {
  summary: "Core studies",
  rail: true,
  railColor: "#52c989",
  defaultOpen: false,
  disabled: false,
};

const templates: Record<string, Config> = {
  "core studies": base,
  "starts open": {
    ...base,
    summary: "Minor studies",
    railColor: "#7ea0ff",
    defaultOpen: true,
  },
  "no rail": { ...base, summary: "Free-choice studies", rail: false },
  disabled: { ...base, summary: "Locked section", disabled: true },
};

function Courses() {
  return (
    <ul className="flex flex-col gap-2 pb-4 pl-11 pr-4 text-sm text-muted">
      <li>Introduction to Software Engineering, 5 cr</li>
      <li>Data Structures and Algorithms, 5 cr</li>
      <li>Operating Systems, 5 cr</li>
    </ul>
  );
}

const snippetFor = (c: Config): string => {
  const attrs = [
    c.rail && `railColor="${c.railColor}"`,
    c.defaultOpen && "defaultOpen",
    c.disabled && "disabled",
  ]
    .filter(Boolean)
    .join("\n  ");
  return `import { DisclosureRow } from "@matt-pasek/usva";

<DisclosureRow
  summary="${c.summary}"${attrs ? `\n  ${attrs}` : ""}
>
  <CourseList />
</DisclosureRow>`;
};

export function DisclosureRowDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "text",
          key: "summary",
          label: "summary",
          sub: "the row itself, here plain text",
        },
        {
          kind: "switch",
          key: "rail",
          label: "railColor",
          sub: "draw the categorical left rail",
        },
        {
          kind: "color",
          key: "railColor",
          label: "railColor",
          sub: "any css color for the rail",
        },
        {
          kind: "switch",
          key: "defaultOpen",
          label: "defaultOpen",
          sub: "start expanded when uncontrolled",
        },
        {
          kind: "switch",
          key: "disabled",
          label: "disabled",
          sub: "the row stops toggling",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <DisclosureRow
          key={`${c.defaultOpen}`}
          summary={c.summary}
          railColor={c.rail ? c.railColor : undefined}
          defaultOpen={c.defaultOpen}
          disabled={c.disabled}
        >
          <Courses />
        </DisclosureRow>
      )}
    />
  );
}
