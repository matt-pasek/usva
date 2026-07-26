"use client";
import type { LoaderMotion } from "@matt-pasek/usva/sula/sula-loader";
import { SulaLoader } from "@matt-pasek/usva/sula/sula-loader";
import { Playground } from "@/components/docs/playground";

const MOTIONS = ["orbit", "cluster", "twin"] as const;

const ACTION: Record<LoaderMotion, string> = {
  orbit: "recoil, release, return",
  cluster: "arrive, fuse, scatter",
  twin: "bridge, exchange, release",
};

type Config = {
  motion: (typeof MOTIONS)[number];
  size: number;
  speed: number;
  label: string;
  fluid: boolean;
  shine: number;
};

const base: Config = {
  motion: "orbit",
  size: 96,
  speed: 1,
  label: "Loading",
  fluid: true,
  shine: 0.7,
};

const templates: Record<string, Config> = {
  relay: base,
  gather: { ...base, motion: "cluster" },
  eclipse: { ...base, motion: "twin" },
  "the still": { ...base, fluid: false },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.size !== 96 && `size={${c.size}}`,
    c.motion !== "orbit" && `motion="${c.motion}"`,
    c.speed !== 1 && `speed={${c.speed}}`,
    c.label !== "Loading" && `label="${c.label}"`,
    !c.fluid && "fluid={false}",
    c.shine !== base.shine && `shine={${c.shine}}`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { SulaLoader } from "@matt-pasek/usva/sula/sula-loader";

<SulaLoader${attrs ? ` ${attrs}` : ""} />`;
};

export function SulaLoaderDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "motion",
          label: "motion",
          sub: "which looping event it stages",
          options: MOTIONS,
        },
        {
          kind: "slider",
          key: "size",
          label: "size",
          sub: "square side in px",
          min: 48,
          max: 160,
          step: 8,
        },
        {
          kind: "slider",
          key: "speed",
          label: "speed",
          sub: "loop-rate multiplier",
          min: 0.25,
          max: 3,
          step: 0.25,
        },
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "the announced status",
        },
        {
          kind: "switch",
          key: "fluid",
          label: "fluid",
          sub: "off renders the static still",
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
      ]}
      snippet={snippetFor}
      render={(c) => (
        <div className="flex min-h-80 w-full flex-col items-center justify-center gap-8 py-8">
          <SulaLoader
            key={`${c.motion}-${c.fluid}`}
            size={c.size}
            motion={c.motion}
            speed={c.speed}
            label={c.label}
            fluid={c.fluid}
            shine={c.shine}
          />
          <p aria-live="polite" className="text-sm text-muted">
            {ACTION[c.motion]}
          </p>
        </div>
      )}
    />
  );
}
