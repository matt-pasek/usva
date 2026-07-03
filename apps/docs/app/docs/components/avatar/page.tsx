import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { AvatarDemo } from "./avatar-demo";

export const metadata: Metadata = {
  title: "Avatar",
  description:
    "A styled-only avatar primitive with image/fallback handling, built on Base UI Avatar.",
};

const props = [
  { name: "src", type: "string", desc: "Image source URL." },
  {
    name: "alt",
    type: "string",
    desc: "Accessible name for the avatar image (required).",
  },
  {
    name: "fallback",
    type: "string",
    desc: "Initials shown while the image is loading, missing, or errored.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    desc: "Visual size. Defaults to md.",
  },
];

const usageSnippet = `import { Avatar } from "@matt-pasek/usva";

<Avatar src="/jane.png" alt="Jane Doe" fallback="JD" />`;

export default function AvatarPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Avatar</h1>
        <p className="text-muted">
          Built on Base UI <code>Avatar</code>, which tracks image load state
          and swaps to initials on error or while unloaded.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <AvatarDemo />
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
          <pre className="overflow-x-auto rounded-md border border-border bg-surface-2 p-3 text-xs text-ink">
            <code>{usageSnippet}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/primitives/avatar/avatar.tsx" />
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
