"use client";
import { Button } from "@matt-pasek/usva/primitives/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@matt-pasek/usva/primitives/tooltip";
import { Playground } from "@/components/docs/playground";

type Config = {
  content: string;
  sideOffset: number;
};

const base: Config = { content: "Deploys the current branch", sideOffset: 6 };

const templates: Record<string, Config> = {
  hint: base,
  "further offset": {
    ...base,
    content: "sits further from the trigger",
    sideOffset: 12,
  },
};

const snippetFor = (c: Config): string =>
  `import { Tooltip, TooltipContent, TooltipTrigger } from "@matt-pasek/usva/primitives/tooltip";

<Tooltip>
  <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
  <TooltipContent${c.sideOffset !== 6 ? ` sideOffset={${c.sideOffset}}` : ""}>${c.content}</TooltipContent>
</Tooltip>`;

export function TooltipDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "text",
          key: "content",
          label: "content",
          sub: "the label on hover and focus",
        },
        {
          kind: "slider",
          key: "sideOffset",
          label: "sideOffset",
          sub: "gap from the trigger, in pixels",
          min: 0,
          max: 20,
          step: 1,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={<Button variant="outline">Hover me</Button>}
            />
            <TooltipContent sideOffset={c.sideOffset}>
              {c.content}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    />
  );
}
