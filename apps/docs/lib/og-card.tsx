import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { OgCard } from "./og-content";
import { OG_FONT_DIR, OG_FONTS } from "./og-fonts";
import { OG_SIZE } from "./og-plate";

const asset = (...parts: string[]) =>
  readFileSync(join(process.cwd(), ...parts));

const FONTS = OG_FONTS.map((font) => ({
  name: font.family,
  weight: font.weight,
  style: "normal" as const,
  data: asset(OG_FONT_DIR, font.file),
}));

const PLATE = `data:image/png;base64,${asset(
  "public",
  "og",
  "plate.png",
).toString("base64")}`;

const KAJO = {
  bg: "#0a0613",
  ink: "#e6e3f2",
  muted: "#8b85a8",
  accent: "#a78bfa",
  accentAlt: "#52c989",
};

const slug = (text: string) => (
  <span
    style={{
      fontFamily: "Fira Code",
      fontWeight: 500,
      fontSize: 16,
      letterSpacing: "0.11em",
      color: KAJO.muted,
    }}
  >
    {text}
  </span>
);

export function ogCard(card: OgCard): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        backgroundColor: KAJO.bg,
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: this tree is rendered by
         Satori into a static PNG, never by a browser, so next/image has
         nothing to optimise and its runtime is not available here. */}
      <img
        src={PLATE}
        width={OG_SIZE.width}
        height={OG_SIZE.height}
        alt=""
        style={{ position: "absolute", top: 0, left: 0 }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: OG_SIZE.width,
          height: OG_SIZE.height,
          padding: "64px 72px 38px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: "Fira Code",
              fontWeight: 500,
              fontSize: 19,
              letterSpacing: "0.14em",
              color: KAJO.accent,
            }}
          >
            {card.eyebrow}
          </span>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              fontFamily: "Fira Sans",
              fontWeight: 800,
              fontSize: 82,
              lineHeight: 0.94,
              letterSpacing: "-0.03em",
              color: KAJO.ink,
            }}
          >
            <span>{card.title}</span>
            {card.period ? (
              <span style={{ color: KAJO.accentAlt }}>.</span>
            ) : null}
          </div>
          <span
            style={{
              marginTop: 22,
              maxWidth: 470,
              fontFamily: "Fira Sans",
              fontWeight: 400,
              fontSize: 34,
              lineHeight: 1.22,
              letterSpacing: "-0.01em",
              color: KAJO.muted,
            }}
          >
            {card.line}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            maxWidth: 660,
          }}
        >
          {slug(card.foot[0])}
          <span
            style={{
              display: "flex",
              flexGrow: 1,
              height: 1,
              backgroundColor: "rgba(230,227,242,0.11)",
            }}
          />
          {slug(card.foot[1])}
        </div>
      </div>
    </div>,
    { ...OG_SIZE, fonts: FONTS },
  );
}
