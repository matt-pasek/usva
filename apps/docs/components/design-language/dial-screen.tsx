"use client";

import { Loimu } from "@usva-ui/react/atmospheres/loimu";
import { Reveal } from "@usva-ui/react/motion/reveal";
import { PageHeader } from "@usva-ui/react/patterns/page-header";
import { SegmentedControl } from "@usva-ui/react/patterns/segmented-control";
import { StatCard } from "@usva-ui/react/patterns/stat-card";
import {
  Toolbar,
  ToolbarActions,
  ToolbarGroup,
} from "@usva-ui/react/patterns/toolbar";
import { Badge } from "@usva-ui/react/primitives/badge";
import { Button } from "@usva-ui/react/primitives/button";
import { Card, CardBody, CardHeader } from "@usva-ui/react/primitives/card";
import { Chip } from "@usva-ui/react/primitives/chip";
import { Progress } from "@usva-ui/react/primitives/progress";
import { SulaNav } from "@usva-ui/react/sula/sula-nav";
import { RotateCw, Workflow } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type * as React from "react";
import { SULA_STOP } from "./dial-model";

const STATS = [
  { label: "runs", value: "1,284", note: "last 7 days", trend: "up" as const },
  { label: "median", value: "312", unit: "ms", trend: "flat" as const },
  { label: "failed", value: "3", note: "all retried", trend: "down" as const },
];

const NAV_VIEWS = [
  {
    href: "#pipeline",
    label: "pipeline",
    icon: <Workflow size={16} strokeWidth={1.6} aria-hidden />,
    items: [
      { href: "#overview", label: "overview" },
      { href: "#runs", label: "runs" },
      { href: "#keys", label: "keys" },
    ],
  },
];

function RegionTag({
  children,
  live,
}: {
  children: React.ReactNode;
  live?: boolean;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-none inline-flex select-none items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${
        live
          ? "bg-accent-tint text-on-tint"
          : "border border-border bg-surface/70 text-muted backdrop-blur-sm"
      }`}
    >
      <span
        aria-hidden
        className={`size-1 rounded-full ${live ? "bg-on-tint" : "bg-faint"}`}
      />
      region · {children}
    </motion.span>
  );
}

export interface DialScreenProps {
  stop: number;
  /** the chrome region shakes when it refuses a second sula. */
  chromeRef?: React.Ref<HTMLDivElement>;
  refused?: boolean;
}

/**
 * One skeleton. Every stop renders the same header, the same stats, the same
 * toolbar, in the same places. Later stops only add energy on top.
 */
export function DialScreen({ stop, chromeRef, refused }: DialScreenProps) {
  const armed = stop >= SULA_STOP;

  return (
    <div className="relative isolate overflow-hidden bg-bg">
      <AnimatePresence>
        {stop >= 3 && (
          <motion.div
            key="atmosphere"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <Loimu className="size-full" opacity={0.7} speed={0.6} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col">
        <div
          ref={chromeRef}
          data-refused={refused || undefined}
          className="relative flex min-h-[76px] items-center justify-center border-border border-b px-4"
        >
          <span className="absolute top-2.5 left-3 z-20">
            <AnimatePresence>
              {armed && (
                <RegionTag key="chrome-tag" live>
                  chrome
                </RegionTag>
              )}
            </AnimatePresence>
          </span>

          {armed ? (
            <SulaNav
              views={NAV_VIEWS}
              activeView="#pipeline"
              activeItem="#overview"
              brand={<span className="font-semibold text-sm">acme</span>}
              brandLabel="acme home"
              ariaLabel="mock screen navigation"
              labelsFrom="sm"
              className="mt-2"
            />
          ) : (
            <nav
              aria-label="mock screen navigation"
              className="flex items-center gap-1 rounded-full border border-border bg-surface p-1.5"
            >
              {NAV_VIEWS[0]?.items.map((item, i) => (
                <span
                  key={item.href}
                  className={`rounded-full px-3.5 py-1.5 text-xs transition-colors ${
                    i === 0
                      ? "bg-surface-2 font-semibold text-ink"
                      : "text-muted"
                  }`}
                >
                  {item.label}
                </span>
              ))}
            </nav>
          )}
        </div>

        <div className="relative">
          <span className="absolute top-2.5 right-3 z-20">
            <AnimatePresence>
              {armed && <RegionTag key="canvas-tag">canvas</RegionTag>}
            </AnimatePresence>
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
              <Button variant="outline" iconOnly aria-label="refresh" size="sm">
                <RotateCw size={14} aria-hidden />
              </Button>
            </ToolbarActions>
          </Toolbar>

          <div className="grid gap-3 p-4 sm:grid-cols-3">
            {STATS.map((stat) => (
              <StatCard key={stat.label} size="sm" {...stat} />
            ))}
          </div>

          <AnimatePresence initial={false}>
            {stop >= 1 && (
              <motion.div
                key="detail-cards"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
