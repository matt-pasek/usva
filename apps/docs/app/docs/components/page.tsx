import type { Metadata } from "next";
import Link from "next/link";
import {
  byLayer,
  counts,
  INTENSITY_BY_LAYER,
  LAYER_LABEL,
  type Layer,
  subExportsOf,
} from "@/lib/catalog";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/docs/components", {
  title: "Components",
  description:
    "Every usva component, grouped by the layer it belongs to and the intensity that layer is allowed to carry.",
});

const ORDER: Layer[] = ["primitive", "pattern", "motion", "sula", "atmosphere"];

function Entry({ slug, name }: { slug: string; name: string }) {
  return (
    <Link
      href={`/docs/components/${slug}`}
      className="group flex flex-col gap-0.5 rounded-lg border border-border bg-surface px-3 py-2 outline-none transition-colors duration-fast ease-soft hover:border-accent focus-visible:ring-focus"
    >
      <span className="text-sm text-ink transition-colors duration-fast ease-soft group-hover:text-accent">
        {slug}
      </span>
      <span className="font-mono text-[0.6rem] text-muted">{name}</span>
    </Link>
  );
}

export default function ComponentsIndex() {
  return (
    <main className="@container flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          the index
        </span>
        <h1 className="font-extrabold text-[clamp(2rem,5cqi,3rem)] text-ink leading-[1.04] tracking-[-0.03em]">
          {counts.total} components
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          grouped by layer, because the layer decides how loud a thing is
          allowed to be. {counts.primitives} primitives and {counts.patterns}{" "}
          patterns that recede and structure, {counts.sula} sula that assert,
          and {counts.atmospheres} atmospheres that are the room.
        </p>
      </header>

      <a
        href="https://storybook.usva.build"
        className="group flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-border-strong bg-surface p-5 outline-none transition-colors duration-base ease-soft hover:border-accent focus-visible:ring-focus"
      >
        <span className="font-semibold text-ink transition-colors duration-base ease-soft group-hover:text-accent">
          every state, on its own
        </span>
        <span className="text-muted text-sm">
          storybook has the variants, the edge cases and the ones a demo never
          shows.
        </span>
        <span className="ml-auto shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors duration-base ease-soft group-hover:text-accent">
          storybook.usva.build <span aria-hidden="true">↗</span>
        </span>
      </a>

      {ORDER.map((layer) => {
        const entries = byLayer(layer);
        return (
          <section key={layer} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                {LAYER_LABEL[layer]}
              </span>
              <span className="font-mono text-[0.65rem] text-muted tabular-nums">
                {entries.length}
              </span>
              <span className="hairline-accent h-px flex-1" />
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent/70">
                {INTENSITY_BY_LAYER[layer]}
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))]">
              {entries.flatMap((entry) => [
                <Entry key={entry.slug} slug={entry.slug} name={entry.name} />,
                ...subExportsOf(entry.slug).map((sub) => (
                  <Entry key={sub.slug} slug={sub.slug} name={sub.name} />
                )),
              ])}
            </div>
          </section>
        );
      })}
    </main>
  );
}
