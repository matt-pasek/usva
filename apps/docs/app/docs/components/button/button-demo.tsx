"use client";
import { Button, type ButtonStatus } from "@matt-pasek/usva";
import * as React from "react";

const variants = ["solid", "soft", "outline", "ghost"] as const;

export function ButtonDemo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        {variants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button>Hover for glow</Button>
        <Button disabled>Disabled</Button>
      </div>

      <StatefulRow />

      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-gradient-accent p-6">
        <Button variant="onSurface">onSurface</Button>
        <Button variant="onSurface" size="sm">
          Over a gradient
        </Button>
      </div>
    </div>
  );
}

function StatefulRow() {
  const [saveStatus, setSaveStatus] = React.useState<ButtonStatus>("idle");
  const [failStatus, setFailStatus] = React.useState<ButtonStatus>("idle");
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  React.useEffect(() => () => clearTimeout(timer.current), []);

  const run = (
    set: (s: ButtonStatus) => void,
    outcome: ButtonStatus,
  ) => {
    set("loading");
    timer.current = setTimeout(() => set(outcome), 1400);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        status={saveStatus}
        loadingText="Saving"
        successText="Saved"
        onClick={() => run(setSaveStatus, "success")}
        onSettle={() => setSaveStatus("idle")}
      >
        Save changes
      </Button>
      <Button
        variant="outline"
        status={failStatus}
        loadingText="Uploading"
        errorText="Failed"
        onClick={() => run(setFailStatus, "error")}
        onSettle={() => setFailStatus("idle")}
      >
        Upload
      </Button>
    </div>
  );
}
