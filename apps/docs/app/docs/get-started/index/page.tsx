import type { Metadata } from "next";
import Link from "next/link";
import {
  byLayer,
  counts,
  INTENSITY_BY_LAYER,
  LAYER_LABEL,
  type Layer,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Index",
  description:
    "Every component in usva., in one flat list, with its layer and its intensity.",
};

const LAYERS: Layer[] = ["primitive", "pattern", "sula", "atmosphere"];

const LAYER_NOTE: Record<Layer, string> = {
  primitive: "the bulk. these are meant to disappear into the work.",
  pattern: "compositions that give a screen its shape.",
  sula: "the fluid ones. one per region, at most. never in dense UI.",
  atmosphere:
    "these are backgrounds, not siblings of Button. you reach them from the atmosphere you are standing in.",
};

export default function IndexPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16 sm:px-10">
      <header className="flex max-w-2xl flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          get started · index
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          all {counts.total} of them
        </h1>
        <p className="text-muted">
          the whole library, flat. intensity belongs to the layer, not to the
          item, so it is on the group and not on the row.
        </p>
      </header>

      {LAYERS.map((layer) => {
        const entries = byLayer(layer);
        return (
          <section key={layer} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 border-b border-border pb-3">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="font-mono text-sm uppercase tracking-widest text-ink">
                  {LAYER_LABEL[layer]}
                </h2>
                <span className="rounded-sm bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted">
                  {INTENSITY_BY_LAYER[layer]}
                </span>
                <span className="font-mono text-xs text-muted">
                  {entries.length}
                </span>
              </div>
              <p className="text-sm text-muted">{LAYER_NOTE[layer]}</p>
            </div>

            <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {entries.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    className="group flex flex-col gap-0.5"
                    href={`/docs/components/${entry.slug}`}
                  >
                    <span className="font-mono text-sm text-ink group-hover:text-accent">
                      {entry.slug}
                    </span>
                    <span className="text-sm text-muted">{entry.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
