import { Terminal } from "@usva-ui/react/primitives/terminal";
import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHeading } from "@/components/chapter-heading";
import { counts, THEMES } from "@/lib/catalog";
import { PACKAGE_NAME, pageMetadata, TOKENS_PACKAGE } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/press", {
  title: "Press kit",
  description:
    "Logos, screenshots, descriptions and links for writing about usva.",
});

const REPO = "https://github.com/matt-pasek/usva";
const NPM = `https://www.npmjs.com/package/${PACKAGE_NAME}`;

const ASSETS = [
  {
    href: "/press/usva-mark.svg",
    name: "usva-mark.svg",
    note: "the railo mark, on its own",
  },
  {
    href: "/press/usva-hero-kajo.png",
    name: "usva-hero-kajo.png",
    note: "1200 by 630, the kajo theme",
  },
  {
    href: "/press/usva-hero-savi.png",
    name: "usva-hero-savi.png",
    note: "1200 by 630, the savi theme",
  },
];

const APPS = [
  {
    href: "https://matt-pasek.dev",
    name: "personal-website",
    note: "the beauty pole. kajo.",
  },
  {
    href: "https://sisu-plus.matt-pasek.dev",
    name: "sisu-plus",
    note: "the density pole. sisu.",
  },
];

/** Selectable rather than copy-buttoned: press blurbs get pasted into a doc. */
function Blurb({ label, children }: { label: string; children: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-muted text-xs uppercase tracking-[0.16em]">
        {label}
      </p>
      <p className="max-w-2xl rounded-lg border border-border bg-surface/40 p-4 text-ink leading-relaxed">
        {children}
      </p>
    </div>
  );
}

function Row({
  href,
  name,
  note,
  external,
}: {
  href: string;
  name: string;
  note: string;
  external?: boolean;
}) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-border border-b py-3">
      <a
        href={href}
        {...(external
          ? { target: "_blank", rel: "noreferrer" }
          : { download: true })}
        className="rounded font-mono text-accent text-sm underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-focus"
      >
        {name}
        {external ? " ↗" : ""}
      </a>
      <span className="text-muted text-sm">{note}</span>
    </li>
  );
}

export default function PressPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-14 px-6 py-20 sm:px-10">
      <header className="flex flex-col gap-4">
        <p className="font-mono text-muted text-xs uppercase tracking-[0.25em]">
          press
        </p>
        <h1 className="font-extrabold text-4xl text-ink tracking-tight sm:text-5xl">
          press kit
        </h1>
        <p className="max-w-2xl text-muted leading-relaxed">
          everything you need to write about usva without asking me for it. the
          assets below are the real ones the site ships, not mockups.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <ChapterHeading>descriptions</ChapterHeading>
        <Blurb label="one line">
          a react design language in three themes, shaped by two live apps that
          wanted opposite things.
        </Blurb>
        <Blurb label="short">
          usva is a react design system and component library built on one token
          vocabulary. kajo is atmospheric and dark, sisu is dense and quick,
          savi is the light ground, and a surface can move between them without
          turning into a different system.
        </Blurb>
        <Blurb label="long">
          usva is a react design language, design system and component library,
          published both as an npm package and as a shadcn compatible registry,
          so a component can be installed or copied in and owned per component.
          it was shaped by two applications that pull in opposite directions: a
          presentational personal site that is allowed to be loud, and a
          dashboard that has to stay usable all day. both run off the same
          vocabulary, which is the whole argument. beauty that stays usable.
        </Blurb>
      </section>

      <section className="flex flex-col gap-4">
        <ChapterHeading>the facts</ChapterHeading>
        <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          <div className="flex items-baseline gap-3">
            <dt className="font-mono text-muted text-xs">name</dt>
            <dd className="text-ink text-sm">
              usva. always lowercase, including the full stop.
            </dd>
          </div>
          <div className="flex items-baseline gap-3">
            <dt className="font-mono text-muted text-xs">components</dt>
            <dd className="text-ink text-sm tabular-nums">{counts.total}</dd>
          </div>
          <div className="flex items-baseline gap-3">
            <dt className="font-mono text-muted text-xs">themes</dt>
            <dd className="text-ink text-sm">{THEMES.join(", ")}</dd>
          </div>
          <div className="flex items-baseline gap-3">
            <dt className="font-mono text-muted text-xs">licence</dt>
            <dd className="text-ink text-sm">mit with commons clause</dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-col gap-4">
        <ChapterHeading>install</ChapterHeading>
        <Terminal command={`bun add ${PACKAGE_NAME} ${TOKENS_PACKAGE}`} />
        <p className="text-muted text-sm leading-relaxed">
          or copy a component in and own it, which is the other half of the
          point:
        </p>
        <Terminal command="npx shadcn add usva.build/r/button.json" />
      </section>

      <section className="flex flex-col gap-4">
        <ChapterHeading>assets</ChapterHeading>
        <ul className="flex flex-col">
          {ASSETS.map((asset) => (
            <Row key={asset.href} {...asset} />
          ))}
        </ul>
        <p className="text-muted text-sm leading-relaxed">
          the mark is called railo. please do not recolour it or set it on a
          background that fights it. if you need it in a colour the site does
          not ship, ask.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <ChapterHeading>what it already runs</ChapterHeading>
        <ul className="flex flex-col">
          {APPS.map((app) => (
            <Row key={app.href} {...app} external />
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <ChapterHeading>links</ChapterHeading>
        <ul className="flex flex-col">
          <Row href={REPO} name="github" note="source and issues" external />
          <Row href={NPM} name="npm" note={PACKAGE_NAME} external />
        </ul>
        <p className="text-muted text-sm leading-relaxed">
          anything else, or a question this page does not answer:{" "}
          <Link
            href="/docs/get-started"
            className="rounded text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-focus"
          >
            start here
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
