"use client";
import { Chip } from "@matt-pasek/usva";
import { useState } from "react";

const initialFilters = ["Design", "Engineering", "Research", "Ops"];

export function ChipDemo() {
  const [filters, setFilters] = useState(initialFilters);

  const remove = (name: string) =>
    setFilters((current) => current.filter((f) => f !== name));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Chip tone="default">Default</Chip>
        <Chip tone="accent">Accent</Chip>
        <Chip tone="accent-alt">Accent alt</Chip>
        <Chip tone="success">Success</Chip>
        <Chip tone="warning">Warning</Chip>
        <Chip tone="danger">Danger</Chip>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip tone="accent" value={128}>
          Stars
        </Chip>
        <Chip tone="success" value="v2.1">
          Release
        </Chip>
        <Chip tone="default" value={3}>
          Drafts
        </Chip>
      </div>

      <div className="flex min-h-7 flex-wrap items-center gap-2">
        {filters.length > 0 ? (
          filters.map((name) => (
            <Chip
              key={name}
              tone="accent"
              onRemove={() => remove(name)}
              removeLabel={`Remove ${name}`}
            >
              {name}
            </Chip>
          ))
        ) : (
          <button
            type="button"
            onClick={() => setFilters(initialFilters)}
            className="text-sm text-accent underline-offset-4 hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
