import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { TabsDemo } from "./tabs-demo";

export const metadata: Metadata = pageMetadata("/docs/components/tabs", {
  title: "Tabs",
  description:
    "Peer views in one region, one panel at a time. Not steps, and never a way to hide required fields.",
});

const rootProps = [
  {
    name: "value",
    type: "Value | null",
    desc: "controlled active tab.",
  },
  {
    name: "defaultValue",
    type: "Value | null",
    desc: "initial active tab when uncontrolled.",
  },
  {
    name: "onValueChange",
    type: "(value, eventDetails) => void",
    desc: "fires when the active tab changes.",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    desc: "vertical stacks the list and moves the indicator to its edge.",
  },
];

const listProps = [
  {
    name: "variant",
    type: '"pill" | "underline"',
    defaultValue: '"pill"',
    desc: "pill slides a raised surface behind the tab; underline slides a hairline along the list edge.",
  },
  {
    name: "activateOnFocus",
    type: "boolean",
    defaultValue: "true",
    desc: "arrow keys switch panels as focus moves, not on a second Enter.",
  },
];

export default function TabsPage() {
  return (
    <ComponentDoc
      slug="tabs"
      client
      description={
        <>
          one panel at a time, picked from a row of peer tabs. the active tab
          takes a single indicator, a pill or a hairline, never both.
        </>
      }
      composition={{
        ok: [
          "settings and detail views where sections are true peers",
          "vertical orientation for a settings rail beside its panels",
        ],
        no: [
          "not navigation between pages. tabs never change the url",
          "not for sequential steps. a wizard has order, tabs do not",
        ],
      }}
      a11y={
        <>
          real <code className="font-mono text-xs">tab</code> /{" "}
          <code className="font-mono text-xs">tabpanel</code> roles · one tab
          stop into the list, arrows rove and activate · disabled tabs stay
          visible at 50%
        </>
      }
      dependencies={<code className="font-mono text-xs">@base-ui/react</code>}
    >
      <TabsDemo />

      <PropsTable title="Tabs" rows={rootProps} />
      <PropsTable title="Tabs.List" rows={listProps} />

      <AcquireSection
        registryName="tabs"
        usage={`import { Tabs } from "@matt-pasek/usva/primitives/tabs";

<Tabs defaultValue="account">
  <Tabs.List>
    <Tabs.Tab value="account">Account</Tabs.Tab>
    <Tabs.Tab value="password">Password</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="account">Manage your account details.</Tabs.Panel>
  <Tabs.Panel value="password">Change your password.</Tabs.Panel>
</Tabs>`}
      />
    </ComponentDoc>
  );
}
