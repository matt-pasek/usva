"use client";
import { LoadingOverlay } from "@usva-ui/react/primitives/loading-overlay";
import { Playground } from "@/components/docs/playground";

const VARIANTS = ["ring", "dots", "bars", "orbit"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const TONES = ["accent", "current"] as const;

type Config = {
  variant: (typeof VARIANTS)[number];
  size: (typeof SIZES)[number];
  tone: (typeof TONES)[number];
  label: string;
  blur: boolean;
};

const base: Config = {
  variant: "ring",
  size: "lg",
  tone: "accent",
  label: "Fetching courses",
  blur: true,
};

const templates: Record<string, Config> = {
  "over a panel": { ...base },
  "scrim only": { ...base, variant: "bars", blur: false, label: "" },
  dots: { ...base, variant: "dots", label: "Syncing" },
  orbit: { ...base, variant: "orbit", size: "md", label: "Loading dashboard" },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.variant !== "ring" && `variant="${c.variant}"`,
    c.size !== "lg" && `size="${c.size}"`,
    c.tone !== "accent" && `tone="${c.tone}"`,
    c.label && `label="${c.label}"`,
    !c.blur && "blur={false}",
  ]
    .filter(Boolean)
    .join(" ");
  return `import { LoadingOverlay } from "@usva-ui/react/primitives/loading-overlay";

<div className="relative">
  <LoadingOverlay${attrs ? ` ${attrs}` : ""} />
</div>`;
};

export function LoadingOverlayDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "variant",
          label: "variant",
          sub: "spinner shape",
          options: VARIANTS,
        },
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "spinner scale",
          options: SIZES,
        },
        {
          kind: "select",
          key: "tone",
          label: "tone",
          sub: "accent or inherited text color",
          options: TONES,
        },
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "announced and shown as caption",
        },
        {
          kind: "switch",
          key: "blur",
          label: "blur",
          sub: "backdrop blur behind the scrim",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-muted">
            content underneath, dimmed by the overlay.
          </p>
          <LoadingOverlay
            contain="parent"
            variant={c.variant}
            size={c.size}
            tone={c.tone}
            label={c.label || undefined}
            blur={c.blur}
          />
        </div>
      )}
    />
  );
}
