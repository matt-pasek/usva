import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ThemeId } from "@/components/theme-provider";
import { THEMES } from "@/lib/catalog";
import { lexeme } from "@/lib/lexicon";
import { pageMetadata } from "@/lib/site";
import { THEME_DOCS } from "@/lib/themes";
import { ThemeView } from "../theme-view";
import { ThemeSync } from "./theme-sync";

export function generateStaticParams(): { theme: string }[] {
  return THEMES.map((theme) => ({ theme }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ theme: string }>;
}): Promise<Metadata> {
  const { theme } = await params;
  const doc = THEME_DOCS[theme as ThemeId];
  const word = lexeme(theme);
  if (!doc || !word) return {};
  return pageMetadata(`/themes/${theme}`, {
    title: `${word.word}, ${word.sense}`,
    description: doc.lede,
  });
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  if (!THEMES.includes(theme as ThemeId)) notFound();

  const id = theme as ThemeId;

  return (
    <>
      <ThemeSync theme={id} />
      <ThemeView theme={id} />
    </>
  );
}
