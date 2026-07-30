import { Utu } from "@usva-ui/react/atmospheres/utu";
import { Button } from "@usva-ui/react/primitives/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <Utu
      speed={0.2}
      params={{
        radius: 2.5,
        swirl: 1.2,
        omega: 0,
        noiseBase: 0.1,
        drift: 0.5,
        wispSigma: 0.37,
        wispAmt: 0.95,
        wispDrift: 0.25,
        absorb: 0.4,
        exposure: 11,
        breathAmt: 0.3,
        breathRate: 0,
      }}
      className="flex min-h-[78svh] items-center justify-center overflow-hidden px-6"
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="font-mono text-[0.7rem] uppercase tracking-widest text-muted">
          404
        </p>

        <h1 className="mt-5 text-[clamp(2.75rem,11vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-ink">
          nothing at this address.
        </h1>

        <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-muted sm:text-lg">
          it may have moved, or it may never have been written. the fog is the
          only thing here, and it was already on.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Button asChild variant="onSurface" size="lg">
            <Link href="/">back to the start →</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/docs">the components</Link>
          </Button>
        </div>
      </div>
    </Utu>
  );
}
