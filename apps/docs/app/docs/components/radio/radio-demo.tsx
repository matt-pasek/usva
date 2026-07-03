"use client";
import { Radio, RadioGroup } from "@matt-pasek/usva";
import { useState } from "react";

export function RadioDemo() {
  const [plan, setPlan] = useState("free");

  return (
    <div className="flex flex-col gap-6">
      <RadioGroup
        name="plan"
        aria-label="Plan"
        value={plan}
        onValueChange={setPlan}
      >
        <Radio
          value="free"
          label="Free"
          description="Good for trying things out."
        />
        <Radio value="pro" label="Pro" description="For growing teams." />
        <Radio value="enterprise" label="Enterprise" disabled />
      </RadioGroup>
      <RadioGroup
        name="orientation-demo"
        aria-label="Orientation demo"
        defaultValue="a"
        orientation="horizontal"
      >
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
        <Radio value="c" label="C" />
      </RadioGroup>
    </div>
  );
}
