import type { Metadata } from "next";
import Link from "next/link";
import { DesignLanguageHero } from "@/components/design-language/dl-hero";
import { INTENSITY_BY_LAYER, LAYER_LABEL, type Layer } from "@/lib/catalog";
import { DL_CHAPTERS, dlHref } from "@/lib/design-language";

export const metadata: Metadata = {
  title: "Design language",
  description:
    "The rules behind usva.: one grammar spoken in three registers, the role tokens, the type, the motion, and a dial that shows exactly how much attention a screen is allowed to ask for.",
};

const PRINCIPLES = [
  {
    title: "authored, not assembled",
    body: "this is not a bag of components someone scraped together. it has a point of view, and the point of view is what you are taking on. if a choice here annoys you, it was still a choice.",
  },
  {
    title: "one grammar, three registers",
    body: "kajo is loud, sisu is working, savi is quiet. they are not three design systems. they are one vocabulary spoken at three volumes, and every component speaks all three without knowing which one it is in.",
  },
  {
    title: "reusable before impressive",
    body: "a thing that only works in the demo is not a component, it is a screenshot. if it cannot survive a long label, a narrow column and a screen reader, it does not ship, however good it looked in the tweet.",
  },
  {
    title: "coherence beats proliferation",
    body: "I would rather have fifteen components you can predict than ninety you have to check. every new one has to earn its place against the ones already here, and most candidates lose.",
  },
];

const LADDER: { layer: Layer; blurb: string }[] = [
  {
    layer: "primitive",
    blurb: "the button, the input, the badge. they do the least, on purpose.",
  },
  {
    layer: "pattern",
    blurb: "cards, headers, lists. they organise what the primitives hold.",
  },
  {
    layer: "motion",
    blurb: "reveals and transitions. they lead the eye; they do not perform.",
  },
  {
    layer: "sula",
    blurb: "the fluid material. it takes the focus, and only one per region.",
  },
  {
    layer: "atmosphere",
    blurb: "the environment behind everything. the room, not an object.",
  },
];

export default function DesignLanguageHub() {
  return (
    <main className="@container flex flex-col gap-10">
      <DesignLanguageHero />

      <section className="flex flex-col gap-6">
        <h2 className="font-bold text-2xl text-ink tracking-tight">
          principles
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((principle) => (
            <article
              key={principle.title}
              className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-5"
            >
              <h3 className="font-semibold text-ink">{principle.title}</h3>
              <p className="text-muted text-sm">{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="font-bold text-2xl text-ink tracking-tight">
            the five degrees
          </h2>
          <p className="text-muted">
            everything usva ships sits at one of five volumes, from the
            primitive that recedes to the atmosphere that is the whole room. a
            screen is tuned by choosing how high up this ladder it is allowed to
            climb. that choice has a page of its own.
          </p>
        </div>
        <Link
          href={dlHref("intensity")}
          className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface transition-colors duration-150 ease-soft hover:border-border-strong"
        >
          {LADDER.map(({ layer, blurb }, index) => (
            <div key={layer} className="flex items-center gap-4 p-4">
              <span className="font-mono text-sm text-faint tabular-nums">
                {index + 1}
              </span>
              <span className="w-28 shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent/80">
                {INTENSITY_BY_LAYER[layer]}
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-sm font-semibold text-ink">
                  {LAYER_LABEL[layer]}
                </span>
                <span className="text-sm text-muted">{blurb}</span>
              </span>
            </div>
          ))}
        </Link>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-bold text-2xl text-ink tracking-tight">
          the chapters
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {DL_CHAPTERS.map((chapter) => (
            <Link
              key={chapter.slug}
              href={dlHref(chapter.slug)}
              className="group flex flex-col gap-2 rounded-lg border border-border bg-surface p-5 transition-colors duration-150 ease-soft hover:border-border-strong"
            >
              <span className="flex items-baseline gap-2">
                <span className="font-mono text-xs text-faint tabular-nums">
                  {chapter.number}
                </span>
                <span className="font-semibold text-ink group-hover:text-accent">
                  {chapter.title}
                </span>
              </span>
              <span className="text-sm text-muted">{chapter.blurb}</span>
            </Link>
          ))}
          <Link
            href="/themes"
            className="group flex flex-col gap-2 rounded-lg border border-border bg-surface p-5 transition-colors duration-150 ease-soft hover:border-border-strong"
          >
            <span className="flex items-baseline gap-2">
              <span className="font-mono text-xs text-faint tabular-nums">
                ↗
              </span>
              <span className="font-semibold text-ink group-hover:text-accent">
                themes
              </span>
            </span>
            <span className="text-sm text-muted">
              kajo, sisu, savi. the three registers, each on its own page.
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
