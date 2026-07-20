import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";
import { PageTransitionDemo } from "@/components/page-transition-demo";

export const metadata: Metadata = {
  title: "Page Transition",
  description:
    "A route transition that fades and lifts content in, then softly out, keyed on a routeKey so it works with any router.",
};

const usage = `"use client";
import { PageTransition } from "@matt-pasek/usva";
import { usePathname } from "next/navigation";

export function Shell({ children }) {
  return (
    <PageTransition routeKey={usePathname()}>
      {children}
    </PageTransition>
  );
}`;

const props = [
  {
    name: "routeKey",
    type: "string",
    desc: (
      <>
        the current route. <code>usePathname()</code> in next,{" "}
        <code>location.pathname</code> anywhere else. a change fires the
        transition.
      </>
    ),
  },
  {
    name: "children",
    type: "ReactNode",
    desc: "the route content. the whole subtree unmounts and remounts on every key change.",
  },
];

export default function PageTransitionPage() {
  return (
    <ComponentDoc
      name="Page Transition"
      layer="motion"
      intensity="guides"
      client
      description={
        <>
          a route-level fade and lift: content enters from below and exits
          softly upward, with the outgoing view finishing before the next
          mounts. framework-neutral, keyed on whatever routeKey you hand it.
        </>
      }
      composition={{
        ok: [
          "wraps the route outlet in the app shell, once",
          "any router works, key it on the pathname",
        ],
        no: [
          "never nested. one transition per shell",
          "not for in-page swaps like tabs or lists, it unmounts everything under it",
        ],
      }}
      a11y={
        <>
          returns children untouched under{" "}
          <code className="font-mono text-xs">prefers-reduced-motion</code> ·
          the wrapper is a plain div, no roles, no focus trapping
        </>
      }
      dependencies={<code className="font-mono text-xs">motion</code>}
    >
      <DemoPanel label="live · simulated routes">
        <PageTransitionDemo />
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection registryName="page-transition" usage={usage} />
    </ComponentDoc>
  );
}
