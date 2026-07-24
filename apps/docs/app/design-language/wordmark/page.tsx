import type { Metadata } from "next";
import { ChapterHeading as Heading } from "@/components/chapter-heading";
import { ChapterShell } from "@/components/design-language/chapter-shell";
import { WordmarkClearspace } from "@/components/design-language/wordmark-clearspace";
import { WordmarkRefusals } from "@/components/design-language/wordmark-refusals";
import { THEMES } from "@/lib/catalog";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/design-language/wordmark", {
  title: "Wordmark · Design language",
  description:
    "usva. The period is load-bearing: accent-alt made visible, the paired second voice. One specimen in all three themes, and the four ways to get it wrong.",
});

const PERIOD_NOTE: Record<string, string> = {
  kajo: "it glows like the last light left on the water.",
  sisu: "it works, quiet and legible, doing its one job.",
  savi: "it is fired into the clay, darker so it holds on light.",
};

export default function WordmarkChapter() {
  return (
    <ChapterShell
      slug="wordmark"
      shapedBy={["personal-website"]}
      lede={
        <>
          usva. four letters and a period, and the period is the load-bearing
          part. it is{" "}
          <code className="font-mono text-base text-ink">accent-alt</code> made
          visible: the paired second voice, the one that answers. the same mark
          reads differently in each theme.
        </>
      }
    >
      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>one mark, three registers</Heading>
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
          <Heading>clearspace</Heading>
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
          <Heading>four ways to get it wrong</Heading>
          <p className="text-muted text-sm">
            hover each one. the mark refuses the change the same way the rest of
            the system does.
          </p>
        </div>
        <WordmarkRefusals />
      </section>
    </ChapterShell>
  );
}
