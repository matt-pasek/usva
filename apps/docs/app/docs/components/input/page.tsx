import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { InputDemo } from "./input-demo";

export const metadata: Metadata = pageMetadata("/docs/components/input", {
  title: "Input",
  description:
    "One line of text over the native input, with its own focus ring, hover border, invalid, and disabled states.",
});

const props = [
  {
    name: "aria-invalid",
    type: "boolean",
    defaultValue: "false",
    desc: "danger border and ring for the field the error text points at.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "dims to 50% with a not-allowed cursor.",
  },
  {
    name: "…InputHTMLAttributes",
    type: "React.InputHTMLAttributes",
    desc: "every native input attribute passes straight through.",
  },
];

export default function InputPage() {
  return (
    <ComponentDoc
      slug="input"
      client
      description={
        <>
          a single line of text you type into. anything longer is a textarea,
          not a taller Input.
        </>
      }
      composition={{
        ok: [
          "under a Label, inside form rows and field groups",
          "aria-invalid flags the field the error text points at",
        ],
        no: [
          "never unlabeled. a placeholder is not a label",
          "no search icons or buttons stuffed inside. wrap it instead",
        ],
      }}
      a11y={
        <>
          a native <code className="font-mono text-xs">&lt;input&gt;</code>,
          named by a Label or{" "}
          <code className="font-mono text-xs">aria-label</code> ·{" "}
          <code className="font-mono text-xs">aria-invalid</code> paints the
          danger state
        </>
      }
    >
      <InputDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="input"
        usage={`import { Input } from "usva/primitives/input";

<Input placeholder="you@example.com" type="email" />
<Input aria-invalid defaultValue="not-an-email" />
<Input disabled placeholder="Disabled" />`}
      />
    </ComponentDoc>
  );
}
