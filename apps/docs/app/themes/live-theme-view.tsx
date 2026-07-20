"use client";
import { useTheme } from "@/components/theme-provider";
import { ThemeView } from "./theme-view";

/**
 * /themes follows the theme you are in rather than forcing one, so this reads the
 * live theme from context. The forced /themes/[theme] pages are the shareable
 * permalinks; this is the one that moves with the switcher.
 */
export function LiveThemeView() {
  const { theme } = useTheme();
  return <ThemeView theme={theme} />;
}
