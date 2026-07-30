import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { SelectDemo } from "./select-demo";

export const metadata: Metadata = pageMetadata("/docs/components/select", {
  title: "Select",
  description:
    "One value out of many, when the list is too long to lay out flat. A controlled, keyboard-accessible select with a live demo, props, and copy-in source.",
});

const props = [
  {
    name: "value",
    type: "Value | null",
    desc: "the controlled selection. pair with onValueChange.",
  },
  {
    name: "defaultValue",
    type: "Value | null",
    desc: "starting selection when uncontrolled.",
  },
  {
    name: "onValueChange",
    type: "(value, eventDetails) => void",
    desc: "fires with the new value when the user picks one.",
  },
  {
    name: "name",
    type: "string",
    desc: "the form field name. a hidden input carries the value.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "dims the trigger to 50% and blocks the popup.",
  },
  {
    name: "Content sideOffset",
    type: "number",
    defaultValue: "6",
    desc: "the gap between trigger and listbox.",
  },
];

export default function SelectPage() {
  return (
    <ComponentDoc
      slug="select"
      client
      description={
        <>
          one value from a closed list, revealed when you open its trigger.{" "}
          <b>for a long set of known options</b>; a few visible choices want
          SegmentedControl or Radio.
        </>
      }
      composition={{
        ok: [
          "form rows next to Input, sharing the same height and focus ring",
          "filter bars where the options are known and short",
        ],
        no: [
          "not for two or three options. that is SegmentedControl",
          "not for navigation. picking an option should never route",
        ],
      }}
      a11y={
        <>
          the trigger is a <code className="font-mono text-xs">combobox</code>,
          the popup a <code className="font-mono text-xs">listbox</code> of{" "}
          <code className="font-mono text-xs">option</code>s · give a trigger
          with no visible label an{" "}
          <code className="font-mono text-xs">aria-label</code>
        </>
      }
      dependencies={<code className="font-mono text-xs">@base-ui/react</code>}
    >
      <SelectDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="select"
        usage={`import { Select } from "@usva-ui/react/primitives/select";

<Select onValueChange={(value) => setFruit(value)}>
  <Select.Trigger aria-label="Fruit">
    <Select.Value placeholder="Pick a fruit" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="apple">Apple</Select.Item>
    <Select.Item value="banana">Banana</Select.Item>
  </Select.Content>
</Select>`}
      />
    </ComponentDoc>
  );
}
