import { Kajastus } from "@usva-ui/react/atmospheres/kajastus";
import { Kynnos } from "@usva-ui/react/atmospheres/kynnos";
import { Loimu } from "@usva-ui/react/atmospheres/loimu";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ThemeId } from "@/components/theme-provider";
import { lexeme } from "@/lib/lexicon";
import { THEME_ORDER, type ThemeDoc } from "@/lib/themes";

const ATMOSPHERES = {
  kajo: Kajastus,
  sisu: Loimu,
  savi: Kynnos,
} as const;

export function ThemeHero({ doc, live }: { doc: ThemeDoc; live: boolean }) {
  const word = lexeme(doc.id);
  const room = lexeme(doc.atmosphere.word);
  const Atmosphere = ATMOSPHERES[doc.id as ThemeId];

  return (
    <Atmosphere className="-mt-20 sm:-mt-24 relative flex min-h-[82svh] items-end">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: "linear-gradient(to top, var(--usva-bg), transparent)",
        }}
      />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-5 px-6 pt-32 pb-10 sm:px-10 sm:pb-14">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          {live
            ? `themes · you are standing in ${doc.id}`
            : `theme 0${doc.index} of 0${THEME_ORDER.length} · ${word?.labels}`}
        </span>
        <h1 className="font-extrabold text-[clamp(3.5rem,11vw,8rem)] leading-[0.95] tracking-[-0.04em] text-ink">
          {word?.word}
          <span className="text-accent-alt">.</span>
        </h1>
        <p className="font-mono text-sm text-muted">
          {word?.ipa} · {word?.sense}
        </p>
        <p className="max-w-xl text-lg text-ink">{doc.lede}</p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-5">
          <span className="text-sm text-muted">
            the room behind this page is{" "}
            <Link
              className="text-accent underline-offset-4 hover:underline"
              href={`/docs/components/${doc.atmosphere.slug}`}
            >
              {doc.atmosphere.word}
              <ArrowUpRight
                aria-hidden="true"
                className="ml-0.5 inline size-3.5 align-[-0.1em]"
              />
            </Link>
            {room ? <> · {room.sense}</> : null}
          </span>
        </div>
      </div>
    </Atmosphere>
  );
}
