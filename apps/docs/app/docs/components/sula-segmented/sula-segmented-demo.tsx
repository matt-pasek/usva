"use client";
import { SulaSegmented, type SulaSegmentedItem } from "@matt-pasek/usva";
import { useState } from "react";

const ITEMS: SulaSegmentedItem[] = [
  { value: "kajo", label: "Kajo" },
  { value: "sisu", label: "Sisu" },
  { value: "system", label: "System" },
];

export function SulaSegmentedDemo({ fluid = true }: { fluid?: boolean }) {
  const [value, setValue] = useState("kajo");
  return (
    <div className="flex w-full justify-center py-8">
      <SulaSegmented
        fluid={fluid}
        items={ITEMS}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}
