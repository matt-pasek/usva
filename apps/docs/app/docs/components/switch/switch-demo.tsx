"use client";
import { Switch } from "@matt-pasek/usva";
import { Playground } from "@/components/docs/playground";

const SIZES = ["sm", "md"] as const;

type Config = {
  label: string;
  description: string;
  size: (typeof SIZES)[number];
  defaultChecked: boolean;
  disabled: boolean;
};

const base: Config = {
  label: "Notifications",
  description: "Enable push notifications for updates.",
  size: "md",
  defaultChecked: false,
  disabled: false,
};

const templates: Record<string, Config> = {
  "settings row": base,
  "on by default": {
    ...base,
    label: "Auto-save",
    description: "Save changes as you type.",
    defaultChecked: true,
  },
  "dense row": {
    ...base,
    label: "Compact mode",
    description: "",
    size: "sm",
  },
  disabled: {
    ...base,
    label: "Beta features",
    description: "Available on the Pro plan.",
    disabled: true,
  },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    `label="${c.label}"`,
    c.description && `description="${c.description}"`,
    c.size !== "md" && `size="${c.size}"`,
    c.defaultChecked && "defaultChecked",
    c.disabled && "disabled",
  ].filter(Boolean);
  return `import { Switch } from "@matt-pasek/usva";

<Switch
  ${attrs.join("\n  ")}
/>`;
};

export function SwitchDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "names the control",
        },
        {
          kind: "text",
          key: "description",
          label: "description",
          sub: "helper text under the switch",
        },
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "sm for dense rows",
          options: SIZES,
        },
        {
          kind: "switch",
          key: "defaultChecked",
          label: "defaultChecked",
          sub: "initial on state",
        },
        {
          kind: "switch",
          key: "disabled",
          label: "disabled",
          sub: "dims and blocks the pointer",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Switch
          key={`${c.size}-${c.defaultChecked}-${c.disabled}`}
          label={c.label}
          description={c.description || undefined}
          size={c.size}
          defaultChecked={c.defaultChecked}
          disabled={c.disabled}
        />
      )}
    />
  );
}
