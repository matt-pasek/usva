import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { PanelDemo } from "./panel-demo";

export const metadata: Metadata = pageMetadata("/docs/components/panel", {
  title: "Panel",
  description:
    "The dashboard workhorse: a titled region whose header stays fixed while the body scrolls, sized to fill a grid cell.",
});

const props = [
  { name: "title", type: "ReactNode", desc: "the panel heading." },
  {
    name: "eyebrow",
    type: "ReactNode",
    desc: "mono uppercase label above the title.",
  },
  {
    name: "icon",
    type: "ReactNode",
    desc: "leading icon, shown in a tile.",
  },
  {
    name: "badge",
    type: "ReactNode",
    desc: "right-aligned status slot. pass a Badge.",
  },
  {
    name: "actions",
    type: "ReactNode",
    desc: "right-aligned controls slot. icon-only Buttons fit.",
  },
  {
    name: "loading",
    type: "boolean",
    defaultValue: "false",
    desc: "swaps the body for a centered Spinner. the header stays.",
  },
  {
    name: "loadingSlot",
    type: "ReactNode",
    desc: "replaces the default spinner while loading. a Skeleton stack goes here.",
  },
  {
    name: "surface",
    type: "CardSurface",
    defaultValue: '"elevated"',
    desc: "how the panel sits on the page. shares Card's surface scale.",
  },
];

export default function PanelPage() {
  return (
    <ComponentDoc
      slug="panel"
      description={
        <>
          the dashboard workhorse: it fills its grid cell, the header stays
          fixed, and the body scrolls its own overflow.
        </>
      }
      composition={{
        ok: [
          "a cell of DashboardGrid or a bento layout. it needs a sized box",
          "badge takes a Badge, actions take icon-only Buttons",
        ],
        no: [
          "never nested in a Card or another Panel. it is the region",
          "not a page section on a marketing page. that is Card territory",
        ],
      }}
      a11y={
        <>
          the loading spinner is{" "}
          <code className="font-mono text-xs">role="status"</code> with an sr
          label · badge and actions keep their own semantics
        </>
      }
      dependencies={
        <>
          Spinner <span className="text-muted">·</span> Card{" "}
          <span className="text-muted">from the same package</span>
        </>
      }
    >
      <PanelDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="panel"
        usage={`import { Panel } from "usva/patterns/panel";
import { Badge } from "usva/primitives/badge";

<Panel eyebrow="overview" title="Deployments" badge={<Badge live>live</Badge>}>
  <DeploymentList />
</Panel>`}
      />
    </ComponentDoc>
  );
}
