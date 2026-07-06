import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EntityActions,
  EntityBody,
  EntityCard,
  EntityContent,
  EntityIndex,
  EntityMedia,
  EntityMeta,
  EntityTitle,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Entity Card",
  description:
    "A parts-only card scaffold for representing an entity — media, meta, title, body, and actions — that composes into projects, courses, and more.",
};

const props = [
  {
    name: "variant",
    type: '"stack" | "row" | "showcase"',
    desc: "Layout: stack (media-on-top tile, default), row (side media list row), or showcase (big numbered work card). Wrap text in EntityContent for row/showcase.",
  },
  {
    name: "className",
    type: "string",
    desc: "Merged onto the root Card; the root adds a 2xl radius, overflow-hidden, and a flex column.",
  },
  {
    name: "...Card props",
    type: "CardProps",
    desc: "EntityCard extends the Card primitive, so every Card prop is forwarded.",
  },
];

const usageSnippet = `import {
  EntityCard,
  EntityMedia,
  EntityMeta,
  EntityTitle,
  EntityBody,
  EntityActions,
  Badge,
  Button,
} from "@matt-pasek/usva";

<EntityCard>
  <EntityMedia>
    <img src="/cover.jpg" alt="" />
  </EntityMedia>
  <EntityMeta>
    <Badge tone="accent">Design</Badge>
  </EntityMeta>
  <EntityTitle>Aurora tokens</EntityTitle>
  <EntityBody>A layered token pipeline for the kajo theme.</EntityBody>
  <EntityActions>
    <Button size="sm">Open</Button>
  </EntityActions>
</EntityCard>`;

export default function EntityCardPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Entity Card</h1>
        <p className="text-muted">
          A parts-only scaffold — <code>EntityCard</code> wraps the{" "}
          <code>Card</code> primitive, then <code>EntityMedia</code>,{" "}
          <code>EntityMeta</code>, <code>EntityTitle</code>,{" "}
          <code>EntityBody</code>, and <code>EntityActions</code> compose in any
          order you need. Nothing is prescribed beyond spacing, so the same
          parts render a project tile or a course card.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="grid gap-5 sm:grid-cols-2">
            <EntityCard>
              <EntityMedia>
                <div className="h-full w-full bg-[linear-gradient(135deg,var(--color-accent)/20,transparent)] [background-color:var(--color-surface-2)]" />
              </EntityMedia>
              <EntityMeta>
                <Badge tone="accent">Project</Badge>
                <Badge tone="neutral" mono>
                  React
                </Badge>
              </EntityMeta>
              <EntityTitle>Aurora tokens</EntityTitle>
              <EntityBody>
                A layered token pipeline that emits Tailwind v4 and DTCG from
                one source of truth.
              </EntityBody>
              <EntityActions>
                <Button size="sm">Open</Button>
                <Button size="sm" variant="ghost">
                  Source
                </Button>
              </EntityActions>
            </EntityCard>

            <EntityCard>
              <EntityMeta>
                <Badge tone="accent-alt">Course</Badge>
                <Badge tone="success">Enrolled</Badge>
              </EntityMeta>
              <EntityTitle>Designing with fog</EntityTitle>
              <EntityBody>
                Six lessons on building beauty that stays usable across two
                brand poles.
              </EntityBody>
              <EntityMeta className="pt-1 text-xs text-muted">
                <span>6 lessons</span>
                <span aria-hidden="true">·</span>
                <span>2h 40m</span>
              </EntityMeta>
              <EntityActions>
                <Button size="sm" variant="soft">
                  Continue
                </Button>
              </EntityActions>
            </EntityCard>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Showcase</CardHeader>
        <CardBody>
          <p className="mb-4 text-sm text-muted">
            <code>variant=&quot;showcase&quot;</code> — the numbered
            &quot;selected work&quot; card: an index marker, tag pills, an
            oversized title, a blurb, and a case-study link.
          </p>
          <EntityCard variant="showcase" interactive>
            <EntityContent>
              <EntityMeta>
                <EntityIndex>001</EntityIndex>
                <Badge tone="accent" mono>
                  Frontend
                </Badge>
                <Badge tone="accent-alt" mono>
                  Design system
                </Badge>
              </EntityMeta>
              <EntityTitle>jAIn 2.0</EntityTitle>
              <EntityBody>
                Solo frontend developer and UI designer on an AI-powered HR
                platform: architecture, design system, and every user-facing
                feature. Now in active use across the organisation.
              </EntityBody>
              <EntityActions>
                <Button size="sm" variant="ghost">
                  view case study →
                </Button>
              </EntityActions>
            </EntityContent>
          </EntityCard>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Row</CardHeader>
        <CardBody>
          <p className="mb-4 text-sm text-muted">
            <code>variant=&quot;row&quot;</code> — a side media panel with the
            content beside it (stacks on narrow screens). Wrap the text in{" "}
            <code>EntityContent</code>.
          </p>
          <EntityCard variant="row" interactive>
            <EntityMedia>
              <div className="h-full w-full [background:linear-gradient(135deg,color-mix(in_srgb,var(--color-accent)_30%,transparent),transparent)]" />
            </EntityMedia>
            <EntityContent>
              <EntityMeta>
                <Badge tone="accent-alt">Course</Badge>
                <Badge tone="success">Enrolled</Badge>
              </EntityMeta>
              <EntityTitle>Discrete Mathematics</EntityTitle>
              <EntityBody className="pb-5">
                MA-140 · 4 cr · a compact list row that keeps its media, meta,
                and title in one line-up.
              </EntityBody>
            </EntityContent>
          </EntityCard>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="entity-card" />
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
          <SourceView filePath="packages/usva/src/patterns/entity-card/entity-card.tsx" />
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
