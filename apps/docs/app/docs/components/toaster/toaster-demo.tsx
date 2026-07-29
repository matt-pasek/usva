"use client";
import { Button } from "usva/primitives/button";
import { notify, Toaster } from "usva/primitives/toast";
import { Playground } from "@/components/docs/playground";

type Config = { limit: number; timeout: number };

const templates: Record<string, Config> = {
  default: { limit: 3, timeout: 5000 },
  "one at a time": { limit: 1, timeout: 5000 },
  patient: { limit: 3, timeout: 12000 },
  stacked: { limit: 6, timeout: 8000 },
};

const snippetFor = (c: Config): string =>
  `import { Toaster } from "usva/primitives/toast";

// once, at the root of the app
<Toaster${c.limit !== 3 ? ` limit={${c.limit}}` : ""}${c.timeout !== 5000 ? ` timeout={${c.timeout}}` : ""} />`;

export function ToasterDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "slider",
          key: "limit",
          label: "limit",
          sub: "how many stack before the oldest goes",
          min: 1,
          max: 6,
          step: 1,
        },
        {
          kind: "slider",
          key: "timeout",
          label: "timeout",
          sub: "ms before one dismisses itself",
          min: 2000,
          max: 12000,
          step: 500,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <>
          {/* Keyed so a changed limit or timeout remounts the provider. */}
          <Toaster
            key={`${c.limit}-${c.timeout}`}
            limit={c.limit}
            timeout={c.timeout}
          />
          <Button
            size="sm"
            onClick={() =>
              notify.success("saved", {
                description: "the sky is on its way to your clipboard.",
              })
            }
          >
            send one
          </Button>
        </>
      )}
    />
  );
}
