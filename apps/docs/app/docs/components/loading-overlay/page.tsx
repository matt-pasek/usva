import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { LoadingOverlayDemo } from "./loading-overlay-demo";

export const metadata: Metadata = {
  title: "Loading Overlay",
  description:
    "Covers the region that is busy and only that region: a dimming scrim, a centred spinner, and refcounted scroll lock.",
};

const props = [
  {
    name: "contain",
    type: '"viewport" | "parent"',
    defaultValue: '"parent"',
    desc: (
      <>
        parent covers the nearest positioned ancestor and locks nothing.{" "}
        <b>viewport locks body scroll</b>, refcounted, and restores the exact
        overflow value it found.
      </>
    ),
  },
  {
    name: "label",
    type: "string",
    defaultValue: '"Loading"',
    desc: "announced by the status region and repeated as a visible caption.",
  },
  {
    name: "blur",
    type: "boolean",
    defaultValue: "true",
    desc: "backdrop blur behind the scrim.",
  },
  {
    name: "variant",
    type: '"ring" | "dots" | "bars" | "orbit"',
    defaultValue: '"ring"',
    desc: "forwarded to Spinner.",
  },
  {
    name: "size",
    type: "SpinnerSize",
    defaultValue: '"lg"',
    desc: "forwarded to Spinner.",
  },
  {
    name: "tone",
    type: "SpinnerTone",
    defaultValue: '"accent"',
    desc: "forwarded to Spinner.",
  },
];

export default function LoadingOverlayPage() {
  return (
    <ComponentDoc
      slug="loading-overlay"
      client
      description={
        <>
          a dimming scrim with a centered spinner, over its parent while it
          loads or over the whole page.
        </>
      }
      composition={{
        ok: [
          "over a positioned panel or Card while its data loads",
          'contain="viewport" for whole-page transitions, even over an open modal',
        ],
        no: [
          "not for button-level loading. Button has a status machine",
          "not a Dialog scrim. it dims content, it does not trap focus",
        ],
      }}
      a11y={
        <>
          the spinner is a{" "}
          <code className="font-mono text-xs">role="status"</code> region
          announcing the label once · the visible caption is{" "}
          <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
      dependencies={
        <>
          Spinner <span className="text-muted">from the same package</span>
        </>
      }
    >
      <LoadingOverlayDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="loading-overlay"
        usage={`import { LoadingOverlay } from "@matt-pasek/usva";

<div className="relative">
  <LoadingOverlay label="Fetching courses" />
</div>

<LoadingOverlay contain="viewport" label="Loading dashboard" />`}
      />
    </ComponentDoc>
  );
}
