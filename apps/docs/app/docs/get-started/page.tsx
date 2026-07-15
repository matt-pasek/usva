import type { Metadata } from "next";
import Link from "next/link";
import { counts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Get started",
  description: "What usva. is, how it is distributed, and where to go next.",
};

const next = [
  {
    href: "/docs/get-started/installation",
    title: "installation",
    body: "the fork: install it as a package, or copy the source in. both are supported, per component.",
  },
  {
    href: "/docs/get-started/theming",
    title: "theming",
    body: "retheme the whole thing by moving role tokens. you do not fork a component to change a colour.",
  },
  {
    href: "/docs/get-started/for-agents",
    title: "for agents",
    body: "what a coding agent gets: a skill file and llms.txt. no MCP server, and here is why.",
  },
  {
    href: "/docs/get-started/index",
    title: "index",
    body: `every one of the ${counts.total} components, in one flat list.`,
  },
];

export default function GetStartedPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16 sm:px-10">
      <header className="flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          get started
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          beauty that stays usable
        </h1>
        <p className="text-lg text-muted">
          usva. is a React design language with a component library attached,
          not the other way round. {counts.primitives} primitives and{" "}
          {counts.patterns} patterns that recede and structure, {counts.sula}{" "}
          sula components that assert, {counts.atmospheres} atmospheres that are
          the room, and {counts.themes} themes that run all of it at three
          different energies.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-mono uppercase tracking-widest text-muted">
          the one rule
        </h2>
        <p className="text-muted">
          intensity is a property of the layer, not of your taste. core recedes.
          patterns structure. sula asserts, and only one sula element belongs in
          any one region. an atmosphere is not a component you place, it is the
          room the rest of it stands in. everything else in this documentation
          is a consequence of that.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {next.map((item) => (
          <Link
            key={item.href}
            className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong"
            href={item.href}
          >
            <span className="font-mono text-sm text-ink">
              {item.title}{" "}
              <span aria-hidden="true" className="text-accent">
                →
              </span>
            </span>
            <span className="text-sm text-muted">{item.body}</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
