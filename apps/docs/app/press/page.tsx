import {
  BentoCard,
  BentoGrid,
  BentoInfo,
} from "@usva-ui/react/patterns/bento-grid";
import { Terminal } from "@usva-ui/react/primitives/terminal";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CopyButton } from "@/components/copy-button";
import { Railo } from "@/components/railo";
import { Wordmark } from "@/components/wordmark";
import { counts, THEMES } from "@/lib/catalog";
import {
  PACKAGE_NAME,
  pageMetadata,
  SITE_ORIGIN,
  TOKENS_PACKAGE,
} from "@/lib/site";

export const metadata: Metadata = pageMetadata("/press", {
  title: "Press kit",
  description:
    "Logos, wordmarks, footage, descriptions and links for writing about usva.",
});

const REPO = "https://github.com/matt-pasek/usva";
const NPM = `https://www.npmjs.com/package/${PACKAGE_NAME}`;
const SITE = SITE_ORIGIN.replace(/^https?:\/\//, "");

/* Stored on the press-assets release, served back through our own route so the
 * content-type is right. See app/press/footage/[file]/route.ts. */
const FOOTAGE = "/press/footage";

function Asset({
  href,
  name,
  note,
  span,
  rowSpan,
  children,
}: {
  href: string;
  name: string;
  note: string;
  span?: number;
  rowSpan?: number;
  children: ReactNode;
}) {
  return (
    <BentoCard
      span={span}
      rowSpan={rowSpan}
      className="group/asset relative overflow-hidden"
    >
      <div className="flex h-full flex-col">
        <div className="relative z-10 flex max-h-80 min-h-0 flex-1 items-center justify-center overflow-hidden bg-sunken/50 p-4">
          {children}
        </div>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 border-border border-t px-4 py-3">
          <a
            href={href}
            download
            className="rounded font-mono text-accent text-xs underline-offset-4 after:absolute after:inset-0 after:content-[''] group-hover/asset:underline focus-visible:outline-none focus-visible:ring-focus"
          >
            {name}
          </a>
          <span className="text-muted text-xs">{note}</span>
        </div>
      </div>
    </BentoCard>
  );
}

function Blurb({
  label,
  span,
  children,
}: {
  label: string;
  span?: number;
  children: string;
}) {
  return (
    <BentoCard span={span}>
      <BentoInfo label={label}>
        <div className="flex items-start gap-4">
          <p className="min-w-0 flex-1 text-ink leading-relaxed">{children}</p>
          <CopyButton
            value={children}
            label={`copy the ${label} description`}
          />
        </div>
      </BentoInfo>
    </BentoCard>
  );
}

function Poster({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={630}
      className="h-full w-full rounded-md object-cover"
    />
  );
}

function Clip({ src, poster }: { src: string; poster: string }) {
  return (
    <video
      controls
      preload="none"
      poster={poster}
      src={src}
      className="h-full max-h-full w-full rounded-md object-contain"
    >
      <track kind="captions" />
    </video>
  );
}

function Out({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-focus"
    >
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-border border-b pb-2 last:border-0 last:pb-0">
      <dt className="font-mono text-muted text-xs uppercase tracking-[0.14em]">
        {term}
      </dt>
      <dd className="text-ink text-sm leading-snug">{children}</dd>
    </div>
  );
}

export default function PressPage() {
  return (
    <main className="mx-auto w-full max-w-[100rem] px-6 py-20 sm:px-10">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-muted text-xs uppercase tracking-[0.25em]">
          press
        </p>
        <h1 className="font-extrabold text-4xl text-ink tracking-tight sm:text-5xl">
          press kit
        </h1>
        <p className="max-w-2xl text-muted leading-relaxed">
          everything you need to write about usva without asking me for it.
          every tile is the thing itself: the copy is selectable and copies in
          one click, and clicking a tile downloads it.
        </p>
      </header>

      <BentoGrid
        columns={6}
        className="mt-12 max-lg:grid-cols-[minmax(0,1fr)]! max-lg:*:col-auto! max-lg:*:row-auto!"
      >
        <Asset
          span={3}
          rowSpan={2}
          href={`${FOOTAGE}/usva-launch.mp4`}
          name="usva-launch.mp4"
          note="the film · 1920 by 1080 · 30s"
        >
          <Clip
            src={`${FOOTAGE}/usva-launch.mp4`}
            poster="/press/poster-launch.jpg"
          />
        </Asset>

        <Asset
          span={1}
          rowSpan={2}
          href={`${FOOTAGE}/usva-launch-vertical.mp4`}
          name="usva-launch-vertical.mp4"
          note="9:16 · 30s"
        >
          <Clip
            src={`${FOOTAGE}/usva-launch-vertical.mp4`}
            poster="/press/poster-launch-vertical.jpg"
          />
        </Asset>

        <Blurb label="one line" span={2}>
          a react design language in three themes, shaped by two live apps that
          wanted opposite things.
        </Blurb>

        <BentoCard span={2}>
          <BentoInfo label="install">
            <div className="flex flex-col gap-2">
              <Terminal command={`bun add ${PACKAGE_NAME} ${TOKENS_PACKAGE}`} />
              <Terminal command="npx shadcn add usva.build/r/button.json" />
            </div>
          </BentoInfo>
        </BentoCard>

        <Blurb label="short" span={4}>
          usva is a react design system and component library built on one token
          vocabulary. kajo is atmospheric and dark, sisu is dense and quick,
          savi is the light ground, and a surface can move between them without
          turning into a different system.
        </Blurb>

        <BentoCard span={2} rowSpan={2}>
          <BentoInfo label="the facts">
            <dl className="flex flex-col gap-2.5">
              <Fact term="name">
                usva. always lowercase, including the full stop.
              </Fact>
              <Fact term="built by">built and maintained by Matt Pasek.</Fact>
              <Fact term="components">
                {counts.total} across five layers, in {THEMES.length} themes (
                {THEMES.join(", ")}).
              </Fact>
              <Fact term="licence">
                MIT with the Commons Clause. usva is source-available, not open
                source: fork it, change it, ship it in what you make, but do not
                repackage the components themselves to sell or republish as a
                competing library.
              </Fact>
            </dl>
          </BentoInfo>
        </BentoCard>

        <Blurb label="long" span={4}>
          usva is a react design language, design system and component library,
          published both as an npm package and as a shadcn-compatible registry,
          so a component can be installed or copied in and owned per component.
          it was shaped by two applications that pull in opposite directions: a
          presentational personal site that is allowed to be loud, and a
          dashboard that has to stay usable all day. both run off the same
          vocabulary, which is the whole argument. beauty that stays usable.
        </Blurb>

        <Asset
          span={2}
          href="/press/usva-mark.svg"
          name="usva-mark.svg"
          note="railo, the mark"
        >
          <Railo className="size-16" />
        </Asset>

        <Asset
          span={2}
          href="/press/usva-wordmark.svg"
          name="usva-wordmark.svg"
          note="on a dark ground"
        >
          <Wordmark className="text-5xl text-ink" />
        </Asset>

        <Asset
          span={2}
          href="/press/usva-wordmark-light.svg"
          name="usva-wordmark-light.svg"
          note="on a light ground"
        >
          <span className="flex w-full items-center justify-center rounded-md bg-[#e7dcc8] py-7">
            <span className="font-extrabold text-5xl text-[#33291d] leading-[0.86] tracking-tighter">
              usva<span className="text-[#86562e]">.</span>
            </span>
          </span>
        </Asset>

        <Asset
          span={3}
          href="/press/usva-hero-kajo.png"
          name="usva-hero-kajo.png"
          note="1200 by 630 · kajo"
        >
          <Poster
            src="/press/usva-hero-kajo.png"
            alt="the usva hero still in the kajo theme"
          />
        </Asset>

        <Asset
          span={3}
          href="/press/usva-hero-savi.png"
          name="usva-hero-savi.png"
          note="1200 by 630 · savi"
        >
          <Poster
            src="/press/usva-hero-savi.png"
            alt="the usva hero still in the savi theme"
          />
        </Asset>

        <Asset
          span={3}
          rowSpan={2}
          href={`${FOOTAGE}/usva-clip-kuohu.mp4`}
          name="usva-clip-kuohu.mp4"
          note="kuohu · 11s"
        >
          <Clip
            src={`${FOOTAGE}/usva-clip-kuohu.mp4`}
            poster="/press/poster-kuohu.jpg"
          />
        </Asset>

        <BentoCard span={3}>
          <BentoInfo label="what it already runs">
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex flex-wrap items-baseline gap-x-2">
                <Out href="https://matt-pasek.dev">personal-website</Out>
                <span className="text-muted">the beauty pole. kajo.</span>
              </li>
              <li className="flex flex-wrap items-baseline gap-x-2">
                <Out href="https://sisu-plus.matt-pasek.dev">sisu-plus</Out>
                <span className="text-muted">the density pole. sisu.</span>
              </li>
            </ul>
          </BentoInfo>
        </BentoCard>

        <BentoCard span={3}>
          <BentoInfo label="links">
            <ul className="flex flex-col gap-2 text-sm">
              <li className="flex flex-wrap items-baseline gap-x-2">
                <Out href={SITE_ORIGIN}>{SITE}</Out>
                <span className="text-muted">the site</span>
              </li>
              <li className="flex flex-wrap items-baseline gap-x-2">
                <Out href={REPO}>github</Out>
                <span className="text-muted">source and issues</span>
              </li>
              <li className="flex flex-wrap items-baseline gap-x-2">
                <Out href={NPM}>npm</Out>
                <span className="font-mono text-muted text-xs">
                  {PACKAGE_NAME}
                </span>
              </li>
            </ul>
          </BentoInfo>
        </BentoCard>
      </BentoGrid>

      <p className="mt-8 max-w-2xl text-muted text-sm leading-relaxed">
        the mark is called railo. the period on the wordmark is part of it, not
        decoration, so please keep the two tones rather than flattening it to
        one. all three films are finished pieces rather than clean plates: each
        carries a music bed and its own burned-in type, so plan to cut around
        that rather than to title over it. anything this page does not answer,{" "}
        <Link
          href="/docs/get-started"
          className="rounded text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-focus"
        >
          start here
        </Link>
        .
      </p>
    </main>
  );
}
