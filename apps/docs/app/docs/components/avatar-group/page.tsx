import {
  Avatar,
  AvatarGroup,
  Card,
  CardBody,
  CardHeader,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Avatar Group",
  description:
    "An overlapping stack of avatars with an optional +N overflow chip and a caption, for social proof and shared ownership.",
};

const props = [
  {
    name: "max",
    type: "number",
    desc: "Cap the visible avatars; the rest collapse into a +N chip.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    desc: "Overlap spacing and +N chip size. Defaults to md.",
  },
  {
    name: "label",
    type: "React.ReactNode",
    desc: 'Caption after the stack, e.g. "25+ active users".',
  },
  {
    name: "tone",
    type: '"solid" | "accent" | "neutral"',
    desc: "Colors the +N chip to match the cluster. Pair with Avatar tone. Defaults to neutral.",
  },
];

const usage = `import { AvatarGroup, Avatar } from "@matt-pasek/usva";

<AvatarGroup max={4} label="+128 students">
  <Avatar alt="Ada" fallback="MP" />
  <Avatar alt="Blaise" fallback="AK" />
  <Avatar alt="Curie" fallback="JL" />
  <Avatar alt="Dijkstra" fallback="RS" />
  <Avatar alt="Euler" fallback="TN" />
</AvatarGroup>`;

export default function AvatarGroupPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Avatar Group</h1>
        <p className="text-muted">
          An overlapping stack of <code>Avatar</code>s, capped with a{" "}
          <code>max</code> and a <code>+N</code> overflow chip, plus an optional
          caption. For social proof, shared ownership, and participant lists.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="flex flex-col gap-5">
          <AvatarGroup max={4} label="+128 students">
            <Avatar alt="Ada" fallback="MP" />
            <Avatar alt="Blaise" fallback="AK" />
            <Avatar alt="Curie" fallback="JL" />
            <Avatar alt="Dijkstra" fallback="RS" />
            <Avatar alt="Euler" fallback="TN" />
            <Avatar alt="Fermat" fallback="OK" />
          </AvatarGroup>
          <AvatarGroup size="sm">
            <Avatar size="sm" alt="Ada" fallback="MP" />
            <Avatar size="sm" alt="Blaise" fallback="AK" />
            <Avatar size="sm" alt="Curie" fallback="JL" />
          </AvatarGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Tinted cluster</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Pair <code>Avatar tone=&quot;accent&quot;</code> with{" "}
            <code>AvatarGroup tone=&quot;accent&quot;</code> for the tinted
            social-proof cluster — accent-filled initials, a matching{" "}
            <code>+N</code> chip, and a caption.
          </p>
          <AvatarGroup size="sm" max={3} tone="accent" label="25+ active users">
            <Avatar size="sm" tone="accent" alt="Ada" fallback="MP" />
            <Avatar size="sm" tone="accent" alt="Blaise" fallback="AK" />
            <Avatar size="sm" tone="accent" alt="Curie" fallback="JL" />
            <Avatar size="sm" tone="accent" alt="Dijkstra" fallback="RS" />
            <Avatar size="sm" tone="accent" alt="Euler" fallback="TN" />
          </AvatarGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="avatar" />
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
          <SourceView filePath="packages/usva/src/primitives/avatar/avatar-group.tsx" />
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
