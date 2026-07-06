import { Card, CardBody, CardHeader, FeatureCarousel } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Feature Carousel",
  description:
    "An auto-advancing feature showcase — one large card cross-fades between entries, with a selector rail, an animated progress line, and pause-on-hover.",
};

const props = [
  {
    name: "cards",
    type: "FeatureCard[]",
    desc: "The features: { title, body?, id? }.",
  },
  {
    name: "autoAdvanceMs",
    type: "number",
    desc: "Auto-advance interval. Defaults to 4600.",
  },
];

const usage = `import { FeatureCarousel } from "@matt-pasek/usva";

<FeatureCarousel
  cards={[
    { title: "Owns your data", body: "Everything stays local." },
    { title: "Reads at a glance", body: "Dense, but it breathes." },
    { title: "Yours to fork", body: "Copy the source, or install it." },
  ]}
/>`;

export default function FeatureCarouselPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Feature Carousel</h1>
        <p className="text-muted">
          An auto-advancing showcase — one large card cross-fades between
          entries while a selector rail tracks progress with an animated line.
          It pauses on hover and focus, and honors{" "}
          <code>prefers-reduced-motion</code>.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <FeatureCarousel
            cards={[
              {
                title: "Owns your data",
                body: "Everything stays local, nothing phones home.",
              },
              {
                title: "Reads at a glance",
                body: "Dense dashboards that still breathe.",
              },
              {
                title: "Yours to fork",
                body: "Copy the source in, or install the package.",
              },
              {
                title: "Fast by default",
                body: "The 20ms most people skip, and everyone feels.",
              },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="feature-carousel" />
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
        <CardBody>
          <SourceView filePath="packages/usva/src/patterns/feature-carousel/feature-carousel.tsx" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Props</CardHeader>
        <CardBody>
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
                    <td className="py-2 pr-4 font-mono text-xs text-ink">
                      {p.name}
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-muted">
                      {p.type}
                    </td>
                    <td className="py-2 text-muted">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
