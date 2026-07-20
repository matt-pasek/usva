import type { Metadata } from "next";
import { ChapterShell } from "@/components/design-language/chapter-shell";
import { ContrastMatrix } from "@/components/design-language/contrast-matrix";

export const metadata: Metadata = {
  title: "Accessibility · Design language",
  description:
    "The floor, not the ceiling. Every contrast ratio here is computed live from the shipping tokens, so the page cannot claim a number the components do not actually hit.",
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-bold text-ink text-xl tracking-tight">{children}</h2>
  );
}

const COVENANTS = [
  {
    title: "the text tier rule",
    body: "ink and muted are the only roles a fact may be written in, because they are the only two that clear AA on every surface. faint is decorative and never the sole carrier of anything.",
  },
  {
    title: "the ring stays",
    body: "the focus ring is never removed, only restyled. every interactive thing shows where the keyboard is, and it shows it in the theme's own accent, not a browser default.",
  },
  {
    title: "motion asks first",
    body: "every reveal, every atmosphere, every sula field checks prefers-reduced-motion and holds still when asked. the still frame is composed on purpose, not a broken version of the moving one.",
  },
];

export default function AccessibilityChapter() {
  return (
    <ChapterShell
      slug="accessibility"
      shapedBy={["personal-website", "sisu-plus"]}
      lede={
        <>
          beauty that stays usable is not a slogan, it is a constraint. the
          floor is AA, and it is checked by a machine rather than a promise.
        </>
      }
    >
      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>the contrast matrix</Heading>
          <p className="text-muted text-sm">
            every text tier against every surface, in each theme. if a
            pairing ever failed, this table would be the first to say so.
          </p>
        </div>
        <ContrastMatrix />
      </section>

      <section className="flex flex-col gap-4">
        <Heading>three covenants</Heading>
        <div className="grid gap-3 sm:grid-cols-3">
          {COVENANTS.map((covenant) => (
            <article
              key={covenant.title}
              className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-5"
            >
              <h3 className="font-semibold text-ink text-sm">
                {covenant.title}
              </h3>
              <p className="text-muted text-sm">{covenant.body}</p>
            </article>
          ))}
        </div>
      </section>
    </ChapterShell>
  );
}
