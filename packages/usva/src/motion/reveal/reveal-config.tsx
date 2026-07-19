"use client";
import * as React from "react";

export interface RevealConfig {
  /** Global reveal intensity: kajo = 1 (bold), sisu ≈ 0.45 (quiet), 0 = crossfade. */
  intensity: number;
}

const RevealConfigContext = React.createContext<RevealConfig>({ intensity: 1 });

export function RevealConfigProvider({
  intensity,
  children,
}: {
  intensity: number;
  children: React.ReactNode;
}) {
  const value = React.useMemo(() => ({ intensity }), [intensity]);
  return (
    <RevealConfigContext.Provider value={value}>
      {children}
    </RevealConfigContext.Provider>
  );
}

export function useRevealIntensity(override?: number): number {
  const ctx = React.useContext(RevealConfigContext);
  return override ?? ctx.intensity;
}
