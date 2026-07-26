import { SulaLoader } from "@matt-pasek/usva/sula/sula-loader";
import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { SulaLoaderDemo } from "./sula-loader-demo";

export const metadata: Metadata = pageMetadata("/docs/components/sula-loader", {
  title: "Sula Loader",
  description:
    "For a wait you want felt. A liquid-glass metaball spinner that loops only while it is mounted.",
});

const props = [
  {
    name: "size",
    type: "number",
    defaultValue: "96",
    desc: "square side in px. the blobs scale off it, so this is the only sizing knob.",
  },
  {
    name: "motion",
    type: '"orbit" | "cluster" | "twin"',
    defaultValue: '"orbit"',
    desc: "orbit relays a released bead; cluster gathers three unequal drops; twin exchanges momentum between two masses.",
  },
  {
    name: "speed",
    type: "number",
    defaultValue: "1",
    desc: "loop-rate multiplier. higher is faster.",
  },
  {
    name: "label",
    type: "string",
    defaultValue: '"Loading"',
    desc: "the status text a screen reader announces.",
  },
  {
    name: "fluid",
    type: "boolean",
    defaultValue: "true",
    desc: "false renders a static still and mounts no canvas.",
  },
  {
    name: "accentColor",
    type: "string",
    desc: "rim light and glow on the droplets. defaults to the accent token.",
  },
  {
    name: "backdrop",
    type: "string",
    desc: "the colour the glass tints against. defaults to the bg token.",
  },
  {
    name: "tint",
    type: "string",
    desc: "the glass itself. defaults to the surface-2 token.",
  },
  {
    name: "shine",
    type: "number",
    desc: "0 is flat matte glass, 1 is the full neon rim. derived from the backdrop when unset.",
  },
];

export default function SulaLoaderPage() {
  return (
    <ComponentDoc
      slug="sula-loader"
      client
      description={
        <>
          a loading moment made of liquid glass. each loop stages one physical
          event: a bead tears free and returns, drops gather and scatter, or two
          masses trade momentum through a bridge.{" "}
          <b>the loader unmounts the moment the work lands</b>.
        </>
      }
      composition={{
        ok: [
          "the big wait: a route change, a splash, an empty panel, a hero settling in",
          "one per screen. it is the focal point while nothing else exists",
        ],
        no: [
          "not the spinner for a button, a table row, or a validating field. that is Spinner",
          "never left looping behind a finished page",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="status"</code> with{" "}
          <code className="font-mono text-xs">aria-busy</code>, announces its{" "}
          <code className="font-mono text-xs">label</code> · the field is{" "}
          <code className="font-mono text-xs">aria-hidden</code> · reduced
          motion gets the still
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">motion</code> ·{" "}
          <code className="font-mono text-xs">ogl</code> · sula-core{" "}
          <span className="text-muted">from the same package</span>
        </>
      }
    >
      <SulaLoaderDemo />

      <DemoPanel label="the still · fluid={false}, reduced motion, or no WebGL2">
        <div className="flex items-center justify-center gap-8 py-6">
          <SulaLoader size={72} motion="orbit" fluid={false} />
          <SulaLoader size={72} motion="cluster" fluid={false} />
          <SulaLoader size={72} motion="twin" fluid={false} />
        </div>
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection
        registryName="sula-loader"
        usage={`import { SulaLoader } from "@matt-pasek/usva/sula/sula-loader";

{isPending ? <SulaLoader label="Loading dashboard" /> : <Dashboard />}`}
      />
    </ComponentDoc>
  );
}
