import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { StripeCardDemo } from "./stripe-card-demo";

export const metadata: Metadata = pageMetadata("/docs/components/stripe-card", {
  title: "Stripe Card",
  description:
    "A card keyed by colour so a long list sorts by eye. The stripe is data, not decoration.",
});

const props = [
  {
    name: "heading",
    type: "ReactNode",
    desc: "the primary title.",
  },
  {
    name: "metaLeft",
    type: "ReactNode",
    desc: "mono meta on the left, e.g. a code.",
  },
  {
    name: "metaRight",
    type: "ReactNode",
    desc: "mono meta on the right, rendered in the accent color.",
  },
  {
    name: "badge",
    type: "ReactNode",
    desc: "top-right slot, usually a Badge.",
  },
  {
    name: "footer",
    type: "ReactNode",
    desc: "bottom bar slot, pinned under the body.",
  },
  {
    name: "stripeColor",
    type: "string",
    desc: (
      <>
        any CSS color, <b>keyed to a category</b>. unset falls back to a neutral
        token.
      </>
    ),
  },
  {
    name: "wash",
    type: "boolean",
    defaultValue: "false",
    desc: "a faint background wash in the stripe's color, or the accent when the stripe is unset.",
  },
  {
    name: "surface",
    type: '"elevated" | "flat" | "glass" | "outline"',
    defaultValue: '"elevated"',
    desc: "how the card sits on the page. inherited from Card.",
  },
  {
    name: "selected",
    type: "boolean",
    defaultValue: "false",
    desc: "swaps the hover lift for the accent glow ring.",
  },
];

export default function StripeCardPage() {
  return (
    <ComponentDoc
      slug="stripe-card"
      description={
        <>
          a compact row-card for one entity: a leading stripe keys it to a
          category, with a heading, mono meta, and optional badge and footer.
          the stripe means something or stays neutral, never decoration.
        </>
      }
      composition={{
        ok: [
          "sits in a grid or list of siblings, one entity each",
          "the stripe color keys a category shared with a ToolbarLegend",
        ],
        no: [
          "never a lone hero card. it is a row in a collection",
          "no interactive children fighting the card's own hover lift",
        ],
      }}
      a11y={
        <>
          the stripe and the meta separator are{" "}
          <code className="font-mono text-xs">aria-hidden</code> · the heading
          is a real <code className="font-mono text-xs">h3</code>
        </>
      }
      dependencies={
        <>
          Card <span className="text-muted">from the same package</span>
        </>
      }
    >
      <StripeCardDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="stripe-card"
        usage={`import { StripeCard, Badge } from "@matt-pasek/usva";

<StripeCard
  heading="Algorithms & Data Structures"
  metaLeft="CS-201"
  metaRight="5 cr"
  stripeColor="var(--color-accent)"
  badge={<Badge tone="accent-alt">enrolled</Badge>}
/>`}
      />
    </ComponentDoc>
  );
}
