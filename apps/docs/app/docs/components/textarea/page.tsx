import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { TextareaDemo } from "./textarea-demo";

export const metadata: Metadata = pageMetadata("/docs/components/textarea", {
  title: "Textarea",
  description:
    "Text that runs past one line, on the input's surface, focus ring and invalid state. Grows with what you type when you ask it to.",
});

const props = [
  {
    name: "autoGrow",
    type: "boolean",
    defaultValue: "false",
    desc: "grows with the content instead of scrolling. off by default, so height stays yours.",
  },
  {
    name: "minRows",
    type: "number",
    defaultValue: "2",
    desc: "shortest the field ever gets. also seeds the rows attribute under autoGrow.",
  },
  {
    name: "maxRows",
    type: "number",
    desc: "where growing stops and scrolling starts. unbounded when unset.",
  },
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
    name: "…TextareaHTMLAttributes",
    type: "React.TextareaHTMLAttributes",
    desc: "every native textarea attribute passes straight through.",
  },
];

export default function TextareaPage() {
  return (
    <ComponentDoc
      slug="textarea"
      client
      description={
        <>
          text that runs past one line. same surface, focus ring and invalid
          state as Input, and it can grow with what you type.
        </>
      }
      composition={{
        ok: [
          "under a Label, inside a FieldGroup, with FieldCount for a limit",
          "autoGrow with a maxRows, so a long answer never eats the page",
        ],
        no: [
          "not for one line. that is an Input, however wide you make it",
          "autoGrow without maxRows in a short form. it will run off screen",
        ],
      }}
      a11y={
        <>
          a native <code className="font-mono text-xs">&lt;textarea&gt;</code>,
          named by a Label or{" "}
          <code className="font-mono text-xs">aria-label</code> ·{" "}
          <code className="font-mono text-xs">aria-invalid</code> paints the
          danger state · autoGrow only changes height, never focus or caret
        </>
      }
    >
      <TextareaDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="textarea"
        usage={`import { Textarea } from "@usva-ui/react/primitives/textarea";

<Textarea placeholder="Tell us about yourself…" rows={3} />
<Textarea autoGrow minRows={2} maxRows={10} />
<Textarea aria-invalid defaultValue="Too short." />
<Textarea disabled defaultValue="Read only for now." />`}
      />
    </ComponentDoc>
  );
}
