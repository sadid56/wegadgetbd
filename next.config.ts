import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bftjqobykjnrtaaqzokb.supabase.co",
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
      "react-zoom-pan-pinch",
      "@mui/x-date-pickers",
    ],
  },
  devIndicators: false,
  turbopack: {},
};

export default withNextIntl(nextConfig);
