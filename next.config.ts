import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/skill-guide",
        destination: "https://church-translation-skill-guide.vercel.app/",
        permanent: true,
      },
      {
        source: "/skill-guide/:path*",
        destination: "https://church-translation-skill-guide.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
