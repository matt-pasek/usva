import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { BadgeDemo } from "./badge-demo";

export const metadata: Metadata = pageMetadata("/docs/components/badge", {
  title: "Badge",
  description:
    "The status of the thing it sits on. Six semantic tones, plus a monospace uppercase variant for tags and metadata. It labels, it never clicks.",
});

const props = [
  {
    name: "tone",
    type: '"neutral" | "accent" | "accent-alt" | "success" | "warning" | "danger"',
    defaultValue: '"neutral"',
    desc: "semantic color role, rendered as a soft pill.",
  },
  {
    name: "mono",
    type: "boolean",
    defaultValue: "false",
    desc: "an uppercase monospace tag, for versions, keys and metadata.",
  },
  {
    name: "live",
    type: "boolean",
    desc: "the live green with a pulsing dot. overrides tone.",
  },
];

export default function BadgePage() {
  return (
    <ComponentDoc
      slug="badge"
      description={
        <>
          the status of the thing it sits on. six semantic tones as soft pills,
          a <code>mono</code> variant for versions and keys, and a pulsing{" "}
          <code>live</code> state. <b>it labels, it never clicks</b>; a
          clickable pill is Chip.
        </>
      }
      composition={{
        ok: [
          "sits in Card headers, table rows, list items, next to a title",
          "mono for machine values: versions, ids, env names",
        ],
        no: [
          "no onClick, no dismiss. interaction makes it a Chip",
          "not a counter on an icon. that is NotificationBadge",
        ],
      }}
      a11y={
        <>
          plain text in a <code className="font-mono text-xs">span</code> · the
          live dot is <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
      dependencies={
        <code className="font-mono text-xs">class-variance-authority</code>
      }
    >
      <BadgeDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="badge"
        usage={`import { Badge } from "@matt-pasek/usva/primitives/badge";

<Badge tone="accent">New</Badge>
<Badge tone="success">Passing</Badge>
<Badge tone="accent-alt" mono>v1.0.0</Badge>`}
      />
    </ComponentDoc>
  );
}
