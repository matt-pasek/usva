"use client";
import { Dialog } from "@matt-pasek/usva";
import { Playground } from "@/components/docs/playground";

const SURFACES = ["elevated", "flat", "glass"] as const;
const HIGHLIGHTS = ["none", "wash", "edge", "ring"] as const;
const MODALS = ["true", "trap-focus", "false"] as const;

type Config = {
  surface: (typeof SURFACES)[number];
  highlight: (typeof HIGHLIGHTS)[number];
  modal: (typeof MODALS)[number];
  title: string;
  description: string;
  confirm: boolean;
};

const base: Config = {
  surface: "elevated",
  highlight: "none",
  modal: "true",
  title: "Confirm action",
  description: "This can't be undone. Are you sure you want to continue?",
  confirm: true,
};

const templates: Record<string, Config> = {
  confirm: base,
  destructive: {
    ...base,
    title: "Delete project",
    description: "Every file, deploy and secret goes with it.",
  },
  glass: {
    ...base,
    surface: "glass",
    title: "Sign in",
    description: "A blurred pane that keeps the page visible behind it.",
    confirm: false,
  },
  "accent wash": {
    ...base,
    highlight: "wash",
    title: "You're invited",
    description: "An accent wash warms the surface from the top corner.",
  },
  "non-modal": {
    ...base,
    modal: "false",
    title: "Heads up",
    description: "The page stays scrollable and clickable behind this one.",
    confirm: false,
  },
};

const modalValue = (m: Config["modal"]) =>
  m === "trap-focus" ? '"trap-focus"' : m;

const snippetFor = (c: Config): string => {
  const rootAttrs = c.modal !== "true" ? ` modal={${modalValue(c.modal)}}` : "";
  const surfaceAttr = c.surface !== "elevated" ? ` surface="${c.surface}"` : "";
  const highlightAttr =
    c.highlight !== "none" ? ` highlight="${c.highlight}"` : "";
  return `import { Dialog } from "@matt-pasek/usva";

<Dialog${rootAttrs}>
  <Dialog.Trigger>Open dialog</Dialog.Trigger>
  <Dialog.Content${surfaceAttr}${highlightAttr}>
    <Dialog.Title>${c.title}</Dialog.Title>
    <Dialog.Description>${c.description}</Dialog.Description>
    <div className="mt-4 flex justify-end gap-2">
      <Dialog.Close>Cancel</Dialog.Close>${
        c.confirm
          ? `
      <button type="button">Confirm</button>`
          : ""
      }
    </div>
  </Dialog.Content>
</Dialog>`;
};

const modalProp = (m: Config["modal"]): boolean | "trap-focus" =>
  m === "true" ? true : m === "false" ? false : "trap-focus";

export function DialogDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "surface",
          label: "surface",
          sub: "how content sits above the scrim",
          options: SURFACES,
        },
        {
          kind: "select",
          key: "highlight",
          label: "highlight",
          sub: "wash, top edge, or glow ring",
          options: HIGHLIGHTS,
        },
        {
          kind: "select",
          key: "modal",
          label: "modal",
          sub: "focus trap, scroll lock, outside-pointer",
          options: MODALS,
        },
        {
          kind: "text",
          key: "title",
          label: "title",
          sub: "names the dialog for screen readers",
        },
        {
          kind: "text",
          key: "description",
          label: "description",
          sub: "the body copy",
        },
        {
          kind: "switch",
          key: "confirm",
          label: "confirm",
          sub: "add an accent button beside cancel",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Dialog modal={modalProp(c.modal)}>
          <Dialog.Trigger className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink transition-colors hover:bg-surface-2">
            Open dialog
          </Dialog.Trigger>
          <Dialog.Content surface={c.surface} highlight={c.highlight}>
            <Dialog.Title>{c.title}</Dialog.Title>
            <Dialog.Description>{c.description}</Dialog.Description>
            <div className="mt-4 flex justify-end gap-2">
              <Dialog.Close className="rounded-md border border-border px-3 py-1.5 text-sm text-ink transition-colors hover:bg-surface-2">
                Cancel
              </Dialog.Close>
              {c.confirm ? (
                <Dialog.Close className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent/90">
                  Confirm
                </Dialog.Close>
              ) : null}
            </div>
          </Dialog.Content>
        </Dialog>
      )}
    />
  );
}
