import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { NotificationBadgeDemo } from "./notification-badge-demo";

export const metadata: Metadata = {
  title: "Notification Badge",
  description:
    "An unread count pinned to the corner of an icon or button, capped at a max. It wraps, it does not replace.",
};

const props = [
  {
    name: "count",
    type: "number",
    defaultValue: "0",
    desc: "the count to show. hidden at 0 unless showZero.",
  },
  {
    name: "max",
    type: "number",
    defaultValue: "9",
    desc: 'cap before showing "N+".',
  },
  {
    name: "dot",
    type: "boolean",
    defaultValue: "false",
    desc: "a bare presence dot instead of a number.",
  },
  {
    name: "tone",
    type: '"accent" | "accent-alt" | "danger" | "warning"',
    defaultValue: '"danger"',
    desc: "indicator color.",
  },
  {
    name: "showZero",
    type: "boolean",
    defaultValue: "false",
    desc: "keep the badge visible at 0.",
  },
];

export default function NotificationBadgePage() {
  return (
    <ComponentDoc
      slug="notification-badge"
      description={
        <>
          a small count or dot pinned to the corner of whatever it wraps: an
          icon, a button, an avatar. it vanishes at zero, so silence stays
          silent.
        </>
      }
      composition={{
        ok: [
          "wraps an icon-only Button, an avatar, a nav item",
          "dot mode for presence, count mode for unread",
        ],
        no: [
          "not a status Badge. it counts, it does not label",
          "never on a bare icon with no accessible name of its own",
        ],
      }}
      a11y={
        <>
          the dot is <code className="font-mono text-xs">aria-hidden</code> ·
          the wrapper never steals the child's role or name
        </>
      }
    >
      <NotificationBadgeDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="notification-badge"
        usage={`import { NotificationBadge, Button } from "@matt-pasek/usva";

<NotificationBadge count={42} max={9}>
  <Button variant="outline" iconOnly aria-label="Notifications">
    <BellIcon />
  </Button>
</NotificationBadge>`}
      />
    </ComponentDoc>
  );
}
