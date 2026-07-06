import {
  Card,
  CardBody,
  CardHeader,
  IconButton,
  NotificationBadge,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Notification Badge",
  description:
    "A count or dot indicator overlaid on the corner of any icon or button, with overflow capping.",
};

const Bell = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a2 2 0 0 0 3.4 0" />
  </svg>
);

const props = [
  {
    name: "count",
    type: "number",
    desc: "The count to show. Hidden at 0 unless showZero.",
  },
  {
    name: "max",
    type: "number",
    desc: 'Cap before showing "N+". Defaults to 9.',
  },
  {
    name: "dot",
    type: "boolean",
    desc: "Show a bare dot instead of a number.",
  },
  {
    name: "tone",
    type: '"accent" | "accent-alt" | "danger" | "warning"',
    desc: "Indicator color. Defaults to danger.",
  },
  { name: "showZero", type: "boolean", desc: "Keep the badge visible at 0." },
];

const usage = `import { NotificationBadge, IconButton } from "@matt-pasek/usva";

<NotificationBadge count={42} max={9}>
  <IconButton aria-label="Notifications"><BellIcon /></IconButton>
</NotificationBadge>`;

export default function NotificationBadgePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Notification Badge</h1>
        <p className="text-muted">
          A count or dot indicator overlaid on the corner of any element — an
          icon, a button, an avatar. Caps overflow as <code>N+</code> and hides
          itself at zero.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex items-center gap-6">
            <NotificationBadge count={3}>
              <IconButton aria-label="Notifications">
                <Bell />
              </IconButton>
            </NotificationBadge>
            <NotificationBadge count={42}>
              <IconButton aria-label="Notifications">
                <Bell />
              </IconButton>
            </NotificationBadge>
            <NotificationBadge dot tone="accent-alt">
              <IconButton aria-label="Notifications">
                <Bell />
              </IconButton>
            </NotificationBadge>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="notification-badge" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{usage}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/primitives/notification-badge/notification-badge.tsx" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Props</CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pr-4 font-medium">Prop</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p.name} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-xs text-ink">
                      {p.name}
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-muted">
                      {p.type}
                    </td>
                    <td className="py-2 text-muted">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
