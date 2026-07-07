import {
  Card,
  CardBody,
  CardHeader,
  CaseStudyHero,
  Chip,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Case Study Hero",
  description:
    "The copy-driven opener for a case study: eyebrow, two-tone display headline, tagline, meta grid, and a media slot.",
};

const props = [
  {
    name: "headingLevel",
    type: '"h1" | "h2" | "h3"',
    desc: "Heading element for the headline. Defaults to h1. Pick by document outline, not by size.",
  },
  {
    name: "headline",
    type: "React.ReactNode",
    desc: "The display headline. The only required prop.",
  },
  {
    name: "headlineAccent",
    type: "React.ReactNode",
    desc: "Second line of the headline, carrying the accent color. Omitted entirely when absent.",
  },
  {
    name: "accentColor",
    type: "string",
    desc: "Any CSS color. Categorical, not semantic: it keys to the study. Falls back to the accent-alt token.",
  },
  {
    name: "eyebrow",
    type: "React.ReactNode",
    desc: 'Mono uppercase kicker, e.g. "Case study".',
  },
  {
    name: "kicker",
    type: "React.ReactNode",
    desc: "Secondary mono line, e.g. the client and year.",
  },
  {
    name: "tagline",
    type: "React.ReactNode",
    desc: "Lede under the headline.",
  },
  {
    name: "link",
    type: "{ href, label, external? }",
    desc: "Rendered once. external adds target, the rel guard, and a screen-reader hint.",
  },
  {
    name: "meta",
    type: "{ label, value }[]",
    desc: "Rendered as a definition list. The grid is omitted when empty.",
  },
  {
    name: "tags",
    type: "React.ReactNode",
    desc: "Arbitrary slot. Pass Chips, spans, or nothing.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    desc: "The media well. Pass a MockupShowcase, an img, a video, or an iframe.",
  },
];

const usage = `import { CaseStudyHero, Chip, MockupShowcase } from "@matt-pasek/usva";

<CaseStudyHero
  eyebrow="Case study"
  kicker="Acme University · 2026"
  headline="Students could not see"
  headlineAccent="their whole degree."
  accentColor="#52c989"
  tagline="Four registries, one planner."
  link={{ href: "https://example.com", label: "Visit site", external: true }}
  meta={[
    { label: "Role", value: "Design engineer" },
    { label: "Timeline", value: "6 weeks" },
  ]}
  tags={<><Chip>React</Chip><Chip>Tailwind</Chip></>}
>
  <MockupShowcase>{/* media */}</MockupShowcase>
</CaseStudyHero>`;

const metaPairs = [
  { label: "Role", value: "Design engineer" },
  { label: "Timeline", value: "6 weeks" },
  { label: "Surface", value: "Web, extension" },
  { label: "Users", value: "2,400" },
];

export default function CaseStudyHeroPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Case Study Hero</h1>
        <p className="text-muted">
          The copy-driven opener for a case study, composed from atoms usva
          already ships. The headline is an <code>h1</code> by default; the demo
          below drops to <code>h2</code> so this page keeps one top-level
          heading.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <CaseStudyHero
            headingLevel="h2"
            eyebrow="Case study"
            kicker="Acme University · 2026"
            headline="Students could not see"
            headlineAccent="their whole degree."
            tagline="Four registries, one planner. Reconciling the systems nobody wanted to own."
            link={{
              href: "https://example.com",
              label: "Visit site",
              external: true,
            }}
            meta={metaPairs}
            tags={
              <>
                <Chip>React</Chip>
                <Chip>Tailwind</Chip>
                <Chip>Base UI</Chip>
              </>
            }
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>One link, one node</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The link is rendered exactly once and wraps on narrow screens. A
            hero that duplicates the link per breakpoint and hides one with{" "}
            <code>sm:hidden</code> puts two links in the accessibility tree and
            twice in the tab order, which is why this one does not.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Motion is opt-in</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The hero ships motion-free so the copied registry source has no
            import to resolve. Wrap it, or its parts, in{" "}
            <code>RevealGroup</code> for a staggered entrance.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Semantic vs categorical color</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            <code>accentColor</code> is an arbitrary CSS string because a
            study's brand color carries no meaning the system can reason about.
            A semantic tone would be a union (<code>success</code>,{" "}
            <code>warning</code>, <code>danger</code>). The two never share a
            prop.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="case-study-hero" />
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
          <SourceView filePath="packages/usva/src/patterns/case-study-hero/case-study-hero.tsx" />
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
