import type { Metadata } from "next";
import { SectionLabel } from "usva/patterns/section-label";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/docs/components/section-label",
  {
    title: "Section Label",
    description:
      "The quiet way to start a section: an optional mono index, an uppercase title, an accent hairline, and a trailing aside.",
  },
);

const props = [
  {
    name: "index",
    type: "string",
    desc: "mono, glowing accent index before the title (e.g. 01).",
  },
  {
    name: "title",
    type: "ReactNode",
    desc: (
      <>
        the section title, rendered as an <code>h2</code>.
      </>
    ),
  },
  {
    name: "aside",
    type: "ReactNode",
    desc: "trailing content after the hairline (e.g. a count).",
  },
  {
    name: "description",
    type: "ReactNode",
    desc: "a lede below the row. turns the label into a section header.",
  },
  {
    name: "tone",
    type: '"accent" | "accent-alt"',
    defaultValue: '"accent"',
    desc: "the index color. accent glows, accent-alt does not.",
  },
];

export default function SectionLabelPage() {
  return (
    <ComponentDoc
      slug="section-label"
      description={
        <>
          a heading row that names a region: a mono index, a title, an accent
          hairline, and a trailing aside. add a description and it becomes a
          full section header.
        </>
      }
      composition={{
        ok: [
          "at the top of every major page region, index counting up",
          "aside carries the region's one metadata fact, like a count",
        ],
        no: [
          "not a page title. it labels a section, PageHeader opens the page",
          "never stack two without content between them",
        ],
      }}
      a11y={
        <>
          the title is a real <code className="font-mono text-xs">h2</code>{" "}
          heading · the hairline is{" "}
          <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
    >
      <DemoPanel label="label row">
        <div className="flex w-full flex-col gap-8">
          <SectionLabel index="01" title="Selected work" aside="6 projects" />
          <SectionLabel index="02" title="Writing" />
          <SectionLabel title="Now" aside="2026" />
        </div>
      </DemoPanel>

      <DemoPanel label="section header">
        <SectionLabel
          className="w-full"
          index="03"
          title="About"
          aside="est. 2024"
          description="with a description the label grows into a section header. the row keeps its rhythm and the lede stays muted below it."
        />
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection
        registryName="section-label"
        usage={`import { SectionLabel } from "usva/patterns/section-label";

<SectionLabel index="01" title="Projects" aside="6 total" />`}
      />
    </ComponentDoc>
  );
}
