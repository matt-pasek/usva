"use client";
import { cn } from "@matt-pasek/usva/cn";
import { THEMES } from "@/lib/catalog";
import { type ThemeId, useTheme } from "./theme-provider";

const HINT: Record<ThemeId, string> = {
  kajo: "faint glow. the dark, expressive one.",
  sisu: "grit. the dashboard one.",
  savi: "clay. the light one.",
};

/**
 * The theme control, as it sits on the nav's glass. It paints no surface of its
 * own: the pill under it is the nav's field, so this is only the type and the
 * indicator.
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="flex min-h-11 items-center gap-0.5 p-1.5"
    >
      {THEMES.map((id) => {
        const active = id === theme;
        return (
          // biome-ignore lint/a11y/useSemanticElements: same as the library's SegmentedControl, this needs a button with a custom indicator that a native radio input cannot render
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            title={HINT[id]}
            onClick={() => setTheme(id)}
            className={cn(
              "rounded-full px-2.5 py-1.5 font-mono text-xs whitespace-nowrap outline-none",
              "transition-tint duration-fast ease-soft focus-visible:ring-focus",
              active ? "bg-ink/6 text-ink" : "text-muted hover:text-ink",
            )}
          >
            {id}
          </button>
        );
      })}
    </div>
  );
}
