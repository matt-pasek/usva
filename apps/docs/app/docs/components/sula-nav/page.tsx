import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { SulaNavDemo } from "./sula-nav-demo";

export const metadata: Metadata = {
  title: "Sula Nav",
  description:
    "Sula Nav: a liquid-glass navigation bar. The parts merge and separate like drops of water, painted by one WebGL distance field.",
};

const props = [
  {
    name: "views",
    type: "SulaNavView[]",
    desc: "Each entry is { href, label, icon, items? }. One is expanded to its bar of items; the rest collapse to icon pills on the right.",
  },
  {
    name: "activeView",
    type: "string",
    desc: "Controlled: the href of the expanded view. Defaults to the first view. Derive it from your router.",
  },
  {
    name: "onViewChange",
    type: "(href: string) => void",
    desc: "Fires when a collapsed view pill is clicked; the row morphs the old bar down and the clicked one up.",
  },
  {
    name: "activeItem",
    type: "string",
    desc: "Controlled: the active section tab inside the expanded view. Drive it from a scroll-spy.",
  },
  {
    name: "onNavigate",
    type: "(href: string) => void",
    desc: "Fires on a section-tab click, alongside the link's own navigation.",
  },
  {
    name: "linkComponent",
    type: "React.ElementType",
    desc: 'Defaults to "a". Pass next/link or a NavLink.',
  },
  {
    name: "brand",
    type: "ReactNode",
    desc: "The leftmost pill: a wordmark or logo. Links to brandHref. Needs brandLabel to be named.",
  },
  {
    name: "brandHref",
    type: "string",
    desc: 'Where the brand pill points. Defaults to "/".',
  },
  {
    name: "offset",
    type: "number",
    desc: "Vertical nudge in px from the nav's anchor: positive is down, negative is up.",
  },
  {
    name: "fluid",
    type: "boolean",
    desc: "false renders plain CSS pills and mounts no canvas. Defaults to true.",
  },
  {
    name: "backdrop",
    type: "string",
    desc: "The colour the glass tints against. Defaults to the bg token.",
  },
  {
    name: "tint",
    type: "string",
    desc: "The glass itself. Defaults to the surface token.",
  },
  {
    name: "accentColor",
    type: "string",
    desc: "Rim light and specular sweep. Defaults to the accent token.",
  },
  {
    name: "shine",
    type: "number",
    desc: "0 is flat matte glass, 1 is the full neon rim. Defaults to the theme: dark themes glow, pale ones stay subtle.",
  },
  {
    name: "mergeRadius",
    type: "number",
    desc: "How eagerly the parts merge, in pixels. Defaults to 14.",
  },
  {
    name: "revealDelay",
    type: "number",
    desc: "Milliseconds after the bar lands before the brand and view pills emerge.",
  },
  {
    name: "sidesOpen",
    type: "boolean",
    desc: "Whether the brand and collapsed view pills are out. Defaults to true. Toggle it from scroll or focus to melt everything but the active bar back in; a hidden part is not tabbable.",
  },
];

const usage = `import { SulaNav } from "@matt-pasek/usva";
import Link from "next/link";

<header className="fixed inset-x-0 top-0 z-50 flex justify-center p-4">
  <SulaNav
    linkComponent={Link}
    brand={<span>usva.</span>}
    brandLabel="usva home"
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
      { href: "/writing", label: "Writing", icon: <PenIcon />, items: [
        { href: "#latest", label: "Latest" },
      ] },
      { href: "/play", label: "Playground", icon: <SparkIcon /> },
    ]}
  />
</header>`;

function PropsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="py-2 pr-4 font-medium">Prop</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs text-ink">{p.name}</td>
              <td className="py-2 pr-4 font-mono text-xs text-muted">
                {p.type}
              </td>
              <td className="py-2 text-muted">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SulaNavPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Sula Nav</h1>
        <p className="text-muted">
          A row of views that behaves like one body of liquid. One view is
          expanded into its bar of section tabs; the others sit collapsed to
          icon pills on the right. Click a pill and the row morphs: the old bar
          melts down into its own pill while the clicked one swells into the
          bar, the whole row fusing and separating as it settles.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <SulaNavDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>One mechanism, three animations</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The load, the reveal and the merge are not three animations. They
            are one: a signed distance field of rounded pills, combined with a
            polynomial smooth minimum. Two shapes that approach each other grow
            a meniscus between them, and two that separate stretch a neck that
            thins until it breaks. Everything else falls out of the geometry.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The active pill is DOM, not liquid</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The indicator behind the current link is a measured{" "}
            <code>span</code>, the same approach the segmented control uses. It
            could have been a fourth blob, but text drawn over a canvas that is
            resampling every frame goes soft, and the field would have to run
            forever. Instead the shader draws glass and the browser draws type.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Why there is a backdrop prop</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            A canvas cannot sample the page behind it, so the glass cannot
            refract what it sits on. It paints its own instead: a fresnel rim, a
            specular sweep and a chromatic fringe, tinted against{" "}
            <code>backdrop</code>. Set that to whatever the nav floats over and
            the illusion holds. Leave it alone and it uses the background token,
            re-reading it whenever the theme changes. A dark theme gets the full
            glow; a pale one drops to a matte frosted glass, because the neon
            rim only looks garish on light. Override that with{" "}
            <code>shine</code>.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>When the canvas does not run</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Three cases fall back to plain CSS pills, and they share one code
            path: <code>fluid={"{false}"}</code>, a{" "}
            <code>prefers-reduced-motion</code> preference, and a machine with
            no WebGL2 or a lost context. The server always renders the fallback,
            so there is no hydration mismatch. The canvas is appended
            afterwards, and it is decorative.
          </p>
          <div className="rounded-lg border border-border bg-bg p-4">
            <SulaNavDemo fluid={false} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It costs nothing at rest</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The render loop parks itself the moment every spring settles, and
            wakes on a resize or a font swap. The field never runs on an idle
            page. The normal comes from screen-space derivatives rather than
            four extra samples, and the device pixel ratio is capped at two.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="sula-nav" />
          <p className="text-sm text-muted">
            Pulls in <code>ogl</code>, which ships untranspiled ESM. Bundlers
            are fine with it; a bare CommonJS <code>require</code> is not.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{usage}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <SourceView filePath="packages/usva/src/sula/sula-nav/sula-nav.tsx" />
          <SourceView filePath="packages/usva/src/sula/sula-nav/nav-geometry.ts" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Props</CardHeader>
        <CardBody>
          <PropsTable />
        </CardBody>
      </Card>
    </main>
  );
}
