import { type RefObject, useEffect } from "react";

export function useCenteredChip(rail: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const strip = rail.current;
    const chip = strip?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!strip || !chip) return;
    const stripBox = strip.getBoundingClientRect();
    const chipBox = chip.getBoundingClientRect();
    strip.scrollLeft +=
      chipBox.left - stripBox.left - (stripBox.width - chipBox.width) / 2;
  }, [rail]);
}
