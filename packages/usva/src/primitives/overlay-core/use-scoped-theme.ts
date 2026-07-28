"use client";
import * as React from "react";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

export function useScopedTheme() {
  const probe = React.useRef<HTMLSpanElement>(null);
  const [theme, setTheme] = React.useState<string>();

  useIsomorphicLayoutEffect(() => {
    const found = probe.current
      ?.closest("[data-theme]")
      ?.getAttribute("data-theme");
    setTheme(found ?? undefined);
  });

  return [probe, theme] as const;
}
