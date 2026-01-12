import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,   // completely skips ESLint during build
  },
  typescript: {
    ignoreBuildErrors: true,    // completely skips TypeScript errors during build
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    domains: [
      "localhost",
      "159.223.53.146:4001",
      "159.223.53.146",
      "api.nirapadbusiness.com",
    ],
  },
};

export default nextConfig;
