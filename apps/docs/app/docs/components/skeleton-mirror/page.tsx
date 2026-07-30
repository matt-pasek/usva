import { SkeletonMirror } from "@usva-ui/react/primitives/skeleton";
import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";

function MediaCard() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-floating">
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-full bg-sunken" />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">Aino Virtanen</span>
          <span className="text-xs text-muted">Product designer</span>
        </div>
      </div>
      <div className="h-40 rounded-xl bg-sunken" />
      <p className="text-sm text-muted">
        A short caption describing the item, its state, and one more line of
        supporting detail so the block has some height.
      </p>
      <div className="flex gap-2">
        <span className="rounded-md bg-accent px-3 py-1.5 text-xs text-on-accent">
          Open
        </span>
        <span className="rounded-md border border-border px-3 py-1.5 text-xs text-muted">
          Share
        </span>
      </div>
    </div>
  );
}

export const metadata: Metadata = pageMetadata(
  "/docs/components/skeleton-mirror",
  {
    title: "Skeleton Mirror",
    description:
      "Wraps any layout and greys every leaf into a shaped block, so the placeholder is the real markup, not an approximation.",
  },
);

const props = [
  {
    name: "loading",
    type: "boolean",
    defaultValue: "true",
    desc: "false renders the children untouched.",
  },
  {
    name: "label",
    type: "string",
    defaultValue: '"Loading"',
    desc: "what screen readers announce for the status region.",
  },
];

export default function SkeletonMirrorPage() {
  return (
    <ComponentDoc
      slug="skeleton-mirror"
      description={
        <>
          wrap your real markup and it greys every leaf into a shaped block, so
          the placeholder <b>is the layout</b>, not an approximation of it. flip{" "}
          <code className="font-mono text-xs">loading</code> to false and the
          children render untouched.
        </>
      }
      composition={{
        ok: [
          "around any component, usva or your own, while its data loads",
          "toggle loading straight from the same boolean that fetches",
        ],
        no: [
          "not for a bespoke placeholder. hand-build those with Skeleton",
          "not a spinner. it promises the shape of what is coming",
        ],
      }}
      a11y={
        <>
          a labelled <code className="font-mono text-xs">role="status"</code>{" "}
          region · the greyed markup is{" "}
          <code className="font-mono text-xs">aria-hidden</code> · the sheen
          stops under reduced motion
        </>
      }
      dependencies={<>Skeleton from the same package</>}
    >
      <DemoPanel label="SkeletonMirror">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-muted">real</span>
            <MediaCard />
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-muted">
              &lt;SkeletonMirror&gt;
            </span>
            <SkeletonMirror>
              <MediaCard />
            </SkeletonMirror>
          </div>
        </div>
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection
        registryName="skeleton"
        usage={`import { SkeletonMirror } from "@usva-ui/react/primitives/skeleton";

<SkeletonMirror loading={isLoading}>
  <ProfileCard user={user} />
</SkeletonMirror>`}
      />
    </ComponentDoc>
  );
}
