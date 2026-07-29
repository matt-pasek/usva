import { DEFAULT_THEME, THEMES } from "./catalog";

export const THEME_STORAGE_KEY = "usva-theme";

/**
 * Runs before the body paints, so the first frame is already in the right theme.
 * Deferring this to React means every load flashes kajo first. savi is the light
 * one, so it is what a first-time visitor on a light system gets; after that the
 * stored choice wins outright, because an explicit pick is not a preference to
 * be second-guessed on the next visit.
 *
 * It lives here rather than beside the provider because the root layout is a
 * server component and injects this string directly. Exported from a
 * "use client" module it would arrive as a client reference, and the script
 * that prevents the flash would be the thing that causes it.
 */
export const themeScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});var t=${JSON.stringify(
  THEMES,
)}.indexOf(s)>=0?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"savi":${JSON.stringify(
  DEFAULT_THEME,
)});document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme",${JSON.stringify(
  DEFAULT_THEME,
)});}})();`;
