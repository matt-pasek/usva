"use client";
import { Chip } from "@usva-ui/react/primitives/chip";
import { Playground } from "@/components/docs/playground";

const TONES = [
  "default",
  "accent",
  "accent-alt",
  "success",
  "warning",
  "danger",
] as const;

const SIZES = ["sm", "md"] as const;

type Config = {
  tone: (typeof TONES)[number];
  size: (typeof SIZES)[number];
  label: string;
  value: string;
  selected: boolean;
  removable: boolean;
};

const base: Config = {
  tone: "default",
  size: "md",
  label: "Design",
  value: "",
  selected: false,
  removable: false,
};

const templates: Record<string, Config> = {
  "filter tag": {
    ...base,
    tone: "accent",
    label: "Engineering",
    removable: true,
  },
  "count chip": { ...base, tone: "accent", label: "Stars", value: "128" },
  "release tag": { ...base, tone: "success", label: "Release", value: "v2.1" },
  "active filter": {
    ...base,
    tone: "accent",
    label: "Design",
    selected: true,
    removable: true,
  },
  "dense row": { ...base, size: "sm", label: "Ops" },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.tone !== "default" && `tone="${c.tone}"`,
    c.size !== "md" && `size="${c.size}"`,
    c.selected && "selected",
    c.value.trim() && `value="${c.value}"`,
    c.removable && `onRemove={() => remove(id)}`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Chip } from "@usva-ui/react/primitives/chip";

<Chip${attrs ? ` ${attrs}` : ""}>${c.label}</Chip>`;
};

export function ChipDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "tone",
          label: "tone",
          sub: "semantic color role",
          options: TONES,
        },
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "sm for dense rows",
          options: SIZES,
        },
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "the text inside",
        },
        {
          kind: "text",
          key: "value",
          label: "value",
          sub: "trailing segment behind a divider",
        },
        {
          kind: "switch",
          key: "selected",
          label: "selected",
          sub: "glow-ring pressed look for active filters",
        },
        {
          kind: "switch",
          key: "removable",
          label: "removable",
          sub: "renders the dismiss button",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Chip
          tone={c.tone}
          size={c.size}
          selected={c.selected}
          value={c.value.trim() ? c.value : undefined}
          onRemove={c.removable ? () => {} : undefined}
          removeLabel={`Remove ${c.label}`}
        >
          {c.label}
        </Chip>
      )}
    />
  );
}
