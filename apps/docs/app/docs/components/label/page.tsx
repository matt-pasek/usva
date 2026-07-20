import { Input, Label } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";

export const metadata: Metadata = {
  title: "Label",
  description:
    "The name of a form control that focuses it on click, with disabled and monospace variants.",
};

const props = [
  {
    name: "htmlFor",
    type: "string",
    desc: "the control's id. clicking the label focuses it.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: (
      <>
        muted, not-allowed styling and <code>data-disabled</code>.{" "}
        <b>style only</b>, disable the control too.
      </>
    ),
  },
  {
    name: "mono",
    type: "boolean",
    defaultValue: "false",
    desc: "the monospace family, for tokens, ids and machine names.",
  },
];

export default function LabelPage() {
  return (
    <ComponentDoc
      slug="label"
      description={
        <>
          the name of a form control, click it and the control focuses.{" "}
          <b>never a heading or a caption</b>.
        </>
      }
      composition={{
        ok: [
          "above an Input or Select, beside a Checkbox, wired with htmlFor",
          "mono for tokens, ids and machine names",
        ],
        no: [
          "never a section heading or a caption",
          "disabled dims the label only. disable the control too",
        ],
      }}
      a11y={
        <>
          a real <code className="font-mono text-xs">&lt;label&gt;</code> ·{" "}
          <code className="font-mono text-xs">htmlFor</code> clicks through to
          the control · disabled sets{" "}
          <code className="font-mono text-xs">data-disabled</code>
        </>
      }
    >
      <DemoPanel>
        <div className="mx-auto flex max-w-sm flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-email">Email</Label>
            <Input id="demo-email" type="email" placeholder="you@usva.dev" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-token" mono>
              API token
            </Label>
            <Input id="demo-token" placeholder="sk_live_…" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="demo-locked" disabled>
              Locked field
            </Label>
            <Input id="demo-locked" disabled placeholder="Unavailable" />
          </div>
        </div>
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection
        registryName="label"
        usage={`import { Input, Label } from "@matt-pasek/usva";

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="you@usva.dev" />`}
      />
    </ComponentDoc>
  );
}
