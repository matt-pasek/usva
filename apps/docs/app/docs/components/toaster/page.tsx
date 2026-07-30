import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { ToasterDemo } from "./toaster-demo";

export const metadata: Metadata = pageMetadata("/docs/components/toaster", {
  title: "Toaster",
  description:
    "The viewport every toast renders into. Mount it once at the root, or nothing you notify ever appears.",
});

const props = [
  {
    name: "limit",
    type: "number",
    desc: "how many toasts stack before the oldest is dropped.",
  },
  {
    name: "timeout",
    type: "number",
    desc: "milliseconds a toast waits before dismissing itself.",
  },
];

export default function ToasterPage() {
  return (
    <ComponentDoc
      slug="toaster"
      name="Toaster"
      layer="primitive"
      provenance={["sisu-plus"]}
      client
      description={
        <>
          the place toasts land. it is the half of the toast system you mount
          rather than call: one of these at the root, and{" "}
          <code className="font-mono text-xs">notify</code> works from anywhere,
          including outside React.
        </>
      }
      composition={{
        ok: [
          "once, at the root of the app, beside the theme provider",
          "it portals to a fixed viewport, so where you put it does not affect where toasts appear",
        ],
        no: [
          "never two of them. the second viewport competes for the same toasts",
          "not per route or per dialog. mounting it late means early toasts are lost",
        ],
      }}
      a11y={
        <>
          the viewport is a live region, so a toast is announced without
          stealing focus · each toast keeps its own close button
        </>
      }
      dependencies={
        <>
          Base UI <span className="text-muted">toast</span>
        </>
      }
    >
      <ToasterDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="toast"
        usage={`import { Toaster, notify } from "@usva-ui/react/primitives/toast";

// once, at the root
<Toaster />

// anywhere at all
notify.success("saved", { description: "your sky is safe." });`}
      />
    </ComponentDoc>
  );
}
