import type { Metadata } from "next";
import { ChapterHeading as Heading } from "@/components/chapter-heading";
import { ChapterShell } from "@/components/design-language/chapter-shell";
import { RailoAnatomy } from "@/components/design-language/railo-anatomy";
import { RailoClearspace } from "@/components/design-language/railo-clearspace";
import { RailoCuts } from "@/components/design-language/railo-cuts";
import { RailoRefusals } from "@/components/design-language/railo-refusals";
import { WordmarkClearspace } from "@/components/design-language/wordmark-clearspace";
import { WordmarkRefusals } from "@/components/design-language/wordmark-refusals";
import { Railo } from "@/components/railo";
import { Wordmark } from "@/components/wordmark";
import { THEMES } from "@/lib/catalog";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/design-language/identity", {
  title: "Identity · Design language",
  description:
    "usva. and railo: the wordmark, the mark that stands in for it, and the rule for which one gets to appear.",
});

const PERIOD_NOTE: Record<string, string> = {
  kajo: "it glows like the last light left on the water.",
  sisu: "it works, quiet and legible, doing its one job.",
  savi: "it is fired into the clay, darker so it holds on light.",
};

const PLACES = [
  {
    mark: "usva.",
    rule: "wherever it fits",
    places: [
      "the nav, from md up",
      "headers, footers, signatures",
      "anywhere there is a line to sit on",
    ],
  },
  {
    mark: "railo",
    rule: "only where it will not",
    places: [
      "the nav, below md",
      "a browser tab, an app icon, an avatar",
      "anything square, or under 24px",
    ],
  },
  {
    mark: "usva. + railo",
    rule: "only off our own surfaces",
    places: [
      "marketing, launch art, slides",
      "merch, stickers, booths",
      "anywhere the name is still new",
    ],
  },
];

export default function IdentityChapter() {
  return (
    <ChapterShell
      slug="identity"
      shapedBy={["personal-website"]}
      lede={
        <>
          two marks, and one of them almost always wins. usva. is four letters
          and a period, and the period is the load-bearing part: it is{" "}
          <code className="font-mono text-base text-ink">accent-alt</code> made
          visible, the paired second voice. railo is what appears when those
          four letters have nowhere to go.
        </>
      }
    >
      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>which mark, when</Heading>
          <p className="text-muted text-sm">
            railo is a stand-in, not a companion. the two are not set side by
            side in usva's own chrome, where the name is already on the page. in
            marketing they go together: on a surface that has never met us, the
            name is the thing nobody remembers and the mark is what carries it
            back.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PLACES.map(({ mark, rule, places }) => (
            <div
              key={mark}
              className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6"
            >
              <div className="grid h-20 place-items-center rounded-md bg-sunken">
                {mark === "usva." && <Wordmark className="text-4xl text-ink" />}
                {mark === "railo" && <Railo className="size-12" />}
                {mark === "usva. + railo" && (
                  <span className="flex items-center gap-3">
                    <Railo className="size-9" />
                    <Wordmark className="text-3xl text-ink" />
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-ink">{mark}</span>
                <span className="text-muted text-sm">{rule}</span>
              </div>
              <ul className="flex flex-col gap-1.5 border-border border-t pt-4 text-muted text-sm">
                {places.map((place) => (
                  <li key={place}>{place}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>one wordmark, three registers</Heading>
          <p className="text-muted text-sm">
            the same four letters, rendered once per theme scope. watch{" "}
            <code className="font-mono text-ink text-xs">accent-alt</code>{" "}
            change meaning under the period without the letters moving at all.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {THEMES.map((theme) => (
            <div
              key={theme}
              data-theme={theme}
              className="flex flex-col gap-4 rounded-lg border p-6"
              style={{
                background: "var(--usva-bg)",
                borderColor: "var(--usva-border)",
              }}
            >
              <span
                className="font-extrabold text-4xl tracking-tight"
                style={{ color: "var(--usva-ink)" }}
              >
                usva
                <span style={{ color: "var(--usva-accent-alt)" }}>.</span>
              </span>
              <span className="flex flex-col gap-1">
                <span
                  className="font-mono text-[0.65rem] uppercase tracking-widest"
                  style={{ color: "var(--usva-muted)" }}
                >
                  {theme}
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--usva-muted)" }}
                >
                  {PERIOD_NOTE[theme]}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>wordmark clearspace</Heading>
          <p className="text-muted text-sm">
            keep room equal to the height of the{" "}
            <span className="font-semibold text-ink">u</span> on every side. the
            mist needs air; nothing crowds the mark.
          </p>
        </div>
        <WordmarkClearspace />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>four ways to get the wordmark wrong</Heading>
          <p className="text-muted text-sm">
            hover each one. the mark refuses the change the same way the rest of
            the system does.
          </p>
        </div>
        <WordmarkRefusals />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>railo, and how it is made</Heading>
          <p className="text-muted text-sm">
            two fields arrive from opposite sides. where they meet, the overlap
            is taken out of both, and the lens left in the gap is the mark.
            nothing is drawn: railo is what the two fields do not share.
          </p>
        </div>
        <RailoAnatomy />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>two cuts</Heading>
          <p className="text-muted text-sm">
            one construction, drawn twice. the small cut is not the large one
            scaled down: the fields move apart until the crescents and the gap
            carry the same weight, because at 16px whichever is thinner
            disappears first.
          </p>
        </div>
        <RailoCuts />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>railo clearspace</Heading>
          <p className="text-muted text-sm">
            the mark sets its own margin. the left field is{" "}
            <code className="font-mono text-ink text-xs">accent</code>, the
            right is{" "}
            <code className="font-mono text-ink text-xs">accent-alt</code>, in
            that order, and the gap between them takes whatever is behind it.
          </p>
        </div>
        <RailoClearspace />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>five ways to get railo wrong</Heading>
          <p className="text-muted text-sm">
            most of these look like small adjustments. each one takes out the
            subtraction, which is the only thing holding the mark together.
          </p>
        </div>
        <RailoRefusals />
      </section>
    </ChapterShell>
  );
}
