"use client";
import { Button } from "@usva-ui/react/primitives/button";
import { NotificationBadge } from "@usva-ui/react/primitives/notification-badge";
import { Bell } from "lucide-react";
import { Playground } from "@/components/docs/playground";

const TONES = ["danger", "accent", "accent-alt", "warning"] as const;

type Config = {
  count: number;
  max: number;
  dot: boolean;
  tone: (typeof TONES)[number];
  showZero: boolean;
};

const base: Config = {
  count: 3,
  max: 9,
  dot: false,
  tone: "danger",
  showZero: false,
};

const templates: Record<string, Config> = {
  "unread count": base,
  capped: { ...base, count: 42 },
  "presence dot": { ...base, dot: true, tone: "accent-alt" },
  "show zero": { ...base, count: 0, showZero: true },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.dot ? "dot" : `count={${c.count}}`,
    !c.dot && c.max !== 9 && `max={${c.max}}`,
    c.tone !== "danger" && `tone="${c.tone}"`,
    !c.dot && c.showZero && "showZero",
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Button } from "@usva-ui/react/primitives/button";
import { NotificationBadge } from "@usva-ui/react/primitives/notification-badge";

<NotificationBadge ${attrs}>
  <Button variant="outline" iconOnly aria-label="Notifications">
    <BellIcon />
  </Button>
</NotificationBadge>`;
};

export function NotificationBadgeDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "slider",
          key: "count",
          label: "count",
          sub: "the number shown",
          min: 0,
          max: 20,
          step: 1,
        },
        {
          kind: "slider",
          key: "max",
          label: "max",
          sub: "cap before N+",
          min: 1,
          max: 20,
          step: 1,
        },
        {
          kind: "switch",
          key: "dot",
          label: "dot",
          sub: "bare presence dot, no number",
        },
        {
          kind: "select",
          key: "tone",
          label: "tone",
          sub: "indicator colour",
          options: TONES,
        },
        {
          kind: "switch",
          key: "showZero",
          label: "showZero",
          sub: "stay visible at 0",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <NotificationBadge
          count={c.count}
          max={c.max}
          dot={c.dot}
          tone={c.tone}
          showZero={c.showZero}
        >
          <Button variant="outline" iconOnly aria-label="Notifications">
            <Bell aria-hidden="true" strokeWidth={1.8} />
          </Button>
        </NotificationBadge>
      )}
    />
  );
}
