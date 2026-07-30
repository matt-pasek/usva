import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { ButtonDemo } from "./button-demo";

export const metadata: Metadata = pageMetadata("/docs/components/button", {
  title: "Button",
  description:
    "The one thing you want pressed. Six variants, three sizes, and a built-in loading, success and error machine.",
});

const props = [
  {
    name: "variant",
    type: '"solid" | "soft" | "outline" | "ghost" | "onSurface" | "glass"',
    defaultValue: '"solid"',
    desc: (
      <>
        visual weight. <b>one solid per region</b>. onSurface is a{" "}
        <b>theme-tonal</b> fill for a button on a surface or gradient you own;
        it adapts with the theme. glass is a <b>fixed dark frost</b>, blurred,
        for a control floating over a live atmosphere, where the theme cannot
        guarantee contrast.
      </>
    ),
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    desc: (
      <>
        sm exists for dense rows. it is a smaller button, not a <b>subtler</b>{" "}
        one.
      </>
    ),
  },
  {
    name: "shape",
    type: '"rounded" | "pill"',
    defaultValue: '"rounded"',
    desc: (
      <>
        pill fully rounds the button into a chip. the default follows the size
        radius.
      </>
    ),
  },
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    desc: (
      <>
        merges props onto the single child instead of rendering a{" "}
        <code>&lt;button&gt;</code>. how a link earns the button skin.
      </>
    ),
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "dims to 50% and drops pointer events. loading is a status, not this.",
  },
  {
    name: "status",
    type: '"idle" | "loading" | "success" | "error"',
    defaultValue: '"idle"',
    desc: (
      <>
        the content machine. <b>keeps its width</b>: loading swaps in the
        spinner, success and error flash their icon and settle back to idle.
      </>
    ),
  },
  {
    name: "loadingText / successText / errorText",
    type: "ReactNode",
    desc: "the label beside the spinner, check and alert for each non-idle status.",
  },
  {
    name: "iconOnly",
    type: "boolean",
    defaultValue: "false",
    desc: (
      <>
        a square button for one glyph. <b>requires aria-label</b>, it throws in
        dev without one.
      </>
    ),
  },
  {
    name: "tooltip / side",
    type: 'ReactNode · "top" | "bottom" | "left" | "right"',
    desc: "a visible label on hover and focus. what icon-only buttons use instead of text.",
  },
  {
    name: "active",
    type: "boolean",
    defaultValue: "false",
    desc: "the pressed look, for toggles.",
  },
  {
    name: "settleDelay",
    type: "number",
    defaultValue: "1200",
    desc: "how long success or error holds before returning to idle.",
  },
  {
    name: "onSettle",
    type: "() => void",
    desc: "fires when a success or error settles back to idle.",
  },
];

export default function ButtonPage() {
  return (
    <ComponentDoc
      slug="button"
      client
      description={
        <>
          the most-used thing in the system, so it does the least. one solid per
          region carries the action; everything else steps back. a button that
          performs is a button competing with the thing you clicked it for.
        </>
      }
      composition={{
        ok: [
          "sits inside Card, PageHeader, Toolbar, Panel, Dialog footer",
          "asChild puts the skin on a link when the action navigates",
        ],
        no: [
          "never inside another Button, never as a row's only click target",
          "danger styling is not a variant. destruction gets a Dialog first",
        ],
      }}
      a11y={
        <>
          focus ring on <code className="font-mono text-xs">--ring</code> ·
          loading sets <code className="font-mono text-xs">aria-busy</code>, not
          disabled · the label never empties
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">motion</code> ·{" "}
          <code className="font-mono text-xs">class-variance-authority</code> ·
          Spinner <span className="text-muted">from the same package</span>
        </>
      }
    >
      <ButtonDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="button"
        usage={`import { Button } from "@usva-ui/react/primitives/button";

<Button variant="solid">Save changes</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button asChild>
  <a href="/docs">Read the docs</a>
</Button>`}
      />
    </ComponentDoc>
  );
}
