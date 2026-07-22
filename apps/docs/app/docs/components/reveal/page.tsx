import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";
import { RevealDemo } from "@/components/reveal-demo";

export const metadata: Metadata = {
  title: "Reveal",
  description:
    "Six role-based scroll reveals that resolve out of mist, plus a stagger group and an intensity knob.",
};

const usage = `import { Reveal, RevealGroup } from "@matt-pasek/usva";

<Reveal variant="cast" as="h2">Section title</Reveal>
<Reveal variant="veil">Body copy resolves out of the mist.</Reveal>

<RevealGroup variant="tick" className="grid grid-cols-3 gap-3">
  <StatCard />
  <StatCard />
  <StatCard />
</RevealGroup>`;

const props = [
  {
    name: "variant",
    type: '"veil" | "cast" | "surface" | "focus" | "tick" | "lean"',
    defaultValue: '"veil"',
    desc: (
      <>
        <b>assign by content role, never by position</b>. cast for headings,
        veil for prose, surface for cards and CTAs, focus for media, tick for
        data, lean for quotes.
      </>
    ),
  },
  {
    name: "as",
    type: "RevealTag",
    defaultValue: '"div"',
    desc: "the rendered element. h2, section, p, li, figure and friends keep their semantics.",
  },
  {
    name: "intensity",
    type: "number",
    desc: "overrides the ambient RevealConfigProvider scalar. 1 is kajo-bold, ~0.45 sisu-quiet, 0 switches the reveal off.",
  },
  {
    name: "delay",
    type: "number",
    defaultValue: "0",
    desc: "seconds before the enter starts.",
  },
  {
    name: "amount",
    type: "number",
    defaultValue: "0.35",
    desc: "fraction of the element that must be visible to trigger.",
  },
  {
    name: "force",
    type: "boolean",
    defaultValue: "false",
    desc: "reveal even when already in view at mount. demos and explicit entrances.",
  },
];

export default function RevealPage() {
  return (
    <ComponentDoc
      name="Reveal"
      layer="motion"
      intensity="guides"
      client
      description={
        <>
          six scroll reveals under one idea: things resolve out of mist as they
          come into view. assign the variant by content role, so a page does not
          replay one identical entrance.
        </>
      }
      composition={{
        ok: [
          "sections, cards and media on marketing and content pages",
          "stagger lives inside one RevealGroup, never across sections",
        ],
        no: [
          "not in dense task UI. a dashboard someone works in reveals nothing",
          "never a Reveal inside a RevealGroup, the group already animates each child",
        ],
      }}
      a11y={
        <>
          renders static under{" "}
          <code className="font-mono text-xs">prefers-reduced-motion</code>,
          nothing ever arms · content ships visible before hydration · as keeps
          the element semantic
        </>
      }
      dependencies={<code className="font-mono text-xs">motion</code>}
    >
      <DemoPanel label="live · six variants">
        <RevealDemo />
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection registryName="reveal" usage={usage} />
    </ComponentDoc>
  );
}
