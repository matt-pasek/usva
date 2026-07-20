import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { ProgressDemo } from "./progress-demo";

export const metadata: Metadata = {
  title: "Progress",
  description:
    "A progress bar with determinate and indeterminate modes, three sizes, and an optional accent glow.",
};

const props = [
  {
    name: "value",
    type: "number",
    desc: "current progress, clamped to [0, max]. omit it for the indeterminate shimmer.",
  },
  {
    name: "max",
    type: "number",
    defaultValue: "100",
    desc: "upper bound for value.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    desc: "track height, 4 to 12 pixels. pick by the density of the row it sits in.",
  },
  {
    name: "glow",
    type: "boolean",
    defaultValue: "false",
    desc: "the accent halo on the fill. one glowing bar per view.",
  },
];

export default function ProgressPage() {
  return (
    <ComponentDoc
      slug="progress"
      description={
        <>
          a bar that fills to show how far along something is, or shimmers when
          the end is unknown. <b>it renders no text, so it always needs a
          label</b>.
        </>
      }
      composition={{
        ok: [
          "uploads, installs, quota rows inside Card or a table cell",
          "pair with a text line that says what is progressing",
        ],
        no: [
          "not a meter for static values. it implies something is underway",
          "not a page loader. indeterminate work that owns the view gets Spinner",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="progressbar"</code> with{" "}
          <code className="font-mono text-xs">aria-valuenow/min/max</code>,
          valuenow omitted when indeterminate · bring an{" "}
          <code className="font-mono text-xs">aria-label</code> · motion stops
          under reduced motion
        </>
      }
      dependencies={
        <code className="font-mono text-xs">class-variance-authority</code>
      }
    >
      <ProgressDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="progress"
        usage={`import { Progress } from "@matt-pasek/usva";

<Progress value={40} aria-label="Upload" />
<Progress value={80} glow aria-label="Sync" />
<Progress aria-label="Working" />`}
      />
    </ComponentDoc>
  );
}
