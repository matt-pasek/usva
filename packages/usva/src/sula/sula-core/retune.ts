"use client";
import * as React from "react";
import type { FieldColors } from "./field.js";

export function useFieldRetune(
  fieldRef: React.RefObject<{ setColors(colors: FieldColors): void } | null>,
  read: () => FieldColors | null,
  token: unknown,
  wakeRef?: React.RefObject<(() => void) | null>,
) {
  const readRef = React.useRef(read);
  readRef.current = read;

  // biome-ignore lint/correctness/useExhaustiveDependencies: `token` is not read here, it is what decides when a retune runs
  React.useEffect(() => {
    const next = readRef.current();
    if (!next) return;
    fieldRef.current?.setColors(next);
    wakeRef?.current?.();
  }, [token, fieldRef, wakeRef]);
}
