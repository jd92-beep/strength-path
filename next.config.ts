import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* Fully static output — the same build deploys to Vercel AND drops straight
     into a Capacitor iOS/Android shell (no Node server required). */
  output: "export",
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
