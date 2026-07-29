import type { CopyKind } from "./kinds";

export function trackCopy(kind: CopyKind, name: string): void {
  if (typeof navigator === "undefined" || !navigator.sendBeacon) return;
  navigator.sendBeacon(
    "/api/copy",
    new Blob([JSON.stringify({ kind, name })], { type: "application/json" }),
  );
}
