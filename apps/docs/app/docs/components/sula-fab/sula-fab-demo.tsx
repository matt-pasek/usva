"use client";
import { SulaFab, type SulaFabAction } from "@matt-pasek/usva";
import * as React from "react";

/** Widen the edge gap on coarse-pointer, small screens so beads are easy to hit. */
function useTouchGap(): number {
  const [touch, setTouch] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(max-width: 640px), (pointer: coarse)");
    const update = () => setTouch(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return touch ? 20 : 12;
}

function Glyph({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const ACTIONS: SulaFabAction[] = [
  { icon: <Glyph d="M12 5v14M5 12h14" />, label: "New note" },
  { icon: <Glyph d="M4 7h16M4 12h16M4 17h10" />, label: "New list" },
  {
    icon: (
      <Glyph d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    ),
    label: "Message",
  },
];

export function SulaFabDemo({
  fluid = true,
  layout = "line",
}: {
  fluid?: boolean;
  layout?: "line" | "arc";
}) {
  const gap = useTouchGap();
  return (
    <div className="flex min-h-64 w-full items-end justify-center py-8">
      <SulaFab
        fluid={fluid}
        layout={layout}
        gap={gap}
        actions={ACTIONS}
        label="Create"
      />
    </div>
  );
}
