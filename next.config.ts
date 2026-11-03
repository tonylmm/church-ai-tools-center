import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/skill-guide",
        destination: "/skill-guide/index.html",
      },
    ];
  },
};

export default nextConfig;
