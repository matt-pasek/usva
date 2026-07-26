import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { RevealGroupDemo } from "@/components/reveal-group-demo";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/docs/components/reveal-group",
  {
    title: "Reveal Group",
    description:
      "The stagger group for Reveal: one shared trigger cascades its direct children in, one after the next.",
  },
);

const usage = `import { RevealGroup } from "@matt-pasek/usva/motion/reveal";

<RevealGroup variant="tick" className="grid grid-cols-3 gap-3">
  <StatCard />
  <StatCard />
  <StatCard />
</RevealGroup>`;

const props = [
  {
    name: "variant",
    type: '"veil" | "cast" | "surface" | "focus" | "tick" | "lean"',
    defaultValue: '"tick"',
    desc: "the reveal every child runs. assign by content role, like Reveal.",
  },
  {
    name: "stagger",
    type: "number",
    defaultValue: "0.06",
    desc: (
      <>
        seconds between children on the shared trigger.{" "}
        <b>the cascade is the effect</b>, so the layout classes go on the group.
      </>
    ),
  },
  {
    name: "as",
    type: "RevealTag",
    defaultValue: '"div"',
    desc: "the rendered element. ul, section, and friends keep their semantics.",
  },
  {
    name: "intensity",
    type: "number",
    desc: "overrides the ambient RevealConfigProvider scalar for the group.",
  },
  {
    name: "force",
    type: "boolean",
    defaultValue: "false",
    desc: "cascade even when already in view at mount.",
  },
];

export default function RevealGroupPage() {
  return (
    <ComponentDoc
      name="Reveal Group"
      layer="motion"
      intensity="guides"
      client
      description={
        <>
          the stagger group for Reveal: one shared viewport trigger cascades its
          direct children in, one after the next. the cascade is the effect, so
          the layout goes on the group and one variant covers every child.
        </>
      }
      composition={{
        ok: [
          "a grid or row of siblings that enter together: cards, stats, logos",
          "one variant for the whole group; children inherit it",
        ],
        no: [
          "never a Reveal inside it, the group already animates each child",
          "not across sections, one trigger per group",
        ],
      }}
      a11y={
        <>
          renders static under{" "}
          <code className="font-mono text-xs">prefers-reduced-motion</code>,
          nothing ever arms · children ship visible before hydration
        </>
      }
      dependencies={<code className="font-mono text-xs">motion</code>}
    >
      <RevealGroupDemo />

      <PropsTable rows={props} />

      <AcquireSection registryName="reveal" usage={usage} />
    </ComponentDoc>
  );
}
