"use client";
import { Input } from "@matt-pasek/usva/primitives/input";
import { Playground } from "@/components/docs/playground";

const TYPES = ["text", "email", "password", "number"] as const;

type Config = {
  type: (typeof TYPES)[number];
  placeholder: string;
  value: string;
  invalid: boolean;
  disabled: boolean;
};

const base: Config = {
  type: "text",
  placeholder: "you@example.com",
  value: "",
  invalid: false,
  disabled: false,
};

const templates: Record<string, Config> = {
  "email field": { ...base, type: "email" },
  filled: { ...base, value: "Ada Lovelace", placeholder: "Full name" },
  invalid: { ...base, type: "email", value: "not-an-email", invalid: true },
  disabled: { ...base, placeholder: "Disabled", disabled: true },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.type !== "text" && `type="${c.type}"`,
    c.placeholder && `placeholder="${c.placeholder}"`,
    c.value && `defaultValue="${c.value}"`,
    c.invalid && "aria-invalid",
    c.disabled && "disabled",
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Input } from "@matt-pasek/usva/primitives/input";

<Input${attrs ? ` ${attrs}` : ""} />`;
};

export function InputDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "type",
          label: "type",
          sub: "native input type",
          options: TYPES,
        },
        {
          kind: "text",
          key: "placeholder",
          label: "placeholder",
          sub: "hint text, never a label",
        },
        {
          kind: "text",
          key: "value",
          label: "value",
          sub: "the starting text",
        },
        {
          kind: "switch",
          key: "invalid",
          label: "invalid",
          sub: "sets aria-invalid, paints danger",
        },
        {
          kind: "switch",
          key: "disabled",
          label: "disabled",
          sub: "dims to 50%, not-allowed cursor",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Input
          key={`${c.type}-${c.value}`}
          aria-label="Preview"
          type={c.type}
          placeholder={c.placeholder}
          defaultValue={c.value || undefined}
          aria-invalid={c.invalid || undefined}
          disabled={c.disabled}
          className="w-full max-w-sm"
        />
      )}
    />
  );
}
