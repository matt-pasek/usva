"use client";
import { usePathname, useRouter } from "next/navigation";
import { SulaSegmented } from "usva/sula/sula-segmented";
import { THEMES } from "@/lib/catalog";
import { type ThemeId, useTheme } from "./theme-provider";

const ITEMS = THEMES.map((id) => ({ value: id, label: id }));

/**
 * The theme control is the library's own segmented control rather than a bespoke
 * copy of it: it lives inside the nav's theme satellite, which is the nav's own
 * body, so the fluid indicator here is that one body's material moving under the
 * label it selects.
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const onValueChange = (value: string) => {
    const next = value as ThemeId;
    setTheme(next);
    if (pathname.startsWith("/themes/")) router.push(`/themes/${next}`);
  };

  return (
    <SulaSegmented
      bare
      aria-label="Theme"
      className="m-1"
      size="sm"
      items={ITEMS}
      value={theme}
      onValueChange={onValueChange}
    />
  );
}
