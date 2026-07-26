import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { CtaBannerDemo } from "./cta-banner-demo";

export const metadata: Metadata = pageMetadata("/docs/components/cta-banner", {
  title: "CTA Banner",
  description:
    "The ask at the end of a page: accent wash, copy, an action, and an optional proof row. Everything below the title is optional.",
});

const props = [
  { name: "title", type: "ReactNode", desc: "the panel headline." },
  { name: "body", type: "ReactNode", desc: "supporting copy." },
  {
    name: "headingLevel",
    type: '"h2" | "h3" | "h4"',
    defaultValue: '"h2"',
    desc: "heading element for the title. match the page outline.",
  },
  {
    name: "action",
    type: "ReactNode",
    desc: "the call to action. pass a Button.",
  },
  {
    name: "footer",
    type: "ReactNode",
    desc: "trailing proof row. draws a rule above itself.",
  },
  {
    name: "footerLabel",
    type: "ReactNode",
    desc: "mono kicker beside the footer content.",
  },
];

export default function CtaBannerPage() {
  return (
    <ComponentDoc
      slug="cta-banner"
      description={
        <>
          the panel that closes a marketing page: a title, a line of copy, and
          the one action you want next. everything below the title is optional,
          so it degrades to just a headline and a button.
        </>
      }
      composition={{
        ok: [
          "the last section of a landing page, before the footer",
          "a proof row of Chips under the action when you have receipts to show",
        ],
        no: [
          "not mid-page. one per page, at the close",
          "never nest one inside a Card. it is already a panel",
        ],
      }}
      a11y={
        <>
          the title is a real heading at{" "}
          <code className="font-mono text-xs">headingLevel</code> · the footer
          rule is <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
    >
      <CtaBannerDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="cta-banner"
        usage={`import { CtaBanner } from "@matt-pasek/usva/patterns/cta-banner";
import { Button } from "@matt-pasek/usva/primitives/button";
import { Chip } from "@matt-pasek/usva/primitives/chip";

<CtaBanner
  title="Have something in mind?"
  body="Design engineering for teams that sweat the details."
  action={<Button>Start a project</Button>}
  footerLabel="Recent work"
  footer={<><Chip>Fintech</Chip><Chip>Health</Chip></>}
/>`}
      />
    </ComponentDoc>
  );
}
