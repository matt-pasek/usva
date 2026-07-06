import { Announcement, Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Announcement",
  description:
    "A pill that pairs a solid leading badge with a short label, for release notes and callouts. Optionally renders as a link with a trailing arrow.",
};

const props = [
  {
    name: "badge",
    type: "ReactNode",
    desc: 'Text of the solid leading badge, e.g. "NEW".',
  },
  {
    name: "tone",
    type: '"live" | "accent" | "accent-alt" | "success" | "warning" | "danger"',
    desc: "Color of the leading badge. Defaults to the live green.",
  },
  {
    name: "href",
    type: "string",
    desc: "Render as a link. A trailing arrow and hover glow appear when set.",
  },
];

const usageSnippet = `import { Announcement } from "@matt-pasek/usva";

<Announcement badge="NEW" tone="live" href="/changelog">
  v2.0.1 just shipped
</Announcement>`;

export default function AnnouncementPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Announcement</h1>
        <p className="text-muted">
          A pill that pairs a solid leading badge with a short label, for
          release notes, version callouts, and banners. Pass <code>href</code>{" "}
          to make it a link with a trailing arrow and a hover glow.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex flex-wrap items-center gap-3">
            <Announcement badge="NEW" tone="live">
              v2.0.1 just shipped
            </Announcement>
            <Announcement badge="NEW" tone="live" href="/changelog">
              v2.0.1 just shipped
            </Announcement>
            <Announcement badge="BETA" tone="accent">
              Try the new editor
            </Announcement>
            <Announcement badge="SOON" tone="warning">
              Pricing update incoming
            </Announcement>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="announcement" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{usageSnippet}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/primitives/announcement/announcement.tsx" />
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
