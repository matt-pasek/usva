import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { CheckboxDemo } from "./checkbox-demo";

export const metadata: Metadata = pageMetadata("/docs/components/checkbox", {
  title: "Checkbox",
  description:
    "An independent yes or no, for options that do not exclude each other. Label and description support, on Base UI Checkbox and Field.",
});

const props = [
  {
    name: "checked",
    type: "boolean",
    desc: "controlled checked state.",
  },
  {
    name: "defaultChecked",
    type: "boolean",
    defaultValue: "false",
    desc: "initial checked state when uncontrolled.",
  },
  {
    name: "onCheckedChange",
    type: "(checked: boolean) => void",
    desc: "fires with the next checked state.",
  },
  {
    name: "indeterminate",
    type: "boolean",
    defaultValue: "false",
    desc: "the mixed state, for a parent whose children disagree.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "disables the whole field, label included.",
  },
  {
    name: "label",
    type: "ReactNode",
    desc: "the field label, wired to the control by id.",
  },
  {
    name: "description",
    type: "ReactNode",
    desc: "helper text under the control.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    defaultValue: '"md"',
    desc: "sm for dense rows. the hidden hit area grows to compensate.",
  },
];

export default function CheckboxPage() {
  return (
    <ComponentDoc
      slug="checkbox"
      client
      description={
        <>
          the collecting control. it gathers choices and waits for a submit,
          ticking one commits nothing until you send the form. that deferral is
          the whole line between it and Switch.
        </>
      }
      composition={{
        ok: [
          "forms, settings rows, filter groups. anywhere choices accumulate",
          "indeterminate heads a group whose children disagree",
        ],
        no: [
          "not for actions that apply immediately. that is a switch, not a checkbox",
          "never unlabelled. the label is the click target and the accessible name",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="checkbox"</code> named by
          its label · disabled sets{" "}
          <code className="font-mono text-xs">aria-disabled</code> · the check
          icon is <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">@base-ui/react</code> ·{" "}
          <code className="font-mono text-xs">class-variance-authority</code>
        </>
      }
    >
      <CheckboxDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="checkbox"
        usage={`import { Checkbox } from "usva/primitives/checkbox";

<Checkbox
  label="Accept terms"
  description="You agree to our terms of service."
/>`}
      />
    </ComponentDoc>
  );
}
