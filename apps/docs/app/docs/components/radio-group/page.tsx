import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { RadioGroupDemo } from "./radio-group-demo";

export const metadata: Metadata = pageMetadata("/docs/components/radio-group", {
  title: "Radio Group",
  description:
    "The container a Radio needs: it owns the value, arrow-key roving focus and the shared disabled state.",
});

const props = [
  {
    name: "value",
    type: "Value",
    desc: "the selected option. controlled, and generic, so the value does not have to be a string.",
  },
  {
    name: "onValueChange",
    type: "(value: Value) => void",
    desc: "fires with the newly selected value.",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"vertical"',
    desc: "how the options stack, and which arrow keys move between them.",
  },
  {
    name: "disabled",
    type: "boolean",
    desc: "locks every Radio inside at once, rather than one by one.",
  },
];

export default function RadioGroupPage() {
  return (
    <ComponentDoc
      slug="radio-group"
      name="RadioGroup"
      layer="primitive"
      provenance={["sisu-plus"]}
      client
      description={
        <>
          a Radio on its own is half a control. the group is what holds the
          value, moves focus between the options and speaks for them as one
          question.
        </>
      }
      composition={{
        ok: [
          "one question, two to five options, all visible at once",
          "orientation follows the shape of the answers: long labels stack",
        ],
        no: [
          "never a lone Radio outside a group. it has nothing to belong to",
          "past about five options this wants a Select instead",
        ],
      }}
      a11y={
        <>
          give it an <code className="font-mono text-xs">aria-label</code> or a
          visible label · arrow keys move between options, tab moves past the
          whole group
        </>
      }
      dependencies={
        <>
          Base UI <span className="text-muted">radio group</span>
        </>
      }
    >
      <RadioGroupDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="radio"
        usage={`import { Radio, RadioGroup } from "usva/primitives/radio";

<RadioGroup value={theme} onValueChange={setTheme} aria-label="theme">
  <Radio value="kajo">kajo</Radio>
  <Radio value="sisu">sisu</Radio>
</RadioGroup>`}
      />
    </ComponentDoc>
  );
}
