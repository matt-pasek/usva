"use client";
import { type Step, StepList } from "@matt-pasek/usva";
import { Box, PenLine, RefreshCw, Send, TrendingUp } from "lucide-react";
import type * as React from "react";
import { Playground } from "@/components/docs/playground";

type Config = {
  count: number;
  bodies: boolean;
  icons: boolean;
};

const ICONS: React.ReactNode[] = [
  <PenLine key="sketch" aria-hidden="true" strokeWidth={1.8} />,
  <Box key="build" aria-hidden="true" strokeWidth={1.8} />,
  <Send key="ship" aria-hidden="true" strokeWidth={1.8} />,
  <TrendingUp key="measure" aria-hidden="true" strokeWidth={1.8} />,
  <RefreshCw key="iterate" aria-hidden="true" strokeWidth={1.8} />,
];

const POOL: Required<Pick<Step, "title" | "body">>[] = [
  {
    title: "Sketch the flow",
    body: "Rough the screens and the path between them.",
  },
  {
    title: "Build the primitives",
    body: "Wire the tokens and the core components.",
  },
  { title: "Ship it", body: "Push to the registry and migrate the apps." },
  {
    title: "Measure",
    body: "Watch the first real sessions and tune from there.",
  },
  { title: "Iterate", body: "Fold the feedback back into the tokens." },
];

const templates: Record<string, Config> = {
  "how it works": { count: 3, bodies: true, icons: false },
  "titles only": { count: 3, bodies: false, icons: false },
  "with icons": { count: 4, bodies: true, icons: true },
  "full sequence": { count: 5, bodies: true, icons: false },
};

const build = (c: Config): Step[] =>
  POOL.slice(0, c.count).map((s, i) => ({
    title: s.title,
    ...(c.bodies ? { body: s.body } : {}),
    ...(c.icons ? { icon: ICONS[i] } : {}),
  }));

const snippetFor = (c: Config): string => {
  const rows = POOL.slice(0, c.count)
    .map((s) => {
      const parts = [
        c.icons ? "icon: <StepIcon />" : "",
        `title: "${s.title}"`,
        c.bodies ? `body: "${s.body}"` : "",
      ].filter(Boolean);
      return `    { ${parts.join(", ")} },`;
    })
    .join("\n");
  return `import { StepList } from "@matt-pasek/usva";

<StepList
  steps={[
${rows}
  ]}
/>`;
};

export function StepListDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "slider",
          key: "count",
          label: "steps",
          sub: "how many in the sequence",
          min: 2,
          max: 5,
          step: 1,
        },
        {
          kind: "switch",
          key: "bodies",
          label: "bodies",
          sub: "a sentence under each title",
        },
        {
          kind: "switch",
          key: "icons",
          label: "icons",
          sub: "replace the step number with an icon",
        },
      ]}
      snippet={snippetFor}
      render={(c) => <StepList steps={build(c)} />}
    />
  );
}
