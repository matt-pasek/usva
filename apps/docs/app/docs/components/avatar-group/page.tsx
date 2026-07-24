import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { AvatarGroupDemo } from "./avatar-group-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/avatar-group",
  {
    title: "Avatar Group",
    description:
      "Overlapping avatars with a +N overflow chip and a caption, for social proof and shared ownership.",
  },
);

const props = [
  {
    name: "max",
    type: "number",
    desc: "caps the visible avatars. the rest collapse into a +N chip.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    desc: "overlap spacing and +N chip size. match the Avatars inside.",
  },
  {
    name: "label",
    type: "ReactNode",
    desc: 'caption after the stack, e.g. "25+ active users".',
  },
  {
    name: "tone",
    type: '"solid" | "accent" | "neutral"',
    defaultValue: '"neutral"',
    desc: "colors the +N chip. pair it with the Avatar tone.",
  },
];

export default function AvatarGroupPage() {
  return (
    <ComponentDoc
      slug="avatar-group"
      name="AvatarGroup"
      layer="primitive"
      provenance={["sisu-plus"]}
      description={
        <>
          avatars overlapped into one cluster, so a crowd reads at a glance. the
          caption carries the claim, the faces carry the proof.
        </>
      }
      composition={{
        ok: [
          "hero social proof, participant lists, shared ownership rows",
          "the tinted cluster pairs tone on the group with tone on each Avatar",
        ],
        no: [
          "never more faces than max can justify. five visible is the ceiling",
          "not a picker. the stack does not click",
        ],
      }}
      a11y={
        <>
          each Avatar keeps its own{" "}
          <code className="font-mono text-xs">alt</code> · the +N chip and
          caption are plain text
        </>
      }
    >
      <AvatarGroupDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="avatar"
        usage={`import { AvatarGroup, Avatar } from "@matt-pasek/usva";

<AvatarGroup max={4} label="+128 students">
  <Avatar alt="Ada" fallback="AL" />
  <Avatar alt="Blaise" fallback="BP" />
  <Avatar alt="Curie" fallback="MC" />
  <Avatar alt="Dijkstra" fallback="ED" />
  <Avatar alt="Euler" fallback="LE" />
</AvatarGroup>`}
      />
    </ComponentDoc>
  );
}
