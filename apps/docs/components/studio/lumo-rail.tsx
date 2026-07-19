"use client";
import * as React from "react";
import { CtrlColor, CtrlGrid, CtrlSelect } from "@/components/docs/controls";
import { Lab } from "@/components/docs/lab";
import { type Config, Control } from "@/components/docs/playground";
import type { ErasedStudio } from "@/lib/atmospheres";

function FieldStack({
  studio,
  config,
  patch,
}: {
  studio: ErasedStudio;
  config: Config;
  patch: (partial: Partial<Config>) => void;
}) {
  const basic = studio.fields.filter((field) => !field.advanced);
  const advanced = studio.fields.filter((field) => field.advanced);

  return (
    <>
      <CtrlGrid className="grid-cols-1 sm:grid-cols-1">
        {basic.map((field) => (
          <Control
            key={String(field.key)}
            field={field}
            config={config}
            patch={patch}
          />
        ))}
      </CtrlGrid>
      {advanced.length > 0 && (
        <details className="group mt-2">
          <summary className="flex cursor-pointer list-none items-center gap-2 rounded-[10px] border border-border bg-surface-2 px-3 py-2 outline-none focus-visible:ring-focus [&::-webkit-details-marker]:hidden">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
              advanced
            </span>
            <span className="font-mono text-[0.65rem] tabular-nums text-muted">
              {advanced.length}
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
          <CtrlGrid className="mt-2 grid-cols-1 sm:grid-cols-1">
            {advanced.map((field) => (
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
  );
}

function RailButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 rounded-[9px] border border-border-strong bg-sunken px-3 py-2 font-mono text-xs text-ink outline-none transition-colors duration-150 ease-soft hover:border-accent/55 hover:bg-accent-tint focus-visible:ring-focus"
    >
      {children}
    </button>
  );
}

export function LumoRail({
  studio,
  studios,
  config,
  template,
  templateNames,
  canvasBg,
  onPatch,
  onAtmosphere,
  onTemplate,
  onCanvasBg,
  onReset,
  onShare,
  onExport,
}: {
  studio: ErasedStudio;
  studios: ErasedStudio[];
  config: Config;
  template: string;
  templateNames: string[];
  canvasBg: string;
  onPatch: (partial: Partial<Config>) => void;
  onAtmosphere: (name: string) => void;
  onTemplate: (name: string) => void;
  onCanvasBg: (value: string) => void;
  onReset: () => void;
  onShare: () => void;
  onExport: () => void;
}) {
  const [shared, setShared] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const share = () => {
    onShare();
    setShared(true);
    window.setTimeout(() => setShared(false), 1400);
  };
  const exportCode = () => {
    onExport();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  const templateOptions = templateNames.includes(template)
    ? templateNames
    : [...templateNames, "custom"];

  return (
    <div className="flex h-full w-full flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        <div className="space-y-2">
          <Lab>background</Lab>
          <CtrlGrid className="grid-cols-1 sm:grid-cols-1">
            <CtrlSelect
              label="atmosphere"
              sub="the shader"
              value={studio.name}
              options={studios.map((entry) => entry.name)}
              onChange={onAtmosphere}
            />
            <CtrlSelect
              label="preset"
              sub="a starting point"
              value={template}
              options={templateOptions}
              onChange={onTemplate}
            />
            <CtrlColor
              label="canvas"
              sub="the ground it casts on, from the theme"
              value={canvasBg}
              onChange={onCanvasBg}
            />
          </CtrlGrid>
        </div>

        <div className="space-y-2">
          <Lab>{studio.label}</Lab>
          <FieldStack studio={studio} config={config} patch={onPatch} />
        </div>
      </div>

      <div className="shrink-0 space-y-2 border-t border-border pt-3">
        <button
          type="button"
          onClick={exportCode}
          className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-accent px-4 py-2.5 font-mono text-sm font-semibold text-on-accent outline-none transition-colors duration-150 ease-soft hover:bg-accent/90 focus-visible:ring-focus"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 6l-5 6 5 6M16 6l5 6-5 6" />
          </svg>
          {copied ? "copied to clipboard" : "export code"}
        </button>
        <div className="flex gap-2">
          <RailButton onClick={onReset}>reset</RailButton>
          <RailButton onClick={share}>
            {shared ? "link copied" : "share"}
          </RailButton>
        </div>
      </div>
    </div>
  );
}
