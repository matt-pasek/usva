"use client";
import { Badge, Panel } from "@matt-pasek/usva";
import { cn } from "@matt-pasek/usva/cn";
import { Playground } from "@/components/docs/playground";

type RunStatus = "live" | "building" | "failed" | "queued";

const runs: {
  branch: string;
  hash: string;
  when: string;
  status: RunStatus;
}[] = [
  {
    branch: "feat/docs",
    hash: "1ec3bbc",
    when: "just now",
    status: "building",
  },
  {
    branch: "fix/hero-split",
    hash: "0df772e",
    when: "14m ago",
    status: "live",
  },
  { branch: "chore/tokens", hash: "c74cf7c", when: "1h ago", status: "live" },
  {
    branch: "feat/color-field",
    hash: "fa17ccd",
    when: "3h ago",
    status: "live",
  },
  {
    branch: "fix/bento-grid",
    hash: "9d2d01e",
    when: "5h ago",
    status: "failed",
  },
  {
    branch: "feat/segmented",
    hash: "8b21f04",
    when: "yesterday",
    status: "live",
  },
  {
    branch: "chore/registry",
    hash: "a90c7d1",
    when: "yesterday",
    status: "queued",
  },
];

const statusStyle: Record<RunStatus, { dot: string; label: string }> = {
  live: { dot: "bg-accent-alt", label: "text-accent-alt" },
  building: { dot: "bg-[#f0a04b]", label: "text-[#f0a04b]" },
  failed: { dot: "bg-danger", label: "text-danger" },
  queued: { dot: "bg-muted", label: "text-muted" },
};

function DeploymentList() {
  return (
    <ul className="flex flex-col">
      {runs.map((run) => {
        const style = statusStyle[run.status];
        return (
          <li
            key={run.hash}
            className="flex items-center justify-between gap-4 border-b border-border/60 py-3 first:pt-0 last:border-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className={cn("size-2 shrink-0 rounded-full", style.dot)} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {run.branch}
                </p>
                <p className="font-mono text-xs text-muted">
                  {run.hash} · {run.when}
                </p>
              </div>
            </div>
            <span className={cn("shrink-0 font-mono text-xs", style.label)}>
              {run.status}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const SURFACES = ["elevated", "flat", "glass", "outline"] as const;

type Config = {
  eyebrow: string;
  title: string;
  surface: (typeof SURFACES)[number];
  badge: boolean;
  loading: boolean;
};

const base: Config = {
  eyebrow: "overview",
  title: "Deployments",
  surface: "elevated",
  badge: true,
  loading: false,
};

const templates: Record<string, Config> = {
  "dashboard cell": base,
  loading: { ...base, loading: true },
  "flat, no badge": { ...base, surface: "flat", badge: false },
  glass: {
    ...base,
    surface: "glass",
    eyebrow: "activity",
    title: "Recent runs",
  },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.eyebrow && `eyebrow="${c.eyebrow}"`,
    `title="${c.title}"`,
    c.surface !== "elevated" && `surface="${c.surface}"`,
    c.badge && 'badge={<Badge tone="accent-alt" live>live</Badge>}',
    c.loading && "loading",
  ]
    .filter(Boolean)
    .join("\n  ");
  return `import { Badge, Panel } from "@matt-pasek/usva";

<Panel
  ${attrs}
>
  <DeploymentList />
</Panel>`;
};

export function PanelDemo() {
  return (
    <Playground<Config>
      templates={templates}
      note="in a 288px-tall box. the body scrolls when it overflows"
      fields={[
        {
          kind: "text",
          key: "eyebrow",
          label: "eyebrow",
          sub: "mono label above the title",
        },
        {
          kind: "text",
          key: "title",
          label: "title",
          sub: "the panel heading",
        },
        {
          kind: "select",
          key: "surface",
          label: "surface",
          sub: "how it sits on the page",
          options: SURFACES,
        },
        {
          kind: "switch",
          key: "badge",
          label: "badge",
          sub: "a status Badge in the header",
        },
        {
          kind: "switch",
          key: "loading",
          label: "loading",
          sub: "swaps the body for a Spinner",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <div className="h-72 w-full">
          <Panel
            eyebrow={c.eyebrow || undefined}
            title={c.title}
            surface={c.surface}
            loading={c.loading}
            badge={
              c.badge ? (
                <Badge tone="accent-alt" live>
                  live
                </Badge>
              ) : undefined
            }
          >
            <DeploymentList />
          </Panel>
        </div>
      )}
    />
  );
}
