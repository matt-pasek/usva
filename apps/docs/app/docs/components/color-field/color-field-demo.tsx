"use client";
import { ColorField } from "@matt-pasek/usva";
import { useState } from "react";

export function ColorFieldDemo() {
  const [accent, setAccent] = useState("#a78bfa");

  return (
    <div className="flex flex-col gap-4">
      <ColorField label="Accent" value={accent} onValueChange={setAccent} />
      <ColorField label="Surface" defaultValue="#141419" />
      <ColorField label="Invalid" defaultValue="#zzz" />
      <ColorField label="Disabled" defaultValue="#52c989" disabled />
    </div>
  );
}
