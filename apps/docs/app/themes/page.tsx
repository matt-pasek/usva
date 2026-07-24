import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { LiveThemeView } from "./live-theme-view";

export const metadata: Metadata = pageMetadata("/themes", {
  title: "Themes",
  description:
    "Kajo, sisu, savi. The three registers of the usva design language, shown in the one you are in.",
});

export default function ThemesIndex() {
  return <LiveThemeView />;
}
