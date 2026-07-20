"use client";
import { CodeSnippet } from "@matt-pasek/usva";
import * as React from "react";
import {
  ControlsHead,
  CtrlColor,
  CtrlGrid,
  CtrlSelect,
  CtrlSlider,
  CtrlSwitch,
  CtrlText,
  TemplateSelect,
} from "./controls";
import { DemoPanel } from "./demo-panel";

export type Config = Record<string, string | number | boolean>;

/** Fields flagged advanced fold into a collapsible group below the basics. */
type Advanced = { advanced?: boolean };

export type Field<C extends Config> = {
  [K in keyof C]: C[K] extends boolean
    ? { kind: "switch"; key: K; label: string; sub: string } & Advanced
    : C[K] extends number
      ? {
          kind: "slider";
          key: K;
          label: string;
          sub: string;
          min: number;
          max: number;
          step?: number;
        } & Advanced
      : (
          | {
              kind: "select";
              key: K;
              label: string;
              sub: string;
              options: readonly string[];
            }
          | { kind: "text"; key: K; label: string; sub: string }
          | { kind: "color"; key: K; label: string; sub: string }
        ) &
          Advanced;
}[keyof C];

export interface PlaygroundProps<C extends Config> {
  /** Starting points shown in the demo-bar dropdown. The first is the default. */
  templates: Record<string, C>;
  /** One control per tunable prop, rendered in the panel footer. */
  fields: Field<C>[];
  /** The live preview, driven by the current config. */
  render: (config: C) => React.ReactNode;
  /** The copy-paste usage snippet, derived from the current config. */
  snippet: (config: C) => string;
  /** Extra classes on the stage wrapper around `render`. */
  stageClassName?: string;
  /** Drops the stage fill for the current config, e.g. a "hide bg" switch. */
  bareStage?: (config: C) => boolean;
  /** Right-aligned mono note on the panel bar, shown when no template is set. */
  note?: string;
}

const STAGE = "flex min-h-24 flex-wrap items-center justify-center gap-4";

export function Playground<C extends Config>({
  templates,
  fields,
  render,
  snippet,
  stageClassName,
  note,
}: PlaygroundProps<C>) {
  const entries = React.useMemo(() => Object.entries(templates), [templates]);
  const names = entries.map(([name]) => name);
  const first = entries[0];
  const [template, setTemplate] = React.useState(first?.[0] ?? "");
  const [config, setConfig] = React.useState<C>(() => first?.[1] ?? ({} as C));

  const applyTemplate = (name: string) => {
    setTemplate(name);
    const preset = templates[name];
    if (preset) setConfig(preset);
  };

  const patch = (partial: Partial<C>) => {
    setTemplate("custom");
    setConfig((current) => ({ ...current, ...partial }));
  };

  return (
    <>
      <DemoPanel
        note={note}
        action={
          names.length > 1 ? (
            <TemplateSelect
              value={template}
              options={names}
              onChange={applyTemplate}
            />
          ) : undefined
        }
        footer={
          fields.length > 0 && (
            <>
              <ControlsHead />
              <CtrlGrid>
                {fields
                  .filter((field) => !field.advanced)
                  .map((field) => (
                    <Control
                      key={String(field.key)}
                      field={field}
                      config={config}
                      patch={patch}
                    />
                  ))}
              </CtrlGrid>
              {fields.some((field) => field.advanced) && (
                <details className="group mt-2">
                  <summary className="flex cursor-pointer list-none items-center gap-2 rounded-[10px] border border-border bg-surface-2 px-3 py-2 outline-none focus-visible:ring-focus [&::-webkit-details-marker]:hidden">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                      advanced
                    </span>
                    <span className="font-mono text-[0.65rem] tabular-nums text-muted">
                      {fields.filter((field) => field.advanced).length}
                    </span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="ml-auto size-3.5 text-muted transition-transform duration-150 ease-soft group-open:rotate-90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </summary>
                  <CtrlGrid className="mt-2">
                    {fields
                      .filter((field) => field.advanced)
                      .map((field) => (
                        <Control
                          key={String(field.key)}
                          field={field}
                          config={config}
                          patch={patch}
                        />
                      ))}
                  </CtrlGrid>
                </details>
              )}
            </>
          )
        }
      >
        <div className={stageClassName ?? STAGE}>{render(config)}</div>
      </DemoPanel>

      <CodeSnippet className="mt-9" label="usage" code={snippet(config)} />
    </>
  );
}

export function Control<C extends Config>({
  field,
  config,
  patch,
}: {
  field: Field<C>;
  config: C;
  patch: (partial: Partial<C>) => void;
}) {
  const value = config[field.key];
  switch (field.kind) {
    case "select":
      return (
        <CtrlSelect
          label={field.label}
          sub={field.sub}
          value={String(value)}
          options={field.options}
          onChange={(next) =>
            patch({ [field.key]: next } as unknown as Partial<C>)
          }
        />
      );
    case "switch":
      return (
        <CtrlSwitch
          label={field.label}
          sub={field.sub}
          checked={Boolean(value)}
          onChange={(next) =>
            patch({ [field.key]: next } as unknown as Partial<C>)
          }
        />
      );
    case "slider":
      return (
        <CtrlSlider
          label={field.label}
          sub={field.sub}
          value={Number(value)}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(next) =>
            patch({ [field.key]: next } as unknown as Partial<C>)
          }
        />
      );
    case "color":
      return (
        <CtrlColor
          label={field.label}
          sub={field.sub}
          value={String(value)}
          onChange={(next) =>
            patch({ [field.key]: next } as unknown as Partial<C>)
          }
        />
      );
    case "text":
      return (
        <CtrlText
          label={field.label}
          sub={field.sub}
          value={String(value)}
          onChange={(next) =>
            patch({ [field.key]: next } as unknown as Partial<C>)
          }
        />
      );
  }
}
