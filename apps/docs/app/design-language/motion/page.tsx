import type { Metadata } from "next";
import { ChapterHeading as Heading } from "@/components/chapter-heading";
import { ChapterShell } from "@/components/design-language/chapter-shell";
import { MotionRegisters } from "@/components/design-language/motion-registers";
import { MotionTiers } from "@/components/design-language/motion-tiers";
import { lexeme } from "@/lib/lexicon";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/design-language/motion", {
  title: "Motion · Design language",
  description:
    "Two registers. A landing page is scrubbed, so a line climbs out of its own edge on scroll and climbs back in; an app is triggered, because there is work to do.",
});

export default function MotionChapter() {
  const word = lexeme("tiivistymä");

  return (
    <ChapterShell
      slug="motion"
      shapedBy={["personal-website", "sisu-plus"]}
      lede={
        <>
          motion has two registers, and what the screen is for picks between
          them. the test is what scroll means there: if scroll is how the
          content is consumed, scroll is the clock and you scrub. if it is only
          how someone reaches the next control, motion gets its own clock and
          you trigger.
        </>
      }
    >
      <MotionRegisters />

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-3">
          <Heading>scrubbed, for a page you scroll</Heading>
          <p className="text-muted text-sm">
            nothing fires on viewport entry. a line climbs out from behind its
            own edge as a continuous function of how far you have scrolled, so
            scrolling back climbs it in again. this is the landing-page
            register, and the front of this site runs on it.
          </p>
          <p className="text-muted text-sm">
            it is written with the page rather than imported. each scrubbed page
            owns its own scenes, because the ranges are cut against that
            page&apos;s layout and nobody else&apos;s.
          </p>
          <p className="text-muted text-sm">
            the one exception is the hero. it gets a single timed entrance
            because at the top of the page there is no scroll yet to author
            with. one gesture per page, and only there.
          </p>
        </div>

        <p className="max-w-2xl text-ink text-xl">
          <strong className="font-semibold">{word?.word}</strong>{" "}
          <span className="text-base text-muted">{word?.ipa}</span>{" "}
          <span className="text-muted">({word?.sense})</span>. {word?.reading}
        </p>
        <p className="max-w-2xl border-border border-l-2 pl-4 text-muted">
          {word?.psychology}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-3">
          <Heading>triggered, for a screen you work in</Heading>
          <p className="text-muted text-sm">
            inside an app nobody is reading an argument, they are going
            somewhere. content arrives once and settles. tying that to scroll
            would mean a row that undoes itself every time somebody scrolls up
            to check a number, which is motion getting in the way of the work.
          </p>
          <p className="text-muted text-sm">
            this is the register{" "}
            <code className="font-mono text-ink">Reveal</code> and{" "}
            <code className="font-mono text-ink">PageTransition</code> are
            written for: one entrance, on view or on route change, then done.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-3">
          <Heading>when motion is off</Heading>
          <p className="text-muted text-sm">
            a reduced-motion preference collapses both registers. scrubbed lines
            sit where they land, triggered content just arrives, and the
            duration tiers read as zero. nothing the page says lives in the
            motion.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-3">
          <Heading>how long</Heading>
          <p className="text-muted text-sm">
            scrubbed motion has no duration. scroll is its clock. everything
            that runs on its own clock, the triggered register and the
            hero&apos;s one gesture, reads the theme&apos;s: four duration tiers
            and three easings, the same names everywhere, set to different
            values.
          </p>
          <p className="text-muted text-sm">
            a component asks for{" "}
            <code className="font-mono text-ink">duration-slow</code> and gets
            kajo&apos;s long spring or sisu&apos;s short damped one, without
            knowing the difference.
          </p>
        </div>
        <MotionTiers />
      </section>
    </ChapterShell>
  );
}
