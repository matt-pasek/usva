import type { Metadata } from "next";
import { ChapterShell } from "@/components/design-language/chapter-shell";
import { TypeScale } from "@/components/design-language/type-scale";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/design-language/type", {
  title: "Type · Design language",
  description:
    "One family. Fira Sans carries the display line and the smallest label; the mono is the only permitted second voice, and only for structural annotation.",
});

export default function TypeChapter() {
  return (
    <ChapterShell
      slug="type"
      shapedBy={["personal-website"]}
      lede={
        <>
          one family. Fira Sans carries the display line and the smallest label,
          and a second sans would read as indecision, not range. the personality
          comes from the weight extremes and from tracking that gets tighter as
          the type gets bigger.
        </>
      }
    >
      <p className="max-w-2xl text-muted text-sm">
        the mono is the only permitted second voice, and it has exactly one job:
        structural annotation. indices, tags, metadata, code. never prose. the
        moment a paragraph is set in mono it stops being a document and starts
        being terminal cosplay.
      </p>
      <TypeScale />
    </ChapterShell>
  );
}
