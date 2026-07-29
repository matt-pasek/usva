"use client";
import { Popover } from "usva/primitives/popover";
import { Playground } from "@/components/docs/playground";

const SIDES = ["top", "right", "bottom", "left"] as const;
const ALIGNS = ["start", "center", "end"] as const;

type Config = {
  side: (typeof SIDES)[number];
  align: (typeof ALIGNS)[number];
  sideOffset: number;
  title: string;
  description: string;
};

const base: Config = {
  side: "bottom",
  align: "center",
  sideOffset: 8,
  title: "Notifications",
  description: "You have no new notifications.",
};

const templates: Record<string, Config> = {
  default: base,
  "right filter": {
    ...base,
    side: "right",
    align: "start",
    title: "Filters",
    description: "Narrow the results by status and owner.",
  },
  "far top": { ...base, side: "top", sideOffset: 16 },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.side !== "bottom" && `side="${c.side}"`,
    c.align !== "center" && `align="${c.align}"`,
    c.sideOffset !== 8 && `sideOffset={${c.sideOffset}}`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Popover } from "usva/primitives/popover";

<Popover>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content${attrs ? ` ${attrs}` : ""}>
    <Popover.Title>${c.title}</Popover.Title>
    <Popover.Description>${c.description}</Popover.Description>
  </Popover.Content>
</Popover>`;
};

export function PopoverDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "side",
          label: "side",
          sub: "preferred side of the trigger",
          options: SIDES,
        },
        {
          kind: "select",
          key: "align",
          label: "align",
          sub: "alignment along that side",
          options: ALIGNS,
        },
        {
          kind: "slider",
          key: "sideOffset",
          label: "sideOffset",
          sub: "gap from the trigger, in pixels",
          min: 0,
          max: 24,
          step: 1,
        },
        {
          kind: "text",
          key: "title",
          label: "title",
          sub: "the popup's accessible name",
        },
        {
          kind: "text",
          key: "description",
          label: "description",
          sub: "supporting line below the title",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Popover key={`${c.side}-${c.align}-${c.sideOffset}`} defaultOpen>
          <Popover.Trigger className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink transition-colors hover:bg-surface-2">
            Open popover
          </Popover.Trigger>
          <Popover.Content
            side={c.side}
            align={c.align}
            sideOffset={c.sideOffset}
          >
            <Popover.Title>{c.title}</Popover.Title>
            <Popover.Description>{c.description}</Popover.Description>
          </Popover.Content>
        </Popover>
      )}
    />
  );
}
