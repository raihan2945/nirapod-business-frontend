import type { NextConfig } from "next";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

// Only images served from the backend's uploads folder may go through the
// Next.js image optimizer. Never use a wildcard hostname here: it lets anyone
// make this server fetch and process arbitrary remote images.
const UPLOADS_PATH = "/uploads/photos/**";

const toPattern = (rawUrl: string): RemotePattern | null => {
  try {
    const url = new URL(rawUrl);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: UPLOADS_PATH,
    };
  } catch {
    return null;
  }
};

const allowedImageOrigins = [
  "https://api.nirapadbusiness.com",
  // Whatever API the build points at (e.g. http://localhost:4001 in dev).
  process.env.NEXT_PUBLIC_BASE_URL,
];

const remotePatterns = allowedImageOrigins
  .filter((origin): origin is string => Boolean(origin))
  .map(toPattern)
  .filter((pattern): pattern is RemotePattern => pattern !== null)
  .filter(
    (pattern, index, all) =>
      all.findIndex(
        (p) =>
          p.protocol === pattern.protocol &&
          p.hostname === pattern.hostname &&
          p.port === pattern.port
      ) === index
  );

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,   // completely skips ESLint during build
  },
  typescript: {
    ignoreBuildErrors: true,    // completely skips TypeScript errors during build
  },
  output: 'standalone',
  images: {
    remotePatterns,
  },
};

export default nextConfig;
