"use client";
import { CodeSnippet } from "@matt-pasek/usva/primitives/code-snippet";
import { Playground } from "@/components/docs/playground";

const LANGUAGES = [
  "tsx",
  "typescript",
  "javascript",
  "json",
  "bash",
  "css",
  "plain",
] as const;

type Config = {
  code: string;
  language: (typeof LANGUAGES)[number];
  label: string;
  note: string;
  copyable: boolean;
};

const base: Config = {
  code: `import { CodeSnippet } from "@matt-pasek/usva/primitives/code-snippet";

<CodeSnippet
  label="lib/utils.ts"
  language="typescript"
  code={source}
/>`,
  language: "tsx",
  label: "usage",
  note: "",
  copyable: true,
};

const templates: Record<string, Config> = {
  labelled: base,
  "with note": {
    ...base,
    label: "lib/utils.ts",
    note: "typescript",
    language: "typescript",
  },
  bare: { ...base, label: "" },
  output: {
    ...base,
    label: "output",
    language: "bash",
    copyable: false,
    code: `$ bun run build
built in 412ms`,
  },
};

const snippetFor = (c: Config): string => {
  const lines = ["<CodeSnippet"];
  if (c.label) lines.push(`  label="${c.label}"`);
  if (c.note) lines.push(`  note="${c.note}"`);
  if (c.language !== "tsx") lines.push(`  language="${c.language}"`);
  if (!c.copyable) lines.push("  copyable={false}");
  lines.push("  code={source}");
  lines.push("/>");
  return `import { CodeSnippet } from "@matt-pasek/usva/primitives/code-snippet";

${lines.join("\n")}`;
};

export function CodeSnippetDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "text",
          key: "code",
          label: "code",
          sub: "the text shown and copied",
        },
        {
          kind: "select",
          key: "language",
          label: "language",
          sub: "highlight.js grammar, plain to skip",
          options: LANGUAGES,
        },
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "header caption, empty for no header bar",
        },
        {
          kind: "text",
          key: "note",
          label: "note",
          sub: "quiet right side of the header",
        },
        {
          kind: "switch",
          key: "copyable",
          label: "copyable",
          sub: "off for output and logs",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <CodeSnippet
          code={c.code}
          language={c.language}
          label={c.label || undefined}
          note={c.note || undefined}
          copyable={c.copyable}
        />
      )}
    />
  );
}
