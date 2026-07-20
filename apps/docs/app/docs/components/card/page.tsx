import type { Metadata } from "next";
import { CardHighlightDemo } from "@/components/card-highlight-demo";
import { CardSurfaceDemo } from "@/components/card-surface-demo";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";
import { CardDemo } from "./card-demo";

export const metadata: Metadata = {
  title: "Card",
  description:
    "A composable surface with header, body, and footer regions plus eyebrow, title, icon, badge, and action parts.",
};

const props = [
  {
    name: "surface",
    type: '"elevated" | "flat" | "glass" | "outline"',
    defaultValue: '"elevated"',
    desc: (
      <>
        how the card sits on the page. the same vocabulary drives StatCard,
        Panel and Dialog. glass is <b>a rare, purposeful choice</b>, never a
        default.
      </>
    ),
  },
  {
    name: "highlight",
    type: '"none" | "wash" | "edge" | "ring"',
    defaultValue: '"none"',
    desc: "accent treatment: a radial wash, a top edge hairline, or a full glow ring. ring replaces the elevation shadow.",
  },
  {
    name: "interactive",
    type: "boolean",
    defaultValue: "false",
    desc: "lifts on hover. only for cards that are actually clickable.",
  },
  {
    name: "row (CardHeader)",
    type: "boolean",
    defaultValue: "false",
    desc: "lays the header out as icon + title + actions instead of stacked.",
  },
];

export default function CardPage() {
  return (
    <ComponentDoc
      slug="card"
      description={
        <>
          the base surface, composed not configured. header, body and footer are
          regions you fill, so a card is whatever you assemble in them. one{" "}
          <code>surface</code> word sets its weight, from elevated to a bare
          outline, and StatCard, Panel and Dialog all speak it.
        </>
      }
      composition={{
        ok: [
          "holds Button, Badge, StatCard content, forms, anything grouped",
          "GlowCard swaps in for the single card that earns the pointer glow",
        ],
        no: [
          "never a card inside a card. nest with Panel or plain spacing",
          "interactive without an actual click target is a lie",
        ],
      }}
      a11y={
        <>
          CardTitle is a real{" "}
          <code className="font-mono text-xs">&lt;h3&gt;</code> · the glow layer
          is <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
      dependencies={
        <>
          Badge <span className="text-muted">from the same package</span>
        </>
      }
    >
      <CardDemo />

      <DemoPanel label="highlights">
        <CardHighlightDemo />
      </DemoPanel>

      <DemoPanel label="surface" note="shared with StatCard · Panel · Dialog">
        <CardSurfaceDemo />
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection
        registryName="card"
        usage={`import {
  Card, CardHeader, CardIcon, CardEyebrow, CardTitle,
  CardActions, CardBadge, CardBody, CardFooter,
} from "@matt-pasek/usva";

<Card interactive>
  <CardHeader row>
    <CardIcon><BoltIcon /></CardIcon>
    <div className="flex flex-col gap-1">
      <CardEyebrow>Deployment</CardEyebrow>
      <CardTitle>Production build</CardTitle>
    </div>
    <CardActions>
      <CardBadge tone="success">live</CardBadge>
    </CardActions>
  </CardHeader>
  <CardBody>Shipped 4 minutes ago.</CardBody>
  <CardFooter>
    <Button size="sm" variant="outline">View logs</Button>
  </CardFooter>
</Card>`}
      />
    </ComponentDoc>
  );
}
