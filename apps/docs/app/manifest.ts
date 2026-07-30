import studio from "@usva-ui/tokens/tokens.studio.json";
import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION } from "@/lib/site";

const KAJO_GROUND = (studio as unknown as StudioThemes).kajo.color.bg.value;

interface StudioThemes {
  kajo: { color: { bg: { value: string } } };
}

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "usva. · Beautiful, usable React components",
    short_name: "usva.",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "browser",
    background_color: KAJO_GROUND,
    theme_color: KAJO_GROUND,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon.png", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
