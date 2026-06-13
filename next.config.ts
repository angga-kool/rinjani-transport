import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Allow any image in development
    ...(process.env.NODE_ENV === "development" && {
      remotePatterns: [{ protocol: "https", hostname: "**" }],
    }),
  },
  // Vercel serverless function config
  serverExternalPackages: ["pg"],
};

export default nextConfig;
