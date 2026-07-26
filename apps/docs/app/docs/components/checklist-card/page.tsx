import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { ChecklistCardDemo } from "./checklist-card-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/checklist-card",
  {
    title: "Checklist Card",
    description:
      "Short ticked reassurances as a real list, so the reader gets the count and the order.",
  },
);

const props = [
  {
    name: "items",
    type: "React.ReactNode[]",
    desc: "the claims. strings or nodes.",
  },
  {
    name: "title",
    type: "React.ReactNode",
    desc: "heading above the list. omitted entirely when absent.",
  },
  {
    name: "marker",
    type: "React.ReactNode",
    defaultValue: "tick",
    desc: "overrides the default tick. decorative either way.",
  },
];

export default function ChecklistCardPage() {
  return (
    <ComponentDoc
      slug="checklist-card"
      description={
        <>
          a card of short reassurances, each one ticked. for the feature and
          privacy claims on a landing page, three to five at a time.
        </>
      }
      composition={{
        ok: [
          "feature and privacy claims on landing pages, three to five items",
          "a custom marker when the tick reads wrong for the content",
        ],
        no: [
          "not a todo list. nothing here is interactive or checkable",
          "no paragraphs as items. a claim is one line",
        ],
      }}
      a11y={
        <>
          a real <code className="font-mono text-xs">ul</code> with the item
          count · markers are{" "}
          <code className="font-mono text-xs">aria-hidden</code> · the title is
          a heading
        </>
      }
      dependencies={
        <>
          Card · List <span className="text-muted">from the same package</span>
        </>
      }
    >
      <ChecklistCardDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="checklist-card"
        usage={`import { ChecklistCard } from "@matt-pasek/usva/patterns/checklist-card";

<ChecklistCard
  title="Privacy"
  items={["Runs on your machine", "No tracking", "Open source"]}
/>`}
      />
    </ComponentDoc>
  );
}
