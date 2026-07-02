"use client";
import { Button } from "@matt-pasek/usva";

export function ThemeSwitcher() {
  const set = (t: string) => document.documentElement.setAttribute("data-theme", t);
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="soft" onClick={() => set("kajo")}>kajo</Button>
      <Button size="sm" variant="soft" onClick={() => set("sisu")}>sisu</Button>
    </div>
  );
}
