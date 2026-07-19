import type { Metadata } from "next";
import { LumoStudio } from "@/components/studio/lumo-studio";

export const metadata: Metadata = {
  title: "Lumo",
  description:
    "Cast a sky. Tune any usva atmosphere and take it away as component code or a PNG wallpaper.",
};

export default function StudioPage() {
  return (
    <main className="flex h-[calc(100svh-5rem)] flex-col overflow-hidden px-4 pb-4 sm:h-[calc(100svh-6rem)] sm:px-6">
      <header className="mx-auto flex w-full max-w-[112rem] shrink-0 items-baseline gap-3 pb-3">
        <h1 className="text-xl font-extrabold tracking-tight text-ink">
          the atmosphere studio
        </h1>
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted">
          lumo · cast a sky
        </span>
      </header>
      <LumoStudio />
    </main>
  );
}
