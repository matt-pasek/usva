import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import {
  type DLChapter,
  dlChapter,
  dlHref,
  dlNeighbours,
} from "@/lib/design-language";
import { breadcrumbList, techArticle } from "@/lib/schema";

function SpineLink({
  chapter,
  direction,
}: {
  chapter: DLChapter;
  direction: "prev" | "next";
}) {
  const prev = direction === "prev";
  return (
    <Link
      href={dlHref(chapter.slug)}
      className={`group flex max-w-[48%] flex-col gap-1 rounded-lg border border-border bg-surface p-4 transition-colors duration-150 ease-soft hover:border-border-strong ${
        prev ? "items-start text-left" : "ml-auto items-end text-right"
      }`}
    >
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
        {prev ? "← previous" : "next →"}
      </span>
      <span className="font-semibold text-ink group-hover:text-accent">
        {chapter.title}
      </span>
    </Link>
  );
}

export function ChapterShell({
  slug,
  lede,
  shapedBy,
  children,
}: {
  slug: string;
  lede: ReactNode;
  /** which live consumer shaped this chapter. omitted when authored. */
  shapedBy?: string[];
  children: ReactNode;
}) {
  const chapter = dlChapter(slug);
  if (!chapter) return null;
  const { prev, next } = dlNeighbours(slug);
  const path = dlHref(slug);

  return (
    <article className="@container flex flex-col gap-8">
      <JsonLd
        data={breadcrumbList([
          { name: "usva.", path: "/" },
          { name: "design language", path: "/design-language" },
          { name: chapter.title, path },
        ])}
      />
      <JsonLd
        data={techArticle({
          path,
          headline: chapter.title,
          description: chapter.blurb,
        })}
      />
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          design language · {chapter.number}
        </span>
        <h1 className="font-extrabold text-[clamp(2rem,5cqi,3rem)] text-ink leading-[1.04] tracking-[-0.03em]">
          {chapter.title}
          <span className="text-accent-alt">.</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted">{lede}</p>
      </header>

      {children}

      <footer className="flex flex-col gap-5 border-t border-border pt-6">
        {shapedBy && shapedBy.length > 0 ? (
          <p className="font-mono text-[0.7rem] text-muted uppercase tracking-[0.16em]">
            shaped by {shapedBy.join(" · ")}
          </p>
        ) : null}
        <nav className="flex items-stretch gap-4">
          {prev ? <SpineLink chapter={prev} direction="prev" /> : <span />}
          {next ? <SpineLink chapter={next} direction="next" /> : <span />}
        </nav>
      </footer>
    </article>
  );
}
