export type DLChapter = {
  slug: string;
  number: string;
  title: string;
  group: DLGroup;
  blurb: string;
};

export const DL_GROUPS = [
  "foundations",
  "the language",
  "the practice",
] as const;
export type DLGroup = (typeof DL_GROUPS)[number];

export const DL_CHAPTERS: DLChapter[] = [
  {
    slug: "color",
    number: "01",
    title: "color",
    group: "foundations",
    blurb: "the role tokens. you never write a hex.",
  },
  {
    slug: "type",
    number: "02",
    title: "type",
    group: "foundations",
    blurb: "one family, spoken at the weight extremes.",
  },
  {
    slug: "space",
    number: "03",
    title: "space",
    group: "foundations",
    blurb: "rhythm is fluid, containers not viewports.",
  },
  {
    slug: "depth",
    number: "04",
    title: "depth",
    group: "foundations",
    blurb: "elevation is weather, not z-index.",
  },
  {
    slug: "motion",
    number: "05",
    title: "motion",
    group: "foundations",
    blurb: "four tiers, three easings, tuned per theme.",
  },
  {
    slug: "iconography",
    number: "06",
    title: "iconography",
    group: "foundations",
    blurb: "glyphs inherit, arrows are punctuation.",
  },
  {
    slug: "voice",
    number: "07",
    title: "voice",
    group: "the language",
    blurb: "how it sounds, and how it names.",
  },
  {
    slug: "wordmark",
    number: "08",
    title: "wordmark",
    group: "the language",
    blurb: "the mark, and the load-bearing period.",
  },
  {
    slug: "intensity",
    number: "09",
    title: "intensity",
    group: "the practice",
    blurb: "how loud a screen is allowed to be.",
  },
  {
    slug: "accessibility",
    number: "10",
    title: "accessibility",
    group: "the practice",
    blurb: "the floor is AA.",
  },
  {
    slug: "tokens",
    number: "11",
    title: "tokens",
    group: "the practice",
    blurb: "the reference, and the exports.",
  },
];

export const dlHref = (slug: string): string => `/design-language/${slug}`;

export const dlChapter = (slug: string): DLChapter | undefined =>
  DL_CHAPTERS.find((chapter) => chapter.slug === slug);

export function dlNeighbours(slug: string): {
  prev: DLChapter | null;
  next: DLChapter | null;
} {
  const index = DL_CHAPTERS.findIndex((chapter) => chapter.slug === slug);
  return {
    prev: index > 0 ? (DL_CHAPTERS[index - 1] ?? null) : null,
    next:
      index >= 0 && index < DL_CHAPTERS.length - 1
        ? (DL_CHAPTERS[index + 1] ?? null)
        : null,
  };
}
