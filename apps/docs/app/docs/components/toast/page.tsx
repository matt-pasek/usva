import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";
import { ToastDemo } from "./toast-demo";

export const metadata: Metadata = {
  title: "Toast",
  description:
    "The result of something you just did, fired imperatively from anywhere with toast().",
};

const toastOptions = [
  {
    name: "title",
    type: "ReactNode",
    desc: "the headline. the only required field.",
  },
  {
    name: "description",
    type: "ReactNode",
    desc: "supporting copy under the title.",
  },
  {
    name: "type",
    type: '"success" | "warning" | "danger" | "info"',
    desc: "the status icon, dot and tint. untyped toasts render plain.",
  },
  {
    name: "duration",
    type: "number",
    desc: (
      <>
        auto-dismiss in ms, drawn as a countdown bar. <b>0 disables it</b>, for
        toasts that need a decision.
      </>
    ),
  },
  {
    name: "action",
    type: "{ label: string; onClick?: () => void }",
    desc: "one inline action button. more than that is a Dialog.",
  },
];

const toasterProps = [
  {
    name: "limit",
    type: "number",
    desc: "how many toasts stack before the oldest collapses.",
  },
  {
    name: "timeout",
    type: "number",
    desc: "the default duration for toasts that do not set their own.",
  },
];

export default function ToastPage() {
  return (
    <ComponentDoc
      slug="toast"
      client
      description={
        <>
          a brief message that announces something just happened. mount{" "}
          <code>Toaster</code> once, then fire <code>toast()</code> from
          anywhere, even outside React.
        </>
      }
      composition={{
        ok: [
          "Toaster mounts once in the root layout, the viewport portals itself",
          "fire from event handlers, async callbacks, non-React modules",
        ],
        no: [
          "never two Toasters. two viewports means every toast twice",
          "not for form errors. those belong inline, next to the field",
        ],
      }}
      a11y={
        <>
          the close button is labelled Dismiss · icons, dots and the countdown
          bar are <code className="font-mono text-xs">aria-hidden</code> · swipe
          down or right to dismiss
        </>
      }
      dependencies={<code className="font-mono text-xs">@base-ui/react</code>}
    >
      <DemoPanel>
        <ToastDemo />
      </DemoPanel>

      <PropsTable title="toast() options" rows={toastOptions} />
      <PropsTable title="Toaster" rows={toasterProps} />

      <AcquireSection
        registryName="toast"
        usage={`import { toast, notify, Toaster } from "@matt-pasek/usva";

<Toaster />

toast({ title: "Saved", description: "Your changes are live.", type: "success" });
notify.error("Upload failed");`}
      />
    </ComponentDoc>
  );
}
