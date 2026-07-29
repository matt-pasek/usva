"use client";
import { useState } from "react";
import { SulaFrame } from "usva/sula/sula-frame";

export function SulaFrameFixedToggle() {
  const [on, setOn] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        className="w-fit rounded-lg bg-accent px-4 py-2 text-sm text-bg"
      >
        {on ? "remove the page frame" : "frame the whole viewport"}
      </button>
      <p className="text-xs text-muted">
        {on
          ? "the liquid edge now hugs the browser viewport. move the cursor to any edge to goo it, or turn it back off."
          : "turns on a fixed frame around this whole tab, inset by 12px."}
      </p>
      {on ? <SulaFrame fixed inset={12} thickness={3} /> : null}
    </div>
  );
}
