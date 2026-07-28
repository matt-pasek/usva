"use client";
import { ChecklistCard } from "usva/patterns/checklist-card";
import { Playground } from "@/components/docs/playground";

const MARKERS = ["tick", "dot", "star", "arrow"] as const;

type Config = {
  title: string;
  items: string;
  marker: (typeof MARKERS)[number];
};

const base: Config = {
  title: "Privacy",
  items:
    "Runs entirely on your machine\nNo tracking, no analytics, no accounts\nOpen source, end to end",
  marker: "tick",
};

const templates: Record<string, Config> = {
  privacy: base,
  plan: {
    title: "Included",
    items:
      "Unlimited projects\nPriority support\nSSO and audit log\nCustom domains",
    marker: "tick",
  },
  "no title": { ...base, title: "" },
  starred: {
    title: "Highlights",
    items: "Zero config\nWorks offline\nTyped end to end",
    marker: "star",
  },
};

const markerNode = (m: Config["marker"]) => {
  if (m === "dot") return "•";
  if (m === "star") return "★";
  if (m === "arrow") return "→";
  return undefined;
};

const toItems = (raw: string): string[] =>
  raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const snippetFor = (c: Config): string => {
  const items = toItems(c.items);
  const itemsLiteral = `[${items.map((i) => `"${i}"`).join(", ")}]`;
  const lines = [
    c.title && `  title="${c.title}"`,
    `  items={${itemsLiteral}}`,
    c.marker !== "tick" && `  marker="${markerNode(c.marker)}"`,
  ].filter(Boolean);
  return `import { ChecklistCard } from "usva/patterns/checklist-card";

<ChecklistCard
${lines.join("\n")}
/>`;
};

export function ChecklistCardDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="mx-auto w-full max-w-md"
      fields={[
        {
          kind: "text",
          key: "title",
          label: "title",
          sub: "heading above the list, empty to omit",
        },
        {
          kind: "select",
          key: "marker",
          label: "marker",
          sub: "decorative glyph before each item",
          options: MARKERS,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <ChecklistCard
          title={c.title || undefined}
          items={toItems(c.items)}
          marker={markerNode(c.marker)}
        />
      )}
    />
  );
}
