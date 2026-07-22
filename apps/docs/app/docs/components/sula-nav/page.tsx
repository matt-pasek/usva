import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { SulaNavDemo } from "./sula-nav-demo";

export const metadata: Metadata = {
  title: "Sula Nav",
  description:
    "Navigation whose parts merge and pinch apart as you move between views.",
};

const props = [
  {
    name: "views",
    type: "SulaNavView[]",
    desc: "each entry is { href, label, icon, items? }. one expands to its bar of section tabs; the rest collapse to icon pills.",
  },
  {
    name: "activeView",
    type: "string",
    defaultValue: "first view",
    desc: "controlled: the href of the expanded view. derive it from your router.",
  },
  {
    name: "onViewChange",
    type: "(href: string) => void",
    desc: "fires when a collapsed view pill is clicked; the old bar melts down while the clicked one swells up.",
  },
  {
    name: "activeItem",
    type: "string",
    desc: "controlled: the active section tab inside the expanded view. drive it from a scroll-spy.",
  },
  {
    name: "onNavigate",
    type: "(href: string) => void",
    desc: "fires on a section-tab click, alongside the link's own navigation.",
  },
  {
    name: "linkComponent",
    type: "React.ElementType",
    defaultValue: '"a"',
    desc: "pass next/link or a NavLink.",
  },
  {
    name: "brand / brandHref / brandLabel",
    type: "ReactNode · string · string",
    defaultValue: 'brandHref: "/"',
    desc: (
      <>
        the leftmost pill: a wordmark linking to brandHref.{" "}
        <b>needs brandLabel</b> to be named.
      </>
    ),
  },
  {
    name: "satellites",
    type: "SulaNavSatellite[]",
    desc: "fields that split off the body and settle in a corner: search, theme. handing them here keeps them one material with the bar.",
  },
  {
    name: "labelsFrom",
    type: '"sm" | "md" | "lg" | "xl"',
    defaultValue: '"sm"',
    desc: "below this width the item labels fold away and the tabs are icons.",
  },
  {
    name: "collapseBelow",
    type: '"sm" | "md" | "lg"',
    desc: "below this width the routes and satellites fold into a single menu droplet and the body swells open into a panel. nothing is hidden.",
  },
  {
    name: "menuLabel",
    type: "string",
    defaultValue: '"Menu"',
    desc: "accessible name of the menu droplet.",
  },
  {
    name: "offset",
    type: "number",
    defaultValue: "0",
    desc: "vertical nudge in px from the nav's anchor: positive is down.",
  },
  {
    name: "ariaLabel",
    type: "string",
    defaultValue: '"Primary"',
    desc: "names the nav landmark.",
  },
  {
    name: "fluid",
    type: "boolean",
    defaultValue: "true",
    desc: "false renders plain CSS pills and mounts no canvas. reduced motion and missing WebGL2 take the same path.",
  },
  {
    name: "backdrop / tint / accentColor",
    type: "string",
    defaultValue: "bg · surface · accent tokens",
    desc: "what the glass tints against, the glass itself, and the rim light. re-read on theme change.",
  },
  {
    name: "shine",
    type: "number",
    defaultValue: "theme",
    desc: "0 is flat matte glass, 1 is the full neon rim. dark themes glow, pale ones stay subtle.",
  },
  {
    name: "mergeRadius",
    type: "number",
    defaultValue: "14",
    desc: "how eagerly the parts merge, in pixels.",
  },
  {
    name: "revealDelay",
    type: "number",
    defaultValue: "120",
    desc: "milliseconds after the bar lands before the sides emerge.",
  },
  {
    name: "sidesOpen",
    type: "boolean",
    defaultValue: "true",
    desc: (
      <>
        whether the brand, pills and satellites are out. toggle from scroll to
        melt everything but the active bar back in;{" "}
        <b>a hidden part is not tabbable</b>.
      </>
    ),
  },
];

export default function SulaNavPage() {
  return (
    <ComponentDoc
      slug="sula-nav"
      client
      description={
        <>
          a row of views that behaves like one body of liquid: one view opens
          into its bar of section tabs, the rest sit collapsed as icon pills,
          and the shapes merge and split as you move between them.
        </>
      }
      composition={{
        ok: [
          "one per page, fixed in a header that centers it",
          "search and theme controls ride along as satellites, one material with the bar",
        ],
        no: [
          "never a second sula in the nav's region; satellites exist so nothing sits beside it",
          "not an in-page tab strip. SulaSegmented switches content, this switches routes",
        ],
      }}
      a11y={
        <>
          a labelled <code className="font-mono text-xs">nav</code> landmark ·
          the active tab carries{" "}
          <code className="font-mono text-xs">aria-current="page"</code> ·
          melted sides are <code className="font-mono text-xs">inert</code> ·
          the canvas is <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">motion</code> ·{" "}
          <code className="font-mono text-xs">ogl</code> · sula-core and
          sula-motion <span className="text-muted">from the same package</span>
        </>
      }
    >
      <SulaNavDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="sula-nav"
        usage={`import { SulaNav } from "@matt-pasek/usva";
import Link from "next/link";

<header className="fixed inset-x-0 top-0 z-50 flex justify-center p-4">
  <SulaNav
    linkComponent={Link}
    brand={<span>acme</span>}
    brandLabel="acme home"
    activeView={view}
    onViewChange={setView}
    activeItem={section}
    onNavigate={setSection}
    views={[
      {
        href: "/",
        label: "Site",
        icon: <HomeIcon />,
        items: [
          { href: "#home", label: "Home" },
          { href: "#work", label: "Work" },
        ],
      },
      { href: "/play", label: "Playground", icon: <SparkIcon /> },
    ]}
  />
</header>`}
      />
    </ComponentDoc>
  );
}
