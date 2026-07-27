"use client";
import { Textarea } from "@matt-pasek/usva/primitives/textarea";
import { Playground } from "@/components/docs/playground";

type Config = {
  placeholder: string;
  value: string;
  autoGrow: boolean;
  minRows: number;
  maxRows: number;
  invalid: boolean;
  disabled: boolean;
};

const base: Config = {
  placeholder: "Tell us about yourself…",
  value: "",
  autoGrow: false,
  minRows: 3,
  maxRows: 10,
  invalid: false,
  disabled: false,
};

const templates: Record<string, Config> = {
  "fixed height": base,
  "grows as you type": { ...base, autoGrow: true, minRows: 2, maxRows: 10 },
  "capped at four rows": { ...base, autoGrow: true, minRows: 2, maxRows: 4 },
  invalid: {
    ...base,
    value: "Too short.",
    invalid: true,
  },
  disabled: { ...base, value: "Read only for now.", disabled: true },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.placeholder && `placeholder="${c.placeholder}"`,
    c.value && `defaultValue="${c.value}"`,
    c.autoGrow && "autoGrow",
    c.autoGrow && `minRows={${c.minRows}}`,
    c.autoGrow && `maxRows={${c.maxRows}}`,
    !c.autoGrow && `rows={${c.minRows}}`,
    c.invalid && "aria-invalid",
    c.disabled && "disabled",
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Textarea } from "@matt-pasek/usva/primitives/textarea";

<Textarea${attrs ? ` ${attrs}` : ""} />`;
};

export function TextareaDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
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
          key: "autoGrow",
          label: "autoGrow",
          sub: "grow with the content instead of scrolling",
        },
        {
          kind: "slider",
          key: "minRows",
          label: "minRows",
          sub: "shortest it ever gets",
          min: 1,
          max: 8,
          step: 1,
        },
        {
          kind: "slider",
          key: "maxRows",
          label: "maxRows",
          sub: "where it stops growing and starts scrolling",
          min: 2,
          max: 20,
          step: 1,
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
        <Textarea
          key={`${c.autoGrow}-${c.minRows}-${c.maxRows}-${c.value}`}
          aria-label="Preview"
          placeholder={c.placeholder}
          defaultValue={c.value || undefined}
          autoGrow={c.autoGrow}
          minRows={c.minRows}
          maxRows={c.maxRows}
          rows={c.autoGrow ? undefined : c.minRows}
          aria-invalid={c.invalid || undefined}
          disabled={c.disabled}
          className="w-full max-w-sm"
        />
      )}
    />
  );
}
