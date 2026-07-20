"use client";
import { type Step, StepList } from "@matt-pasek/usva";
import * as React from "react";
import { Playground } from "@/components/docs/playground";

type Config = {
  count: number;
  bodies: boolean;
  icons: boolean;
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ICONS: React.ReactNode[] = [
  <svg key="sketch" {...iconProps}>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>,
  <svg key="build" {...iconProps}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>,
  <svg key="ship" {...iconProps}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>,
  <svg key="measure" {...iconProps}>
    <path d="M3 3v18h18" />
    <path d="m7 15 4-4 3 3 5-6" />
  </svg>,
  <svg key="iterate" {...iconProps}>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    <path d="M3 21v-5h5" />
  </svg>,
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
