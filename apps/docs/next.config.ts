import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Loose on purpose: the theme script runs inline before first paint and the
  // shader canvases need WebGL, so this only claims frame-ancestors.
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
];

const config: NextConfig = {
  transpilePackages: ["usva", "usva-tokens"],
  async redirects() {
    return [
      {
        source: "/tokens",
        destination: "/design-language/color",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/r/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
};
export default config;
