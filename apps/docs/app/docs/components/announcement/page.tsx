import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { AnnouncementDemo } from "./announcement-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/announcement",
  {
    title: "Announcement",
    description:
      "One line above the fold for a release or a warning you cannot bury. Solid leading badge, short label, optional link with a trailing arrow.",
  },
);

const props = [
  {
    name: "badge",
    type: "ReactNode",
    desc: (
      <>
        the solid leading badge, e.g. <code>NEW</code>. keep it to one word.
      </>
    ),
  },
  {
    name: "tone",
    type: '"live" | "accent" | "accent-alt" | "success" | "warning" | "danger"',
    defaultValue: '"live"',
    desc: "color of the leading badge.",
  },
  {
    name: "href",
    type: "string",
    desc: "renders a real link with a trailing arrow.",
  },
];

export default function AnnouncementPage() {
  return (
    <ComponentDoc
      slug="announcement"
      description={
        <>
          a pill that pairs a solid leading badge with a short label, for
          release notes and the one warning you cannot bury.
        </>
      }
      composition={{
        ok: [
          "sits above the fold, usually over a hero heading",
          "href points at the changelog or the announcement itself",
        ],
        no: [
          "one per page. two announcements cancel each other out",
          "not a row label. status inside content is Badge",
        ],
      }}
      a11y={
        <>
          a plain <code className="font-mono text-xs">span</code> without href,
          a real link with it · the arrow is{" "}
          <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
      dependencies={
        <code className="font-mono text-xs">class-variance-authority</code>
      }
    >
      <AnnouncementDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="announcement"
        usage={`import { Announcement } from "@matt-pasek/usva/primitives/announcement";

<Announcement badge="NEW" tone="live" href="/changelog">
  v2.0.1 just shipped
</Announcement>`}
      />
    </ComponentDoc>
  );
}
