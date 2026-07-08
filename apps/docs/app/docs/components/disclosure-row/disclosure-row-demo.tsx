"use client";
import { DisclosureRow, ProgressRow } from "@matt-pasek/usva";
import { useState } from "react";

const SECTIONS = [
  ["core", "Core studies", "#52c989", 45, 60],
  ["minor", "Minor studies", "#7ea0ff", 20, 25],
  ["free", "Free-choice studies", "#a98cff", 11, 20],
] as const;

function Courses() {
  return (
    <ul className="flex flex-col gap-2 pb-4 pl-11 pr-4 text-sm text-muted">
      <li>Introduction to Software Engineering, 5 cr</li>
      <li>Data Structures and Algorithms, 5 cr</li>
      <li>Operating Systems, 5 cr</li>
    </ul>
  );
}

export function SingleDemo() {
  return (
    <DisclosureRow
      railColor="#52c989"
      summary="Core studies"
      aside={
        <span className="font-mono text-sm tabular-nums">
          <span className="font-bold text-accent">45</span>
          <span className="text-faint"> / 60 cr</span>
        </span>
      }
    >
      <Courses />
    </DisclosureRow>
  );
}

export function AccordionDemo() {
  const [open, setOpen] = useState<string | null>("core");

  return (
    <div className="flex flex-col gap-2">
      {SECTIONS.map(([id, title, color, done, total]) => (
        <DisclosureRow
          key={id}
          railColor={color}
          open={open === id}
          onOpenChange={(next) => setOpen(next ? id : null)}
          buttonLabel={title}
          summary={
            <ProgressRow
              label={title}
              value={done}
              max={total}
              unit="cr"
              barColor={color}
            />
          }
        >
          <Courses />
        </DisclosureRow>
      ))}
    </div>
  );
}
