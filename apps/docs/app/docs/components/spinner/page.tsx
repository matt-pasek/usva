import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { SpinnerDemo } from "./spinner-demo";

export const metadata: Metadata = {
  title: "Spinner",
  description:
    "A loading spinner for work with no measurable end, plus a PageLoader wrapper.",
};

const props = [
  {
    name: "variant",
    type: '"ring" | "dots" | "bars" | "orbit"',
    defaultValue: '"ring"',
    desc: "animation style. ring is the general default; orbit is the loudest.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    desc: "diameter and stroke weight.",
  },
  {
    name: "tone",
    type: '"accent" | "current"',
    defaultValue: '"accent"',
    desc: (
      <>
        current inherits the parent's text colour and drops the glow. what a
        spinner uses inside a filled Button.
      </>
    ),
  },
  {
    name: "label",
    type: "string",
    defaultValue: '"Loading"',
    desc: "the screen reader text. say what is loading when you can.",
  },
];

export default function SpinnerPage() {
  return (
    <ComponentDoc
      slug="spinner"
      description={
        <>
          the spinning loading state for work with no measurable end. PageLoader
          centers one when a whole region is waiting.
        </>
      }
      composition={{
        ok: [
          "inline beside text, or inside Button via its status machine",
          "PageLoader fills a route or panel while its data arrives",
        ],
        no: [
          "not a progress bar. it promises nothing about duration",
          "one per region. two spinners is one loading state told twice",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="status"</code> with an{" "}
          <code className="font-mono text-xs">sr-only</code> label · animation
          stops under reduced motion · PageLoader's visible caption is{" "}
          <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
      dependencies={
        <code className="font-mono text-xs">class-variance-authority</code>
      }
    >
      <SpinnerDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="spinner"
        usage={`import { Spinner, PageLoader } from "@matt-pasek/usva";

<Spinner variant="dots" size="sm" />
<PageLoader variant="orbit" label="Loading your workspace" />`}
      />
    </ComponentDoc>
  );
}
