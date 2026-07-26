import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { FieldGroupDemo } from "./field-group-demo";

export const metadata: Metadata = pageMetadata("/docs/components/field-group", {
  title: "Field Group",
  description:
    "Label, control, description and error, wired together as one accessible unit.",
});

const props = [
  {
    name: "id",
    type: "string",
    desc: "base id for the field; derived ids power htmlFor and aria-describedby. auto-generated when omitted.",
  },
  {
    name: "className",
    type: "string",
    desc: "merged onto the root wrapper, a flex column.",
  },
  {
    name: "...div props",
    type: "HTMLAttributes<HTMLDivElement>",
    desc: "any standard div attribute is forwarded to the wrapper.",
  },
];

export default function FieldGroupPage() {
  return (
    <ComponentDoc
      slug="field-group"
      client
      description={
        <>
          a form field that keeps its label, control, description and error
          message together as one accessible unit. mount a FieldError and the
          control flips to invalid, with the message linked, on its own.
        </>
      }
      composition={{
        ok: [
          "one control per group: Input, Select, whatever FieldControl clones",
          "render FieldError conditionally, mounting it is the error state",
        ],
        no: [
          "FieldControl takes exactly one child element",
          "never two controls in one group, every derived id points at one thing",
        ],
      }}
      a11y={
        <>
          the label is wired via{" "}
          <code className="font-mono text-xs">htmlFor</code> · FieldError is{" "}
          <code className="font-mono text-xs">role="alert"</code> · description
          and error ids land in{" "}
          <code className="font-mono text-xs">aria-describedby</code>
        </>
      }
      dependencies={
        <>
          Label <span className="text-muted">from the same package</span>
        </>
      }
    >
      <DemoPanel note="type without an @ to trip the error">
        <div className="mx-auto max-w-md">
          <FieldGroupDemo />
        </div>
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection
        registryName="field-group"
        usage={`import { FieldControl, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@matt-pasek/usva/patterns/field-group";
import { Input } from "@matt-pasek/usva/primitives/input";

<FieldGroup>
  <FieldLabel>Email address</FieldLabel>
  <FieldControl>
    <Input type="email" placeholder="you@studio.fi" />
  </FieldControl>
  <FieldDescription>We only email about releases.</FieldDescription>
  <FieldError>Enter a valid email address.</FieldError>
</FieldGroup>`}
      />
    </ComponentDoc>
  );
}
