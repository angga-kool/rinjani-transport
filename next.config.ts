import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: isDev
      ? [
          {
            protocol: "https",
            hostname: "**",
          },
        ]
      : [
          {
            protocol: "https",
            hostname: "images.unsplash.com",
          },
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
          },
        ],
  },

  serverExternalPackages: ["pg"],
};

export default nextConfig;
