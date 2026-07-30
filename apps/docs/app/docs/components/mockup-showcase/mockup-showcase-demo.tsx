"use client";
import { MockupShowcase } from "@usva-ui/react/patterns/mockup-showcase";
import { Playground } from "@/components/docs/playground";

const FRAMES = ["browser", "device", "none"] as const;
const ASPECTS = ["16/10", "16/9", "4/3", "1/1", "9/16", "21/9"] as const;

type Config = {
  frame: (typeof FRAMES)[number];
  url: string;
  aspect: (typeof ASPECTS)[number];
};

const base: Config = {
  frame: "browser",
  url: "usva.dev",
  aspect: "16/10",
};

const templates: Record<string, Config> = {
  browser: base,
  device: { ...base, frame: "device", aspect: "9/16" },
  bare: { ...base, frame: "none", aspect: "21/9" },
  square: { ...base, aspect: "1/1" },
};

function Placeholder() {
  return (
    <div className="grid h-full w-full place-items-center bg-accent-tint font-mono text-xs text-on-tint">
      your screenshot here
    </div>
  );
}

const snippetFor = (c: Config): string => {
  const attrs = [
    c.frame !== "browser" && `frame="${c.frame}"`,
    c.frame === "browser" && c.url && `url="${c.url}"`,
    c.aspect !== "16/10" && `aspect="${c.aspect}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { MockupShowcase } from "@usva-ui/react/patterns/mockup-showcase";

<MockupShowcase${attrs ? ` ${attrs}` : ""}>
  <Image src={shot} alt="The usva docs homepage" />
</MockupShowcase>`;
};

export function MockupShowcaseDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="mx-auto max-w-md w-full"
      fields={[
        {
          kind: "select",
          key: "frame",
          label: "frame",
          sub: "which chrome to draw",
          options: FRAMES,
        },
        {
          kind: "select",
          key: "aspect",
          label: "aspect",
          sub: "aspect-ratio of the media well",
          options: ASPECTS,
        },
        {
          kind: "text",
          key: "url",
          label: "url",
          sub: "address bar text, browser frame only",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <MockupShowcase
          frame={c.frame}
          url={c.frame === "browser" ? c.url : undefined}
          aspect={c.aspect}
        >
          <Placeholder />
        </MockupShowcase>
      )}
    />
  );
}
