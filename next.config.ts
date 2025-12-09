import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: false, // TẮT PPR → FIX LỖI HYDRATION
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/storage/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;
