"use client";
import * as React from "react";

/**
 * Module-scoped so independently mounted lockers cooperate. A plain per-instance
 * effect cannot know another component still needs the page locked.
 */
let holders = 0;
let previousOverflow = "";

function acquire(): void {
  if (holders === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  holders += 1;
}

function release(): void {
  holders -= 1;
  if (holders <= 0) {
    holders = 0;
    document.body.style.overflow = previousOverflow;
  }
}

/**
 * Locks body scroll while `active`, restoring the exact value that was there
 * before the first lock, not a hardcoded default.
 *
 * The naive version of this (`overflow = 'unset'` on cleanup) silently unlocks
 * the page when an overlay closes over a still-open modal, because the modal's
 * own lock is not consulted. Refcounting is what makes that safe.
 */
export function useScrollLock(active: boolean): void {
  React.useEffect(() => {
    if (!active) return;
    acquire();
    return release;
  }, [active]);
}
