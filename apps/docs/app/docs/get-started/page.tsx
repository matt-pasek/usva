import { Reveal } from "@usva-ui/react/motion/reveal";
import { Card } from "@usva-ui/react/primitives/card";
import type { Metadata } from "next";
import Link from "next/link";
import { counts } from "@/lib/catalog";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/docs/get-started", {
  title: "Get started",
  description:
    "usva. is a React design language with a component library attached. What it is, how it ships as an npm package and a shadcn registry, and where to start.",
});

const next = [
  {
    href: "/docs/get-started/installation",
    title: "installation",
    body: "two ways in, and you pick per component rather than once for the project. about five minutes to a button on your own screen.",
    lead: true,
  },
  {
    href: "/docs/get-started/theming",
    title: "theming",
    body: "retheme the whole thing by moving role tokens. you do not fork a component to change a colour.",
  },
  {
    href: "/docs/get-started/for-agents",
    title: "for agents",
    body: "what a coding agent gets: an installable skill file, and llms.txt as the whole library in plain text.",
  },
];

export default function GetStartedPage() {
  return (
    <main className="@container flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          get started
        </span>
        <h1 className="font-extrabold text-[clamp(2rem,5cqi,3rem)] text-ink leading-[1.04] tracking-[-0.03em]">
          beauty that stays usable
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          usva. is a React design language with a component library attached,
          not the other way round. {counts.primitives} primitives and{" "}
          {counts.patterns} patterns that recede and structure, {counts.sula}{" "}
          sula components that assert, {counts.atmospheres} atmospheres that are
          the room, and {counts.themes} themes that run all of it at three
          different energies.
        </p>
      </header>

      <section className="flex max-w-2xl flex-col gap-2">
        <h2 className="font-bold text-ink text-xl tracking-tight">
          the one rule
        </h2>
        <p className="text-muted text-sm">
          intensity is a property of the layer, not of your taste. core recedes.
          patterns structure. sula asserts, and only one sula element belongs in
          any one region. an atmosphere is not a component you place, it is the
          room the rest of it stands in. everything else in this documentation
          is a consequence of that.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {next.map((item, index) => (
          <Reveal
            key={item.href}
            force
            delay={index * 0.08}
            className={item.lead ? "sm:col-span-2" : undefined}
          >
            <Link
              href={item.href}
              className="group block h-full rounded-2xl outline-none focus-visible:ring-focus"
            >
              <Card
                interactive
                highlight={item.lead ? "edge" : "none"}
                className="flex h-full flex-col gap-2 p-5"
              >
                <span className="flex items-baseline gap-2">
                  <span className="font-mono text-muted text-xs tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-semibold text-ink transition-colors duration-base ease-soft group-hover:text-accent">
                    {item.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="ml-auto text-muted transition-[transform,color] duration-base ease-soft group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transform-none"
                  >
                    →
                  </span>
                </span>
                <span className="text-pretty text-muted text-sm">
                  {item.body}
                </span>
              </Card>
            </Link>
          </Reveal>
        ))}
      </section>
    </main>
  );
}
