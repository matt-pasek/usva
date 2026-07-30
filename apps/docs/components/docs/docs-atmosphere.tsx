"use client";
import { Loimu } from "@usva-ui/react/atmospheres/loimu";
import { Routa } from "@usva-ui/react/atmospheres/routa";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

/** Component pages that are themselves an animated field. The site atmosphere
 * competes with their demos, so it stands down while one is open. */
const ATMOSPHERE_ROUTES = new Set(
  [
    "hehku",
    "kajastus",
    "kuulto",
    "kynnos",
    "loimu",
    "routa",
    "sula-field",
    "utu",
    "vare",
  ].map((slug) => `/docs/components/${slug}`),
);

export function DocsAtmosphere() {
  const { theme } = useTheme();
  const pathname = usePathname();

  if (ATMOSPHERE_ROUTES.has(pathname)) return null;

  const Atmosphere = theme === "savi" ? Routa : Loimu;
  const opacity = theme === "savi" ? 0.2 : 0.5;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Atmosphere opacity={opacity} className="h-full w-full" />
    </div>
  );
}
