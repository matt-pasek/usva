"use client";
import { captureAtmosphere } from "@matt-pasek/usva";
import * as React from "react";
import type { Config } from "@/components/docs/playground";
import type { ErasedStudio } from "@/lib/atmospheres";

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function LumoStage({
  studio,
  config,
  canvasBg,
  theme,
}: {
  studio: ErasedStudio;
  config: Config;
  canvasBg: string;
  theme: string;
}) {
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = React.useState<"idle" | "saving" | "error">(
    "idle",
  );

  const download = async () => {
    const canvas = stageRef.current?.querySelector("canvas");
    if (!canvas) {
      setStatus("error");
      return;
    }
    setStatus("saving");
    try {
      const blob = await captureAtmosphere(canvas, { bg: canvasBg });
      saveBlob(blob, `lumo-${studio.name}.png`);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="relative flex-1 overflow-hidden rounded-xl border border-border">
      <div
        ref={stageRef}
        data-theme={theme}
        className="absolute inset-0"
        style={{ background: canvasBg }}
      >
        {studio.wallpaper(config, "h-full w-full")}
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/15 bg-black/35 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white/85 backdrop-blur-sm">
        {studio.label}
      </span>

      <button
        type="button"
        onClick={download}
        disabled={status === "saving"}
        className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 font-mono text-[0.7rem] text-white/90 outline-none backdrop-blur-sm transition-colors duration-150 ease-soft hover:bg-black/55 focus-visible:ring-focus disabled:opacity-60"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
        </svg>
        {status === "saving"
          ? "capturing…"
          : status === "error"
            ? "no canvas"
            : "download png"}
      </button>
    </div>
  );
}
