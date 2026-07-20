import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { DisclosureRowDemo } from "./disclosure-row-demo";

export const metadata: Metadata = {
  title: "Disclosure Row",
  description:
    "A row that expands to reveal a panel beneath it, with the whole row as the toggle.",
};

const props = [
  {
    name: "summary",
    type: "React.ReactNode",
    desc: "the row itself. a title, a ProgressRow, whatever the panel is about.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    desc: "the panel. stays mounted while closed so the height can transition.",
  },
  {
    name: "aside",
    type: "React.ReactNode",
    desc: "trailing content inside the button. counts, badges, figures.",
  },
  {
    name: "railColor",
    type: "string",
    desc: "any CSS color for the left rail. omit it and no rail draws.",
  },
  {
    name: "open",
    type: "boolean",
    desc: "controlled. leave it out to let the row manage itself.",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    defaultValue: "false",
    desc: "starting state when uncontrolled.",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    desc: "fires on every click, controlled or not.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "the row stops toggling.",
  },
  {
    name: "buttonLabel",
    type: "string",
    desc: "names the button when the summary is not plain text.",
  },
];

export default function DisclosureRowPage() {
  return (
    <ComponentDoc
      slug="disclosure-row"
      client
      description={
        <>
          a row that expands to reveal a panel beneath it. the whole row is the
          button, so there is no small chevron to hunt for.
        </>
      }
      composition={{
        ok: [
          "a ProgressRow as the summary, the sisu pattern it was extracted from",
          "stack a few and control open when only one should stay expanded",
        ],
        no: [
          "no links or buttons inside the summary, the whole row is already a button",
          "not for content that must stay reachable while closed, the panel goes inert",
        ],
      }}
      a11y={
        <>
          the row is a button with{" "}
          <code className="font-mono text-xs">aria-expanded</code> and{" "}
          <code className="font-mono text-xs">aria-controls</code> · the closed
          panel carries <code className="font-mono text-xs">inert</code> so
          nothing inside is focusable
        </>
      }
    >
      <DisclosureRowDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="disclosure-row"
        usage={`import { DisclosureRow, ProgressRow } from "@matt-pasek/usva";

<DisclosureRow
  railColor="#52c989"
  summary={<ProgressRow label="Core studies" value={45} max={60} unit="cr" />}
  buttonLabel="Core studies"
>
  <CourseList />
</DisclosureRow>`}
      />
    </ComponentDoc>
  );
}
