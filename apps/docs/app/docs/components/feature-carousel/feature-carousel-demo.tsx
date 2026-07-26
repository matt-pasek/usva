"use client";
import type { FeatureCard } from "@matt-pasek/usva/patterns/feature-carousel";
import { FeatureCarousel } from "@matt-pasek/usva/patterns/feature-carousel";
import { Playground } from "@/components/docs/playground";

const SETS = ["product", "three", "single"] as const;

const CARD_SETS: Record<(typeof SETS)[number], FeatureCard[]> = {
  product: [
    {
      title: "Owns your data",
      body: "Everything stays local, nothing phones home.",
    },
    {
      title: "Reads at a glance",
      body: "Dense dashboards that still breathe.",
    },
    {
      title: "Yours to fork",
      body: "Copy the source in, or install the package.",
    },
    {
      title: "Fast by default",
      body: "The 20ms most people skip, and everyone feels.",
    },
  ],
  three: [
    { title: "Owns your data", body: "Everything stays local." },
    { title: "Reads at a glance", body: "Dense, but it breathes." },
    { title: "Yours to fork", body: "Copy the source, or install it." },
  ],
  single: [
    {
      title: "one feature, held still",
      body: "a lone card renders static, no rail, no timer.",
    },
  ],
};

type Config = {
  set: (typeof SETS)[number];
  autoAdvanceMs: number;
};

const base: Config = {
  set: "product",
  autoAdvanceMs: 4600,
};

const templates: Record<string, Config> = {
  product: { ...base },
  brisk: { ...base, set: "three", autoAdvanceMs: 2400 },
  slow: { ...base, autoAdvanceMs: 7000 },
  "single card": { ...base, set: "single" },
};

const stringifyCards = (cards: FeatureCard[]): string =>
  cards
    .map(
      (c) =>
        `    { title: ${JSON.stringify(c.title)}, body: ${JSON.stringify(c.body)} },`,
    )
    .join("\n");

const snippetFor = (c: Config): string => {
  const cards = CARD_SETS[c.set];
  const attr =
    c.autoAdvanceMs !== 4600 ? `\n  autoAdvanceMs={${c.autoAdvanceMs}}` : "";
  return `import { FeatureCarousel } from "@matt-pasek/usva/patterns/feature-carousel";

<FeatureCarousel${attr}
  cards={[
${stringifyCards(cards)}
  ]}
/>`;
};

export function FeatureCarouselDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="mx-auto w-full max-w-xl"
      fields={[
        {
          kind: "select",
          key: "set",
          label: "cards",
          sub: "the feature set on show",
          options: SETS,
        },
        {
          kind: "slider",
          key: "autoAdvanceMs",
          label: "autoAdvanceMs",
          sub: "hold per card before the next",
          min: 1500,
          max: 8000,
          step: 100,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <FeatureCarousel
          key={`${c.set}-${c.autoAdvanceMs}`}
          className="w-full"
          cards={CARD_SETS[c.set]}
          autoAdvanceMs={c.autoAdvanceMs}
        />
      )}
    />
  );
}
