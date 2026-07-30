"use client";
import { List, ListItem } from "@usva-ui/react/primitives/list";
import { ArrowRight, Check } from "lucide-react";
import { Playground } from "@/components/docs/playground";

const AS = ["ul", "ol"] as const;
const MARKERS = ["check", "dot", "dash", "arrow", "none"] as const;

type Config = {
  as: (typeof AS)[number];
  marker: (typeof MARKERS)[number];
  divided: boolean;
};

const base: Config = {
  as: "ul",
  marker: "check",
  divided: true,
};

const templates: Record<string, Config> = {
  checklist: base,
  bullets: { ...base, marker: "dot", divided: false },
  steps: { ...base, as: "ol", marker: "arrow" },
  plain: { ...base, marker: "none", divided: true },
};

const markerNode = (m: Config["marker"]) => {
  switch (m) {
    case "check":
      return <Check aria-hidden="true" strokeWidth={1.8} />;
    case "arrow":
      return <ArrowRight aria-hidden="true" strokeWidth={1.8} />;
    case "dot":
      return <>&bull;</>;
    case "dash":
      return <>&ndash;</>;
    default:
      return null;
  }
};

const markerSource: Record<Config["marker"], string> = {
  check: "<CheckIcon />",
  arrow: "<ArrowIcon />",
  dot: '"•"',
  dash: '"–"',
  none: "",
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.as !== "ul" && `as="${c.as}"`,
    c.marker !== "none" && `marker={${markerSource[c.marker]}}`,
    c.divided && "divided",
  ]
    .filter(Boolean)
    .join(" ");
  return `import { List, ListItem } from "@usva-ui/react/primitives/list";

<List${attrs ? ` ${attrs}` : ""}>
  <ListItem>Runs entirely on your machine</ListItem>
  <ListItem>No tracking, no analytics</ListItem>
  <ListItem>Open source, end to end</ListItem>
</List>`;
};

export function ListDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "as",
          label: "as",
          sub: "ul or ol, by whether order carries meaning",
          options: AS,
        },
        {
          kind: "select",
          key: "marker",
          label: "marker",
          sub: "decorative marker on every item",
          options: MARKERS,
        },
        {
          kind: "switch",
          key: "divided",
          label: "divided",
          sub: "rule between items, not after the last",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <div className="mx-auto w-full max-w-md">
          <List as={c.as} marker={markerNode(c.marker)} divided={c.divided}>
            <ListItem>Runs entirely on your machine</ListItem>
            <ListItem>No tracking, no analytics</ListItem>
            <ListItem>Open source, end to end</ListItem>
          </List>
        </div>
      )}
    />
  );
}
