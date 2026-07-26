"use client";
import { Terminal } from "@matt-pasek/usva/primitives/terminal";
import { Playground } from "@/components/docs/playground";

type Config = {
  command: string;
  prompt: string;
  copyable: boolean;
};

const base: Config = {
  command: "bun add @matt-pasek/usva",
  prompt: "$",
  copyable: true,
};

const templates: Record<string, Config> = {
  install: base,
  registry: {
    ...base,
    command: "npx shadcn add https://usva.dev/r/terminal.json",
  },
  "dev server": { ...base, command: "bun run dev", prompt: ">" },
  "read only": { ...base, command: "rm -rf node_modules", copyable: false },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    `command="${c.command}"`,
    c.prompt !== "$" && `prompt="${c.prompt}"`,
    !c.copyable && "copyable={false}",
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Terminal } from "@matt-pasek/usva/primitives/terminal";

<Terminal ${attrs} />`;
};

export function TerminalDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "text",
          key: "command",
          label: "command",
          sub: "the command, without the prompt",
        },
        {
          kind: "text",
          key: "prompt",
          label: "prompt",
          sub: "decorative, hidden from screen readers",
        },
        {
          kind: "switch",
          key: "copyable",
          label: "copyable",
          sub: "off for examples nobody should run",
        },
      ]}
      snippet={snippetFor}
      stageClassName="mx-auto w-full max-w-xl"
      render={(c) => (
        <Terminal command={c.command} prompt={c.prompt} copyable={c.copyable} />
      )}
    />
  );
}
