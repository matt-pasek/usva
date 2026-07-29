"use client";
import { RotateCcw } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "usva/primitives/button";
import { ChapterHeading } from "@/components/chapter-heading";
import { useTheme } from "@/components/theme-provider";
import type { ThemeDoc } from "@/lib/themes";

const STEPS = [
  { name: "fast", cssVar: "--usva-duration-fast", role: "hover, press" },
  { name: "base", cssVar: "--usva-duration-base", role: "most transitions" },
  { name: "slow", cssVar: "--usva-duration-slow", role: "entrances" },
  {
    name: "ambient",
    cssVar: "--usva-duration-ambient",
    role: "atmosphere drift",
  },
] as const;

function toMs(value: string): string {
  if (!value) return "";
  if (value.endsWith("ms")) return value;
  const seconds = Number.parseFloat(value);
  return Number.isNaN(seconds) ? value : `${Math.round(seconds * 1000)}ms`;
}

export function ThemeTiming({ doc }: { doc: ThemeDoc }) {
  const { theme } = useTheme();
  const reduced = useReducedMotion();
  const [values, setValues] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"start" | "rewind" | "run">("start");
  const trackRef = useRef<HTMLDivElement | null>(null);

  const run = phase === "run";

  // biome-ignore lint/correctness/useExhaustiveDependencies: the tokens change with the data-theme attribute, not with any value the effect reads
  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    setValues(
      Object.fromEntries(
        STEPS.map((step) => [
          step.name,
          toMs(style.getPropertyValue(step.cssVar).trim()),
        ]),
      ),
    );
  }, [theme]);

  useEffect(() => {
    if (reduced) {
      setPhase("run");
      return;
    }
    const el = trackRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setPhase("run");
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  // the rewind frame carries transitionProperty: none, so the bars snap back
  // instead of animating backwards. re-arming in the same frame would coalesce
  // both transforms into one style recalc and skip the run entirely.
  const replay = useCallback(() => {
    if (reduced) return;
    setPhase("rewind");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase("run"));
    });
  }, [reduced]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <ChapterHeading>the timing</ChapterHeading>
        <Button variant="ghost" size="sm" onClick={replay} disabled={!!reduced}>
          <RotateCcw aria-hidden="true" />
          replay
        </Button>
      </div>
      <p className="max-w-2xl text-muted">{doc.motionNote}</p>

      <div ref={trackRef} className="flex flex-col">
        {STEPS.map((step) => (
          <div
            key={step.name}
            className="grid items-center gap-x-4 gap-y-1 border-border border-b py-4 last:border-b-0 sm:grid-cols-[9rem_minmax(0,1fr)_5rem]"
          >
            <span className="flex items-baseline gap-2 sm:flex-col sm:gap-0">
              <code className="font-mono text-xs text-ink">{step.name}</code>
              <span className="text-muted text-xs">{step.role}</span>
            </span>
            <div className="relative h-6 [container-type:inline-size]">
              <span
                aria-hidden="true"
                className="-translate-y-1/2 absolute inset-x-0 top-1/2 h-px bg-border"
              />
              {[0, 25, 50, 75, 100].map((mark) => (
                <span
                  key={mark}
                  aria-hidden="true"
                  className={`-translate-y-1/2 absolute top-1/2 w-px bg-border ${
                    mark === 0 || mark === 100 ? "h-3" : "h-1.5"
                  }`}
                  style={{ left: `calc(${mark}% - ${mark / 100}px)` }}
                />
              ))}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-1/2 h-px origin-left bg-accent"
                style={{
                  transform: run
                    ? "translateY(-50%) scaleX(1)"
                    : "translateY(-50%) scaleX(0)",
                  transitionProperty:
                    reduced || phase === "rewind" ? "none" : "transform",
                  transitionDuration: `var(${step.cssVar})`,
                  transitionTimingFunction: "var(--usva-ease-spring)",
                }}
              />
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-0 h-4 w-0.5 rounded-full bg-accent"
                style={{
                  transform: run
                    ? "translate(calc(100cqi - 100%), -50%)"
                    : "translate(0, -50%)",
                  transitionProperty:
                    reduced || phase === "rewind" ? "none" : "transform",
                  transitionDuration: `var(${step.cssVar})`,
                  transitionTimingFunction: "var(--usva-ease-spring)",
                }}
              />
            </div>
            <span className="text-right font-mono text-sm text-ink tabular-nums">
              {values[step.name] || " "}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
