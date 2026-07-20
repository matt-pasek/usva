import type { Metadata } from "next";
import { ChapterShell } from "@/components/design-language/chapter-shell";
import { MotionTiers } from "@/components/design-language/motion-tiers";

export const metadata: Metadata = {
  title: "Motion · Design language",
  description:
    "Every theme ships the same four duration tiers and the same three easings, set to different values. A component asks for a tier and gets the theme's register without knowing the difference.",
};

export default function MotionChapter() {
  return (
    <ChapterShell
      slug="motion"
      shapedBy={["personal-website", "sisu-plus"]}
      lede={
        <>
          every theme ships the same four duration tiers and the same three
          easings, and sets them to different values. that is the whole
          mechanism. a component asks for{" "}
          <code className="font-mono text-ink text-base">duration-slow</code>{" "}
          and gets kajo&apos;s long spring or sisu&apos;s short damped one, and
          never knows the difference.
        </>
      }
    >
      <MotionTiers />
    </ChapterShell>
  );
}
