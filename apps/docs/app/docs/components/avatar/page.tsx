import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { AvatarDemo } from "./avatar-demo";

export const metadata: Metadata = pageMetadata("/docs/components/avatar", {
  title: "Avatar",
  description:
    "One person, as an image or as their initials, with fallback handling on Base UI Avatar.",
});

const props = [
  {
    name: "src",
    type: "string",
    desc: "image source. omit it and the fallback shows.",
  },
  {
    name: "alt",
    type: "string",
    desc: (
      <>
        the person's name. <b>required</b>, it is the accessible name of the
        image.
      </>
    ),
  },
  {
    name: "fallback",
    type: "string",
    desc: "initials shown while the image loads, errors, or is missing.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    desc: "diameter and initials size.",
  },
  {
    name: "status",
    type: '"online" | "away" | "busy" | "offline"',
    desc: "a presence dot in the corner. online pulses.",
  },
  {
    name: "tone",
    type: '"solid" | "accent" | "neutral"',
    defaultValue: '"solid"',
    desc: "fallback fill: solid accent, tinted accent, or neutral surface.",
  },
];

export default function AvatarPage() {
  return (
    <ComponentDoc
      slug="avatar"
      client
      description={<>a person, as an image or their initials.</>}
      composition={{
        ok: [
          "sits in EntityCard, comment rows, nav account corners",
          "stacks into AvatarGroup for social proof",
        ],
        no: [
          "never a click target on its own. wrap it in a link or button",
          "not for logos or icons. it is a person",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">alt</code> names the image · the
          status dot is <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">@base-ui/react</code> ·{" "}
          <code className="font-mono text-xs">class-variance-authority</code>
        </>
      }
    >
      <AvatarDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="avatar"
        usage={`import { Avatar } from "@usva-ui/react/primitives/avatar";

<Avatar src="/jane.png" alt="Jane Doe" fallback="JD" />
<Avatar alt="Ada Lovelace" fallback="AL" status="online" />`}
      />
    </ComponentDoc>
  );
}
