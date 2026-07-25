"use client";

import { useEffect } from "react";
import { RAILO_CUTS, RAILO_VIEW_BOX, railoPaths } from "@/lib/railo-geometry";

const LINK_ID = "railo-favicon";

/**
 * Repaints the tab icon in the active theme.
 *
 * The static app/icon.svg cannot see the theme switcher, so the live one is
 * built here instead and handed over as a data URI. The colours are read off
 * the document rather than written down again, which is the only way this stays
 * true when a token moves.
 */
export function RailoFavicon({ theme }: { theme: string }) {
  useEffect(() => {
    const paint = () => {
      const root = document.documentElement;
      if (root.dataset.theme !== theme) return;

      const styles = getComputedStyle(root);
      const accent = styles.getPropertyValue("--usva-accent").trim();
      const accentAlt = styles.getPropertyValue("--usva-accent-alt").trim();
      if (!accent || !accentAlt) return;

      const paths = railoPaths(RAILO_CUTS.micro);
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${RAILO_VIEW_BOX}">` +
        `<path d="${paths.left}" fill="${accent}"/>` +
        `<path d="${paths.right}" fill="${accentAlt}"/>` +
        `</svg>`;

      document.getElementById(LINK_ID)?.remove();

      const link = document.createElement("link");
      link.id = LINK_ID;
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      document.head.append(link);
    };

    const settle = setTimeout(paint, 600);
    let onLoad: (() => void) | undefined;

    if (document.readyState === "complete") {
      paint();
    } else {
      onLoad = paint;
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      clearTimeout(settle);
      if (onLoad) window.removeEventListener("load", onLoad);
    };
  }, [theme]);

  return null;
}
