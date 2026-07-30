"use client";
import { DropdownMenu } from "@usva-ui/react/primitives/dropdown-menu";
import { Playground } from "@/components/docs/playground";

type Config = {
  triggerLabel: string;
  groupLabel: string;
  sideOffset: number;
  disableDelete: boolean;
};

const base: Config = {
  triggerLabel: "Open menu",
  groupLabel: "Actions",
  sideOffset: 6,
  disableDelete: true,
};

const templates: Record<string, Config> = {
  actions: base,
  flush: { ...base, groupLabel: "", sideOffset: 0 },
  roomy: { ...base, sideOffset: 12 },
  "all enabled": { ...base, disableDelete: false },
};

const snippetFor = (c: Config): string => {
  const offset = c.sideOffset !== 6 ? ` sideOffset={${c.sideOffset}}` : "";
  const label = c.groupLabel
    ? `
    <DropdownMenu.Label>${c.groupLabel}</DropdownMenu.Label>`
    : "";
  const del = c.disableDelete
    ? "<DropdownMenu.Item disabled>Delete</DropdownMenu.Item>"
    : "<DropdownMenu.Item>Delete</DropdownMenu.Item>";
  return `import { DropdownMenu } from "@usva-ui/react/primitives/dropdown-menu";

<DropdownMenu>
  <DropdownMenu.Trigger>${c.triggerLabel}</DropdownMenu.Trigger>
  <DropdownMenu.Content${offset}>${label}
    <DropdownMenu.Item>Edit</DropdownMenu.Item>
    <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
    <DropdownMenu.Separator />
    ${del}
  </DropdownMenu.Content>
</DropdownMenu>`;
};

export function DropdownMenuDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="flex min-h-52 items-start justify-center"
      fields={[
        {
          kind: "text",
          key: "triggerLabel",
          label: "trigger",
          sub: "the button text",
        },
        {
          kind: "text",
          key: "groupLabel",
          label: "Label",
          sub: "group name above items, empty hides it",
        },
        {
          kind: "slider",
          key: "sideOffset",
          label: "sideOffset",
          sub: "gap between trigger and panel",
          min: 0,
          max: 24,
          step: 1,
        },
        {
          kind: "switch",
          key: "disableDelete",
          label: "disabled",
          sub: "dims the delete item, blocks selection",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <DropdownMenu
          key={`${c.sideOffset}-${c.groupLabel}-${c.disableDelete}`}
        >
          <DropdownMenu.Trigger className="rounded-md border border-border px-3 py-1.5 text-sm text-ink">
            {c.triggerLabel}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content sideOffset={c.sideOffset}>
            {c.groupLabel ? (
              <DropdownMenu.Label>{c.groupLabel}</DropdownMenu.Label>
            ) : null}
            <DropdownMenu.Item>Edit</DropdownMenu.Item>
            <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item disabled={c.disableDelete}>
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      )}
    />
  );
}
