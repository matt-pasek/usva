"use client";
import {
  Button,
  Card,
  CardActions,
  CardBadge,
  CardBody,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardIcon,
  CardTitle,
} from "@matt-pasek/usva";
import { Playground } from "@/components/docs/playground";

const SURFACES = ["elevated", "flat", "glass", "outline"] as const;
const HIGHLIGHTS = ["none", "wash", "edge", "ring"] as const;

type Config = {
  surface: (typeof SURFACES)[number];
  highlight: (typeof HIGHLIGHTS)[number];
  interactive: boolean;
  row: boolean;
};

const base: Config = {
  surface: "elevated",
  highlight: "none",
  interactive: false,
  row: false,
};

const templates: Record<string, Config> = {
  deployment: { ...base, interactive: true, row: true },
  selected: { ...base, highlight: "ring" },
  "glass panel": { ...base, surface: "glass", highlight: "wash" },
  outline: { ...base, surface: "outline", highlight: "edge" },
};

const attrLine = (c: Config): string => {
  const attrs = [
    c.surface !== "elevated" && `surface="${c.surface}"`,
    c.highlight !== "none" && `highlight="${c.highlight}"`,
    c.interactive && "interactive",
  ]
    .filter(Boolean)
    .join(" ");
  return attrs ? ` ${attrs}` : "";
};

const snippetFor = (c: Config): string => {
  const header = c.row
    ? `  <CardHeader row>
    <CardIcon><BoltIcon /></CardIcon>
    <div className="flex flex-col gap-1">
      <CardEyebrow>Deployment</CardEyebrow>
      <CardTitle>Production build</CardTitle>
    </div>
    <CardActions>
      <CardBadge tone="success">live</CardBadge>
    </CardActions>
  </CardHeader>`
    : `  <CardHeader>
    <CardEyebrow>Deployment</CardEyebrow>
    <CardTitle>Production build</CardTitle>
  </CardHeader>`;

  return `import {
  Card, CardHeader, CardIcon, CardEyebrow, CardTitle,
  CardActions, CardBadge, CardBody, CardFooter,
} from "@matt-pasek/usva";

<Card${attrLine(c)}>
${header}
  <CardBody>Shipped 4 minutes ago.</CardBody>
  <CardFooter>
    <Button size="sm" variant="outline">View logs</Button>
  </CardFooter>
</Card>`;
};

export function CardDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "surface",
          label: "surface",
          sub: "how the card sits on the page",
          options: SURFACES,
        },
        {
          kind: "select",
          key: "highlight",
          label: "highlight",
          sub: "accent wash, edge, or full ring",
          options: HIGHLIGHTS,
        },
        {
          kind: "switch",
          key: "interactive",
          label: "interactive",
          sub: "lifts on hover for clickable cards",
        },
        {
          kind: "switch",
          key: "row",
          label: "row (CardHeader)",
          sub: "icon + title + actions inline",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Card
          surface={c.surface}
          highlight={c.highlight}
          interactive={c.interactive}
          className="w-full max-w-sm"
        >
          <CardHeader row={c.row}>
            {c.row ? (
              <>
                <CardIcon>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
                      fill="currentColor"
                    />
                  </svg>
                </CardIcon>
                <div className="flex flex-col gap-1">
                  <CardEyebrow>Deployment</CardEyebrow>
                  <CardTitle>Production build</CardTitle>
                </div>
                <CardActions>
                  <CardBadge tone="success">live</CardBadge>
                </CardActions>
              </>
            ) : (
              <>
                <CardEyebrow>Deployment</CardEyebrow>
                <CardTitle>Production build</CardTitle>
              </>
            )}
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted">Shipped 4 minutes ago.</p>
          </CardBody>
          <CardFooter>
            <Button size="sm" variant="outline">
              View logs
            </Button>
            <Button size="sm" variant="ghost">
              Roll back
            </Button>
          </CardFooter>
        </Card>
      )}
    />
  );
}
