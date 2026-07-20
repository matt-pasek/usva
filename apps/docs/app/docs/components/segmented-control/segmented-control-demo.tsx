"use client";
import { SegmentedControl } from "@matt-pasek/usva";
import { Playground } from "@/components/docs/playground";

const SIZES = ["sm", "md"] as const;
const ORIENTATIONS = ["horizontal", "vertical"] as const;

const views = [
  { value: "board", label: "Board" },
  { value: "list", label: "List" },
  { value: "calendar", label: "Calendar" },
];

type Config = {
  size: (typeof SIZES)[number];
  orientation: (typeof ORIENTATIONS)[number];
};

const base: Config = { size: "md", orientation: "horizontal" };

const templates: Record<string, Config> = {
  "view switcher": base,
  compact: { ...base, size: "sm" },
  vertical: { ...base, orientation: "vertical" },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.size !== "md" && `size="${c.size}"`,
    c.orientation !== "horizontal" && `orientation="${c.orientation}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { SegmentedControl } from "@matt-pasek/usva";

<SegmentedControl
  items={[
    { value: "board", label: "Board" },
    { value: "list", label: "List" },
    { value: "calendar", label: "Calendar" },
  ]}
  defaultValue="board"${attrs ? `\n  ${attrs}` : ""}
/>`;
};

export function SegmentedControlDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "segment height and padding",
          options: SIZES,
        },
        {
          kind: "select",
          key: "orientation",
          label: "orientation",
          sub: "row, or a stacked column",
          options: ORIENTATIONS,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <SegmentedControl
          key={`${c.size}-${c.orientation}`}
          items={views}
          defaultValue="board"
          size={c.size}
          orientation={c.orientation}
        />
      )}
    />
  );
}
