import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    globalNotFound: true, // Required for global-not-found.js to work properly
  },
  /* config options here */
};

export default nextConfig;
