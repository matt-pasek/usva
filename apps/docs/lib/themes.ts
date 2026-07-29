import type { ThemeId } from "@/components/theme-provider";

export interface ThemeAtmosphere {
  /** lexicon word, with diacritics */
  word: string;
  /** catalog + docs route slug */
  slug: string;
}

export interface SpecimenStat {
  label: string;
  value: string;
  unit?: string;
  note?: string;
}

export type SpecimenScene =
  | {
      kind: "showcase";
      url: string;
      brand: string;
      nav: string;
      eyebrow: string;
      headline: string;
      lede: string;
      primary: string;
      secondary: string;
      stats: SpecimenStat[];
    }
  | {
      kind: "console";
      url: string;
      title: string;
      action: string;
      environments: { name: string; current?: boolean }[];
      rows: {
        time: string;
        service: string;
        text: string;
        tone: "success" | "neutral" | "warning" | "danger";
      }[];
      meters: {
        label: string;
        value: number;
        max: number;
        unit: string;
        status: string;
        tone: "neutral" | "success" | "warning";
      }[];
      stats: SpecimenStat[];
    }
  | {
      kind: "reading";
      url: string;
      eyebrow: string;
      title: string;
      byline: { name: string; initials: string; meta: string };
      lead: string;
      paragraphs: string[];
      quote: string;
      attribution: string;
      tags: string[];
    };

export interface ThemeDoc {
  id: ThemeId;
  index: number;
  /** one breath, for the homepage capsule */
  capsule: string;
  /** the hero line on /themes */
  lede: string;
  /** Sentence-case meta description; the lede is lowercase and breaks the register. */
  metaDescription: string;
  body: string[];
  atmosphere: ThemeAtmosphere;
  motionNote: string;
  palette: { role: string; note: string }[];
  forThis: string[];
  notThis: string[];
  specimen: SpecimenScene;
  specimenCaption: string;
}

export const THEME_ORDER: ThemeId[] = ["kajo", "sisu", "savi"];

