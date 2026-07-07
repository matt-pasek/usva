import { Card, CardBody, CardHeader, MockupShowcase } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Mockup Showcase",
  description:
    "Browser and device chrome around arbitrary media. Children are the media slot, so any image component, video or iframe fits.",
};

const props = [
  {
    name: "frame",
    type: '"browser" | "device" | "none"',
    desc: "Which chrome to draw. Defaults to browser.",
  },
  {
    name: "url",
    type: "string",
    desc: "Decorative text in the browser address bar. Hidden from assistive tech.",
  },
  {
    name: "aspect",
    type: "string",
    desc: 'Any CSS aspect-ratio value. Defaults to "16/10".',
  },
  {
    name: "children",
    type: "React.ReactNode",
    desc: "The media. Stretched to fill the well, whatever element it is.",
  },
];

const usage = `import { MockupShowcase } from "@matt-pasek/usva";

<MockupShowcase frame="browser" url="usva.dev" aspect="16/10">
  <Image src={shot} alt="The usva docs homepage" />
</MockupShowcase>`;

function Placeholder() {
  return (
    <div className="grid h-full w-full place-items-center bg-accent-tint font-mono text-xs text-on-tint">
      your screenshot here
    </div>
  );
}

export default function MockupShowcasePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Mockup Showcase</h1>
        <p className="text-muted">
          Device and browser chrome around whatever you put inside it. There is
          no image abstraction on purpose: pass a <code>next/image</code>, a
          bare <code>img</code>, a video, or a live iframe. The frame is the
          value.
        </p>
      </div>

      <Card>
        <CardHeader>Browser</CardHeader>
        <CardBody>
          <MockupShowcase frame="browser" url="usva.dev">
            <Placeholder />
          </MockupShowcase>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Device</CardHeader>
        <CardBody>
          <MockupShowcase frame="device" aspect="9/16" className="max-w-64">
            <Placeholder />
          </MockupShowcase>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Bare</CardHeader>
        <CardBody>
          <MockupShowcase frame="none" aspect="21/9">
            <Placeholder />
          </MockupShowcase>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="mockup-showcase" />
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
          <SourceView filePath="packages/usva/src/patterns/mockup-showcase/mockup-showcase.tsx" />
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
