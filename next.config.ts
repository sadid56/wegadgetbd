import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qbtrnvczvftepzcbfwbg.supabase.co",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "recharts",
      "motion",
      "date-fns",
      "@tanstack/react-query",
      "@uiw/react-md-editor",
    ],
  },
  devIndicators: false,
  turbopack: {},
};

export default nextConfig;
