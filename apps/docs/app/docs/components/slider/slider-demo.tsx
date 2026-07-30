"use client";
import { Slider } from "@usva-ui/react/primitives/slider";
import { Playground } from "@/components/docs/playground";

const SIZES = ["sm", "md"] as const;

type Config = {
  label: string;
  size: (typeof SIZES)[number];
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  suffix: string;
  showValue: boolean;
  disabled: boolean;
};

const base: Config = {
  label: "Speed",
  size: "md",
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 40,
  suffix: "",
  showValue: true,
  disabled: false,
};

const templates: Record<string, Config> = {
  opacity: {
    ...base,
    label: "Opacity",
    step: 5,
    defaultValue: 80,
    suffix: "%",
  },
  disabled: { ...base, label: "Locked", defaultValue: 30, disabled: true },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    `label="${c.label}"`,
    `defaultValue={${c.defaultValue}}`,
    c.min !== 0 && `min={${c.min}}`,
    c.max !== 100 && `max={${c.max}}`,
    c.step !== 1 && `step={${c.step}}`,
    c.size !== "md" && `size="${c.size}"`,
    c.showValue && "showValue",
    c.suffix && `formatValue={(v) => \`\${v}${c.suffix}\`}`,
    c.disabled && "disabled",
  ]
    .filter(Boolean)
    .join("\n  ");
  return `import { Slider } from "@usva-ui/react/primitives/slider";

<Slider
  ${attrs}
/>`;
};

export function SliderDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      render={(c) => (
        <div className="mx-auto w-full max-w-sm">
          <Slider
            key={`${c.min}-${c.max}-${c.step}-${c.defaultValue}`}
            label={c.label || undefined}
            size={c.size}
            min={c.min}
            max={c.max}
            step={c.step}
            defaultValue={c.defaultValue}
            showValue={c.showValue}
            disabled={c.disabled}
            formatValue={c.suffix ? (v) => `${v}${c.suffix}` : undefined}
          />
        </div>
      )}
      snippet={snippetFor}
      fields={[
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "text above the track",
        },
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "sm is for dense rows",
          options: SIZES,
        },
        {
          kind: "slider",
          key: "min",
          label: "min",
          sub: "lower bound",
          min: 0,
          max: 50,
          step: 1,
        },
        {
          kind: "slider",
          key: "max",
          label: "max",
          sub: "upper bound",
          min: 50,
          max: 200,
          step: 1,
        },
        {
          kind: "slider",
          key: "step",
          label: "step",
          sub: "increment per tick",
          min: 1,
          max: 25,
          step: 1,
        },
        {
          kind: "slider",
          key: "defaultValue",
          label: "defaultValue",
          sub: "starting position",
          min: 0,
          max: 100,
          step: 1,
        },
        {
          kind: "text",
          key: "suffix",
          label: "suffix",
          sub: "unit appended to the readout",
        },
        {
          kind: "switch",
          key: "showValue",
          label: "showValue",
          sub: "value readout on the right",
        },
        {
          kind: "switch",
          key: "disabled",
          label: "disabled",
          sub: "dims and ignores input",
        },
      ]}
    />
  );
}
