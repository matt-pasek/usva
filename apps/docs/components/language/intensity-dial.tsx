"use client";

import { SulaFrame } from "@matt-pasek/usva";
import * as React from "react";
import {
  ALLOWED_COPY,
  type DialState,
  load,
  loadWithPhantom,
  REFUSAL_COPY,
  REFUSAL_MS,
  REGIONS,
  type RegionId,
  STOP_COPY,
  STOPS,
  SULA_STOP,
  verdict,
} from "./dial-model";
import { DialScreen } from "./dial-screen";
import { useReducedMotion } from "./use-reduced-motion";

const LAST = STOPS.length - 1;

const verdictTone = {
  quiet: "border-border bg-surface-2 text-muted",
  ok: "border-success/40 bg-success/10 text-success",
  danger: "border-danger/50 bg-danger/15 text-danger",
} as const;

function shake(node: HTMLElement) {
  node.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-7px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(3px)" },
      { transform: "translateX(0)" },
    ],
    { duration: 420, easing: "cubic-bezier(0.36, 0.07, 0.19, 0.97)" },
  );
}

export function IntensityDial() {
  const [state, setState] = React.useState<DialState>({
    stop: 0,
    boundaryFrame: false,
  });
  const [refusal, setRefusal] = React.useState<RegionId | null>(null);
  const [note, setNote] = React.useState<"refused" | "allowed" | null>(null);
  const chromeRef = React.useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (!refusal) return;
    const timer = window.setTimeout(() => setRefusal(null), REFUSAL_MS);
    return () => window.clearTimeout(timer);
  }, [refusal]);

  const setStop = (next: number) =>
    setState((prev) => ({
      ...prev,
      stop: Math.min(LAST, Math.max(0, next)),
    }));

  const armed = state.stop >= SULA_STOP;
  const counts = loadWithPhantom(state, refusal);
  const settled = load(state);
  const readout = verdict(counts);

  const refuse = () => {
    setRefusal("chrome");
    setNote("refused");
    if (!reduced && chromeRef.current) shake(chromeRef.current);
  };

  const toggleBoundary = () => {
    setState((prev) => ({ ...prev, boundaryFrame: !prev.boundaryFrame }));
    setNote(state.boundaryFrame ? null : "allowed");
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: state.stop + 1,
      ArrowUp: state.stop + 1,
      ArrowLeft: state.stop - 1,
      ArrowDown: state.stop - 1,
      Home: 0,
      End: LAST,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setStop(next);
  };

  const railRef = React.useRef<HTMLDivElement | null>(null);
  const dragging = React.useRef(false);

  const seek = (clientX: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const box = rail.getBoundingClientRect();
    const ratio = (clientX - box.left) / Math.max(1, box.width);
    setStop(Math.round(ratio * LAST));
  };

  const stopName = STOPS[state.stop] ?? STOPS[0];
  const current = STOP_COPY[stopName];
  const screen = (
    <DialScreen
      stop={state.stop}
      chromeRef={chromeRef}
      refused={refusal === "chrome"}
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div
          ref={railRef}
          role="slider"
          tabIndex={0}
          aria-label="intensity"
          aria-valuemin={0}
          aria-valuemax={LAST}
          aria-valuenow={state.stop}
          aria-valuetext={`${stopName}, ${current.layer}`}
          onKeyDown={onKeyDown}
          onPointerDown={(event) => {
            dragging.current = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            seek(event.clientX);
          }}
          onPointerMove={(event) => {
            if (dragging.current) seek(event.clientX);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          className="relative h-11 cursor-grab touch-none rounded-full border border-border bg-sunken px-5 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 active:cursor-grabbing"
        >
          <span
            aria-hidden
            className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-border-strong"
          />
          <span
            aria-hidden
            className="absolute top-1/2 left-5 h-px -translate-y-1/2 transition-[width] duration-[var(--usva-duration-base)] ease-[var(--usva-ease-emphasis)]"
            style={{
              width: `calc((100% - 2.5rem) * ${state.stop / LAST})`,
              background: "var(--usva-accent)",
            }}
          />
          <span
            aria-hidden
            className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg transition-[left] duration-[var(--usva-duration-base)] ease-[var(--usva-ease-emphasis)]"
            style={{
              left: `calc(1.25rem + (100% - 2.5rem) * ${state.stop / LAST})`,
              background: "var(--usva-accent)",
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {STOPS.map((name, index) => {
            const active = index === state.stop;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setStop(index)}
                aria-pressed={active}
                className={`flex flex-col items-start gap-1 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 ${
                  active
                    ? "border-accent bg-accent-tint text-on-tint"
                    : "border-border bg-surface text-muted hover:text-ink"
                }`}
              >
                <span className="font-semibold text-sm">
                  {STOP_COPY[name].title}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest">
                  {STOP_COPY[name].layer}
                </span>
              </button>
            );
          })}
        </div>

        <p className="max-w-2xl text-muted text-sm">{current.line}</p>
      </div>

      {state.boundaryFrame ? (
        <SulaFrame radius={18} className="rounded-[18px]">
          {screen}
        </SulaFrame>
      ) : (
        <div className="rounded-[18px] border border-border">{screen}</div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
          <h3 className="font-semibold text-ink text-sm">
            try to add a second sula element
          </h3>
          <p className="text-muted text-xs">
            {armed
              ? "one of these is legal and one is not. the difference is not how many, it is where."
              : "reach the sula stop first. there is nothing to compete with yet."}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!armed}
              onClick={refuse}
              className="rounded-lg border border-border border-dashed px-3 py-2 text-left text-xs transition-colors hover:border-danger hover:text-danger focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted"
            >
              + SulaFab <span className="text-muted">→ chrome region</span>
            </button>
            <button
              type="button"
              disabled={!armed}
              onClick={toggleBoundary}
              aria-pressed={state.boundaryFrame}
              className={`rounded-lg border border-dashed px-3 py-2 text-left text-xs transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-40 ${
                state.boundaryFrame
                  ? "border-success bg-success/10 text-success"
                  : "border-border hover:border-success hover:text-success"
              }`}
            >
              {state.boundaryFrame ? "− " : "+ "}SulaFrame{" "}
              <span className="text-muted">→ boundary region</span>
            </button>
          </div>

          {note && (
            <div
              className={`flex flex-col gap-1 rounded-lg border p-3 ${
                note === "refused"
                  ? "border-danger/50 bg-danger/10"
                  : "border-success/40 bg-success/10"
              }`}
            >
              <p
                className={`font-semibold text-xs ${note === "refused" ? "text-danger" : "text-success"}`}
              >
                {note === "refused" ? REFUSAL_COPY.title : ALLOWED_COPY.title}
              </p>
              <p className="text-muted text-xs">
                {note === "refused" ? REFUSAL_COPY.body : ALLOWED_COPY.body}
              </p>
              <p className="font-mono text-[10px] text-muted uppercase tracking-widest">
                {note === "refused" ? REFUSAL_COPY.fix : ALLOWED_COPY.fix}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
          <h3 className="font-mono text-[10px] text-muted uppercase tracking-widest">
            attention budget
          </h3>
          <dl className="flex flex-col gap-2">
            {REGIONS.map((region) => {
              const n = counts[region.id];
              const breached = n > 1;
              return (
                <div key={region.id} className="flex flex-col gap-0.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="font-mono text-ink text-xs">
                      {region.label}
                    </dt>
                    <dd
                      className={`font-mono text-xs tabular-nums ${breached ? "font-bold text-danger" : "text-muted"}`}
                    >
                      {n}/1
                    </dd>
                  </div>
                  <p className="text-[11px] text-muted">{region.what}</p>
                </div>
              );
            })}
          </dl>
          <p
            role="status"
            aria-live="polite"
            className={`rounded-md border px-2.5 py-1.5 text-center font-mono text-[11px] ${verdictTone[readout.tone]}`}
          >
            {readout.label}
          </p>
          <p className="text-[11px] text-muted">
            {settled.chrome + settled.boundary > 1
              ? "two sula elements, two regions, one each. this is fine, and it is what my own site ships."
              : "one dominant element per region. that is the entire rule."}
          </p>
        </div>
      </div>
    </div>
  );
}
