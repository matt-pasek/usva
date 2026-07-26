"use client";
import { Button } from "@matt-pasek/usva/primitives/button";
import { ChevronRight, Code2, PanelRightClose } from "lucide-react";
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
            <ChevronRight
              aria-hidden="true"
              strokeWidth={1.8}
              className="ml-auto size-3.5 text-muted transition-transform duration-150 ease-soft group-open:rotate-90"
            />
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
  onCollapse,
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
  onCollapse: () => void;
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
      <div className="mb-2 flex shrink-0 items-center justify-between">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
          controls
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onCollapse}
          className="font-mono uppercase tracking-[0.14em] text-muted hover:text-ink"
        >
          <PanelRightClose
            aria-hidden="true"
            strokeWidth={1.8}
            className="size-3.5"
          />
          hide
        </Button>
      </div>
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
        <Button
          variant="solid"
          onClick={exportCode}
          className="w-full font-mono"
        >
          <Code2 aria-hidden="true" strokeWidth={1.8} className="size-4" />
          {copied ? "copied to clipboard" : "export code"}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex-1 font-mono"
          >
            reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={share}
            className="flex-1 font-mono"
          >
            {shared ? "link copied" : "share"}
          </Button>
        </div>
      </div>
    </div>
  );
}
