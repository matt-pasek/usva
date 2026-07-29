"use client";
import { ColorField } from "usva/primitives/color-field";
import { Playground } from "@/components/docs/playground";

type Config = {
  label: string;
  value: string;
  disabled: boolean;
};

const base: Config = { label: "Accent", value: "#a78bfa", disabled: false };

const templates: Record<string, Config> = {
  accent: base,
  surface: { ...base, label: "Surface", value: "#141419" },
  invalid: { ...base, label: "Invalid", value: "#zzz" },
  disabled: { ...base, label: "Disabled", value: "#52c989", disabled: true },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    `label="${c.label}"`,
    `defaultValue="${c.value}"`,
    c.disabled && "disabled",
  ]
    .filter(Boolean)
    .join(" ");
  return `import { ColorField } from "usva/primitives/color-field";

<ColorField ${attrs} />`;
};

export function ColorFieldDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        { kind: "text", key: "label", label: "label", sub: "names the field" },
        {
          kind: "text",
          key: "value",
          label: "value",
          sub: "a hex colour; a bad one paints invalid",
        },
        {
          kind: "switch",
          key: "disabled",
          label: "disabled",
          sub: "dims the field and its swatch",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <ColorField
          key={`${c.value}-${c.disabled}`}
          label={c.label}
          defaultValue={c.value}
          disabled={c.disabled}
        />
      )}
    />
  );
}
