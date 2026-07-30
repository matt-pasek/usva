"use client";
import { Button } from "@usva-ui/react/primitives/button";
import { Callout } from "@usva-ui/react/primitives/callout";
import { Playground } from "@/components/docs/playground";

const TONES = ["neutral", "info", "success", "warning", "danger"] as const;

type Config = {
  tone: (typeof TONES)[number];
  title: string;
  body: string;
  action: boolean;
  dismissible: boolean;
};

const base: Config = {
  tone: "neutral",
  title: "A note",
  body: "Nothing is wrong. This is just context that has to stay on the page.",
  action: false,
  dismissible: false,
};

const templates: Record<string, Config> = {
  note: base,
  "heads up": {
    ...base,
    tone: "info",
    title: "Heads up",
    body: "The next release moves this export to a subpath.",
  },
  "with an action": {
    ...base,
    tone: "warning",
    title: "Rate limit reached",
    body: "You have used 4,900 of your 5,000 requests this hour.",
    action: true,
  },
  "error summary": {
    ...base,
    tone: "danger",
    title: "Upload failed",
    body: "The file was larger than the 25 MB limit.",
  },
  dismissible: {
    ...base,
    tone: "success",
    title: "Saved",
    body: "Your changes are live.",
    dismissible: true,
  },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.tone !== "neutral" && `tone="${c.tone}"`,
    c.title && `title="${c.title}"`,
    c.dismissible && "dismissible",
    c.action &&
      'action={<Button size="sm" variant="outline">Upgrade plan</Button>}',
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Callout } from "@usva-ui/react/primitives/callout";

<Callout${attrs ? ` ${attrs}` : ""}>
  ${c.body}
</Callout>`;
};

export function CalloutDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "tone",
          label: "tone",
          sub: "neutral says nothing, danger interrupts",
          options: TONES,
        },
        {
          kind: "text",
          key: "title",
          label: "title",
          sub: "optional. the body can stand alone",
        },
        {
          kind: "text",
          key: "body",
          label: "body",
          sub: "what the reader has to know",
        },
        {
          kind: "switch",
          key: "action",
          label: "action",
          sub: "one button on the end of the block",
        },
        {
          kind: "switch",
          key: "dismissible",
          label: "dismissible",
          sub: "adds a close button. off by default",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Callout
          key={`${c.tone}-${c.title}-${c.body}-${c.action}-${c.dismissible}`}
          tone={c.tone}
          title={c.title || undefined}
          dismissible={c.dismissible}
          action={
            c.action ? (
              <Button size="sm" variant="outline">
                Upgrade plan
              </Button>
            ) : undefined
          }
          className="max-w-md"
        >
          {c.body}
        </Callout>
      )}
    />
  );
}
