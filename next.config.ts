import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Try this if you're having issues in production
  },
  /* config options here */
};

export default nextConfig;
