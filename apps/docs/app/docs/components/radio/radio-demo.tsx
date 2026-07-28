"use client";
import { useState } from "react";
import { Radio, RadioGroup } from "usva/primitives/radio";
import { Playground } from "@/components/docs/playground";

const ORIENTATIONS = ["vertical", "horizontal"] as const;
const SIZES = ["sm", "md"] as const;

type Config = {
  orientation: (typeof ORIENTATIONS)[number];
  size: (typeof SIZES)[number];
  descriptions: boolean;
  disableLast: boolean;
};

const base: Config = {
  orientation: "vertical",
  size: "md",
  descriptions: true,
  disableLast: true,
};

const templates: Record<string, Config> = {
  "plan picker": base,
  "settings list": { ...base, descriptions: false, disableLast: false },
  "compact row": {
    ...base,
    orientation: "horizontal",
    size: "sm",
    descriptions: false,
    disableLast: false,
  },
};

const options = [
  { value: "free", label: "Free", description: "Good for trying things out." },
  { value: "pro", label: "Pro", description: "For growing teams." },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "Advanced controls and support.",
  },
] as const;

const snippetFor = (c: Config): string => {
  const groupAttrs = [
    `name="plan"`,
    `defaultValue="free"`,
    c.orientation !== "vertical" && `orientation="${c.orientation}"`,
  ]
    .filter(Boolean)
    .join(" ");

  const lines = options.map((option, index) => {
    const attrs = [
      `value="${option.value}"`,
      `label="${option.label}"`,
      c.size !== "md" && `size="${c.size}"`,
      c.descriptions && `description="${option.description}"`,
      c.disableLast && index === options.length - 1 && "disabled",
    ]
      .filter(Boolean)
      .join(" ");
    return `  <Radio ${attrs} />`;
  });

  return `import { Radio, RadioGroup } from "usva/primitives/radio";

<RadioGroup ${groupAttrs}>
${lines.join("\n")}
</RadioGroup>`;
};

function RadioPreview(c: Config) {
  const [plan, setPlan] = useState("free");

  return (
    <RadioGroup
      name="plan"
      aria-label="Plan"
      value={plan}
      onValueChange={setPlan}
      orientation={c.orientation}
    >
      {options.map((option, index) => (
        <Radio
          key={option.value}
          value={option.value}
          label={option.label}
          size={c.size}
          description={c.descriptions ? option.description : undefined}
          disabled={c.disableLast && index === options.length - 1}
        />
      ))}
    </RadioGroup>
  );
}

export function RadioDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="flex min-h-24 items-center justify-center"
      fields={[
        {
          kind: "select",
          key: "orientation",
          label: "orientation",
          sub: "stacked or inline",
          options: ORIENTATIONS,
        },
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "control diameter",
          options: SIZES,
        },
        {
          kind: "switch",
          key: "descriptions",
          label: "descriptions",
          sub: "helper text under each label",
        },
        {
          kind: "switch",
          key: "disableLast",
          label: "disableLast",
          sub: "dim and block the last option",
        },
      ]}
      snippet={snippetFor}
      render={(c) => <RadioPreview {...c} />}
    />
  );
}
