import type { Metadata } from "next";
import { LiveThemeView } from "./live-theme-view";

export const metadata: Metadata = {
  title: "themes",
  description:
    "kajo, sisu, savi. the three registers of the usva design language, shown in the one you are in.",
};

export default function ThemesIndex() {
  return <LiveThemeView />;
}
