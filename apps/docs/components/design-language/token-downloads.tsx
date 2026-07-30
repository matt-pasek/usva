"use client";

import { Button } from "@usva-ui/react/primitives/button";
import { Terminal } from "@usva-ui/react/primitives/terminal";
import dtcg from "@usva-ui/tokens/tokens.dtcg.json";
import studio from "@usva-ui/tokens/tokens.studio.json";
import { Download } from "lucide-react";

function downloadJson(name: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

const CARDS = [
  {
    title: "W3C DTCG",
    note: "the design-token standard. drops into any DTCG-aware tool.",
    file: "usva.tokens.dtcg.json",
    data: dtcg,
  },
  {
    title: "Tokens Studio",
    note: "the shape the Figma Tokens Studio plugin reads.",
    file: "usva.tokens.studio.json",
    data: studio,
  },
];

export function TokenDownloads() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5"
          >
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-ink text-sm">{card.title}</h3>
              <p className="text-muted text-xs">{card.note}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-auto w-fit"
              onClick={() => downloadJson(card.file, card.data)}
            >
              <Download size={14} strokeWidth={1.8} aria-hidden /> download
            </Button>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-ink text-sm">the package</h3>
          <p className="text-muted text-xs">
            theme.css and both theme files ship here.
          </p>
        </div>
        <Terminal
          command="bun add @usva-ui/tokens"
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );
}
