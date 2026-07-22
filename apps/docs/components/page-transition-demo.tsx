"use client";
import {
  LogLine,
  LogList,
  PageTransition,
  SegmentedControl,
  StatChip,
  Switch,
} from "@matt-pasek/usva";
import * as React from "react";

const ROUTES = [
  { value: "overview", label: "Overview" },
  { value: "activity", label: "Activity" },
  { value: "settings", label: "Settings" },
] as const;

function OverviewView() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <StatChip tone="accent" label="users" value="2,412" />
        <StatChip tone="success" label="uptime" value="99.9" unit="%" />
        <StatChip label="builds" value="18" />
      </div>
      <p className="max-w-prose text-sm leading-relaxed text-muted">
        the summary at a glance. switch tabs and the whole view lifts out while
        the next one fades up from below.
      </p>
    </div>
  );
}

function ActivityView() {
  return (
    <LogList>
      <LogLine level="success" source="deploy" timestamp="14:22:06">
        Shipped feat/docs to production
      </LogLine>
      <LogLine level="info" source="build">
        Compiled 214 modules in 3.1s
      </LogLine>
      <LogLine level="warn" source="lint" count={2}>
        Unused import in stripe-card
      </LogLine>
      <LogLine level="error" source="test">
        2 snapshots out of date
      </LogLine>
    </LogList>
  );
}

function SettingsView() {
  return (
    <div className="flex flex-col gap-3">
      <Switch
        defaultChecked
        label="Reduce motion"
        description="Collapse transitions to an instant swap."
      />
      <Switch
        label="Email digests"
        description="A weekly summary of what changed."
      />
      <Switch defaultChecked label="Compact density" />
    </div>
  );
}

const VIEWS: Record<string, React.ReactNode> = {
  overview: <OverviewView />,
  activity: <ActivityView />,
  settings: <SettingsView />,
};

export function PageTransitionDemo() {
  const [route, setRoute] = React.useState<string>("overview");

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        size="sm"
        items={ROUTES.map((r) => ({ value: r.value, label: r.label }))}
        value={route}
        onValueChange={(v) => setRoute(v as string)}
        aria-label="Demo route"
      />
      <div className="relative min-h-[11rem] overflow-hidden rounded-lg border border-border bg-sunken/40 p-5">
        <PageTransition routeKey={route}>
          {VIEWS[route] ?? VIEWS.overview}
        </PageTransition>
      </div>
    </div>
  );
}
