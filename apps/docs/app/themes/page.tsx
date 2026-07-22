import type { Metadata } from "next";
import { LiveThemeView } from "./live-theme-view";

export const metadata: Metadata = {
  title: "Themes",
  description:
    "Kajo, sisu, savi. The three registers of the usva design language, shown in the one you are in.",
};

export default function ThemesIndex() {
  return <LiveThemeView />;
}
