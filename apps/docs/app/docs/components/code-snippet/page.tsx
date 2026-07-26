import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { CodeSnippetDemo } from "./code-snippet-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/code-snippet",
  {
    title: "CodeSnippet",
    description:
      "Highlighted code with the copy button already there. The syntax palette is painted with role tokens, so it reskins with the theme.",
  },
);

const props = [
  {
    name: "code",
    type: "string",
    desc: "the text shown and copied.",
  },
  {
    name: "language",
    type: "string",
    defaultValue: '"tsx"',
    desc: (
      <>
        any grammar in highlight.js&apos;s common set.{" "}
        <code className="font-mono text-xs">&quot;plain&quot;</code> or an
        unknown name renders as-is.
      </>
    ),
  },
  {
    name: "label",
    type: "ReactNode",
    desc: "the header caption, e.g. a file path. without it there is no header bar.",
  },
  {
    name: "note",
    type: "ReactNode",
    desc: "the quiet right side of the header bar.",
  },
  {
    name: "copyable",
    type: "boolean",
    defaultValue: "true",
    desc: "off for output, logs, anything not meant to be pasted.",
  },
  {
    name: "preClassName",
    type: "string",
    desc: (
      <>
        extra classes for the scrolling pre, e.g.{" "}
        <code className="font-mono text-xs">max-h-[32rem]</code> for long
        sources.
      </>
    ),
  },
];

export default function CodeSnippetPage() {
  return (
    <ComponentDoc
      slug="code-snippet"
      client
      description={
        <>
          a code block with a copy button. the highlighting is painted from the
          theme&apos;s own tokens, so it never clashes with the surface it sits
          on the way a borrowed dark palette would.
        </>
      }
      composition={{
        ok: [
          "docs pages, Panel bodies, Dialog bodies, anywhere prose explains code",
          "Terminal is the one-line sibling for shell commands",
        ],
        no: ["not an editor", "one block per thing to copy, never nested"],
      }}
      a11y={<>the copy button is labelled</>}
      dependencies={
        <>
          <code className="font-mono text-xs">highlight.js</code> · Button{" "}
          <span className="text-muted">from the same package</span>
        </>
      }
    >
      <CodeSnippetDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="code-snippet"
        usage={`import { CodeSnippet } from "@matt-pasek/usva/primitives/code-snippet";

<CodeSnippet
  label="lib/utils.ts"
  language="typescript"
  code={source}
/>`}
      />
    </ComponentDoc>
  );
}
