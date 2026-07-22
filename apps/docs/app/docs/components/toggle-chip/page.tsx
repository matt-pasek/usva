import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { ToggleChipDemo } from "./toggle-chip-demo";

export const metadata: Metadata = {
  title: "Toggle Chip",
  description:
    "Chips that stay pressed: a filter you turn on rather than a tag you read. Bounded multi-select, or one-of-many.",
};

const groupProps = [
  {
    name: "type",
    type: '"multiple" | "single"',
    defaultValue: '"multiple"',
    desc: (
      <>
        single keeps exactly one chip pressed.{" "}
        <b>the last chip cannot be deselected</b>.
      </>
    ),
  },
  {
    name: "value",
    type: "string | string[]",
    desc: "the pressed ids. controlled; there is no uncontrolled mode.",
  },
  {
    name: "onValueChange",
    type: "(value) => void",
    desc: "hands back a string[] in multiple mode, a bare id in single mode.",
  },
  {
    name: "min",
    type: "number",
    desc: "multiple only. selected chips lock once the count falls to it.",
  },
  {
    name: "max",
    type: "number",
    desc: "multiple only. unselected chips lock once the count reaches it.",
  },
  {
    name: "label",
    type: "ReactNode",
    desc: "mono eyebrow before the chips. names the group when it is a string.",
  },
  {
    name: "ariaLabel",
    type: "string",
    desc: "names the group when label is not a string.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "the fieldset disables every chip at once.",
  },
];

const chipProps = [
  {
    name: "value",
    type: "string",
    desc: "the chip's id. must be unique inside the group.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "disables this chip on top of whatever the group decides.",
  },
];

export default function ToggleChipPage() {
  return (
    <ComponentDoc
      slug="toggle-chip"
      client
      description={
        <>
          pressable chips for choosing what a view shows, when a checkbox list
          is too heavy and a dropdown would hide the choices.
        </>
      }
      composition={{
        ok: [
          "dashboard headers and filter rows, picking visible stats or panels",
          "single mode where a view must always have one panel selected",
        ],
        no: [
          "not a form field. submitting data is Checkbox or RadioGroup",
          "not navigation between views. that is SegmentedControl or Tabs",
        ],
      }}
      a11y={
        <>
          each chip is a button carrying{" "}
          <code className="font-mono text-xs">aria-pressed</code> · the group is
          a <code className="font-mono text-xs">fieldset</code> named by
          ariaLabel or a string label · no roving focus, chips sit in the normal
          Tab order
        </>
      }
    >
      <ToggleChipDemo />

      <PropsTable title="ToggleChipGroup" rows={groupProps} />
      <PropsTable title="ToggleChip" rows={chipProps} />

      <AcquireSection
        registryName="toggle-chip"
        usage={`import { ToggleChip, ToggleChipGroup } from "@matt-pasek/usva";

<ToggleChipGroup value={stats} onValueChange={setStats} min={2} max={4} ariaLabel="Visible stats">
  <ToggleChip value="grade-avg">Grade avg.</ToggleChip>
  <ToggleChip value="active-courses">Active courses</ToggleChip>
</ToggleChipGroup>`}
      />
    </ComponentDoc>
  );
}