export const THEME_DOCS: Record<ThemeId, ThemeDoc> = {
  kajo: {
    id: "kajo",
    index: 1,
    capsule:
      "violet dark, generous radius, real glow. the expressive pole, built for a page you look at rather than work in.",
    lede: "the dark one. built for a page that is trying to make an impression.",
    metaDescription:
      "The dark theme usva was extracted from: a near-black violet ground with an aurora behind it, built for pages you look at rather than work in.",
    body: [
      "kajo is the theme the design system was extracted from: a portfolio that had to look like something, on a near-black violet ground with an aurora sitting behind it. the accents are cool and saturated and they carry a lot of weight, because there is a lot of dark for them to carry it against.",
    ],
    atmosphere: { word: "kajastus", slug: "kajastus" },
    motionNote:
      "the languid end of the vocabulary. durations stretched past the baseline, and a spring that settles with a faint overshoot. things arrive rather than appear, which is affordable here because nobody is filling in a form at speed.",
    palette: [
      { role: "bg", note: "near black, tinted violet. never pure #000" },
      { role: "surface", note: "one step up, still dark. cards sit here" },
      { role: "accent", note: "the aurora. the primary voice" },
      { role: "accent-alt", note: "the second voice. paired, never alone" },
      { role: "ink", note: "primary text, AA on every surface role" },
      { role: "faint", note: "decorative only. it never carries meaning" },
    ],
    forThis: [
      "portfolios and launch pages",
      "a case study that opens with a full-bleed hero",
      "surfaces where an atmosphere or a sula element is the point",
    ],
    notThis: [
      "a dense table someone reads all day",
      "a first-run flow where one control must be found fast",
      "anything that has to survive a white slide",
    ],
    specimen: {
      kind: "showcase",
      url: "revontuli.example",
      brand: "revontuli",
      nav: "get in touch",
      eyebrow: "portfolio",
      headline: "work that glows in the dark",
      lede: "selected projects from nine years of building for the web, shown on the ground they were designed for.",
      primary: "view selected work",
      secondary: "about",
      stats: [
        { label: "shipped projects", value: "24" },
        { label: "years at it", value: "9" },
        { label: "talks given", value: "12" },
      ],
    },
    specimenCaption:
      "a portfolio hero assembled from the catalog: Button, Badge, StatCard and the type scale, on this ground.",
  },
  sisu: {
    id: "sisu",
    index: 2,
    capsule:
      "near-black, tight radius, edges doing the structuring. the usability pole, and it has nothing to prove.",
    lede: "the working one. built for a dashboard somebody has open for eight hours.",
    metaDescription:
      "The working theme: near-black, tight radius, structured by its edges rather than its colour. Built for a dashboard somebody keeps open all day.",
    body: [
      "sisu came out of a browser extension and its landing page: real product surface, lists and toolbars and panels and counts. the palette pulls the accents back and pushes the borders forward, because a working screen is structured by its edges, not by its colour.",
    ],
    atmosphere: { word: "loimu", slug: "loimu" },
    motionNote:
      "snappy and critically damped. short durations, no overshoot. an interface you use a hundred times a day must not perform for you on the hundredth.",
    palette: [
      { role: "bg", note: "a cooler dark, less saturated than kajo" },
      { role: "surface", note: "panels and cards, clearly separated" },
      {
        role: "accent",
        note: "used sparingly, mostly on the one live control",
      },
      { role: "border", note: "load-bearing here. structure comes from edges" },
      { role: "muted", note: "secondary text and every unit, still AA" },
      { role: "danger", note: "a status colour that has to be read, not felt" },
    ],
    forThis: [
      "a dashboard somebody keeps open all day",
      "dense tables and toolbars and logs",
      "long sessions where boring is the feature",
    ],
    notThis: [
      "a landing page selling something in one scroll",
      "a sula element inside a data region",
      "showing off",
    ],
    specimen: {
      kind: "console",
      url: "console.example/deploys",
      title: "deploys",
      action: "redeploy",
      environments: [
        { name: "production", current: true },
        { name: "canary" },
        { name: "staging" },
      ],
      rows: [
        {
          time: "14:02:11",
          service: "api",
          text: "build #482 green in 41s",
          tone: "success",
        },
        {
          time: "14:02:36",
          service: "edge",
          text: "canary at 5% of traffic",
          tone: "neutral",
        },
        {
          time: "14:03:04",
          service: "api",
          text: "p95 latency 118ms, holding",
          tone: "neutral",
        },
        {
          time: "14:03:12",
          service: "worker",
          text: "retry queue draining, 1.2k left",
          tone: "warning",
        },
        {
          time: "14:03:40",
          service: "web",
          text: "assets purged from 14 edges",
          tone: "success",
        },
      ],
      meters: [
        {
          label: "canary traffic",
          value: 5,
          max: 100,
          unit: "%",
          status: "holding",
          tone: "neutral",
        },
        {
          label: "error budget spent",
          value: 0.2,
          max: 1,
          unit: "%",
          status: "watch",
          tone: "warning",
        },
      ],
      stats: [
        { label: "uptime", value: "99.98", unit: "%" },
        { label: "deploys today", value: "7" },
        { label: "open alerts", value: "0" },
      ],
    },
    specimenCaption:
      "a deploy console assembled from the catalog: Badge, Button, Chip, ProgressRow, StatCard and the mono scale, structured by its edges.",
  },
  savi: {
    id: "savi",
    index: 3,
    capsule:
      "warm light, paper rather than screen. proof that the system is not a mood that only works in the dark.",
    lede: "the light one. built for reading, and for the times you cannot ship a dark UI.",
    metaDescription:
      "The light theme: warm, low-contrast, paper rather than screen. Proof the system is not a mood that only works in the dark.",
    body: [
      "savi is the light register, and it is not a colour inversion of kajo. it is warm and low in contrast at the surface level, with the accents doing more work because there is far less dark to lean on. a first-time visitor whose system asks for light gets this one.",
    ],
    atmosphere: { word: "kynnös", slug: "kynnos" },
    motionNote:
      "calm. moderate durations, no bounce. the theme is meant to feel settled rather than energetic, which is the whole reason it exists.",
    palette: [
      { role: "bg", note: "warm off-white. not paper, not grey" },
      { role: "surface", note: "barely a step from bg. separation is by edge" },
      { role: "accent", note: "darker than kajo's, so it holds on light" },
      { role: "accent-tint", note: "the fill behind an accent, kept legible" },
      { role: "ink", note: "near black, warm" },
      {
        role: "border-strong",
        note: "does the separation that shadow does not",
      },
    ],
    forThis: [
      "documentation and long-form reading",
      "an embedded surface in a host app that is already light",
      "screenshots and decks and print",
    ],
    notThis: [
      "a launch page that has to stop someone mid-scroll",
      "a dim room where the screen is the only light",
      "a surface embedded in a host app that is already dark",
    ],
    specimen: {
      kind: "reading",
      url: "notes.example/on-clay",
      eyebrow: "field notes",
      title: "on working with clay",
      byline: {
        name: "helmi rantanen",
        initials: "hr",
        meta: "14 march · six minutes",
      },
      lead: "everything worth making out of this material is made twice: once while it is soft enough to argue with, and once in the kiln, where it stops answering.",
      paragraphs: [
        "the material asks for patience before it gives you anything back. you wedge it, you centre it, and only then does it agree to hold a shape. most of the craft is in the waiting.",
        "a fired pot is not the clay improved. it is the clay committed: every decision you pressed into it while it was soft, kept for a thousand years.",
        "which is why the good potters go slowly at the start and quickly at the end. the shape is decided long before the wheel stops, and after that you are only tidying.",
      ],
      quote: "the surface should disappear, and the writing should not.",
      attribution: "notes on the quiet register",
      tags: ["material", "process", "slow work"],
    },
    specimenCaption:
      "a reading page assembled from the catalog: Avatar, Badge, Chip, Pullquote, the type scale and a measure that stays under seventy characters.",
  },
};
