"use client";
import { SulaSegmented, type SulaSegmentedItem } from "@matt-pasek/usva";
import * as React from "react";
import { Playground } from "@/components/docs/playground";

const ITEMS: SulaSegmentedItem[] = [
  { value: "kajo", label: "Kajo" },
  { value: "sisu", label: "Sisu" },
  { value: "system", label: "System" },
];

const SIZES = ["sm", "md"] as const;

type Config = {
  size: (typeof SIZES)[number];
  fluid: boolean;
  shine: number;
  bare: boolean;
};

const base: Config = {
  size: "md",
  fluid: true,
  shine: 0.6,
  bare: false,
};

const templates: Record<string, Config> = {
  droplet: base,
  compact: { ...base, size: "sm" },
  "matte glass": { ...base, shine: 0.15 },
  bare: { ...base, bare: true },
  "the pill": { ...base, fluid: false },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.size !== "md" && `size="${c.size}"`,
    !c.fluid && "fluid={false}",
    c.bare && "bare",
    c.fluid && `shine={${c.shine}}`,
  ]
    .filter(Boolean)
    .join("\n  ");
  return `import { SulaSegmented } from "@matt-pasek/usva";

<SulaSegmented
  ${attrs ? `${attrs}\n  ` : ""}items={items}
  value={value}
  onValueChange={setValue}
/>`;
};

function Preview(c: Config) {
  const [value, setValue] = React.useState("kajo");
  return (
    <div className="flex w-full justify-center py-8">
      <SulaSegmented
        key={`${c.fluid}-${c.size}`}
        size={c.size}
        fluid={c.fluid}
        bare={c.bare}
        shine={c.fluid ? c.shine : undefined}
        items={ITEMS}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

export function SulaSegmentedDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "segment height and padding",
          options: SIZES,
        },
        {
          kind: "switch",
          key: "fluid",
          label: "fluid",
          sub: "off renders the plain sliding pill",
        },
        {
          kind: "switch",
          key: "bare",
          label: "bare",
          sub: "drops the track fill and border",
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
      render={(c) => <Preview {...c} />}
    />
  );
}
