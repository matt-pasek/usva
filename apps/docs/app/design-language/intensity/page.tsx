import type { Metadata } from "next";
import { ChapterShell } from "@/components/design-language/chapter-shell";
import { IntensityDial } from "@/components/design-language/intensity-dial";

export const metadata: Metadata = {
  title: "Intensity · Design language",
  description:
    "How loud a screen is allowed to be. One screen, four stops, the same skeleton throughout; all that changes is how much of your attention it asks for. Drag the dial, and it will refuse you.",
};

export default function IntensityChapter() {
  return (
    <ChapterShell
      slug="intensity"
      shapedBy={["personal-website"]}
      lede={
        <>
          one screen, four stops. the skeleton is identical at every stop: same
          header, same three stats, same toolbar, in the same places. all that
          changes is how much energy is layered on top, and therefore how much
          of your attention the screen is asking for.
        </>
      }
    >
      <IntensityDial />
    </ChapterShell>
  );
}
