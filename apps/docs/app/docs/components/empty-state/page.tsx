import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { EmptyStateDemo } from "./empty-state-demo";

export const metadata: Metadata = {
  title: "Empty State",
  description:
    "Nothing here yet, and the one thing to do about it: an icon, a message, and a single action.",
};

const props = [
  {
    name: "icon",
    type: "React.ReactNode",
    desc: "glyph in a rounded badge above the title. decorative.",
  },
  {
    name: "title",
    type: "React.ReactNode",
    desc: "the primary message.",
  },
  {
    name: "description",
    type: "React.ReactNode",
    desc: "supporting copy below the title.",
  },
  {
    name: "action",
    type: "React.ReactNode",
    desc: "the way out of empty, rendered below the description.",
  },
  {
    name: "variant",
    type: '"solid" | "dashed"',
    defaultValue: '"solid"',
    desc: "solid surface or a dashed transparent outline.",
  },
];

export default function EmptyStatePage() {
  return (
    <ComponentDoc
      slug="empty-state"
      description={
        <>
          a centered placeholder for a zero-data view: an icon, a message, and
          the one action that gets the user out of empty.
        </>
      }
      composition={{
        ok: [
          "fills the slot the data would occupy: a Panel body, a grid cell, a page",
          "the action is one Button, usually the way out of empty",
        ],
        no: [
          "never beside content, it marks the absence of it",
          "not for failures. an error gets its own treatment, this is legitimately empty",
        ],
      }}
      a11y={
        <>
          the title is an <code className="font-mono text-xs">h3</code> · the
          icon badge is <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
    >
      <EmptyStateDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="empty-state"
        usage={`import { Button, EmptyState } from "@matt-pasek/usva";

<EmptyState
  title="No projects yet"
  description="Create your first project to get started."
  action={<Button>New project</Button>}
/>`}
      />
    </ComponentDoc>
  );
}
