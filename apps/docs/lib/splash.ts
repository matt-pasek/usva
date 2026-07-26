"use client";

export const SPLASH_LEAD_S = 1.15;

export function useSplashLead(): number {
  return typeof document !== "undefined" &&
    document.documentElement.dataset.splash === "1"
    ? SPLASH_LEAD_S
    : 0;
}
