"use client";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { THEMES } from "@/lib/catalog";

export type ThemeId = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeId = "kajo";
const STORAGE_KEY = "usva-theme";

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === "string" && (THEMES as readonly string[]).includes(value);

/**
 * Runs before the body paints, so the first frame is already in the right theme.
 * Deferring this to React means every load flashes kajo first. savi is the light
 * one, so it is what a first-time visitor on a light system gets; after that the
 * stored choice wins outright, because an explicit pick is not a preference to
 * be second-guessed on the next visit.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)});var t=${JSON.stringify(
  THEMES,
)}.indexOf(s)>=0?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"savi":${JSON.stringify(
  DEFAULT_THEME,
)});document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(
  DEFAULT_THEME,
)});}})();`;

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(DEFAULT_THEME);

  /* The script above already put the real theme on <html>. Read it back rather
   * than re-deriving it, so the two can never disagree. */
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (isThemeId(current)) setThemeState(current);
  }, []);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      console.warn("usva: could not persist the theme", error);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return context;
}
