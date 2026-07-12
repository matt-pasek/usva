"use client";
import type { LoaderMotion } from "@matt-pasek/usva";
import { SulaLoader } from "@matt-pasek/usva";
import * as React from "react";

const MOTIONS: Array<{
  value: LoaderMotion;
  label: string;
  action: string;
}> = [
  { value: "orbit", label: "relay", action: "recoil, release, return" },
  { value: "cluster", label: "gather", action: "arrive, fuse, scatter" },
  { value: "twin", label: "eclipse", action: "bridge, exchange, release" },
];

export function SulaLoaderDemo({ fluid = true }: { fluid?: boolean }) {
  const [motion, setMotion] = React.useState<LoaderMotion>("orbit");
  return (
    <div className="flex min-h-80 w-full flex-col items-center justify-center gap-10 py-10">
      <SulaLoader size={96} motion={motion} fluid={fluid} />
      <div className="flex flex-col items-center gap-3">
        <p aria-live="polite" className="text-sm text-muted">
          {MOTIONS.find((item) => item.value === motion)?.action}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {MOTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setMotion(value)}
              aria-pressed={value === motion}
              className="min-h-10 rounded-full border border-border px-4 text-sm font-medium text-muted transition-[color,border-color,background-color,transform] duration-200 hover:border-border-strong hover:text-ink active:scale-[0.97] aria-pressed:border-accent aria-pressed:bg-surface-2 aria-pressed:text-accent motion-reduce:transform-none"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
