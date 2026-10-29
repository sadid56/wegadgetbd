import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "bftjqobykjnrtaaqzokb.supabase.co",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "@emotion/styled",
      "@emotion/react",
      "recharts",
      "date-fns",
      "@tanstack/react-query",
      "@uiw/react-md-editor",
    ],
  },
  devIndicators: false,
  turbopack: {},
};

export default nextConfig;
