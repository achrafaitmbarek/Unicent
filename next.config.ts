import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false, // Try this if you're having issues in production
  },
  experimental: {
    ppr: 'incremental',
  },
  /* config options here */
};

export default nextConfig;
