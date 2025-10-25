import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    domains: [
      "localhost",
      "103.168.140.135:4005",
      "103.168.140.135",
    ],
  },
};

export default nextConfig;
