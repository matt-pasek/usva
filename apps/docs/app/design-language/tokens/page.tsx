import type { Metadata } from "next";
import Link from "next/link";
import { ChapterShell } from "@/components/design-language/chapter-shell";
import { TokenDownloads } from "@/components/design-language/token-downloads";
import { TokenReference } from "@/components/design-language/token-reference";

export const metadata: Metadata = {
  title: "Tokens · Design language",
  description:
    "The reference and the exports. Every non-colour token in one place, plus the DTCG and Tokens Studio files, generated from the tokens package so they cannot drift.",
};

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-bold text-ink text-xl tracking-tight">{children}</h2>
  );
}

export default function TokensChapter() {
  return (
    <ChapterShell
      slug="tokens"
      shapedBy={["personal-website", "sisu-plus"]}
      lede={
        <>
          the whole vocabulary in one place, and the files that carry it out of
          the codebase.
        </>
      }
    >
      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>take it with you</Heading>
          <p className="text-muted text-sm">
            the tokens leave the codebase in three shapes: the W3C standard, the
            Figma plugin format, and the package itself, which carries the CSS
            and the Tailwind preset.
          </p>
        </div>
        <TokenDownloads />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>the reference</Heading>
          <p className="text-muted text-sm">
            spacing, radius, type, and motion, every step, with its value. the
            colour roles have a page of their own, where the three themes sit
            side by side:{" "}
            <Link
              href="/design-language/color"
              className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
            >
              the colour chapter
            </Link>
            .
          </p>
        </div>
        <TokenReference />
      </section>
    </ChapterShell>
  );
}
