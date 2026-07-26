import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { RadioDemo } from "./radio-demo";

export const metadata: Metadata = pageMetadata("/docs/components/radio", {
  title: "Radio",
  description:
    "Exactly one of a few, each option carrying its own label and description. More than five and you want a Select.",
});

const groupProps = [
  {
    name: "value",
    type: "Value",
    desc: "controlled selected value.",
  },
  {
    name: "defaultValue",
    type: "Value",
    desc: "initial selected value when uncontrolled.",
  },
  {
    name: "onValueChange",
    type: "(value: Value, eventDetails) => void",
    desc: "fires when the selected value changes.",
  },
  {
    name: "name",
    type: "string",
    desc: "identifies the group in form submissions.",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"vertical"',
    desc: "layout direction, announced to assistive tech.",
  },
];

const radioProps = [
  {
    name: "value",
    type: "Value",
    desc: "the value this radio represents.",
  },
  {
    name: "label",
    type: "ReactNode",
    desc: "the field label, clickable and tied to the control.",
  },
  {
    name: "description",
    type: "ReactNode",
    desc: "helper text below, indented to line up under the label.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "dims to 50% and blocks selection.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    defaultValue: '"md"',
    desc: "control size. the hit area extends well past both.",
  },
];

export default function RadioPage() {
  return (
    <ComponentDoc
      slug="radio"
      client
      description={
        <>
          one choice from a visible set of options.{" "}
          <b>use it when every option should be seen at once</b>; a long list
          wants a select.
        </>
      }
      composition={{
        ok: [
          "settings forms, plan pickers, anywhere 2 to 5 options fit on screen",
          "orientation horizontal for short, label-only options",
        ],
        no: [
          "not for more than a handful of options. that is a select",
          "descriptions on horizontal groups, the indent only works stacked",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">radiogroup</code> with{" "}
          <code className="font-mono text-xs">aria-orientation</code> · each
          radio reflects <code className="font-mono text-xs">aria-checked</code>{" "}
          and <code className="font-mono text-xs">aria-disabled</code> · label
          and description bind through Field
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">@base-ui/react</code> ·{" "}
          <code className="font-mono text-xs">class-variance-authority</code>
        </>
      }
    >
      <RadioDemo />

      <PropsTable title="RadioGroup" rows={groupProps} />
      <PropsTable title="Radio" rows={radioProps} />

      <AcquireSection
        registryName="radio"
        usage={`import { Radio, RadioGroup } from "@matt-pasek/usva/primitives/radio";

<RadioGroup name="plan" defaultValue="free">
  <Radio value="free" label="Free" description="Good for trying things out." />
  <Radio value="pro" label="Pro" description="For growing teams." />
</RadioGroup>`}
      />
    </ComponentDoc>
  );
}
