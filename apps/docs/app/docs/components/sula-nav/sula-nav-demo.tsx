"use client";
import { SulaNav, type SulaNavProps, type SulaNavView } from "@matt-pasek/usva";
import type { ComponentProps } from "react";
import { useState } from "react";
import { Playground } from "@/components/docs/playground";

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

type Config = {
  fluid: boolean;
  sidesOpen: boolean;
  satellites: boolean;
  shine: number;
  mergeRadius: number;
  revealDelay: number;
};

const base: Config = {
  fluid: true,
  sidesOpen: true,
  satellites: false,
  shine: 0.7,
  mergeRadius: 14,
  revealDelay: 120,
};

const templates: Record<string, Config> = {
  liquid: base,
  satellites: { ...base, satellites: true },
  "matte glass": { ...base, shine: 0 },
  "eager merge": { ...base, mergeRadius: 26, revealDelay: 280 },
  "sides melted in": { ...base, sidesOpen: false },
  "plain pills": { ...base, fluid: false },
};

const satelliteBtn =
  "grid size-8 place-items-center rounded-full text-muted transition-colors duration-150 ease-soft hover:text-ink";

function useSatellites(on: boolean): SulaNavProps["satellites"] {
  const [theme, setTheme] = useState("kajo");
  if (!on) return undefined;
  return [
    {
      id: "search",
      align: "left",
      label: "Search",
      children: (
        <button type="button" className={satelliteBtn} aria-label="Search">
          <Glyph d="M10 4a6 6 0 100 12 6 6 0 000-12M20 20l-4.5-4.5" />
        </button>
      ),
    },
    {
      id: "theme",
      align: "right",
      label: "Theme",
      children: (
        <button
          type="button"
          onClick={() => setTheme((t) => (t === "kajo" ? "sisu" : "kajo"))}
          className="rounded-full px-3 py-1.5 font-mono text-muted text-xs transition-colors duration-150 ease-soft hover:text-ink"
        >
          {theme}
        </button>
      ),
    },
  ];
}

function Preview({ c }: { c: Config }) {
  const [view, setView] = useState("/");
  const [item, setItem] = useState("#home");
  const satellites = useSatellites(c.satellites);
  return (
    <div className="relative flex w-full justify-center overflow-hidden rounded-xl pt-28 pb-6">
      <SulaNav
        fluid={c.fluid}
        sidesOpen={c.sidesOpen}
        shine={c.shine}
        mergeRadius={c.mergeRadius}
        revealDelay={c.revealDelay}
        linkComponent={DemoLink}
        views={VIEWS}
        activeView={view}
        onViewChange={(href) => {
          setView(href);
          setItem(VIEWS.find((v) => v.href === href)?.items?.[0]?.href ?? "");
        }}
        activeItem={item}
        onNavigate={setItem}
        satellites={satellites}
        brand={<span className="tracking-tight">usva.</span>}
        brandLabel="usva home"
      />
    </div>
  );
}

const snippetFor = (c: Config): string => {
  const attrs = [
    !c.fluid && "  fluid={false}",
    !c.sidesOpen && "  sidesOpen={false}",
    c.shine !== base.shine && `  shine={${c.shine}}`,
    c.mergeRadius !== base.mergeRadius && `  mergeRadius={${c.mergeRadius}}`,
    c.revealDelay !== base.revealDelay && `  revealDelay={${c.revealDelay}}`,
  ].filter(Boolean);
  const sat = c.satellites
    ? `    satellites={[
      { id: "search", align: "left", label: "Search", children: <SearchButton /> },
      { id: "theme", align: "right", label: "Theme", children: <ThemeToggle /> },
    ]}\n`
    : "";
  return `import { SulaNav } from "@matt-pasek/usva";
import Link from "next/link";

<header className="fixed inset-x-0 top-0 z-50 flex justify-center p-4">
  <SulaNav
    linkComponent={Link}
    brand={<span>usva.</span>}
    brandLabel="usva home"
    activeView={view}
    onViewChange={setView}
    activeItem={section}
    onNavigate={setSection}
${attrs.length ? `${attrs.join("\n")}\n` : ""}${sat}    views={views}
  />
</header>`;
};

export function SulaNavDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "switch",
          key: "fluid",
          label: "fluid",
          sub: "false mounts no canvas, plain css pills",
        },
        {
          kind: "switch",
          key: "sidesOpen",
          label: "sidesOpen",
          sub: "melt brand and pills back into the active bar",
        },
        {
          kind: "switch",
          key: "satellites",
          label: "satellites",
          sub: "a search and a theme control, one material with the bar",
        },
        {
          kind: "slider",
          key: "shine",
          label: "shine",
          sub: "0 matte glass, 1 full neon rim",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          kind: "slider",
          key: "mergeRadius",
          label: "mergeRadius",
          sub: "how eagerly the parts merge, in px",
          min: 4,
          max: 32,
          step: 1,
        },
        {
          kind: "slider",
          key: "revealDelay",
          label: "revealDelay",
          sub: "ms after landing before the sides emerge",
          min: 0,
          max: 500,
          step: 20,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Preview
          key={`${c.fluid}-${c.satellites}-${c.shine}-${c.mergeRadius}-${c.revealDelay}`}
          c={c}
        />
      )}
    />
  );
}
