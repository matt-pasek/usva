import type { Metadata } from "next";
import Link from "next/link";
import { ColorRoles } from "@/components/language/color-roles";
import { IntensityDial } from "@/components/language/intensity-dial";
import { MotionTiers } from "@/components/language/motion-tiers";
import { TypeScale } from "@/components/language/type-scale";
import { buildTokenReference } from "@/lib/token-reference";

export const metadata: Metadata = {
  title: "Design language",
  description:
    "The rules behind usva.: one type family, the role tokens, three motion registers, and a dial that shows exactly how much attention a screen is allowed to ask for.",
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

export default function DesignLanguagePage() {
  const { color } = buildTokenReference();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-20 px-6 py-16 sm:px-10">
      <header className="@container flex max-w-2xl flex-col gap-4">
        <span className="font-mono text-muted text-xs uppercase tracking-widest">
          design language
        </span>
        <h1 className="font-extrabold text-[clamp(2.25rem,6cqi,3.5rem)] text-ink leading-[1.02] tracking-[-0.03em]">
          the rules, and why they are the rules
        </h1>
        <p className="text-muted">
          a component library tells you what exists. a design language tells you
          what to do with it, and what not to. this page is the second one. the
          last section is a dial you can drag, and it will refuse you.
        </p>
      </header>

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
          <h2 className="font-bold text-2xl text-ink tracking-tight">type</h2>
          <p className="text-muted">
            one family. Fira Sans carries the display line and the smallest
            label, and a second sans would read as indecision, not range. the
            personality comes from the weight extremes and from tracking that
            gets tighter as the type gets bigger.
          </p>
          <p className="text-muted text-sm">
            the mono is the only permitted second voice, and it has exactly one
            job: structural annotation. indices, tags, metadata, code. never
            prose. the moment a paragraph is set in mono it stops being a
            document and starts being terminal cosplay.
          </p>
        </div>
        <TypeScale />
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="font-bold text-2xl text-ink tracking-tight">color</h2>
          <p className="text-muted">
            {color.length} role tokens, and you never write a hex. you write a
            role, the theme decides what it means, and the same call site works
            in all three. two of these rules are worth saying out loud, because
            they are the two people get wrong.
          </p>
        </div>
        <ColorRoles total={color.length} />
        <Link
          href="/tokens"
          className="w-fit rounded-md font-mono text-accent text-xs underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
        >
          all {color.length} roles, side by side →
        </Link>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="font-bold text-2xl text-ink tracking-tight">motion</h2>
          <p className="text-muted">
            every theme ships the same four duration tiers and the same three
            easings, and sets them to different values. that is the whole
            mechanism. a component asks for{" "}
            <code className="font-mono text-ink text-sm">duration-slow</code>{" "}
            and gets kajo's long spring or sisu's short damped one, and never
            knows the difference.
          </p>
        </div>
        <MotionTiers />
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex max-w-2xl flex-col gap-3">
          <h2 className="font-bold text-2xl text-ink tracking-tight">
            the dial
          </h2>
          <p className="text-muted">
            one screen, four stops. the skeleton is identical at every stop:
            same header, same three stats, same toolbar, in the same places. all
            that changes is how much energy is layered on top, and therefore how
            much of your attention the screen is asking for.
          </p>
          <p className="text-muted text-sm">
            drag it, click a stop, or focus the rail and use the arrow keys.
            then try to add a second sula element, and read what happens.
          </p>
        </div>
        <IntensityDial />

        <div className="flex max-w-2xl flex-col gap-2 rounded-lg border border-border bg-surface p-5">
          <h3 className="font-semibold text-ink text-sm">
            the rule, stated once, in case you skipped the dial
          </h3>
          <p className="text-muted text-sm">
            one sula element per region. a region is a bounded area competing
            for a single focus: not a page, not a component. two liquid fields
            in the same region cancel each other out. two in different regions,
            one ambient at the boundary and one focal at the top, do not, and
            that pairing ships on my own site. the interesting part of a rule is
            always its edge.
          </p>
        </div>
      </section>
    </main>
  );
}
