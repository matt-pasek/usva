import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { UtuPlayground } from "./utu-demo";

export const metadata: Metadata = pageMetadata("/docs/components/utu", {
  title: "Utu",
  description:
    "Morning fog made into a field: one luminous body on dark ground, damp soaking into clay on savi.",
});

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "rendered in normal flow above the field. omit for a bare orb you position yourself.",
  },
  {
    name: "speed",
    type: "number",
    defaultValue: "1",
    desc: "rotation and breath rate multiplier.",
  },
  {
    name: "interactive",
    type: "boolean",
    defaultValue: "false",
    desc: "the volume eases a lean toward the cursor. off because a hero should not chase the pointer.",
  },
  {
    name: "bands",
    type: "number",
    defaultValue: "5",
    desc: "how many glowing bands stack through the body.",
  },
  {
    name: "colors",
    type: "{ deep?; mid?; hot? }",
    desc: "override any stop of the dawn gradient. omitted stops keep violet valleys, magenta body, warm-gold cores.",
  },
  {
    name: "accentColor",
    type: "string",
    desc: "collapse the gradient to one brand colour, sunk to black in the valleys and blown toward white at the cores.",
  },
  {
    name: "opacity",
    type: "number",
    defaultValue: "1",
    desc: "overall fog opacity. lower lets more of the page through.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    desc: "forces the material. by default a dark ground emits fog and a light ground holds a damp stain.",
  },
];

export default function UtuPage() {
  return (
    <ComponentDoc
      slug="utu"
      client
      description={
        <>
          morning fog made into a field. on dark ground it is one luminous body
          with depth you can see into; on savi the same density reads as damp
          soaking into clay, transparent where the ground stayed dry.
        </>
      }
      composition={{
        ok: [
          "a landing hero, a splash, one felt moment per view",
          "the savi stain is calm enough to sit behind longer reading",
        ],
        no: [
          "never behind a table or form. the glow gets one spot per view",
          "never two glowing bodies in one viewport",
        ],
      }}
      a11y={
        <>
          the canvas layer is{" "}
          <code className="font-mono text-xs">aria-hidden</code> · children stay
          in normal flow, fully interactive · reduced motion gets a static
          frame, not a loop
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">ogl</code> · atmospheres-core{" "}
          <span className="text-muted">from the same package</span>
        </>
      }
    >
      <UtuPlayground />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="utu"
        usage={`import { Utu } from "@usva-ui/react/atmospheres/utu";

<Utu className="min-h-svh">
  <Hero />
</Utu>`}
      />
    </ComponentDoc>
  );
}
