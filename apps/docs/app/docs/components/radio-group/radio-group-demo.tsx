"use client";
import * as React from "react";
import { Radio, RadioGroup } from "usva/primitives/radio";
import { Playground } from "@/components/docs/playground";

const ORIENTATIONS = ["vertical", "horizontal"] as const;

type Config = {
  orientation: (typeof ORIENTATIONS)[number];
  disabled: boolean;
};

const templates: Record<string, Config> = {
  stacked: { orientation: "vertical", disabled: false },
  inline: { orientation: "horizontal", disabled: false },
  locked: { orientation: "vertical", disabled: true },
};

const OPTIONS = [
  { value: "kajo", label: "kajo" },
  { value: "sisu", label: "sisu" },
  { value: "savi", label: "savi" },
];

const snippetFor = (c: Config): string =>
  `import { Radio, RadioGroup } from "usva/primitives/radio";

<RadioGroup
  value={theme}
  onValueChange={setTheme}${c.orientation === "horizontal" ? '\n  orientation="horizontal"' : ""}${c.disabled ? "\n  disabled" : ""}
>
${OPTIONS.map((o) => `  <Radio value="${o.value}">${o.label}</Radio>`).join("\n")}
</RadioGroup>`;

export function RadioGroupDemo() {
  const [value, setValue] = React.useState("kajo");

  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "orientation",
          label: "orientation",
          sub: "how the options stack",
          options: ORIENTATIONS,
        },
        {
          kind: "switch",
          key: "disabled",
          label: "disabled",
          sub: "locks every option at once",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <RadioGroup
          value={value}
          onValueChange={(next) => setValue(next as string)}
          orientation={c.orientation}
          disabled={c.disabled}
          aria-label="theme"
        >
          {OPTIONS.map((option) => (
            <Radio key={option.value} value={option.value}>
              {option.label}
            </Radio>
          ))}
        </RadioGroup>
      )}
    />
  );
}
