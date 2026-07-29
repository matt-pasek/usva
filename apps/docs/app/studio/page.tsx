import type { Metadata } from "next";
import { LumoStudio } from "@/components/studio/lumo-studio";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/studio", {
  title: "Lumo",
  description:
    "Cast a sky. Tune any usva atmosphere and take it away as component code or a PNG wallpaper.",
});

export default function StudioPage() {
  return (
    <main className="flex flex-col px-4 pb-4 sm:px-6 lg:h-[calc(100svh-6rem)] lg:overflow-hidden">
      <LumoStudio />
    </main>
  );
}
