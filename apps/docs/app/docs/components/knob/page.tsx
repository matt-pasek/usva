import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { KnobDemo } from "./knob-demo";

export const metadata: Metadata = pageMetadata("/docs/components/knob", {
  title: "Knob",
  description:
    "A value set by turning, for controls that sit in a row and are tuned against each other.",
});

const props = [
  { name: "value", type: "number", desc: "controlled value." },
  {
    name: "defaultValue",
    type: "number",
    desc: "initial value when uncontrolled.",
  },
  {
    name: "onValueChange",
    type: "(value: number) => void",
    desc: "fires on every change, mid-drag and per key press.",
  },
  {
    name: "onValueCommitted",
    type: "(value: number) => void",
    desc: "fires once the pointer or key is released. use this to persist.",
  },
  { name: "min", type: "number", defaultValue: "0", desc: "lower bound." },
  { name: "max", type: "number", defaultValue: "100", desc: "upper bound." },
  {
    name: "step",
    type: "number",
    defaultValue: "1",
    desc: "increment per arrow key press, and the grid every drag snaps to.",
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
    desc: "label above the dial. also names the knob for screen readers.",
  },
  {
    name: "showValue",
    type: "boolean",
    desc: "current value under the dial, in mono with tabular figures.",
  },
  {
    name: "formatValue",
    type: "(value: number) => string",
    desc: "formats the readout and the value announced to screen readers.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    desc: "dial diameter, 44 / 64 / 96px.",
  },
];

export default function KnobPage() {
  return (
    <ComponentDoc
      slug="knob"
      client
      description={
        <>
          one number, set by turning: a level, a mix, a gain. it earns its
          circle when several sit in a row and get balanced against each other.
          for a single value in a settings list, Slider reads faster.
        </>
      }
      composition={{
        ok: [
          "banks of related values tuned against one another",
          "drag the ring to dial it, or the body left and right to scrub. hold shift on either for fine control",
          "pair label with showValue so the number survives the drag",
          "onValueCommitted to persist, onValueChange to preview",
        ],
        no: [
          "not a dial for one lonely setting. that is a Slider",
          "not a readout. Progress and StatChip display, this one accepts",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="slider"</code> named by its
          label · arrows step, Home and End reach the bounds, PageUp and
          PageDown move by ten, shift gives a tenth · the dial takes the focus
          ring, and the whole square is the hit target · no wheel handler, so
          scrolling the page over it stays scrolling the page
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">class-variance-authority</code>
        </>
      }
    >
      <KnobDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="knob"
        usage={`import { Knob } from "@usva-ui/react/primitives/knob";

<Knob label="Volume" defaultValue={59} showValue formatValue={(v) => \`\${v} %\`} />`}
      />
    </ComponentDoc>
  );
}
