"use client";
import { cn } from "@usva-ui/react/cn";
import { Button } from "@usva-ui/react/primitives/button";
import { Copy } from "lucide-react";
import { Playground } from "@/components/docs/playground";

const VARIANTS = [
  "solid",
  "soft",
  "outline",
  "ghost",
  "onSurface",
  "glass",
] as const;
const SIZES = ["sm", "md", "lg"] as const;
const SHAPES = ["rounded", "pill"] as const;

type Config = {
  variant: (typeof VARIANTS)[number];
  size: (typeof SIZES)[number];
  shape: (typeof SHAPES)[number];
  label: string;
  loading: boolean;
  disabled: boolean;
  iconOnly: boolean;
};

const base: Config = {
  variant: "solid",
  size: "md",
  shape: "rounded",
  label: "Save changes",
  loading: false,
  disabled: false,
  iconOnly: false,
};

const templates: Record<string, Config> = {
  "primary action": base,
  "dense row": { ...base, variant: "soft", size: "sm", label: "Assign" },
  "quiet dismiss": { ...base, variant: "ghost", label: "Dismiss" },
  "tonal on surface": {
    ...base,
    variant: "onSurface",
    label: "View case study",
  },
  "glass over a canvas": {
    ...base,
    variant: "glass",
    shape: "pill",
    size: "sm",
    label: "download png",
  },
  "busy save": { ...base, loading: true },
  "icon action": { ...base, variant: "outline", label: "Copy", iconOnly: true },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.iconOnly && `iconOnly aria-label="${c.label}" tooltip="copy"`,
    c.variant !== "solid" && `variant="${c.variant}"`,
    c.size !== "md" && `size="${c.size}"`,
    c.shape !== "rounded" && `shape="${c.shape}"`,
    c.loading &&
      (c.iconOnly
        ? `status="loading"`
        : `status="loading" loadingText="Saving"`),
    c.disabled && "disabled",
  ]
    .filter(Boolean)
    .join(" ");

  const child = c.iconOnly ? "<CopyIcon />" : c.label;
  return `import { Button } from "@usva-ui/react/primitives/button";

<Button${attrs ? ` ${attrs}` : ""}>${child}</Button>`;
};

export function ButtonDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "variant",
          label: "variant",
          sub: "visual weight",
          options: VARIANTS,
        },
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "density",
          options: SIZES,
        },
        {
          kind: "select",
          key: "shape",
          label: "shape",
          sub: "pill fully rounds it",
          options: SHAPES,
        },
        {
          kind: "switch",
          key: "iconOnly",
          label: "icon only",
          sub: "square, needs aria-label",
        },
        {
          kind: "switch",
          key: "loading",
          label: "loading",
          sub: "still focusable",
        },
        {
          kind: "switch",
          key: "disabled",
          label: "disabled",
          sub: "prefer an inline error",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <div
          className={cn(
            "flex min-h-24 w-full items-center justify-center",
            c.variant === "onSurface" && "rounded-xl bg-gradient-accent p-8",
            c.variant === "glass" &&
              "rounded-xl bg-[radial-gradient(circle_at_30%_20%,#3a2d6b,#0a0613)] p-8",
          )}
        >
          <Button
            variant={c.variant}
            size={c.size}
            shape={c.shape}
            iconOnly={c.iconOnly}
            aria-label={c.iconOnly ? c.label : undefined}
            tooltip={c.iconOnly ? "copy" : undefined}
            disabled={c.disabled}
            status={c.loading ? "loading" : "idle"}
            loadingText={c.iconOnly ? undefined : "Saving"}
          >
            {c.iconOnly ? (
              <Copy aria-hidden="true" size={16} strokeWidth={1.8} />
            ) : (
              c.label
            )}
          </Button>
        </div>
      )}
    />
  );
}
