import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import satori from "satori";

const DOCS = join(dirname(new URL(import.meta.url).pathname), "..");

const SIZE = 200;

const CUTS = [
  { file: "usva-wordmark.svg", ink: "#e6e3f2", dot: "#52c989" },
  { file: "usva-wordmark-light.svg", ink: "#33291d", dot: "#86562e" },
];

const wordmark = (ink: string, dot: string) => ({
  type: "div",
  props: {
    style: {
      display: "flex",
      fontFamily: "Fira Sans",
      fontWeight: 800,
      fontSize: SIZE,
      letterSpacing: "-0.05em",
      color: ink,
    },
    children: [
      { type: "span", props: { children: "usva" } },
      { type: "span", props: { style: { color: dot }, children: "." } },
    ],
  },
});

const font = readFileSync(join(DOCS, "assets/fonts/fira-sans-800.woff"));

for (const { file, dot, ink } of CUTS) {
  const svg = await satori(wordmark(ink, dot) as never, {
    width: 900,
    height: 260,
    fonts: [{ name: "Fira Sans", data: font, weight: 800, style: "normal" }],
    embedFont: true,
  });

  const box = svg.match(/<rect x="0" y="0" width="(\d+)" height="(\d+)"/);
  if (!box) throw new Error(`${file}: could not read the laid-out box`);
  const [, w, h] = box;

  const trimmed = svg.replace(
    /^<svg width="\d+" height="\d+" viewBox="[^"]*"/,
    `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"`,
  );
  if (trimmed === svg) throw new Error(`${file}: canvas was not trimmed`);

  const titled = trimmed.replace(/^(<svg[^>]*>)/, "$1<title>usva.</title>");

  const out = join(DOCS, "public/press", file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, titled);
  console.log(`${file}  ${w} by ${h}  ${Math.round(titled.length / 1024)} KB`);
}
