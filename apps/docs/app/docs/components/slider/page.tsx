import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { SliderDemo } from "./slider-demo";

export const metadata: Metadata = {
  title: "Slider",
  description:
    "A value on a continuum, picked by feel, where the trend matters more than the exact number.",
};

const props = [
  { name: "value", type: "number", desc: "controlled value." },
  {
    name: "defaultValue",
    type: "number",
    desc: "initial value when uncontrolled.",
  },
  {
    name: "onValueChange",
    type: "(value: number, event) => void",
    desc: "fires on every change, mid-drag and per key press. use onValueCommitted for release only.",
  },
  { name: "min", type: "number", defaultValue: "0", desc: "lower bound." },
  { name: "max", type: "number", defaultValue: "100", desc: "upper bound." },
  {
    name: "step",
    type: "number",
    defaultValue: "1",
    desc: "increment per arrow key press and per drag tick.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "dims to 50% and ignores pointer and keyboard.",
  },
  {
    name: "label",
    type: "ReactNode",
    desc: "label above the track. also names the slider for screen readers.",
  },
  {
    name: "showValue",
    type: "boolean",
    desc: "current value on the right of the label row.",
  },
  {
    name: "formatValue",
    type: "(value: number) => string",
    desc: "formats the readout. without it, Base UI's own formatting is used.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    defaultValue: '"md"',
    desc: "track and thumb size. sm is for dense rows.",
  },
];

export default function SliderPage() {
  return (
    <ComponentDoc
      slug="slider"
      client
      description={
        <>
          one number, picked along a track by feel: a speed, an opacity, a blur
          radius. when the exact digits matter, ask with Input instead.
        </>
      }
      composition={{
        ok: [
          "settings rows, filter panels, anywhere a value is tuned by feel",
          "pair label with showValue so the number stays visible while dragging",
        ],
        no: [
          "not a range picker. one thumb, one number",
          "not a substitute for a typed field when precision matters",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="slider"</code> named by its
          label · arrow keys, Home and End move the thumb · focus ring on the
          thumb
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">@base-ui/react</code> ·{" "}
          <code className="font-mono text-xs">class-variance-authority</code>
        </>
      }
    >
      <SliderDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="slider"
        usage={`import { Slider } from "@matt-pasek/usva";

<Slider label="Speed" defaultValue={40} step={5} showValue />`}
      />
    </ComponentDoc>
  );
}
