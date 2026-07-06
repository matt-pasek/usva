import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { FieldGroupDemo } from "./field-group-demo";

export const metadata: Metadata = {
  title: "Field Group",
  description:
    "An accessible form field wrapper that wires label, control, description, and error together with the correct aria attributes.",
};

const props = [
  {
    name: "id",
    type: "string",
    desc: "Base id for the field; derived ids power htmlFor and aria-describedby. Auto-generated when omitted.",
  },
  {
    name: "className",
    type: "string",
    desc: "Merged onto the root wrapper (a flex column).",
  },
  {
    name: "...div props",
    type: "HTMLAttributes<HTMLDivElement>",
    desc: "Any standard div attribute is forwarded to the wrapper.",
  },
];

const usageSnippet = `import {
  FieldGroup,
  FieldLabel,
  FieldControl,
  FieldDescription,
  FieldError,
  Input,
} from "@matt-pasek/usva";

<FieldGroup>
  <FieldLabel>Email address</FieldLabel>
  <FieldControl>
    <Input type="email" placeholder="you@studio.fi" />
  </FieldControl>
  <FieldDescription>We only email about releases.</FieldDescription>
  <FieldError>Enter a valid email address.</FieldError>
</FieldGroup>`;

export default function FieldGroupPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Field Group</h1>
        <p className="text-muted">
          A compound form field — <code>FieldGroup</code> wraps{" "}
          <code>FieldLabel</code>, <code>FieldControl</code>,{" "}
          <code>FieldDescription</code>, and <code>FieldError</code>. Mounting a{" "}
          <code>FieldError</code> flips the control to <code>aria-invalid</code>{" "}
          and appends the message id to <code>aria-describedby</code>{" "}
          automatically.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <FieldGroupDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="field-group" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{usageSnippet}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/patterns/field-group/field-group.tsx" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Props</CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pr-4 font-medium">Prop</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p.name} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-xs text-ink">
                      {p.name}
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-muted">
                      {p.type}
                    </td>
                    <td className="py-2 text-muted">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
