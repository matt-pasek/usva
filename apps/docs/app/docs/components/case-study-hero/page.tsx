import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { CaseStudyHeroDemo } from "./case-study-hero-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/case-study-hero",
  {
    title: "Case Study Hero",
    description:
      "Opens a piece of work with a two-tone display headline keyed to the study's own colour, over eyebrow, tagline, meta and media slots.",
  },
);

const props = [
  {
    name: "headline",
    type: "ReactNode",
    desc: "the display headline. the only required prop.",
  },
  {
    name: "headlineAccent",
    type: "ReactNode",
    desc: "second line of the headline, carrying the accent color. omitted entirely when absent.",
  },
  {
    name: "accentColor",
    type: "string",
    defaultValue: '"var(--color-accent-alt)"',
    desc: (
      <>
        any CSS color. <b>categorical, not semantic</b>: it keys to the study,
        never to a meaning.
      </>
    ),
  },
  {
    name: "headingLevel",
    type: '"h1" | "h2" | "h3"',
    defaultValue: '"h1"',
    desc: "pick by document outline, not by size.",
  },
  {
    name: "eyebrow",
    type: "ReactNode",
    desc: 'mono uppercase kicker, e.g. "Case study".',
  },
  {
    name: "kicker",
    type: "ReactNode",
    desc: "secondary mono line, e.g. the client and year.",
  },
  {
    name: "tagline",
    type: "ReactNode",
    desc: "lede under the headline.",
  },
  {
    name: "link",
    type: "{ href, label, external? }",
    desc: "rendered exactly once. external adds target, the rel guard, and a screen-reader hint.",
  },
  {
    name: "meta",
    type: "{ label, value }[]",
    desc: "a definition list of facts. the grid is omitted when empty.",
  },
  {
    name: "tags",
    type: "ReactNode",
    desc: "arbitrary slot. pass Chips, spans, or nothing.",
  },
  {
    name: "children",
    type: "ReactNode",
    desc: "the media well. a MockupShowcase, an img, a video, or an iframe.",
  },
];

export default function CaseStudyHeroPage() {
  return (
    <ComponentDoc
      slug="case-study-hero"
      description={
        <>
          the opener at the top of a case study: a two-tone headline keyed to
          the study's own color, with the eyebrow, tagline, meta and media all
          optional slots around it.
        </>
      }
      composition={{
        ok: [
          "the top of a case study page, one per page",
          "MockupShowcase, an img or a video in the media slot",
        ],
        no: [
          "never two on one page. it is the opener, not a section header",
          "no status colors in accentColor. it keys the study, never a meaning",
        ],
      }}
      a11y={
        <>
          headingLevel keeps the document outline correct · the link renders
          once, never per breakpoint · external links get{" "}
          <code className="font-mono text-xs">rel="noopener noreferrer"</code>{" "}
          and a screen-reader new-tab hint
        </>
      }
    >
      <CaseStudyHeroDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="case-study-hero"
        usage={`import { CaseStudyHero } from "usva/patterns/case-study-hero";
import { MockupShowcase } from "usva/patterns/mockup-showcase";
import { Chip } from "usva/primitives/chip";

<CaseStudyHero
  eyebrow="Case study"
  headline="Students could not see"
  headlineAccent="their whole degree."
  accentColor="#52c989"
  meta={[{ label: "Role", value: "Design engineer" }]}
>
  <MockupShowcase>{/* media */}</MockupShowcase>
</CaseStudyHero>`}
      />
    </ComponentDoc>
  );
}
