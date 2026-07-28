"use client";
import { Button } from "usva/primitives/button";
import { HintPopover } from "usva/primitives/hint-popover";
import { Playground } from "@/components/docs/playground";

const TONES = [
  "neutral",
  "accent",
  "success",
  "warning",
  "danger",
  "info",
] as const;

const SIDES = ["top", "right", "bottom", "left"] as const;

type Config = {
  tone: (typeof TONES)[number];
  side: (typeof SIDES)[number];
  trigger: string;
  title: string;
  body: string;
  action: boolean;
  openDelay: number;
  closeDelay: number;
};

const base: Config = {
  tone: "neutral",
  side: "top",
  trigger: "What counts as active?",
  title: "",
  body: "A student who has logged in during the last 30 days.",
  action: false,
  openDelay: 120,
  closeDelay: 200,
};

const templates: Record<string, Config> = {
  definition: base,
  prerequisite: {
    ...base,
    tone: "warning",
    trigger: "2 warnings",
    title: "Prerequisite not met",
    body: "MATH-201 must be completed before MATH-305.",
    action: true,
  },
  "dismissible tip": {
    ...base,
    tone: "info",
    side: "right",
    title: "New this term",
    body: "Attendance now syncs from the roster automatically.",
    action: true,
  },
  danger: {
    ...base,
    tone: "danger",
    trigger: "Enrollment closed",
    title: "Cannot enroll",
    body: "The course cap has been reached for this section.",
  },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.tone !== "neutral" && `\n  tone="${c.tone}"`,
    c.side !== "top" && `\n  side="${c.side}"`,
    c.title && `\n  title="${c.title}"`,
    c.openDelay !== 120 && `\n  openDelay={${c.openDelay}}`,
    c.closeDelay !== 200 && `\n  closeDelay={${c.closeDelay}}`,
    `\n  trigger={<Button variant="ghost">${c.trigger}</Button>}`,
    c.action &&
      `\n  action={<Button size="sm" variant="ghost">Dismiss</Button>}`,
  ]
    .filter(Boolean)
    .join("");
  return `import { Button } from "usva/primitives/button";
import { HintPopover } from "usva/primitives/hint-popover";

<HintPopover${attrs}
>
  ${c.body}
</HintPopover>`;
};

export function HintPopoverDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="min-h-40 flex items-center justify-center"
      fields={[
        {
          kind: "select",
          key: "tone",
          label: "tone",
          sub: "tints panel and icon",
          options: TONES,
        },
        {
          kind: "select",
          key: "side",
          label: "side",
          sub: "edge the panel hangs off",
          options: SIDES,
        },
        {
          kind: "text",
          key: "trigger",
          label: "trigger",
          sub: "text of the element it hangs off",
        },
        {
          kind: "text",
          key: "title",
          label: "title",
          sub: "bold first line, optional",
        },
        {
          kind: "text",
          key: "body",
          label: "children",
          sub: "the explanation",
        },
        {
          kind: "switch",
          key: "action",
          label: "action",
          sub: "adds a dismiss button in the footer",
        },
        {
          kind: "slider",
          key: "openDelay",
          label: "openDelay",
          sub: "hover dwell before opening",
          min: 0,
          max: 600,
          step: 20,
        },
        {
          kind: "slider",
          key: "closeDelay",
          label: "closeDelay",
          sub: "grace period after the pointer leaves",
          min: 0,
          max: 600,
          step: 20,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <HintPopover
          key={`${c.side}-${c.tone}`}
          tone={c.tone}
          side={c.side}
          title={c.title || undefined}
          action={
            c.action ? (
              <Button size="sm" variant="ghost">
                Dismiss
              </Button>
            ) : undefined
          }
          openDelay={c.openDelay}
          closeDelay={c.closeDelay}
          trigger={<Button variant="ghost">{c.trigger}</Button>}
        >
          {c.body}
        </HintPopover>
      )}
    />
  );
}
