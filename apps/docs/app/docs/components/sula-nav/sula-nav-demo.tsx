"use client";
import { SulaNav, type SulaNavView } from "@matt-pasek/usva";
import type { ComponentProps } from "react";
import { useState } from "react";

function DemoLink({ href, onClick, ...rest }: ComponentProps<"a">) {
  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
      {...rest}
    />
  );
}

function Glyph({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <title>Playground</title>
      <path
        d="M12 3l2.2 6.1L20 12l-5.8 2.9L12 21l-2.2-6.1L4 12l5.8-2.9z"
        fill="currentColor"
      />
    </svg>
  );
}

const VIEWS: SulaNavView[] = [
  {
    href: "/",
    label: "Site",
    icon: <Glyph d="M3 11l9-7 9 7M5 10v10h14V10" />,
    items: [
      {
        href: "#home",
        label: "Home",
        icon: <Glyph d="M3 11l9-7 9 7M5 10v10h14V10" />,
      },
      {
        href: "#work",
        label: "Work",
        icon: <Glyph d="M4 7h16v13H4zM9 7V4h6v3" />,
      },
      {
        href: "#about",
        label: "About",
        icon: <Glyph d="M12 12a4 4 0 100-8 4 4 0 000 8zM5 20a7 7 0 0114 0" />,
      },
    ],
  },
  {
    href: "/writing",
    label: "Writing",
    icon: <Glyph d="M4 20h16M6 16l9-9 3 3-9 9H6z" />,
    items: [
      { href: "#latest", label: "Latest" },
      { href: "#archive", label: "Archive" },
    ],
  },
  {
    href: "/play",
    label: "Playground",
    icon: <Spark />,
    items: [{ href: "#play", label: "Playground" }],
  },
];

function Nav({
  fluid,
  offset,
  sidesOpen,
}: {
  fluid: boolean;
  offset: number;
  sidesOpen: boolean;
}) {
  const [view, setView] = useState("/");
  const [item, setItem] = useState("#home");
  return (
    <SulaNav
      fluid={fluid}
      sidesOpen={sidesOpen}
      linkComponent={DemoLink}
      views={VIEWS}
      activeView={view}
      onViewChange={(href) => {
        setView(href);
        setItem(VIEWS.find((v) => v.href === href)?.items?.[0]?.href ?? "");
      }}
      activeItem={item}
      onNavigate={setItem}
      brand={<span className="tracking-tight">usva.</span>}
      brandLabel="usva home"
      offset={offset}
    />
  );
}

const controlClass =
  "rounded-full border border-border px-4 py-2 text-sm text-muted transition-tint hover:text-ink";

export function SulaNavDemo({ fluid = true }: { fluid?: boolean }) {
  const [run, setRun] = useState(0);
  const [sidesOpen, setSidesOpen] = useState(true);
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative flex w-full justify-center overflow-hidden rounded-xl pt-28 pb-6">
        <Nav key={run} fluid={fluid} offset={0} sidesOpen={sidesOpen} />
      </div>
      {fluid ? (
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setRun((n) => n + 1)}
            className={controlClass}
          >
            Replay the reveal
          </button>
          <button
            type="button"
            onClick={() => setSidesOpen((open) => !open)}
            className={controlClass}
          >
            {sidesOpen ? "Melt the sides in" : "Send the sides out"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
