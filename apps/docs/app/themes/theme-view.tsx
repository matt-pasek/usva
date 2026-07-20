import { Badge, Kajastus, Kynnos, Loimu } from "@matt-pasek/usva";
import Link from "next/link";
import type { ThemeId } from "@/components/theme-provider";
import { THEMES } from "@/lib/catalog";

interface ThemeDoc {
  word: string;
  gloss: string;
  etymology: string;
  atmosphere: string;
  lede: string;
  body: string[];
  forThis: string[];
  notThis: string[];
  palette: { role: string; note: string }[];
}

export const THEME_DOCS: Record<ThemeId, ThemeDoc> = {
  kajo: {
    word: "kajo",
    gloss: "faint glow",
    etymology:
      "the light you see before the thing making it. a glow on the horizon at four in the morning, no source in sight.",
    atmosphere: "Kajastus",
    lede: "the dark one. built for a page that is trying to make an impression.",
    body: [
      "kajo is the theme the design system was extracted from: a portfolio that had to look like something, on a near-black violet ground with an aurora sitting behind it. the accents are cool and saturated and they carry a lot of weight, because there is a lot of dark for them to carry it against.",
      "its motion is the languid end of the vocabulary. long durations, a spring that overshoots a little. things arrive rather than appear. that is affordable here because nobody is filling in a form at speed.",
    ],
    forThis: [
      "marketing pages, portfolios, case studies, anything that opens with a hero",
      "surfaces where an atmosphere can run full-bleed behind the content",
      "a sula element or two, where the fluid material is the point",
    ],
    notThis: [
      "a dense table someone reads all day. the contrast is dramatic, not clinical",
      "a print-adjacent document, or anything that has to survive being screenshotted onto a white slide",
      "a first-run experience where the user needs to find one control fast",
    ],
    palette: [
      { role: "bg", note: "near black, tinted violet. never pure #000" },
      { role: "surface", note: "one step up, still dark. cards sit here" },
      { role: "accent", note: "the aurora. the primary voice" },
      { role: "accent-alt", note: "the second voice. paired, never alone" },
      { role: "ink", note: "primary text, AA on every surface role" },
      { role: "faint", note: "decorative only. it never carries meaning" },
    ],
  },
  sisu: {
    word: "sisu",
    gloss: "grit, stubborn resolve",
    etymology:
      "the untranslatable one. not courage in a moment, but the thing that keeps going after the courage runs out.",
    atmosphere: "Loimu",
    lede: "the working one. built for a dashboard somebody has open for eight hours.",
    body: [
      "sisu came out of a browser extension and its landing page: real product surface, lists and toolbars and panels and counts. the palette pulls the accents back and pushes the borders forward, because a working screen is structured by its edges, not by its colour.",
      "its motion is snappy and critically damped. short durations, no overshoot. an interface you use a hundred times a day must not perform for you on the hundredth.",
    ],
    forThis: [
      "dashboards, settings, log views, anything with a toolbar",
      "long sessions. it is tuned to be boring in the way a good tool is boring",
      "dense data, where the plain primitives do the work and nothing sparkles",
    ],
    notThis: [
      "a landing page that has to sell something in one scroll",
      "carrying a sula element inside a data region. that is exactly the prohibition",
      "showing off. it is not trying to",
    ],
    palette: [
      { role: "bg", note: "a cooler dark, less saturated than kajo" },
      { role: "surface", note: "panels and cards, clearly separated" },
      {
        role: "accent",
        note: "used sparingly, mostly on the one live control",
      },
      { role: "border", note: "load-bearing here. structure comes from edges" },
      { role: "muted", note: "secondary text and every unit, still AA" },
      { role: "danger", note: "a status colour that has to be read, not felt" },
    ],
  },
  savi: {
    word: "savi",
    gloss: "clay",
    etymology:
      "the material before it is a thing. warm, matte, worked by hand, and it holds the shape you press into it.",
    atmosphere: "Kynnös",
    lede: "the light one. built for reading, and for the times you cannot ship a dark UI.",
    body: [
      "savi is the light register, and it is not a colour inversion of kajo. it is warm and low in contrast at the surface level, with the accents doing more work because there is far less dark to lean on. a first-time visitor whose system asks for light gets this one.",
      "its motion is calm: moderate durations, no bounce. the theme is meant to feel settled rather than energetic, which is the whole reason it exists.",
    ],
    forThis: [
      "documentation, long-form reading, anything text-first",
      "an embedded surface inside a host app that is already light",
      "screenshots, decks, print. the one theme that survives leaving the browser",
    ],
    notThis: [
      "an atmosphere at full strength. kynnös was drawn for this light ground; the rest were drawn against black",
      "relying on faint. in a light theme it disappears even faster",
      "the loud hero. that is what kajo is for",
    ],
    palette: [
      { role: "bg", note: "warm off-white. not paper, not grey" },
      { role: "surface", note: "barely a step from bg. separation is by edge" },
      { role: "accent", note: "darker than kajo's, so it holds on light" },
      { role: "accent-tint", note: "the fill behind an accent, kept legible" },
      { role: "ink", note: "near black, warm" },
      {
        role: "border-strong",
        note: "does the separation that shadow does not",
      },
    ],
  },
};

