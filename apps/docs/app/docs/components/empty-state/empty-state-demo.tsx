"use client";
import { EmptyState } from "@usva-ui/react/patterns/empty-state";
import { Button } from "@usva-ui/react/primitives/button";
import { Folder } from "lucide-react";
import { Playground } from "@/components/docs/playground";

const VARIANTS = ["solid", "dashed"] as const;

type Config = {
  variant: (typeof VARIANTS)[number];
  title: string;
  description: string;
  showIcon: boolean;
  showAction: boolean;
  actionLabel: string;
};

const base: Config = {
  variant: "solid",
  title: "No projects yet",
  description: "Create your first project to see it show up here.",
  showIcon: true,
  showAction: true,
  actionLabel: "New project",
};

const templates: Record<string, Config> = {
  "no data": base,
  invitation: {
    ...base,
    variant: "dashed",
    title: "Nothing pinned",
    description: "Pin an item and it will appear in this space.",
    showIcon: false,
    actionLabel: "Browse items",
  },
  minimal: {
    ...base,
    title: "All caught up",
    description: "There is nothing left to review.",
    showIcon: false,
    showAction: false,
  },
};

const icon = <Folder aria-hidden="true" strokeWidth={1.8} />;

const snippetFor = (c: Config): string => {
  const lines = [
    "<EmptyState",
    c.variant !== "solid" && `  variant="${c.variant}"`,
    c.showIcon && "  icon={<FolderIcon />}",
    `  title="${c.title}"`,
    `  description="${c.description}"`,
    c.showAction && `  action={<Button>${c.actionLabel}</Button>}`,
    "/>",
  ].filter(Boolean);
  return `import { EmptyState } from "@usva-ui/react/patterns/empty-state";
import { Button } from "@usva-ui/react/primitives/button";

${lines.join("\n")}`;
};

export function EmptyStateDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "variant",
          label: "variant",
          sub: "solid surface or dashed outline",
          options: VARIANTS,
        },
        {
          kind: "text",
          key: "title",
          label: "title",
          sub: "the primary message",
        },
        {
          kind: "text",
          key: "description",
          label: "description",
          sub: "supporting copy below the title",
        },
        {
          kind: "switch",
          key: "showIcon",
          label: "icon",
          sub: "glyph badge above the title",
        },
        {
          kind: "switch",
          key: "showAction",
          label: "action",
          sub: "the way out of empty",
        },
        {
          kind: "text",
          key: "actionLabel",
          label: "actionLabel",
          sub: "text on the action button",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <div className="mx-auto w-full max-w-xl">
          <EmptyState
            variant={c.variant}
            icon={c.showIcon ? icon : undefined}
            title={c.title}
            description={c.description}
            action={c.showAction ? <Button>{c.actionLabel}</Button> : undefined}
          />
        </div>
      )}
    />
  );
}
