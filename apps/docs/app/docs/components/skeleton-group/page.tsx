import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { SkeletonGroupDemo } from "./skeleton-group-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/skeleton-group",
  {
    title: "Skeleton Group",
    description:
      "Runs one shimmer across every Skeleton inside it, so a loading block reads as a single surface instead of a dozen separate flickers.",
  },
);

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "any markup. every Skeleton beneath it joins the sweep, at any depth.",
  },
  {
    name: "className",
    type: "string",
    desc: "the group is a plain div, so it carries your layout: flex, grid, whatever the real content uses.",
  },
];

export default function SkeletonGroupPage() {
  return (
    <ComponentDoc
      slug="skeleton-group"
      name="SkeletonGroup"
      layer="primitive"
      provenance={["sisu-plus"]}
      client
      description={
        <>
          one light passing over the whole block. each Skeleton is measured
          against the group, so the shimmer crosses them in the order they sit
          in rather than restarting inside every one.
        </>
      }
      composition={{
        ok: [
          "any cluster of Skeletons that stands for one thing: a card, a row, a profile",
          "wrap the layout you already have. the group takes your flex or grid classes",
        ],
        no: [
          "not around a whole page of unrelated blocks. the sweep then means nothing",
          "a single Skeleton needs no group. it already shimmers on its own",
        ],
      }}
      a11y={
        <>
          the group adds no semantics of its own · the shimmer is decorative and
          stops under reduced motion
        </>
      }
      dependencies={
        <>
          Skeleton <span className="text-muted">from the same package</span>
        </>
      }
    >
      <SkeletonGroupDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="skeleton"
        usage={`import { Skeleton, SkeletonGroup } from "usva/primitives/skeleton";

<SkeletonGroup className="flex items-start gap-4">
  <Skeleton className="size-12 rounded-full" />
  <Skeleton className="h-4 w-2/3" />
</SkeletonGroup>`}
      />
    </ComponentDoc>
  );
}
