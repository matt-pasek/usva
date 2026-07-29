"use client";
import { Progress } from "usva/primitives/progress";
import { Playground } from "@/components/docs/playground";

const SIZES = ["sm", "md", "lg"] as const;

type Config = {
  value: number;
  size: (typeof SIZES)[number];
  glow: boolean;
  indeterminate: boolean;
};

const base: Config = {
  value: 55,
  size: "md",
  glow: false,
  indeterminate: false,
};

const templates: Record<string, Config> = {
  upload: base,
  "sync, glowing": { ...base, value: 80, size: "lg", glow: true },
  indeterminate: { ...base, indeterminate: true },
  done: { ...base, value: 100 },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    !c.indeterminate && `value={${c.value}}`,
    c.size !== "md" && `size="${c.size}"`,
    c.glow && "glow",
    `aria-label="Upload"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Progress } from "usva/primitives/progress";

<Progress ${attrs} />`;
};

export function ProgressDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "slider",
          key: "value",
          label: "value",
          sub: "0 to 100; ignored when indeterminate",
          min: 0,
          max: 100,
          step: 1,
        },
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "track height",
          options: SIZES,
        },
        {
          kind: "switch",
          key: "glow",
          label: "glow",
          sub: "accent halo on the fill",
        },
        {
          kind: "switch",
          key: "indeterminate",
          label: "indeterminate",
          sub: "drop the value for the shimmer",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Progress
          value={c.indeterminate ? undefined : c.value}
          size={c.size}
          glow={c.glow}
          aria-label="Upload"
          className="w-full max-w-xl"
        />
      )}
    />
  );
}
