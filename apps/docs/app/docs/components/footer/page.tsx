import { Card, CardBody, CardHeader, Footer } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Footer",
  description:
    "A marketing footer: brand slot, titled link columns or a flat row, and an optional bottom bar.",
};

const props = [
  {
    name: "variant",
    type: '"full" | "compact"',
    desc: 'Defaults to "full" (titled columns). "compact" flattens them into one untitled row.',
  },
  {
    name: "columns",
    type: "FooterColumn[]",
    desc: "Each is { title, tone?, links }. The title is the column's accessible name.",
  },
  {
    name: "brand",
    type: "React.ReactNode",
    desc: "Wordmark slot. Pass whatever your brand is.",
  },
  { name: "tagline", type: "React.ReactNode", desc: "Line under the brand." },
  {
    name: "copyright",
    type: "React.ReactNode",
    desc: "Left side of the bottom bar.",
  },
  {
    name: "note",
    type: "React.ReactNode",
    desc: "Right side of the bottom bar. The bar is omitted when both are absent.",
  },
  {
    name: "glow",
    type: "boolean",
    desc: "Two decorative radial washes. Off by default: they assume a dark page.",
  },
];

const usage = `import { Footer } from "@matt-pasek/usva";

<Footer
  brand={<Wordmark />}
  tagline="Designer by eye, dev by hand."
  columns={[
    { title: "Index", links: [{ label: "About", href: "#about" }] },
    {
      title: "Elsewhere",
      tone: "accent-alt",
      links: [{ label: "GitHub", href: "https://github.com/matt-pasek" }],
    },
  ]}
  copyright="© 2026 Mateusz Pasek"
  note="quality > quantity"
/>`;

const columns = [
  {
    title: "Index",
    links: [
      { label: "About", href: "#about" },
      { label: "Work", href: "#work" },
      { label: "Currently", href: "#currently" },
    ],
  },
  {
    title: "Elsewhere",
    tone: "accent-alt" as const,
    links: [
      { label: "GitHub", href: "https://github.com/matt-pasek" },
      { label: "Email", href: "mailto:contact@matt-pasek.dev" },
    ],
  },
];

export default function FooterPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Footer</h1>
        <p className="text-muted">
          Brand, links, and a bottom bar. Two layouts from one component: kajo's
          titled columns and sisu's flat row.
        </p>
      </div>

      <Card>
        <CardHeader>Full</CardHeader>
        <CardBody>
          <Footer
            className="px-0 py-8 sm:px-0"
            brand={
              <span className="text-2xl font-black tracking-tight text-ink">
                usva.
              </span>
            }
            tagline="Designer by eye, dev by hand. Currently in Lahti."
            columns={columns}
            copyright="© 2026 Mateusz Pasek"
            note="quality > quantity"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Compact</CardHeader>
        <CardBody>
          <Footer
            className="px-0 py-8 sm:px-0"
            variant="compact"
            brand={<span className="text-lg font-bold text-ink">sisu+</span>}
            columns={columns}
            copyright="© 2026 Mateusz Pasek"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>What the footer does not own</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            kajo's footer pulls itself up under the section above with a
            negative margin and a very large top padding. That is page layout,
            not footer: it only works when a particular section sits above it.
            Put it in <code>className</code>. The glows are opt-in for the same
            reason, since they assume a dark page.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Link targets are derived</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            An <code>http</code> link opens a new tab and gets the{" "}
            <code>rel</code> guard and a screen-reader hint.{" "}
            <code>mailto:</code>, <code>tel:</code> and in-page anchors do not.
            Set <code>external</code> on a link to override.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="footer" />
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
          <SourceView filePath="packages/usva/src/patterns/footer/footer.tsx" />
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
