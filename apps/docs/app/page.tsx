import { Crest } from "@/components/home/crest";
import { Descent } from "@/components/home/descent";
import { Fork } from "@/components/home/fork";
import { Hero } from "@/components/home/hero";
import { Proportion } from "@/components/home/proportion";
import { StandingIn } from "@/components/home/standing-in";
import { Witnesses } from "@/components/home/witnesses";

/**
 * after it: the negative margins pull the next surface over the last 100svh
 * of the pin, so the page arrives as masses sliding over each other on a
 * curved leading edge rather than as sections stacking.
 */
export default function Home() {
  return (
    <main data-home>
      <Hero />
      <div className="-mt-[100svh] relative z-10">
        <Crest />
        <div className="bg-bg">
          <Witnesses />
          <Descent />
        </div>
      </div>
      <div className="-mt-[100svh] relative z-20">
        <Crest />
        <div className="bg-bg">
          <Proportion />
          <StandingIn />
          <Fork />
        </div>
      </div>
    </main>
  );
}
