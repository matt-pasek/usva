import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@matt-pasek/usva", "@matt-pasek/usva-tokens"],
  async redirects() {
    return [
      {
        source: "/tokens",
        destination: "/design-language/color",
        permanent: true,
      },
    ];
  },
};
export default config;
