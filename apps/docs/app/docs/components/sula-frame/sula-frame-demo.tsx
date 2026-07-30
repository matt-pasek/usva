"use client";
import { SulaFrame } from "@usva-ui/react/sula/sula-frame";
import { Playground } from "@/components/docs/playground";

type Config = {
  radius: number;
  thickness: number;
  inset: number;
  shine: number;
  fluid: boolean;
  intro: boolean;
};

const base: Config = {
  radius: 20,
  thickness: 2,
  inset: 0,
  shine: 0.7,
  fluid: true,
  intro: true,
};

const templates: Record<string, Config> = {
  "brand edge": { ...base, inset: 5 },
  "thick halo": { ...base, thickness: 6, inset: 5, shine: 1 },
  "matte hairline": { ...base, thickness: 1, shine: 0.1, inset: 5 },
  "static fallback": { ...base, fluid: false },
};

const snippetFor = (c: Config): string => {
  const lines = [`  radius={${c.radius}}`];
  if (c.thickness !== 2) lines.push(`  thickness={${c.thickness}}`);
  if (c.inset !== 0) lines.push(`  inset={${c.inset}}`);
  if (c.shine !== base.shine) lines.push(`  shine={${c.shine}}`);
  if (!c.fluid) lines.push("  fluid={false}");
  if (!c.intro) lines.push("  intro={false}");
  lines.push(`  className="bg-surface px-10 py-9"`);
  return `import { SulaFrame } from "@usva-ui/react/sula/sula-frame";

<SulaFrame
${lines.join("\n")}
>
  <Pricing />
</SulaFrame>`;
};

export function SulaFrameDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "slider",
          key: "radius",
          label: "radius",
          sub: "corner radius in px, drives the box too",
          min: 0,
          max: 40,
          step: 2,
        },
        {
          kind: "slider",
          key: "thickness",
          label: "thickness",
          sub: "band width in px",
          min: 1,
          max: 8,
          step: 1,
        },
        {
          kind: "slider",
          key: "inset",
          label: "inset",
          sub: "gap between the frame and the edge",
          min: 0,
          max: 20,
          step: 1,
        },
        {
          kind: "slider",
          key: "shine",
          label: "shine",
          sub: "0 flat matte, 1 full neon rim",
          min: 0,
          max: 1,
          step: 0.05,
        },
        {
          kind: "switch",
          key: "fluid",
          label: "fluid",
          sub: "off paints the static accent border",
        },
        {
          kind: "switch",
          key: "intro",
          label: "intro",
          sub: "one-time reveal ramp on mount",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <div className="grid min-h-96 place-items-center rounded-xl bg-bg p-8 sm:p-10">
          <SulaFrame
            key={`${c.fluid}-${c.intro}`}
            radius={c.radius}
            thickness={c.thickness}
            inset={c.inset}
            shine={c.shine}
            fluid={c.fluid}
            intro={c.intro}
            className="bg-surface px-10 py-9"
            style={{ borderRadius: `${c.radius}px` }}
          >
            <div className="max-w-xs text-center">
              <h2 className="text-2xl font-semibold text-ink">
                a frame that answers
              </h2>
              <p className="mt-2 text-sm text-muted">
                drag the cursor along the edge, or focus the button, and the
                border leans toward you
              </p>
              <button
                type="button"
                className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm text-bg"
              >
                focus me
              </button>
            </div>
          </SulaFrame>
        </div>
      )}
    />
  );
}
