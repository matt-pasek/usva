"use client";
import { Select } from "@matt-pasek/usva";
import { useState } from "react";

const fruits = ["Apple", "Banana", "Cherry"];

export function SelectDemo() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <Select value={value} onValueChange={setValue}>
        <Select.Trigger aria-label="Fruit" className="w-56">
          <Select.Value placeholder="Pick a fruit" />
        </Select.Trigger>
        <Select.Content>
          {fruits.map((fruit) => (
            <Select.Item key={fruit} value={fruit.toLowerCase()}>
              {fruit}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      <Select defaultValue="banana">
        <Select.Trigger aria-label="Fruit (preselected)" className="w-56">
          <Select.Value placeholder="Pick a fruit" />
        </Select.Trigger>
        <Select.Content>
          {fruits.map((fruit) => (
            <Select.Item key={fruit} value={fruit.toLowerCase()}>
              {fruit}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      <Select disabled>
        <Select.Trigger aria-label="Fruit (disabled)" className="w-56">
          <Select.Value placeholder="Disabled" />
        </Select.Trigger>
        <Select.Content>
          {fruits.map((fruit) => (
            <Select.Item key={fruit} value={fruit.toLowerCase()}>
              {fruit}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
}
