"use client";
import { Slider } from "@matt-pasek/usva";
import { useState } from "react";

export function SliderDemo() {
  const [speed, setSpeed] = useState(40);

  return (
    <div className="flex max-w-sm flex-col gap-6">
      <Slider
        label="Speed"
        value={speed}
        onValueChange={(next) => setSpeed(next)}
        showValue
        formatValue={(v) => `${v}%`}
      />
      <Slider label="Blur" defaultValue={12} min={0} max={24} showValue />
      <Slider label="Small" size="sm" defaultValue={60} showValue />
      <Slider label="Disabled" defaultValue={30} disabled showValue />
    </div>
  );
}
