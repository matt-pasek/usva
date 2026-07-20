import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ThemeId } from "@/components/theme-provider";
import { THEMES } from "@/lib/catalog";
import { THEME_DOCS, ThemeView } from "../theme-view";
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
  if (!doc) return {};
  return {
    title: `${doc.word}, ${doc.gloss}`,
    description: doc.lede,
  };
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
