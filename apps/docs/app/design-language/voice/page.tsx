import type { Metadata } from "next";
import { ChapterShell } from "@/components/design-language/chapter-shell";
import { LexiconList } from "@/components/design-language/lexicon-list";
import { VoiceRefusalInput } from "@/components/design-language/voice-refusal-input";
import { Wordmark } from "@/components/wordmark";

export const metadata: Metadata = {
  title: "Voice · Design language",
  description:
    "How usva sounds, and how it names. Lowercase, plain, second person; and a lexicon where every name is a nature word chosen so it already behaves like the thing it labels.",
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-bold text-ink text-xl tracking-tight">{children}</h2>
  );
}

const CASING: { what: string; example: React.ReactNode; render: string }[] = [
  {
    what: "display & headings",
    example: "the rules, and why they are the rules",
    render: "font-semibold text-ink",
  },
  {
    what: "body",
    example: "you never write a hex. you write a role.",
    render: "text-muted",
  },
  {
    what: "labels",
    example: "role · what it is for",
    render: "font-mono text-xs text-muted",
  },
  {
    what: "tags",
    example: "informational",
    render: "font-mono text-[0.7rem] uppercase tracking-widest text-muted",
  },
];

export default function VoiceChapter() {
  return (
    <ChapterShell
      slug="voice"
      lede={
        <>
          the system talks the way it looks: plainly, in lowercase, with nothing
          on that doesn't need to be. and it names things once, carefully, so a
          name never has to be explained twice.
        </>
      }
    >
      <section className="flex max-w-2xl flex-col gap-3">
        <Heading>how it's written</Heading>
        <p className="text-muted text-sm">
          lowercase almost everywhere, because a capital is emphasis and most
          words have not earned it. second person, present tense, because the
          docs are talking to you while you build, not narrating a product to a
          committee. I, never we, because one person made these calls and can be
          argued with. confident, not salesy: a claim, then the reason for it,
          and no adjective doing a verb's job. and no em dashes, ever; a colon
          or a full stop says the same thing without the theatrics.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>the casing law</Heading>
          <p className="text-muted text-sm">
            four registers, and the wordmark. lowercase carries everything a
            person reads; uppercase is reserved for the small mono tags that
            index a screen; the wordmark is lowercase and always keeps its
            period.
          </p>
        </div>
        <dl className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {CASING.map((row) => (
            <div
              key={row.what}
              className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-6"
            >
              <dt className="font-mono text-[0.7rem] text-muted uppercase tracking-widest">
                {row.what}
              </dt>
              <dd className={row.render}>{row.example}</dd>
            </div>
          ))}
          <div className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-6">
            <dt className="font-mono text-[0.7rem] text-muted uppercase tracking-widest">
              the wordmark
            </dt>
            <dd>
              <Wordmark className="text-lg" />
            </dd>
          </div>
        </dl>
      </section>

      <section className="flex max-w-2xl flex-col gap-3">
        <Heading>whose voice this is</Heading>
        <p className="text-muted text-sm">
          the lowercase is mine. it governs this site, the package, and anything
          that speaks as usva or as me. personal-website is the same voice all
          the way down, because it is also me.
        </p>
        <p className="text-muted text-sm">
          it does not govern what you build. an app is not a showcase of my
          voice. sisu-plus is a dashboard with its own users and it capitalises
          like any other product, and the demo content on these pages is written
          the same way, in sentence case, because it is standing in for your app
          rather than speaking for me. the short version: lowercase when usva
          speaks, sentence case when the app does.
        </p>
        <p className="text-muted text-sm">
          everything else carries over wherever you are writing. no em dashes,
          no emoji, confident rather than salesy. a landing page for a product
          can push harder than documentation does, and it still does not need an
          adjective doing a verb's job.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>the refusal</Heading>
          <p className="text-muted text-sm">
            the whole voice, in the system's own native gesture. type a line the
            way you would ship it. break one of the rules and the field does
            what the intensity dial does when you overload a region: it refuses
            you, and tells you why.
          </p>
        </div>
        <VoiceRefusalInput />
      </section>

      <section className="flex max-w-2xl flex-col gap-3">
        <Heading>what gets a name, and how</Heading>
        <p className="text-muted text-sm">
          not everything gets a name. a name is attention, and a named thing is
          asking to be looked at.
        </p>
        <p className="text-muted text-sm">
          the atmospheres are named. so is sula, the material, and kuohu, one of
          the ways that material can behave. so is the motion, each of the three
          registers, and the language itself. lumo names neither an atmosphere
          nor a tool but the act of commanding one, because casting a sky is its
          own gesture.
        </p>
        <p className="text-muted text-sm">
          a button is called a button. an input is called an input. a field is
          called a field. those are things you look through on the way to your
          own work, and a word of their own would be asking for attention they
          must never take. a name tracks intensity: nothing that recedes or
          merely structures has earned one.
        </p>
        <p className="text-muted text-sm">
          every name is a nature or temperament word, chosen so the word already
          behaves like the thing it labels. grit that keeps going after the
          courage runs out is the theme built for an eight-hour dashboard. the
          test for a new name is simple: say the word to someone who has never
          seen the thing, and they should lean the right way.
        </p>
        <p className="text-muted text-sm">
          glosses follow one form, the one you'll see below: the plain sense,
          then my reading of it. never a lecture on where the word came from.
          the meaning is the poetry; the provenance is trivia.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <Heading>the lexicon</Heading>
        <LexiconList />
      </section>
    </ChapterShell>
  );
}
