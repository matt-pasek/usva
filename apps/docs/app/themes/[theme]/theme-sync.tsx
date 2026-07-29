"use client";
import { useEffect } from "react";
import { type ThemeId, useTheme } from "@/components/theme-provider";

/** Standing on a theme's page puts you in that theme, so the page is its own proof. */
export function ThemeSync({ theme }: { theme: ThemeId }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return null;
}
