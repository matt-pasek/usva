"use client";
import { SulaField } from "@usva-ui/react/sula/sula-field";
import { convection } from "./convection";

const HALO =
  "radial-gradient(closest-side, color-mix(in oklab, var(--usva-accent) 20%, transparent), transparent)";
const GLASS =
  "linear-gradient(180deg, color-mix(in oklab, var(--usva-surface-2) 90%, var(--usva-ink)), var(--usva-surface-2))";
const DEPTH =
  "radial-gradient(120% 70% at 50% 100%, color-mix(in oklab, var(--usva-accent) 14%, transparent), transparent 70%), radial-gradient(90% 60% at 50% 0%, color-mix(in oklab, var(--usva-ink) 8%, transparent), transparent 75%)";

const STILL_TIME = 14;

export function Kuohu() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative mx-auto w-[10rem] select-none sm:w-[13rem] lg:w-[15rem]"
    >
      <div
        className="-inset-20 absolute -z-10 rounded-full opacity-60 blur-3xl"
        style={{ backgroundImage: HALO }}
      />
      <div
        className="mx-auto h-3 w-16 rounded-t-sm"
        style={{ backgroundImage: GLASS }}
      />
      <SulaField
        data-kuohu=""
        drive={convection}
        stillTime={STILL_TIME}
        seed={12}
        className="h-[17rem] w-full rounded-[7rem] border border-border bg-surface-2/40 shadow-floating sm:h-[22rem] lg:h-[28rem]"
        style={{ backgroundImage: DEPTH }}
      />
      <div
        className="mx-auto h-12 w-[70%] rounded-b-xl"
        style={{
          backgroundImage: GLASS,
          clipPath: "polygon(14% 0, 86% 0, 100% 100%, 0 100%)",
        }}
      />
    </div>
  );
}
