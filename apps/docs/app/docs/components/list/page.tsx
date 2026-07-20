import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { ListDemo } from "./list-demo";

export const metadata: Metadata = {
  title: "List",
  description:
    "A vertical stack of list items with an optional marker and dividers between them.",
};

const props = [
  {
    name: "as",
    type: '"ul" | "ol"',
    defaultValue: '"ul"',
    desc: "pick by whether the order carries meaning.",
  },
  {
    name: "marker",
    type: "ReactNode",
    desc: "decorative marker on every item, hidden from assistive tech.",
  },
  {
    name: "divided",
    type: "boolean",
    defaultValue: "false",
    desc: "rule between items, stopping at the last one.",
  },
  {
    name: "ListItem marker",
    type: "ReactNode",
    desc: "overrides the shared marker for this item alone.",
  },
];

export default function ListPage() {
  return (
    <ComponentDoc
      slug="list"
      client
      description={
        <>
          a vertical stack of items, each with an optional marker.{" "}
          <b>the marker is decoration, so the text carries the meaning on its own</b>.
        </>
      }
      composition={{
        ok: [
          "feature lists, checklists and summaries inside a Card or section",
          "divided when the rows are entries, plain when they are bullets",
        ],
        no: [
          "not a menu and not navigation. those have their own roles",
          "meaning never lives in the marker alone",
        ],
      }}
      a11y={
        <>
          a real <code className="font-mono text-xs">ul</code> or{" "}
          <code className="font-mono text-xs">ol</code> · every marker is{" "}
          <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
    >
      <ListDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="list"
        usage={`import { List, ListItem } from "@matt-pasek/usva";

<List marker={<CheckIcon />} divided>
  <ListItem>Runs entirely on your machine</ListItem>
  <ListItem>No tracking, no analytics</ListItem>
</List>`}
      />
    </ComponentDoc>
  );
}
