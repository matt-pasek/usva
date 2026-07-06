"use client";
import { PageTransition, SegmentedControl } from "@matt-pasek/usva";
import * as React from "react";

const ROUTES = [
  {
    value: "overview",
    label: "Overview",
    title: "Overview",
    body: "The at-a-glance summary. Switch tabs to see the content lift out and the next view fade up from below.",
  },
  {
    value: "activity",
    label: "Activity",
    title: "Recent activity",
    body: "A running log of what happened. Each route change is keyed on routeKey, so the transition fires on its own.",
  },
  {
    value: "settings",
    label: "Settings",
    title: "Settings",
    body: "Preferences and configuration. Under prefers-reduced-motion this collapses to a plain, instant swap.",
  },
] as const;

export function PageTransitionDemo() {
  const [route, setRoute] = React.useState<string>("overview");
  const active = ROUTES.find((r) => r.value === route) ?? ROUTES[0];

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        size="sm"
        items={ROUTES.map((r) => ({ value: r.value, label: r.label }))}
        value={route}
        onValueChange={(v) => setRoute(v as string)}
        aria-label="Demo route"
      />
      <div className="relative min-h-[8.5rem] overflow-hidden rounded-lg border border-border bg-sunken/40 p-5">
        <PageTransition routeKey={route}>
          <div className="flex flex-col gap-2">
            <h4 className="text-base font-semibold tracking-[-0.01em] text-ink">
              {active.title}
            </h4>
            <p className="max-w-prose text-sm leading-relaxed text-muted">
              {active.body}
            </p>
          </div>
        </PageTransition>
      </div>
    </div>
  );
}
