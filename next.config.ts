import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the dev-mode "N" badge away from the sidebar profile corner.
  devIndicators: {
    position: "bottom-right",
  },
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
