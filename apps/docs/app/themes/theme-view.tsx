import type { ThemeId } from "@/components/theme-provider";
import { OtherRegisters } from "@/components/themes/other-registers";
import { ThemeGround } from "@/components/themes/theme-ground";
import { ThemeHero } from "@/components/themes/theme-hero";
import { ThemeSpecimen } from "@/components/themes/theme-specimen";
import { ThemeTiming } from "@/components/themes/theme-timing";
import { DEFAULT_THEME } from "@/lib/catalog";
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

      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12 sm:px-10 sm:py-16">
        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-sm uppercase tracking-widest text-muted">
            the word
          </h2>
          <p className="max-w-2xl text-xl text-ink">
            <strong className="font-semibold">{word?.word}</strong>{" "}
            <span className="text-base text-muted">{word?.ipa}</span>{" "}
            <span className="text-muted">({word?.sense})</span>. {word?.reading}
          </p>
          <p className="max-w-2xl border-border border-l-2 pl-4 text-muted">
            {word?.psychology}
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

        <section className="flex flex-col gap-6">
          <div className="grid gap-10 sm:grid-cols-2">
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
          </div>

          <p className="max-w-2xl text-muted text-sm">
            you are standing in {doc.id} right now
            {doc.id === DEFAULT_THEME
              ? ", and this site is the thing it was built for. that is the easy case. the other two carry all of it without being built for any of it, which is the harder proof."
              : ", and every page on this site renders in it, this one included. that is range, not a recommendation. it carries all of this without being built for any of it, and what it is built for is the other list."}
          </p>
        </section>

        <OtherRegisters current={theme} />
      </div>
    </main>
  );
}
