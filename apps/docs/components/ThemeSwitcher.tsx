"use client";
import { SegmentedControl } from "@matt-pasek/usva";
import { useEffect, useState } from "react";

const THEMES = [
  { id: "kajo", label: "kajo", hint: "portfolio" },
  { id: "sisu", label: "sisu", hint: "dashboard" },
  { id: "savi", label: "savi", hint: "light / clay" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

const isThemeId = (value: string | null): value is ThemeId =>
  THEMES.some((t) => t.id === value);

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>("kajo");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (isThemeId(current)) setTheme(current);
  }, []);

  const pick = (id: string) => {
    if (!isThemeId(id)) return;
    setTheme(id);
    document.documentElement.setAttribute("data-theme", id);
  };

  return (
    <SegmentedControl
      size="sm"
      aria-label="Theme"
      value={theme}
      onValueChange={pick}
      items={THEMES.map((t) => ({
        value: t.id,
        label: <span title={t.hint}>{t.label}</span>,
      }))}
    />
  );
}
