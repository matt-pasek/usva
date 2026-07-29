"use client";
import { Checkbox } from "usva/primitives/checkbox";
import { Playground } from "@/components/docs/playground";

const SIZES = ["sm", "md"] as const;

type Config = {
  label: string;
  description: string;
  size: (typeof SIZES)[number];
  defaultChecked: boolean;
  indeterminate: boolean;
  disabled: boolean;
};

const base: Config = {
  label: "Accept terms",
  description: "You agree to our terms of service and privacy policy.",
  size: "md",
  defaultChecked: false,
  indeterminate: false,
  disabled: false,
};

const templates: Record<string, Config> = {
  "consent row": { ...base },
  "settings toggle": {
    ...base,
    label: "Email notifications",
    description: "",
    defaultChecked: true,
  },
  "group head": {
    ...base,
    label: "Select all",
    description: "",
    indeterminate: true,
  },
  "dense filter": {
    ...base,
    label: "In stock",
    description: "",
    size: "sm",
  },
  "locked option": {
    ...base,
    label: "Enterprise plan",
    description: "Contact sales to change this.",
    defaultChecked: true,
    disabled: true,
  },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    `label="${c.label}"`,
    c.description && `description="${c.description}"`,
    c.size !== "md" && `size="${c.size}"`,
    c.defaultChecked && "defaultChecked",
    c.indeterminate && "indeterminate",
    c.disabled && "disabled",
  ].filter(Boolean);
  return `import { Checkbox } from "usva/primitives/checkbox";

<Checkbox
  ${attrs.join("\n  ")}
/>`;
};

export function CheckboxDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "the click target and accessible name",
        },
        {
          kind: "text",
          key: "description",
          label: "description",
          sub: "helper text under the control",
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
          sub: "starts ticked",
        },
        {
          kind: "switch",
          key: "indeterminate",
          label: "indeterminate",
          sub: "the mixed state for a group head",
        },
        {
          kind: "switch",
          key: "disabled",
          label: "disabled",
          sub: "greys out the whole field",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Checkbox
          key={`${c.size}-${c.defaultChecked}-${c.indeterminate}`}
          label={c.label}
          description={c.description || undefined}
          size={c.size}
          defaultChecked={c.defaultChecked}
          indeterminate={c.indeterminate}
          disabled={c.disabled}
        />
      )}
    />
  );
}
