import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { PageTransitionDemo } from "@/components/page-transition-demo";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Page Transition",
  description:
    "A framework-neutral route transition — fade + lift in, soft lift out — keyed on a routeKey prop so it works with any router.",
};

const nextSnippet = `"use client";
import { PageTransition } from "@matt-pasek/usva";
import { usePathname } from "next/navigation";

export function Shell({ children }) {
  return (
    <PageTransition routeKey={usePathname()}>
      {children}
    </PageTransition>
  );
}`;

export default function PageTransitionPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Page Transition</h1>
        <p className="text-muted">
          Wraps route content in a fade-and-lift transition — in from below, out
          softly upward. It is framework-neutral: you pass the current route as{" "}
          <code>routeKey</code> (from <code>usePathname()</code>,{" "}
          <code>location.pathname</code>, or any router), so it isn&apos;t bound
          to Next. Collapses to a plain render under reduced motion.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <PageTransitionDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{nextSnippet}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/motion/page-transition.tsx" />
        </CardBody>
      </Card>
    </main>
  );
}
