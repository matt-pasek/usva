import type { Page } from "playwright";

declare global {
  interface Window {
    __usvaTick: (dt: number) => void;
  }
}

export const FREEZE_CLOCK = `
(() => {
  let now = 0;
  let nextId = 1;
  const callbacks = new Map();

  performance.now = () => now;
  Date.now = () => now;

  window.requestAnimationFrame = (cb) => {
    const id = nextId++;
    callbacks.set(id, cb);
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    callbacks.delete(id);
  };

  window.__usvaTick = (dt) => {
    now += dt;
    const due = [...callbacks.values()];
    callbacks.clear();
    for (const cb of due) cb(now);
  };
})();
`;

export const tickTo = async (page: Page, ms: number, fps: number) => {
  const dt = 1000 / fps;
  const frames = Math.round(ms / dt);
  for (let i = 0; i < frames; i += 1) {
    await page.evaluate((step) => window.__usvaTick(step), dt);
  }
};
