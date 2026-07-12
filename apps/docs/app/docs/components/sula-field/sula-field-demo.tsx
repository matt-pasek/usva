"use client";
import { SulaField } from "@matt-pasek/usva";

export function SulaFieldDemo({
  fluid = true,
  interactive = false,
}: {
  fluid?: boolean;
  interactive?: boolean;
}) {
  return (
    <SulaField
      fluid={fluid}
      interactive={interactive}
      className="grid min-h-96 place-items-center rounded-xl bg-bg p-8 sm:p-10"
    >
      <div className="max-w-sm text-center">
        <h2 className="text-3xl font-semibold text-ink">mist, made of glass</h2>
        <p className="mt-3 text-muted">
          {interactive
            ? "move the cursor and the veil answers with pressure"
            : "slow glass gathers at the edges and leaves the words clear"}
        </p>
      </div>
    </SulaField>
  );
}
