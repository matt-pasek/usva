"use client";

import { useState } from "react";

export const SPLASH_LEAD_S = 1.15;

export function splashLead(): number {
  return typeof document !== "undefined" &&
    document.documentElement.dataset.splash === "1"
    ? SPLASH_LEAD_S
    : 0;
}

export function useSplashLead(): number {
  const [lead] = useState(splashLead);
  return lead;
}
