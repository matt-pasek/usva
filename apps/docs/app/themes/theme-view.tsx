import type { ThemeId } from "@/components/theme-provider";
import { OtherRegisters } from "@/components/themes/other-registers";
import { ThemeGround } from "@/components/themes/theme-ground";
import { ThemeHero } from "@/components/themes/theme-hero";
import { ThemeSpecimen } from "@/components/themes/theme-specimen";
import { ThemeTiming } from "@/components/themes/theme-timing";
import { lexeme } from "@/lib/lexicon";
import { THEME_DOCS } from "@/lib/themes";

export function ThemeView({
  theme,
  live = false,
}: {
  theme: ThemeId;
  live?: boolean;
}) {
  const doc = THEME_DOCS[theme];
  const word = lexeme(theme);

  return (
    <main>
      <ThemeHero doc={doc} live={live} />

      <div className="mx-auto flex max-w-5xl flex-col gap-20 px-6 py-16 sm:px-10 sm:py-20">
        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted">
            the word
          </h2>
          <p className="max-w-2xl text-xl text-ink">
            <strong className="font-semibold">{word?.word}</strong>{" "}
            <span className="text-base text-muted">{word?.ipa}</span>{" "}
            <span className="text-muted">({word?.sense})</span>. {word?.reading}
          </p>
          {doc.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="max-w-2xl text-muted">
              {paragraph}
            </p>
          ))}
        </section>

        <ThemeGround doc={doc} />

        <ThemeSpecimen doc={doc} />

        <ThemeTiming doc={doc} />

        <section className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col gap-4">
            <h2 className="font-mono text-sm uppercase tracking-widest text-muted">
              use it for
            </h2>
            <ul className="flex flex-col gap-2.5 text-ink">
              {doc.forThis.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-accent">
                    →
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="font-mono text-sm uppercase tracking-widest text-danger">
              not for
            </h2>
            <ul className="flex flex-col gap-2.5 text-muted">
              {doc.notThis.map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="text-danger">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <OtherRegisters current={theme} />
      </div>
    </main>
  );
}
