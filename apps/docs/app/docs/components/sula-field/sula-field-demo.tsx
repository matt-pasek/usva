"use client";
import { SulaField } from "@usva-ui/react/sula/sula-field";
import { Playground } from "@/components/docs/playground";

export function SulaFieldDemo({
  speed = 1,
  interactive = false,
  seed = 0,
  fluid = true,
  caption,
}: {
  speed?: number;
  interactive?: boolean;
  seed?: number;
  fluid?: boolean;
  caption?: string;
}) {
  return (
    <SulaField
      speed={speed}
      interactive={interactive}
      seed={seed}
      fluid={fluid}
      className="grid min-h-96 place-items-center rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-sm text-center">
        <h2 className="text-3xl font-semibold text-ink">mist, made of glass</h2>
        <p className="mt-3 text-muted">
          {caption ??
            (interactive
              ? "move the cursor and the veil answers with pressure"
              : "slow glass gathers at the edges and leaves the words clear")}
        </p>
      </div>
    </SulaField>
  );
}

type PlayConfig = {
  speed: number;
  interactive: boolean;
  seed: number;
  fluid: boolean;
};

const quiet: PlayConfig = {
  speed: 1,
  interactive: false,
  seed: 0,
  fluid: true,
};

const playTemplates: Record<string, PlayConfig> = {
  "quiet veil": quiet,
  "answers pointer": { ...quiet, interactive: true },
  "faster drift": { ...quiet, speed: 1.6 },
};

const playSnippet = (c: PlayConfig): string => {
  const lines = ["<SulaField"];
  if (c.speed !== 1) lines.push(`  speed={${c.speed}}`);
  if (c.interactive) lines.push("  interactive");
  if (c.seed !== 0) lines.push(`  seed={${c.seed}}`);
  if (!c.fluid) lines.push("  fluid={false}");
  return `import { SulaField } from "@usva-ui/react/sula/sula-field";

${lines.join("\n")}
>
  <Hero />
</SulaField>`;
};

export function SulaFieldPlayground() {
  return (
    <Playground<PlayConfig>
      templates={playTemplates}
      stageClassName=""
      fields={[
        {
          kind: "slider",
          key: "speed",
          label: "speed",
          sub: "drift-rate multiplier",
          min: 0.2,
          max: 2,
          step: 0.1,
        },
        {
          kind: "switch",
          key: "interactive",
          label: "interactive",
          sub: "the veil leans toward the pointer",
        },
        {
          kind: "slider",
          key: "seed",
          label: "seed",
          sub: "same value wanders the same way",
          min: 0,
          max: 9,
          step: 1,
        },
        {
          kind: "switch",
          key: "fluid",
          label: "fluid",
          sub: "off mounts no canvas, one static frame",
        },
      ]}
      snippet={playSnippet}
      render={(c) => (
        <SulaFieldDemo
          speed={c.speed}
          interactive={c.interactive}
          seed={c.seed}
          fluid={c.fluid}
          caption={
            c.fluid
              ? undefined
              : "no canvas mounts. the layout holds and the words stay put"
          }
        />
      )}
    />
  );
}
