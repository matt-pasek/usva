import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { MockupShowcaseDemo } from "./mockup-showcase-demo";

export const metadata: Metadata = {
  title: "Mockup Showcase",
  description:
    "Browser or device chrome around any media you put inside: an image, a video, or a live iframe.",
};

const props = [
  {
    name: "frame",
    type: '"browser" | "device" | "none"',
    defaultValue: '"browser"',
    desc: "which chrome to draw.",
  },
  {
    name: "url",
    type: "string",
    desc: "decorative text in the browser address bar.",
  },
  {
    name: "aspect",
    type: "string",
    defaultValue: '"16/10"',
    desc: "any CSS aspect-ratio value.",
  },
  {
    name: "children",
    type: "ReactNode",
    desc: "the media. stretched to fill the well, whatever element it is.",
  },
];

export default function MockupShowcasePage() {
  return (
    <ComponentDoc
      slug="mockup-showcase"
      description={
        <>
          browser or device chrome around whatever you put inside: a next/image,
          a bare img, a video or a live iframe. the frame is the value.
        </>
      }
      composition={{
        ok: [
          "the visual slot of HeroSplit, a case study, a feature section",
          "children keep their own alt text and semantics",
        ],
        no: [
          "not a window manager. nothing inside the chrome is interactive",
          "never nested in another MockupShowcase",
        ],
      }}
      a11y={
        <>
          the chrome, dots and address bar are all{" "}
          <code className="font-mono text-xs">aria-hidden</code> · the media
          carries its own alt
        </>
      }
    >
      <MockupShowcaseDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="mockup-showcase"
        usage={`import { MockupShowcase } from "@matt-pasek/usva";

<MockupShowcase frame="browser" url="usva.dev">
  <Image src={shot} alt="The usva docs homepage" />
</MockupShowcase>`}
      />
    </ComponentDoc>
  );
}