const ATMOSPHERES = {
  kajo: Kajastus,
  sisu: Loimu,
  savi: Kynnos,
} as const;

export function ThemeView({ theme }: { theme: ThemeId }) {
  const doc = THEME_DOCS[theme];
  const Atmosphere = ATMOSPHERES[theme];

  return (
    <main>
      <Atmosphere className="-mt-20 sm:-mt-24 flex min-h-[70svh] items-end">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 pt-28 pb-12 sm:px-10">
          <span className="font-mono text-xs uppercase tracking-widest text-muted">
            theme · {doc.atmosphere}
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight text-ink sm:text-7xl">
            {doc.word}
            <span className="text-accent-alt">.</span>
          </h1>
          <p className="max-w-xl text-lg text-ink">{doc.lede}</p>
        </div>
      </Atmosphere>

      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16 sm:px-10">
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted">
            the word
          </h2>
          <p className="max-w-2xl text-xl text-ink">
            <strong className="font-semibold">{doc.word}</strong>{" "}
            <span className="text-muted">({doc.gloss})</span>. {doc.etymology}
          </p>
          {doc.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-2xl text-muted">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted">
            the palette
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {doc.palette.map(({ role, note }) => (
              <li key={role} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`h-9 w-9 shrink-0 rounded-md border border-border-strong bg-${role}`}
                />
                <span className="flex min-w-0 flex-col">
                  <code className="font-mono text-xs text-ink">{role}</code>
                  <span className="text-sm text-muted">{note}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted">
            every role, in all three themes, side by side:{" "}
            <Link className="text-accent underline" href="/tokens">
              /tokens
            </Link>
          </p>
        </section>

        <section className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col items-start gap-3">
            <Badge tone="accent">what it is for</Badge>
            <ul className="flex flex-col gap-2 text-muted">
              {doc.forThis.map((item) => (
                <li key={item}>
                  <span aria-hidden="true" className="text-accent">
                    →{" "}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-3">
            <Badge tone="danger">what it is not for</Badge>
            <ul className="flex flex-col gap-2 text-muted">
              {doc.notThis.map((item) => (
                <li key={item}>
                  <span aria-hidden="true" className="text-danger">
                    ·{" "}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <nav className="flex flex-wrap gap-4 border-t border-border pt-8 text-sm">
          {THEMES.filter((other) => other !== theme).map((other) => (
            <Link
              key={other}
              className="text-muted underline hover:text-ink"
              href={`/themes/${other}`}
            >
              {other} ↗
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
