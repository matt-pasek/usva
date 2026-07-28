"use client";

import * as React from "react";
import { SegmentedControl } from "usva/patterns/segmented-control";
import { THEMES } from "@/lib/catalog";
import { AA_NORMAL, contrastRatio, parseRgb, type Rgb } from "@/lib/contrast";

const TIERS = ["ink", "muted", "faint"] as const;
const SURFACES = ["bg", "surface", "surface-2", "overlay"] as const;

/** Surfaces with a dedicated text role, checked as the pair they ship as. sunken
 * is not a general surface: code wells carry on-sunken, not ink. */
const PAIRS = [
  { ink: "on-accent", surface: "accent" },
  { ink: "on-tint", surface: "accent-tint" },
  { ink: "on-sunken", surface: "sunken" },
] as const;

const ALL: string[] = [
  ...new Set<string>([
    ...TIERS,
    ...SURFACES,
    ...PAIRS.flatMap((p) => [p.ink, p.surface]),
  ]),
];

type ThemeColors = Record<string, Rgb>;

const css = (c: Rgb) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;

export function ContrastMatrix() {
  const probeRef = React.useRef<HTMLDivElement>(null);
  const [colors, setColors] = React.useState<Record<string, ThemeColors>>();
  const [theme, setTheme] = React.useState<string>(THEMES[0]);

  React.useEffect(() => {
    const root = probeRef.current;
    if (!root) return;
    const next: Record<string, ThemeColors> = {};
    for (const t of THEMES) {
      const themeColors: ThemeColors = {};
      for (const role of ALL) {
        const el = root.querySelector<HTMLElement>(
          `[data-probe="${t}:${role}"]`,
        );
        if (!el) continue;
        const rgb = parseRgb(getComputedStyle(el).color);
        if (rgb) themeColors[role] = rgb;
      }
      next[t] = themeColors;
    }
    setColors(next);
  }, []);

  const active = colors?.[theme];

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={probeRef}
        aria-hidden
        className="pointer-events-none fixed top-0 -left-[9999px] opacity-0"
      >
        {THEMES.map((t) => (
          <div key={t} data-theme={t}>
            {ALL.map((role) => (
              <span
                key={role}
                data-probe={`${t}:${role}`}
                style={{ color: `var(--usva-${role})` }}
              />
            ))}
          </div>
        ))}
      </div>

      <SegmentedControl
        aria-label="theme"
        value={theme}
        items={THEMES.map((t) => ({ value: t, label: t }))}
        onValueChange={setTheme}
      />

      {!active ? (
        <p className="text-muted text-sm">computing from the live tokens…</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-border border-b bg-surface">
                <th className="p-3 font-mono text-muted text-xs uppercase tracking-widest">
                  text ↓ / surface →
                </th>
                {SURFACES.map((surface) => (
                  <th
                    key={surface}
                    className="p-3 font-mono text-muted text-xs uppercase tracking-widest"
                  >
                    {surface}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIERS.map((tier) => (
                <tr key={tier} className="border-border border-b last:border-0">
                  <th className="whitespace-nowrap p-3 text-left align-middle">
                    <code className="font-mono text-ink text-xs">{tier}</code>
                  </th>
                  {SURFACES.map((surface) => {
                    const t = active[tier];
                    const s = active[surface];
                    if (!t || !s) {
                      return (
                        <td key={surface} className="p-3 text-muted">
                          ·
                        </td>
                      );
                    }
                    const ratio = contrastRatio(t, s);
                    const decorative = tier === "faint";
                    const pass = ratio >= AA_NORMAL;
                    return (
                      <td key={surface} className="p-3 align-middle">
                        <div className="flex flex-col gap-1.5">
                          <span
                            aria-hidden
                            className="grid h-9 w-14 place-items-center rounded-md border border-border-strong font-semibold text-sm"
                            style={{
                              backgroundColor: css(s),
                              color: css(t),
                            }}
                          >
                            Aa
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="font-mono text-ink text-xs tabular-nums">
                              {ratio.toFixed(1)}
                            </span>
                            {decorative ? (
                              <span className="rounded-sm bg-surface-2 px-1 py-0.5 font-mono text-[9px] text-muted uppercase">
                                decor
                              </span>
                            ) : (
                              <span
                                className={`rounded-sm px-1 py-0.5 font-mono text-[9px] uppercase ${
                                  pass
                                    ? "bg-accent-tint text-on-tint"
                                    : "bg-danger/15 text-danger"
                                }`}
                              >
                                {pass ? "AA" : "fail"}
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {active ? (
        <div className="flex flex-col gap-2">
          <h3 className="font-mono text-[0.7rem] text-muted uppercase tracking-widest">
            paired roles
          </h3>
          <div className="grid gap-2 sm:grid-cols-3">
            {PAIRS.map(({ ink, surface }) => {
              const t = active[ink];
              const s = active[surface];
              if (!t || !s) return null;
              const ratio = contrastRatio(t, s);
              const pass = ratio >= AA_NORMAL;
              return (
                <div
                  key={ink}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
                >
                  <span
                    aria-hidden
                    className="grid h-9 w-14 shrink-0 place-items-center rounded-md border border-border-strong font-semibold text-sm"
                    style={{ backgroundColor: css(s), color: css(t) }}
                  >
                    Aa
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <code className="truncate font-mono text-ink text-xs">
                      {ink} / {surface}
                    </code>
                    <span className="flex items-center gap-1.5">
                      <span className="font-mono text-ink text-xs tabular-nums">
                        {ratio.toFixed(1)}
                      </span>
                      <span
                        className={`rounded-sm px-1 py-0.5 font-mono text-[9px] uppercase ${
                          pass
                            ? "bg-accent-tint text-on-tint"
                            : "bg-danger/15 text-danger"
                        }`}
                      >
                        {pass ? "AA" : "fail"}
                      </span>
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <p className="text-muted text-xs">
        <code className="font-mono text-ink">ink</code> and{" "}
        <code className="font-mono text-ink">muted</code> clear {AA_NORMAL}:1 on
        every surface. <code className="font-mono text-ink">faint</code> does
        not, on purpose: it is decorative, and marked so. surfaces with a
        dedicated text role, like a code well, are checked as the pair they ship
        as: <code className="font-mono text-ink">on-sunken</code> on{" "}
        <code className="font-mono text-ink">sunken</code>, not ink.
      </p>
    </div>
  );
}
