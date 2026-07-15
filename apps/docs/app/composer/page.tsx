import type { Metadata } from "next";
import Link from "next/link";
import { counts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Composer",
  description:
    "A drag-and-drop canvas for composing layouts out of usva components. Not built yet.",
};

const planned = [
  "drag a component out of the catalog and drop it on a canvas",
  "the canvas is a real page in a real theme, not a wireframe",
  "the composition rules are enforced while you compose: drop a second sula element into one region and it refuses",
  "export what you built as JSX you can paste, or as a registry command",
];

export default function ComposerPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-24 sm:px-10">
      <header className="flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          composer · not built
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          this page does not exist yet
        </h1>
        <p className="text-lg text-muted">
          the composer is planned, not shipped. i would rather tell you that
          than show you a mock of it that does nothing when you click it.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted">
          what it will be
        </h2>
        <p className="text-muted">
          a live drag-and-drop canvas for composing a layout out of the{" "}
          {counts.total} components in this library. the point is not another
          page builder. the point is that the design system already knows its
          own composition rules, and a canvas can enforce them while you work
          instead of writing them down in a paragraph nobody reads.
        </p>
        <ul className="flex flex-col gap-2 text-muted">
          {planned.map((item) => (
            <li key={item}>
              <span aria-hidden="true" className="text-accent">
                →{" "}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-ink">until then</h2>
        <p className="text-sm text-muted">
          the component pages each carry a live demo, the props, and the source.
          start at{" "}
          <Link
            className="text-accent underline"
            href="/docs/get-started/index"
          >
            the index
          </Link>{" "}
          and compose by hand.
        </p>
      </section>
    </main>
  );
}
