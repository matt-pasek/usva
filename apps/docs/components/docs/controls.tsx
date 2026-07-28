"use client";
import type { ReactNode } from "react";
import { cn } from "usva/cn";
import { ColorField } from "usva/primitives/color-field";
import { Knob } from "usva/primitives/knob";
import { Lab } from "./lab";

export function ControlsHead({ note }: { note?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <Lab>customize</Lab>
      {note && (
        <p className="font-mono text-[0.65rem] leading-relaxed text-muted">
          {note}
        </p>
      )}
    </div>
  );
}

export function CtrlGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-3 grid gap-2 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function CtrlRow({
  label,
  sub,
  children,
}: {
  label: string;
  sub: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[2.9rem] items-center justify-between gap-4 rounded-[10px] border border-border bg-surface-2 px-3 py-2">
      <span className="text-sm text-ink">
        {label}
        <em className="mt-0.5 block font-mono text-[0.58rem] uppercase not-italic tracking-[0.12em] text-muted">
          {sub}
        </em>
      </span>
      {children}
    </div>
  );
}

const SELECT_CLASS = cn(
  "appearance-none rounded-[7px] border border-border-strong bg-sunken py-1.5 pl-2.5 pr-7",
  "font-mono text-xs text-ink outline-none focus-visible:ring-focus",
  "bg-[linear-gradient(45deg,transparent_50%,var(--usva-muted)_50%),linear-gradient(135deg,var(--usva-muted)_50%,transparent_50%)]",
  "bg-[position:calc(100%-14px)_calc(50%-1px),calc(100%-10px)_calc(50%-1px)]",
  "bg-[size:4px_4px,4px_4px] bg-no-repeat",
);

export interface CtrlSelectProps {
  label: string;
  sub: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}

export function CtrlSelect({
  label,
  sub,
  value,
  options,
  onChange,
}: CtrlSelectProps) {
  return (
    <CtrlRow label={label} sub={sub}>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={SELECT_CLASS}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </CtrlRow>
  );
}

export interface CtrlSwitchProps {
  label: string;
  sub: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CtrlSwitch({ label, sub, checked, onChange }: CtrlSwitchProps) {
  return (
    <CtrlRow label={label} sub={sub}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "h-[1.3rem] w-[2.3rem] shrink-0 rounded-full border p-[2px] text-left",
          "outline-none transition-colors duration-150 ease-soft focus-visible:ring-focus",
          checked
            ? "border-accent/55 bg-accent-tint"
            : "border-border-strong bg-sunken",
        )}
      >
        <span
          className={cn(
            "block size-[0.9rem] rounded-full transition-transform duration-150 ease-soft",
            checked ? "translate-x-4 bg-accent" : "bg-muted",
          )}
        />
      </button>
    </CtrlRow>
  );
}

export interface CtrlTextProps {
  label: string;
  sub: string;
  value: string;
  onChange: (value: string) => void;
}

export function CtrlText({ label, sub, value, onChange }: CtrlTextProps) {
  return (
    <CtrlRow label={label} sub={sub}>
      <input
        type="text"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-[9.5rem] rounded-[7px] border border-border-strong bg-sunken px-2.5 py-1.5 font-mono text-xs text-ink outline-none focus-visible:ring-focus"
      />
    </CtrlRow>
  );
}

export interface CtrlSliderProps {
  label: string;
  sub: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

export function CtrlSlider({
  label,
  sub,
  value,
  min,
  max,
  step = 1,
  onChange,
}: CtrlSliderProps) {
  return (
    <CtrlRow label={label} sub={sub}>
      <span className="flex items-center gap-2.5">
        <Knob
          size="sm"
          aria-label={label}
          value={value}
          min={min}
          max={max}
          step={step}
          onValueChange={onChange}
          className="shrink-0"
        />
        <output className="w-12 shrink-0 text-right font-mono text-[0.7rem] tabular-nums text-muted">
          {String(Number.parseFloat(value.toFixed(3)))}
        </output>
      </span>
    </CtrlRow>
  );
}

export interface CtrlColorProps {
  label: string;
  sub: string;
  value: string;
  onChange: (value: string) => void;
}

export function CtrlColor({ label, sub, value, onChange }: CtrlColorProps) {
  return (
    <CtrlRow label={label} sub={sub}>
      <ColorField
        value={value}
        onValueChange={onChange}
        swatchLabel={label}
        className="shrink-0"
      />
    </CtrlRow>
  );
}

export interface TemplateSelectProps {
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}

/** The demo-bar dropdown: a handful of starting points for the panel below. */
export function TemplateSelect({
  value,
  options,
  onChange,
}: TemplateSelectProps) {
  return (
    <label className="flex items-center gap-2">
      <Lab>template</Lab>
      <select
        aria-label="demo template"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={SELECT_CLASS}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        {value === "custom" && <option value="custom">custom</option>}
      </select>
    </label>
  );
}
