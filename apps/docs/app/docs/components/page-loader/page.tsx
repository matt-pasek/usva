import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { PageLoaderDemo } from "./page-loader-demo";

export const metadata: Metadata = pageMetadata("/docs/components/page-loader", {
  title: "Page Loader",
  description:
    "A centred spinner with room around it and an optional label, for a route or a panel that has nothing to show yet.",
});

const props = [
  {
    name: "label",
    type: "string",
    desc: "what is being waited on. omit it only when the surrounding page already says.",
  },
  {
    name: "variant",
    type: '"ring" | "dots" | "bars" | "orbit"',
    defaultValue: '"ring"',
    desc: "the Spinner it centres. the whole Spinner vocabulary is available here.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"lg"',
    desc: "spinner scale. lg is the route-level default, sm suits a panel.",
  },
  {
    name: "tone",
    type: '"accent" | "current"',
    defaultValue: '"accent"',
    desc: "current inherits the surrounding ink, for a loader inside tinted chrome.",
  },
];

export default function PageLoaderPage() {
  return (
    <ComponentDoc
      slug="page-loader"
      name="PageLoader"
      layer="primitive"
      provenance={["sisu-plus"]}
      client
      description={
        <>
          a Spinner given a room of its own. it claims a minimum height and
          centres in it, so a route that is still fetching holds its shape
          instead of collapsing to nothing.
        </>
      }
      composition={{
        ok: [
          "route-level waits, and panels that have nothing to show yet",
          "the label is the honest part: say what is loading, not that it is loading",
        ],
        no: [
          "not for a button or an inline wait. that is Spinner on its own",
          "not over content that already exists. that is LoadingOverlay",
        ],
      }}
      a11y={
        <>
          the Spinner carries the live region · the label is read with it, so
          the wait is announced rather than silent
        </>
      }
      dependencies={
        <>
          Spinner <span className="text-muted">from the same package</span>
        </>
      }
    >
      <PageLoaderDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="spinner"
        usage={`import { PageLoader } from "usva/primitives/spinner";

<PageLoader label="loading your dashboard" />`}
      />
    </ComponentDoc>
  );
}
