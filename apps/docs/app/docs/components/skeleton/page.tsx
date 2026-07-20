import { Skeleton, SkeletonGroup } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";

export const metadata: Metadata = {
  title: "Skeleton",
  description:
    "A grey block in the shape of a piece of content, shown while that content loads.",
};

const props = [
  {
    name: "variant",
    type: '"text" | "circle" | "rect"',
    defaultValue: '"text"',
    desc: "the placeholder shape. text is a line, circle an avatar, rect a media block.",
  },
  {
    name: "width / height",
    type: "string | number",
    desc: "explicit dimensions, applied via inline style.",
  },
  {
    name: "radius",
    type: "string | number",
    desc: "border radius override, applied via inline style.",
  },
];

export default function SkeletonPage() {
  return (
    <ComponentDoc
      slug="skeleton"
      description={
        <>
          a grey block in the shape of a piece of content, shown while that
          content loads. hand these into the layout you are waiting on; to grey
          a whole component at once, reach for SkeletonMirror. wrap a composed
          placeholder in SkeletonGroup so one sheen crosses every block.
        </>
      }
      composition={{
        ok: [
          "hand-built blocks that mimic the loading card, list row or avatar",
          "text, circle and rect cover a line, an avatar and a media block",
          "SkeletonGroup gives a composed placeholder one continuous border sheen",
        ],
        no: [
          "not a spinner. a skeleton promises the shape of what is coming",
          "greying a whole component you already have is SkeletonMirror",
        ],
      }}
      a11y={
        <>
          decorative, <code className="font-mono text-xs">aria-hidden</code> ·
          own the loading announcement on the region around it · the sheen stops
          under reduced motion
        </>
      }
      dependencies={
        <code className="font-mono text-xs">class-variance-authority</code>
      }
    >
      <DemoPanel label="blocks">
        <SkeletonGroup className="mx-auto flex w-72 flex-col gap-3 rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <Skeleton variant="circle" width={40} height={40} />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </div>
          </div>
          <Skeleton variant="rect" height={120} />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </SkeletonGroup>
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection
        registryName="skeleton"
        usage={`import { Skeleton, SkeletonGroup } from "@matt-pasek/usva";

<SkeletonGroup className="flex flex-col gap-3">
  <Skeleton variant="circle" width={40} height={40} />
  <Skeleton variant="text" width="60%" />
  <Skeleton variant="rect" height={120} />
</SkeletonGroup>`}
      />
    </ComponentDoc>
  );
}
