"use client";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DEFAULT_THEME, THEMES } from "@/lib/catalog";
import { THEME_STORAGE_KEY } from "@/lib/theme-script";
import { RailoFavicon } from "./railo-favicon";

export type ThemeId = (typeof THEMES)[number];
const STORAGE_KEY = THEME_STORAGE_KEY;

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === "string" && (THEMES as readonly string[]).includes(value);

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
      <RailoFavicon theme={theme} />
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
