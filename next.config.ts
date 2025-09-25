import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "cdn3d.iconscout.com",
      },
      {
        protocol: "https",
        hostname: "example.com", // TODO: Temporal - reemplazar con imágenes reales
      },
    ],
  },
};

export default nextConfig;
