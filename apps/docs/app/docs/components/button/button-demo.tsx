"use client";
import { Button } from "@matt-pasek/usva";

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

      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-gradient-accent p-6">
        <Button variant="onSurface">onSurface</Button>
        <Button variant="onSurface" size="sm">
          Over a gradient
        </Button>
      </div>
    </div>
  );
}
