import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { CalloutDemo } from "./callout-demo";

export const metadata: Metadata = pageMetadata("/docs/components/callout", {
  title: "Callout",
  description:
    "A note that sits in the flow and stays there, in five tones, carrying a warning, an aside or an error summary.",
});

const props = [
  {
    name: "tone",
    type: '"neutral" | "info" | "success" | "warning" | "danger"',
    defaultValue: '"neutral"',
    desc: "picks the tint, the icon and the dot. neutral gets none of the three.",
  },
  {
    name: "title",
    type: "ReactNode",
    desc: "optional heading above the body. the body can stand alone.",
  },
  {
    name: "action",
    type: "ReactNode",
    desc: "one control on the end of the block. more than one belongs on the page.",
  },
  {
    name: "icon",
    type: "ReactNode | false",
    desc: "swaps the tone icon, or false drops it.",
  },
  {
    name: "dismissible",
    type: "boolean",
    defaultValue: "false",
    desc: "adds a close button. off by default, because a callout that leaves is a toast.",
  },
  {
    name: "onDismiss",
    type: "() => void",
    desc: "fires after the close button removes the callout.",
  },
  {
    name: "dismissLabel",
    type: "string",
    defaultValue: '"Dismiss"',
    desc: "accessible name on the close button.",
  },
  {
    name: "role",
    type: '"status" | "alert"',
    desc: "status on the calm tones, alert on danger. pass it to override.",
  },
];

export default function CalloutPage() {
  return (
    <ComponentDoc
      slug="callout"
      client
      description={
        <>
          a note that sits in the flow and stays there. a toast leaves on its
          own and an Announcement links somewhere. this one waits to be read.
        </>
      }
      composition={{
        ok: [
          "an error summary at the top of a form, or a warning on a docs page",
          "one action on the end, when there is something to do about it",
        ],
        no: [
          "not for a transient confirmation. that is a toast",
          "danger for anything you would not interrupt a screen reader for",
          "never stack four in a row. that is a page with no hierarchy",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="status"</code> on the calm
          tones, so a change is announced politely ·{" "}
          <code className="font-mono text-xs">role="alert"</code> only on
          danger, because alert cuts a screen reader off mid sentence · the tone
          icon is <code className="font-mono text-xs">aria-hidden</code>, so
          tone is never the only carrier
        </>
      }
    >
      <CalloutDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="callout"
        usage={`import { Callout } from "@usva-ui/react/primitives/callout";

<Callout title="A note">Nothing is wrong. This is just context.</Callout>

<Callout tone="warning" title="Rate limit reached">
  You have used 4,900 of your 5,000 requests this hour.
</Callout>

<Callout tone="danger" title="Upload failed" dismissible>
  The file was larger than the 25 MB limit.
</Callout>`}
      />
    </ComponentDoc>
  );
}
