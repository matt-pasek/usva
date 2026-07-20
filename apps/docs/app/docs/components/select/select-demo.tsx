"use client";
import { Select } from "@matt-pasek/usva";
import { Playground } from "@/components/docs/playground";

const fruits = ["Apple", "Banana", "Cherry"];
const PRESELECT = ["none", "apple", "banana", "cherry"] as const;

type Config = {
  placeholder: string;
  preselect: (typeof PRESELECT)[number];
  disabled: boolean;
};

const base: Config = {
  placeholder: "Pick a fruit",
  preselect: "none",
  disabled: false,
};

const templates: Record<string, Config> = {
  "fruit picker": base,
  preselected: { ...base, preselect: "banana" },
  disabled: { ...base, disabled: true },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.preselect !== "none" && `defaultValue="${c.preselect}"`,
    c.disabled && "disabled",
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Select } from "@matt-pasek/usva";

<Select${attrs ? ` ${attrs}` : ""}>
  <Select.Trigger aria-label="Fruit">
    <Select.Value placeholder="${c.placeholder}" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="apple">Apple</Select.Item>
    <Select.Item value="banana">Banana</Select.Item>
    <Select.Item value="cherry">Cherry</Select.Item>
  </Select.Content>
</Select>`;
};

export function SelectDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "text",
          key: "placeholder",
          label: "placeholder",
          sub: "shown until a value is picked",
        },
        {
          kind: "select",
          key: "preselect",
          label: "defaultValue",
          sub: "the value chosen on mount",
          options: PRESELECT,
        },
        {
          kind: "switch",
          key: "disabled",
          label: "disabled",
          sub: "dims the trigger, blocks the popup",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Select
          key={`${c.preselect}-${c.disabled}`}
          defaultValue={c.preselect === "none" ? undefined : c.preselect}
          disabled={c.disabled}
        >
          <Select.Trigger aria-label="Fruit" className="w-56">
            <Select.Value placeholder={c.placeholder} />
          </Select.Trigger>
          <Select.Content>
            {fruits.map((fruit) => (
              <Select.Item key={fruit} value={fruit.toLowerCase()}>
                {fruit}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      )}
    />
  );
}
