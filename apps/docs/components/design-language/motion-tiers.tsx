"use client";

import { Button } from "@matt-pasek/usva";
import * as React from "react";
import { useReducedMotion } from "./use-reduced-motion";

const THEMES = ["kajo", "sisu", "savi"] as const;

const CHARACTER: Record<(typeof THEMES)[number], string> = {
  kajo: "languid, and it overshoots. the spring is allowed to be seen.",
  sisu: "snappy and critically damped. nothing wobbles in a dashboard.",
  savi: "calm. slower than sisu, straighter than kajo.",
};

const TIERS = ["fast", "base", "slow", "ambient"] as const;

type Read = Record<string, string>;

/** Printed from the live scope, so the numbers cannot drift from the themes. */
function useScopeValues(refs: React.RefObject<(HTMLElement | null)[]>) {
  const [values, setValues] = React.useState<Record<string, Read>>({});

  React.useEffect(() => {
    const next: Record<string, Read> = {};
    THEMES.forEach((theme, i) => {
      const node = refs.current?.[i];
      if (!node) return;
      const style = getComputedStyle(node);
      const read: Read = {};
      for (const tier of TIERS)
        read[tier] = style.getPropertyValue(`--usva-duration-${tier}`).trim();
      next[theme] = read;
    });
    setValues(next);
  }, [refs]);

  return values;
}

export function MotionTiers() {
  const [out, setOut] = React.useState(false);
  const reduced = useReducedMotion();
  const refs = React.useRef<(HTMLElement | null)[]>([]);
  const values = useScopeValues(refs);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="outline" onClick={() => setOut((v) => !v)}>
          run all three
        </Button>
        <p className="text-muted text-xs">
          {reduced
            ? "reduced motion is on, so the duration tokens are zero and all three just arrive."
            : "same distance, same trigger, three themes. watch kajo overshoot and sisu refuse to."}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {THEMES.map((theme, i) => (
          <section
            key={theme}
            data-theme={theme}
            ref={(node) => {
              refs.current[i] = node;
            }}
            className="flex flex-col gap-3 rounded-lg border p-4"
            style={{
              background: "var(--usva-surface)",
              borderColor: "var(--usva-border)",
              color: "var(--usva-ink)",
            }}
          >
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-semibold text-sm">{theme}</h3>
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: "var(--usva-muted)" }}
              >
                {values[theme]?.base ?? ""}
              </span>
            </div>

            <div
              className="relative h-10 overflow-hidden rounded-md"
              style={{ background: "var(--usva-sunken)" }}
            >
              <span
                className="absolute top-1/2 size-6 -translate-y-1/2 rounded-md"
                style={{
                  background: "var(--usva-accent)",
                  left: out ? "calc(100% - 2rem)" : "0.5rem",
                  transitionProperty: "left",
                  transitionDuration: reduced
                    ? "1ms"
                    : "var(--usva-duration-slow)",
                  transitionTimingFunction: "var(--usva-ease-spring)",
                }}
              />
            </div>

            <dl className="flex flex-wrap gap-x-3 gap-y-1">
              {TIERS.map((tier) => (
                <div key={tier} className="flex items-baseline gap-1">
                  <dt
                    className="font-mono text-[10px]"
                    style={{ color: "var(--usva-muted)" }}
                  >
                    {tier}
                  </dt>
                  <dd className="font-mono text-[10px] tabular-nums">
                    {values[theme]?.[tier] ?? "·"}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="text-xs" style={{ color: "var(--usva-muted)" }}>
              {CHARACTER[theme]}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
