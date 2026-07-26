"use client";
import { Tabs } from "@matt-pasek/usva/primitives/tabs";
import { useState } from "react";
import { Playground } from "@/components/docs/playground";

const VARIANTS = ["pill", "underline"] as const;
const ORIENTATIONS = ["horizontal", "vertical"] as const;

type Config = {
  variant: (typeof VARIANTS)[number];
  orientation: (typeof ORIENTATIONS)[number];
  activateOnFocus: boolean;
  disabledTab: boolean;
};

const base: Config = {
  variant: "pill",
  orientation: "horizontal",
  activateOnFocus: true,
  disabledTab: false,
};

const templates: Record<string, Config> = {
  "settings pills": base,
  "underline row": { ...base, variant: "underline" },
  "settings rail": { ...base, orientation: "vertical" },
  "with disabled": { ...base, disabledTab: true },
};

const snippetFor = (c: Config): string => {
  const rootAttrs = [
    'defaultValue="account"',
    c.orientation !== "horizontal" && `orientation="${c.orientation}"`,
  ]
    .filter(Boolean)
    .join(" ");
  const listAttrs = [
    c.variant !== "pill" && `variant="${c.variant}"`,
    !c.activateOnFocus && "activateOnFocus={false}",
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Tabs } from "@matt-pasek/usva/primitives/tabs";

<Tabs ${rootAttrs}>
  <Tabs.List${listAttrs ? ` ${listAttrs}` : ""}>
    <Tabs.Tab value="account">Account</Tabs.Tab>
    <Tabs.Tab value="password">Password</Tabs.Tab>
    <Tabs.Tab value="team"${c.disabledTab ? " disabled" : ""}>Team</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="account">Manage your account details.</Tabs.Panel>
  <Tabs.Panel value="password">Change your password.</Tabs.Panel>
  <Tabs.Panel value="team">Invite and manage teammates.</Tabs.Panel>
</Tabs>`;
};

function TabsPreview({ config }: { config: Config }) {
  const [value, setValue] = useState("account");
  const vertical = config.orientation === "vertical";

  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      orientation={config.orientation}
      className={vertical ? "flex w-full gap-6" : "w-full"}
    >
      <Tabs.List
        variant={config.variant}
        activateOnFocus={config.activateOnFocus}
      >
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="password">Password</Tabs.Tab>
        <Tabs.Tab value="team" disabled={config.disabledTab}>
          Team
        </Tabs.Tab>
      </Tabs.List>
      <div className={vertical ? "flex-1" : undefined}>
        <Tabs.Panel value="account">Manage your account details.</Tabs.Panel>
        <Tabs.Panel value="password">Change your password.</Tabs.Panel>
        <Tabs.Panel value="team">Invite and manage teammates.</Tabs.Panel>
      </div>
    </Tabs>
  );
}

export function TabsDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="min-h-24 w-full"
      fields={[
        {
          kind: "select",
          key: "variant",
          label: "variant",
          sub: "pill surface or hairline underline",
          options: VARIANTS,
        },
        {
          kind: "select",
          key: "orientation",
          label: "orientation",
          sub: "row of tabs or a side rail",
          options: ORIENTATIONS,
        },
        {
          kind: "switch",
          key: "activateOnFocus",
          label: "activateOnFocus",
          sub: "arrows switch panels as focus moves",
        },
        {
          kind: "switch",
          key: "disabledTab",
          label: "disabledTab",
          sub: "the team tab stays visible at 50%",
        },
      ]}
      snippet={snippetFor}
      render={(c) => <TabsPreview config={c} />}
    />
  );
}
