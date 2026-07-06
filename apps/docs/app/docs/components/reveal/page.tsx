import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { RevealDemo } from "@/components/reveal-demo";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Reveal",
  description:
    "A scroll-reveal system with six role-based variants under one 'resolve from mist' metaphor, plus a stagger group and an intensity knob that dials kajo-bold down to sisu-quiet.",
};

const variants = [
  [
    "cast",
    "Headings, eyebrows, titles",
    "Light resolving from above — the one variant that moves down.",
  ],
  [
    "veil",
    "Prose, generic sections, footers",
    "The default. Mist thinning: a small lift with a soft blur.",
  ],
  [
    "surface",
    "Cards, panels, CTAs, hero blocks",
    "Material rising to the light — scale + lift on a spring, no blur.",
  ],
  [
    "focus",
    "Images, video, media frames",
    "A lens finding focus: sharpens into place with no travel.",
  ],
  [
    "tick",
    "Stats, tables, mono/tabular data",
    "An instrument reading — crisp, fast, never blurs. Use grouped.",
  ],
  [
    "lean",
    "Quotes, testimonials, asides",
    "The aside voice — the only horizontal move, in from the edge.",
  ],
];

const roleSnippet = `import { Reveal, RevealGroup } from "@matt-pasek/usva";

<Reveal variant="cast" as="h2">Section title</Reveal>
<Reveal variant="veil">Body copy resolves out of the mist.</Reveal>

<RevealGroup variant="tick" className="grid grid-cols-3 gap-3">
  <StatCard … />
  <StatCard … />
  <StatCard … />
</RevealGroup>`;

const intensitySnippet = `import { RevealConfigProvider } from "@matt-pasek/usva";

// sisu dials the whole reveal set quiet from one knob
<RevealConfigProvider intensity={0.45}>
  <Dashboard />
</RevealConfigProvider>`;

export default function RevealPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Reveal</h1>
        <p className="text-muted">
          A scroll-reveal system, not a single animation. Six variants share one
          metaphor — things <em>resolve out of mist toward the light above</em>{" "}
          — but each has a distinct silhouette, so a page varies by content role
          instead of applying one identical entrance to everything. Reveals are
          SSR-safe (content ships visible; only below-the-fold elements arm) and
          collapse to a crossfade under <code>prefers-reduced-motion</code>.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <RevealDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The six variants</CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pr-4 font-medium">Variant</th>
                  <th className="py-2 pr-4 font-medium">Fits</th>
                  <th className="py-2 font-medium">Feel</th>
                </tr>
              </thead>
              <tbody>
                {variants.map(([v, fits, feel]) => (
                  <tr key={v} className="border-b border-border/50 align-top">
                    <td className="py-2 pr-4 font-mono text-xs text-accent">
                      {v}
                    </td>
                    <td className="py-2 pr-4 text-muted">{fits}</td>
                    <td className="py-2 text-muted">{feel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Assign by role — headings <code>cast</code>, prose <code>veil</code>
            , surfaces <code>surface</code>, media <code>focus</code>, data{" "}
            <code>tick</code> (grouped), quotes <code>lean</code>. Stagger lives
            inside one <code>RevealGroup</code>, never across sections.
          </p>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{roleSnippet}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Intensity</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            One <code>intensity</code> scalar scales distance, blur, and
            duration for the whole set: kajo runs at <code>1</code> (bold), sisu
            at <code>~0.45</code> (quiet), and <code>0</code> degenerates to a
            crossfade — the same path reduced-motion takes. Set it per element
            or for a whole subtree.
          </p>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{intensitySnippet}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/motion/reveal.tsx" />
        </CardBody>
      </Card>
    </main>
  );
}
