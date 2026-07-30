"use client";
import { StepChips } from "@usva-ui/react/patterns/step-chips";
import { Playground } from "@/components/docs/playground";

type Config = {
  steps: string;
  label: string;
};

const templates: Record<string, Config> = {
  setup: {
    steps: "Install the extension, Sign in, Done",
    label: "Setup steps",
  },
  checkout: { steps: "Cart, Address, Pay", label: "Checkout steps" },
  onboarding: {
    steps: "Create account, Invite team, Ship",
    label: "Onboarding steps",
  },
};

const toSteps = (value: string) =>
  value
    .split(",")
    .map((step) => step.trim())
    .filter(Boolean);

const snippetFor = (c: Config): string => {
  const steps = toSteps(c.steps)
    .map((step) => `"${step}"`)
    .join(", ");
  return `import { StepChips } from "@usva-ui/react/patterns/step-chips";

<StepChips
  aria-label="${c.label}"
  steps={[${steps}]}
/>`;
};

export function StepChipsDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[]}
      snippet={snippetFor}
      render={(c) => (
        <StepChips aria-label={c.label} steps={toSteps(c.steps)} />
      )}
    />
  );
}
