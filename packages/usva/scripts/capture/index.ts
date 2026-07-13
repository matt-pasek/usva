import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import { FREEZE_CLOCK, tickTo } from "./clock.js";
import { encodeGif } from "./gif.js";
import { seekFor } from "./seeks.js";

const STATIC_DIR = join(import.meta.dir, "../../storybook-static");
const OUT_DIR = join(import.meta.dir, "../../captures");
const THEMES = ["kajo", "sisu", "savi"] as const;
const FPS = 30;
const GIF_FRAMES = 24;
const PNG_SIZE = { width: 960, height: 600, scale: 2 };
const GIF_SIZE = { width: 480, height: 300, scale: 1 };

type StoryEntry = {
  id: string;
  title: string;
  name: string;
  type?: string;
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const get = (flag: string) =>
    args.find((a) => a.startsWith(`${flag}=`))?.split("=")[1];
  return {
    filter: get("--filter"),
    format: (get("--format") ?? "png") as "png" | "gif",
    themes: (get("--theme")?.split(",") ?? THEMES) as string[],
  };
};

const loadStories = async (filter?: string): Promise<StoryEntry[]> => {
  const raw = await readFile(join(STATIC_DIR, "index.json"), "utf8");
  const index = JSON.parse(raw) as { entries: Record<string, StoryEntry> };
  return Object.values(index.entries)
    .filter((e) => e.type !== "docs")
    .filter((e) => (filter ? e.id.includes(filter) : true));
};

/** Storybook's iframe fetches its modules, which file:// refuses. It has to be served. */
const serve = () =>
  Bun.serve({
    port: 0,
    fetch(request) {
      const path = new URL(request.url).pathname;
      const file = Bun.file(
        join(STATIC_DIR, path === "/" ? "index.html" : path),
      );
      return new Response(file);
    },
  });

const capture = async () => {
  const { filter, format, themes } = parseArgs();
  const stories = await loadStories(filter);

  if (stories.length === 0) {
    throw new Error(
      `No stories matched${filter ? ` filter "${filter}"` : ""}. Run build-storybook first.`,
    );
  }

  const server = serve();
  const origin = `http://localhost:${server.port}`;

  const size = format === "gif" ? GIF_SIZE : PNG_SIZE;
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: size.width, height: size.height },
    deviceScaleFactor: size.scale,
    reducedMotion: "no-preference",
  });
  await context.addInitScript(FREEZE_CLOCK);

  const page = await context.newPage();
  let written = 0;

  try {
    for (const theme of themes) {
      for (const story of stories) {
        const { seekMs, loopMs } = seekFor(story.id);
        if (format === "gif" && !loopMs) continue;

        const url = `${origin}/iframe.html?id=${story.id}&globals=theme:${theme}&viewMode=story`;

        await page.goto(url, { waitUntil: "load" });
        await page.waitForSelector("#storybook-root > *", { timeout: 10_000 });
        await tickTo(page, seekMs, FPS);

        const out = join(OUT_DIR, theme, `${story.id}.${format}`);
        await mkdir(dirname(out), { recursive: true });

        const root = page.locator("#storybook-root");

        if (format === "gif" && loopMs) {
          const frames: Buffer[] = [];
          const dt = loopMs / GIF_FRAMES;
          for (let i = 0; i < GIF_FRAMES; i += 1) {
            frames.push(await root.screenshot({ type: "png" }));
            await tickTo(page, dt, FPS);
          }
          await writeFile(out, await encodeGif(frames, dt));
        } else {
          await root.screenshot({ path: out, type: "png" });
        }

        written += 1;
        console.info(`${theme}/${story.id}.${format}`);
      }
    }
  } finally {
    await browser.close();
    await server.stop();
  }

  console.info(`\n${written} captures written to ${OUT_DIR}`);
};

capture().catch((error) => {
  console.error("Capture failed:", error);
  process.exit(1);
});
