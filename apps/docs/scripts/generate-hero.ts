import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { build } from "vite";
import {
  FREEZE_CLOCK,
  tickTo,
} from "../../../packages/usva/scripts/capture/clock.js";
import {
  HERO_FPS,
  HERO_SCALE,
  HERO_SEEK_MS,
  HERO_SIZE,
  HERO_SQUARE,
  HERO_SQUARE_X,
  HERO_THEMES,
  heroFiles,
} from "../lib/hero.js";

const DOCS = join(dirname(new URL(import.meta.url).pathname), "..");

const KNOB_VALUE = "62";

const write = (relative: string, data: Buffer) => {
  const out = join(DOCS, relative);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, data);
  console.log(`${relative}  ${Math.round(data.length / 1024)} KB`);
};

const bake = async () => {
  await build({
    configFile: join(DOCS, "scripts/hero/vite.config.ts"),
    logLevel: "warn",
  });

  const dist = join(DOCS, "scripts/hero/.dist");
  const server = Bun.serve({
    port: 0,
    fetch(request) {
      const path = new URL(request.url).pathname;
      return new Response(
        Bun.file(join(dist, path === "/" ? "index.html" : path)),
      );
    },
  });
  const origin = `http://localhost:${server.port}`;

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { ...HERO_SIZE },
    deviceScaleFactor: HERO_SCALE,
    reducedMotion: "no-preference",
  });
  await context.addInitScript(FREEZE_CLOCK);

  try {
    for (const theme of HERO_THEMES) {
      const page = await context.newPage();
      await page.goto(`${origin}?theme=${theme}`, { waitUntil: "load" });
      await page.waitForSelector("[data-hero] canvas", { timeout: 20_000 });

      const handle = await page.waitForFunction(() => window.__heroPointer);
      const pointer = await handle.jsonValue();
      if (!pointer) throw new Error("hero: the knob never reported its centre");

      await page.mouse.move(pointer.x, pointer.y);
      await page.mouse.down();

      await tickTo(page, HERO_SEEK_MS, HERO_FPS);

      const value = await page
        .locator('[role="slider"]')
        .getAttribute("aria-valuenow");
      if (value !== KNOB_VALUE) {
        throw new Error(
          `hero: the press moved the knob to ${value}, expected ${KNOB_VALUE}`,
        );
      }

      const shot = await page
        .locator("[data-hero]")
        .screenshot({ type: "png" });
      await page.mouse.up();
      await page.close();

      const files = heroFiles(theme);
      write(
        files.wide,
        await sharp(shot)
          .resize(HERO_SIZE.width, HERO_SIZE.height)
          .png()
          .toBuffer(),
      );
      write(
        files.square,
        await sharp(shot)
          .extract({
            left: HERO_SQUARE_X * HERO_SCALE,
            top: 0,
            width: HERO_SQUARE * HERO_SCALE,
            height: HERO_SQUARE * HERO_SCALE,
          })
          .resize(HERO_SQUARE, HERO_SQUARE)
          .png()
          .toBuffer(),
      );
    }
  } finally {
    await browser.close();
    await server.stop();
  }
};

await bake();
