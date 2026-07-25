import { bySlug, CATALOG } from "./catalog";
import { DL_CHAPTERS, dlChapter } from "./design-language";
import { SITE_ORIGIN } from "./site";

export const OG_HOST = new URL(SITE_ORIGIN).host;

export interface OgCard {
  eyebrow: string;
  title: string;
  period: boolean;
  line: string;
  foot: [string, string];
}

export const ROOT_CARD: OgCard = {
  eyebrow: OG_HOST,
  title: "usva",
  period: true,
  line: "a react design language, and the component library that speaks it.",
  foot: ["npm + registry", "mit + commons clause"],
};

const COMPONENT_PREFIX = ["docs", "components"];
const CHAPTER_PREFIX = ["design-language"];

const startsWith = (segments: string[], prefix: string[]): boolean =>
  prefix.every((part, index) => segments[index] === part);

export function resolveCard(segments: string[]): OgCard {
  const tail = segments[segments.length - 1] ?? "";

  if (
    startsWith(segments, COMPONENT_PREFIX) &&
    segments.length === COMPONENT_PREFIX.length + 1
  ) {
    const entry = bySlug(tail);
    if (entry) {
      return {
        eyebrow: `${OG_HOST} / components`,
        title: entry.name,
        period: false,
        line: entry.summary,
        foot: [entry.layer, "npm + registry"],
      };
    }
  }

  if (
    startsWith(segments, CHAPTER_PREFIX) &&
    segments.length === CHAPTER_PREFIX.length + 1
  ) {
    const chapter = dlChapter(tail);
    if (chapter) {
      return {
        eyebrow: `${OG_HOST} / design language`,
        title: chapter.title,
        period: false,
        line: chapter.blurb,
        foot: [`chapter ${chapter.number}`, "npm + registry"],
      };
    }
  }

  return ROOT_CARD;
}

export const ogPaths = (): string[][] => [
  ...CATALOG.map((entry) => [...COMPONENT_PREFIX, entry.slug]),
  ...DL_CHAPTERS.map((chapter) => [...CHAPTER_PREFIX, chapter.slug]),
];
