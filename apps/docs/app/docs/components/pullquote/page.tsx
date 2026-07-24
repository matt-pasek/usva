import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { PullquoteDemo } from "./pullquote-demo";

export const metadata: Metadata = pageMetadata("/docs/components/pullquote", {
  title: "Pullquote",
  description:
    "One sentence pulled out and made large, with an attribution and a decorative ornament slot above it.",
});

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "the quote. rendered as a blockquote.",
  },
  {
    name: "attribution",
    type: "ReactNode",
    desc: "upgrades the wrapper to a figure and becomes its figcaption.",
  },
  {
    name: "ornament",
    type: "ReactNode",
    desc: "decorative flourish above the quote, in a fixed 80px slot.",
  },
];

export default function PullquotePage() {
  return (
    <ComponentDoc
      slug="pullquote"
      description={
        <>
          a centered quote in display weight, with an optional attribution tied
          to it and a decorative ornament slot above.
        </>
      }
      composition={{
        ok: [
          "long-form prose, landing sections, a manifesto beat between blocks",
          "any decorative node in the ornament slot, KajoSphere included",
        ],
        no: [
          "not for testimonials in a grid. one quote per section",
          "no interactive content in the ornament, it is aria-hidden",
        ],
      }}
      a11y={
        <>
          attributed quotes render{" "}
          <code className="font-mono text-xs">figure</code> +{" "}
          <code className="font-mono text-xs">figcaption</code> · the ornament
          is <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
    >
      <PullquoteDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="pullquote"
        usage={`import { Pullquote } from "@matt-pasek/usva";

<Pullquote attribution="usva, design principles">
  Beauty that stays usable.
</Pullquote>`}
      />
    </ComponentDoc>
  );
}
