import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn3d.iconscout.com",
      },
    ],
  }
};

export default nextConfig;
