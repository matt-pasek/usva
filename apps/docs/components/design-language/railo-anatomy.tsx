"use client";

import { useState } from "react";
import { RailoMasked } from "@/components/railo-motion";
import { useInViewOnce } from "@/lib/use-in-view-once";

export function RailoAnatomy() {
  const [run, setRun] = useState(0);
  const [frame, seen] = useInViewOnce<HTMLDivElement>(0.6);

  return (
    <div
      ref={frame}
      className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6"
    >
      <div className="flex items-baseline gap-3">
        <span className="font-semibold text-ink">the mark builds itself</span>
        <span className="text-muted text-sm">900ms, once</span>
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="ml-auto rounded-md border border-border-strong bg-surface-2 px-3 py-1.5 font-mono text-[0.7rem] text-ink outline-none transition-colors duration-fast ease-soft hover:bg-accent-tint focus-visible:ring-focus"
        >
          replay
        </button>
      </div>
      <div className="grid min-h-52 place-items-center rounded-md bg-sunken p-8">
        {seen && (
          <RailoMasked key={run} animation="reveal" className="size-32" />
        )}
      </div>
    </div>
  );
}
