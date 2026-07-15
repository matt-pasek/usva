"use client";

import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Chip,
  IconButton,
  PageHeader,
  Progress,
  Reveal,
  SegmentedControl,
  StatCard,
  SulaNav,
  Toolbar,
  ToolbarActions,
  ToolbarGroup,
  Utu,
} from "@matt-pasek/usva";
import type * as React from "react";
import { SULA_STOP } from "./dial-model";

const STATS = [
  { label: "runs", value: "1,284", note: "last 7 days", trend: "up" as const },
  { label: "median", value: "312", unit: "ms", trend: "flat" as const },
  { label: "failed", value: "3", note: "all retried", trend: "down" as const },
];

const NAV_VIEWS = [
  { href: "#overview", label: "overview", icon: <span aria-hidden>◈</span> },
  { href: "#runs", label: "runs", icon: <span aria-hidden>↳</span> },
  { href: "#keys", label: "keys", icon: <span aria-hidden>·</span> },
];

function RegionTag({
  children,
  live,
}: {
  children: React.ReactNode;
  live?: boolean;
}) {
  return (
    <span
      className={`pointer-events-none select-none rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
        live ? "bg-accent-tint text-on-tint" : "bg-surface-2 text-muted"
      }`}
    >
      region · {children}
    </span>
  );
}

export interface DialScreenProps {
  stop: number;
  /** the chrome region shakes when it refuses a second sula. */
  chromeRef: React.Ref<HTMLDivElement>;
  refused: boolean;
}

/**
 * One skeleton. Every stop renders the same header, the same stats, the same
 * toolbar, in the same places. Later stops only add energy on top.
 */
export function DialScreen({ stop, chromeRef, refused }: DialScreenProps) {
  return (
    <div className="relative isolate overflow-hidden rounded-[18px] bg-bg">
      {stop >= 3 && (
        <div aria-hidden className="absolute inset-0 z-0">
          <Utu className="size-full" opacity={0.85} speed={0.7} />
        </div>
      )}

      <div className="relative z-10 flex flex-col">
        <div
          ref={chromeRef}
          data-refused={refused || undefined}
          className="relative flex min-h-[74px] items-center justify-center border-border border-b px-4"
        >
          <span className="absolute top-2 left-3 z-20">
            <RegionTag live={stop >= SULA_STOP}>chrome</RegionTag>
          </span>

          {stop >= SULA_STOP ? (
            <SulaNav
              views={NAV_VIEWS}
              activeView="#overview"
              ariaLabel="mock screen navigation"
              labelsFrom="md"
              className="mt-3"
            />
          ) : (
            <nav
              aria-label="mock screen navigation"
              className="mt-2 flex items-center gap-1 rounded-full border border-border bg-surface px-1.5 py-1.5"
            >
              {NAV_VIEWS.map((view, i) => (
                <span
                  key={view.href}
                  className={`rounded-full px-3 py-1 text-xs ${
                    i === 0
                      ? "bg-surface-2 font-semibold text-ink"
                      : "text-muted"
                  }`}
                >
                  {view.label}
                </span>
              ))}
            </nav>
          )}
        </div>

        <div className="relative">
          <span className="absolute top-2 right-3 z-20">
            <RegionTag>canvas</RegionTag>
          </span>

          <PageHeader
            size="compact"
            headingLevel="h3"
            eyebrow="workspace"
            title="ingest"
            titleAccent="pipeline"
            meta={
              <span className="flex items-center gap-2 text-muted text-xs">
                <span className="size-1.5 rounded-full bg-success" />
                healthy · updated 2 minutes ago
              </span>
            }
            className="border-border border-b bg-transparent"
          />

          <Toolbar className="bg-transparent">
            <ToolbarGroup>
              <SegmentedControl
                aria-label="range"
                value="7d"
                items={[
                  { value: "24h", label: "24h" },
                  { value: "7d", label: "7d" },
                  { value: "30d", label: "30d" },
                ]}
                onValueChange={() => {}}
              />
            </ToolbarGroup>
            <ToolbarActions>
              <Chip>region: eu</Chip>
              <IconButton aria-label="refresh" size="sm">
                <span aria-hidden>↻</span>
              </IconButton>
            </ToolbarActions>
          </Toolbar>

          <div className="grid gap-3 p-4 sm:grid-cols-3">
            {STATS.map((stat) => (
              <StatCard key={stat.label} size="sm" {...stat} />
            ))}
          </div>

          {stop >= 1 && (
            <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2">
              <Reveal force delay={0} variant="veil">
                <Card>
                  <CardHeader>throughput</CardHeader>
                  <CardBody className="flex flex-col gap-3">
                    <Progress value={72} aria-label="throughput" />
                    <p className="text-muted text-xs">
                      72% of the window's budget, and holding.
                    </p>
                  </CardBody>
                </Card>
              </Reveal>
              <Reveal force delay={0.08} variant="veil">
                <Card>
                  <CardHeader>last failure</CardHeader>
                  <CardBody className="flex flex-col gap-2">
                    <Badge tone="danger" className="w-fit">
                      timeout
                    </Badge>
                    <p className="font-mono text-muted text-xs">
                      shard-04 · 09:41 · retried
                    </p>
                  </CardBody>
                </Card>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
