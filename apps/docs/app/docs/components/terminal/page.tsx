import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { TerminalDemo } from "./terminal-demo";

export const metadata: Metadata = pageMetadata("/docs/components/terminal", {
  title: "Terminal",
  description:
    "A shell command behind a prompt, with a copy button that skips the prompt.",
});

const props = [
  {
    name: "command",
    type: "string",
    desc: "just the command. what gets copied.",
  },
  {
    name: "prompt",
    type: "string",
    defaultValue: '"$"',
    desc: "decorative, hidden from screen readers.",
  },
  {
    name: "copyable",
    type: "boolean",
    defaultValue: "true",
    desc: "off for examples nobody should run.",
  },
  {
    name: "onCopied",
    type: "(value: string) => void",
    desc: "fires after a successful copy, never on a denied one.",
  },
];

export default function TerminalPage() {
  return (
    <ComponentDoc
      slug="terminal"
      client
      description={
        <>
          a shell command in a row, with the copy button already there. scoped
          packages and urls carry the accent. anything longer than a line is
          CodeSnippet with bash.
        </>
      }
      composition={{
        ok: [
          "install sections, docs, empty states that end in a command",
          "stack a few for a sequence",
        ],
        no: ["not a shell. it does not execute or scroll", "not for output"],
      }}
      a11y={
        <>
          the prompt is <code className="font-mono text-xs">aria-hidden</code> ·
          the copy button is labelled
        </>
      }
      dependencies={
        <>
          CodeSnippet <span className="text-muted">from the same package</span>
        </>
      }
    >
      <TerminalDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="terminal"
        usage={`import { Terminal } from "usva/primitives/terminal";

<Terminal command="bun add usva" />`}
      />
    </ComponentDoc>
  );
}
