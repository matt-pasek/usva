import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { ChipDemo } from "./chip-demo";

export const metadata: Metadata = pageMetadata("/docs/components/chip", {
  title: "Chip",
  description:
    "A tag, a filter, a stack entry. Six tones, an optional value segment, and a remove button when it is a filter.",
});

const props = [
  {
    name: "tone",
    type: '"default" | "accent" | "accent-alt" | "success" | "warning" | "danger"',
    defaultValue: '"default"',
    desc: "the color role. tinted border, fill and text from one token.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    defaultValue: '"md"',
    desc: "height and padding. sm for dense rows.",
  },
  {
    name: "selected",
    type: "boolean",
    defaultValue: "false",
    desc: "the glow-ring pressed look, for chips acting as active filters.",
  },
  {
    name: "value",
    type: "ReactNode",
    desc: "a trailing segment behind a divider, tabular for counts.",
  },
  {
    name: "onRemove",
    type: "() => void",
    desc: "when provided, renders the dismiss button.",
  },
  {
    name: "removeLabel",
    type: "string",
    defaultValue: '"Remove"',
    desc: "accessible name for the dismiss button. name the thing being removed.",
  },
];

export default function ChipPage() {
  return (
    <ComponentDoc
      slug="chip"
      client
      description={
        <>
          a compact pill for tags, filters and counts. a chip states something,
          it does not do something, the only interactive part is the optional
          dismiss. when the whole thing should toggle, reach for ToggleChip.
        </>
      }
      composition={{
        ok: [
          "tag rows, filter bars, a count beside a heading",
          "value carries the number, the label stays text",
        ],
        no: [
          "not a click target. when the whole chip toggles, that is ToggleChip",
          "a danger chip states a fact. it does not warn or block anything",
        ],
      }}
      a11y={
        <>
          the chip is a plain span · the dismiss button is named by{" "}
          <code className="font-mono text-xs">removeLabel</code> with a hit area
          past the glyph · the x icon is{" "}
          <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
      dependencies={
        <code className="font-mono text-xs">class-variance-authority</code>
      }
    >
      <ChipDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="chip"
        usage={`import { Chip } from "@usva-ui/react/primitives/chip";

<Chip tone="accent">Design</Chip>
<Chip tone="success" value="v2.1">Release</Chip>
<Chip tone="accent" onRemove={() => remove(id)}>Engineering</Chip>`}
      />
    </ComponentDoc>
  );
}
