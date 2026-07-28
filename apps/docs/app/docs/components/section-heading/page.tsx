import type { Metadata } from "next";
import { SectionHeading } from "usva/patterns/section-heading";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/docs/components/section-heading",
  {
    title: "Section Heading",
    description:
      "The loud way to start a section: a mono uppercase eyebrow over a large fluid display title.",
  },
);

const props = [
  {
    name: "eyebrow",
    type: "ReactNode",
    desc: "mono uppercase kicker above the title. omitted entirely when absent.",
  },
  {
    name: "title",
    type: "ReactNode",
    desc: "the display title.",
  },
  {
    name: "as",
    type: '"h1" | "h2" | "h3"',
    defaultValue: '"h2"',
    desc: (
      <>
        the heading element. <b>the type scale never changes</b> with it.
      </>
    ),
  },
  {
    name: "tone",
    type: '"accent" | "accent-alt"',
    defaultValue: '"accent-alt"',
    desc: "colors the eyebrow.",
  },
];

export default function SectionHeadingPage() {
  return (
    <ComponentDoc
      slug="section-heading"
      description={
        <>
          the opener that carries a section: a mono uppercase eyebrow over a
          large, fluid title.
        </>
      }
      composition={{
        ok: [
          "opens a page section, one per section",
          "the eyebrow names the beat: the problem, outcome, approach",
        ],
        no: [
          "not a card title. inside Card use CardHeader",
          "never picked by size. as follows the document outline",
        ],
      }}
      a11y={
        <>
          a real heading element, <code className="font-mono text-xs">h2</code>{" "}
          by default · the eyebrow is a plain paragraph, so the accessible name
          is the title alone
        </>
      }
    >
      <DemoPanel>
        <div className="flex flex-col">
          <SectionHeading
            eyebrow="The problem"
            title="Students could not see their whole degree."
          />
          <SectionHeading
            tone="accent"
            eyebrow="Outcome"
            title="One planner, four systems reconciled."
          />
          <SectionHeading title="No eyebrow, just the heading." />
        </div>
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection
        registryName="section-heading"
        usage={`import { SectionHeading } from "usva/patterns/section-heading";

<SectionHeading
  eyebrow="The problem"
  title="Students could not see their whole degree."
/>`}
      />
    </ComponentDoc>
  );
}
