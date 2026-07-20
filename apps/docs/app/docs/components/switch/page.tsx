import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { SwitchDemo } from "./switch-demo";

export const metadata: Metadata = {
  title: "Switch",
  description:
    "An on/off control that takes effect immediately, with a label and optional description.",
};

const props = [
  {
    name: "checked",
    type: "boolean",
    desc: "controlled checked state. pair with onCheckedChange.",
  },
  {
    name: "defaultChecked",
    type: "boolean",
    defaultValue: "false",
    desc: "initial state when uncontrolled.",
  },
  {
    name: "onCheckedChange",
    type: "(checked: boolean) => void",
    desc: "fires with the next state on every toggle.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "dims to 50% and blocks the pointer. disables the whole field.",
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
    desc: "sm for dense rows. both keep a full-height hit area.",
  },
];

export default function SwitchPage() {
  return (
    <ComponentDoc
      slug="switch"
      client
      description={
        <>
          a labelled on/off control that takes effect immediately.{" "}
          <b>flipping it changes something now</b>, with no save button after.
        </>
      }
      composition={{
        ok: [
          "settings rows and preference panels, one per line with a label",
          "description carries the consequence when the label alone is vague",
        ],
        no: [
          "not for choices a form submits later. that is Checkbox",
          "never unlabelled. the thumb alone says nothing about what it toggles",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="switch"</code> named by its
          label · toggles with space · disabled sets{" "}
          <code className="font-mono text-xs">aria-disabled</code> · focus ring
          on the track
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">@base-ui/react</code>{" "}
          <span className="text-muted">(Switch + Field)</span> ·{" "}
          <code className="font-mono text-xs">class-variance-authority</code>
        </>
      }
    >
      <SwitchDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="switch"
        usage={`import { Switch } from "@matt-pasek/usva";

<Switch
  label="Notifications"
  description="Enable push notifications for updates."
  onCheckedChange={(checked) => setEnabled(checked)}
/>`}
      />
    </ComponentDoc>
  );
}
