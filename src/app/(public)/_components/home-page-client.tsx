"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import { useProducts } from "@/query-client/products";
import { tokens } from "@/theme/theme";

import { Hero } from "./Hero";
import { CategoryRibbon } from "./CategoryRibbon";
import { TopPicksSection } from "./TopPicksSection";
import { WhyChooseUsBanner } from "./WhyChooseUsBanner";
import { LatestArrivalsSection } from "./LatestArrivalsSection";
import { JournalSection } from "./JournalSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQ } from "@/components/common/FAQ";

export default function LandingPage() {
  const { data } = useProducts({ limit: 20, sort: "newest" });

  const products = useMemo(() => data?.products ?? [], [data?.products]);
  const topPicks = useMemo(() => products.slice(0, 4), [products]);
  const latestArrivals = useMemo(() => products.slice(4, 8), [products]);

  return (
    <Box
      component='main'
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflowX: "hidden",
        bgcolor: tokens.bgCanvas,
      }}
    >
      {/* 1. Dark Ambient Lifestyle Hero Section */}
      <Hero />

      {/* 2. Floating Curved Category Ribbon */}
      <CategoryRibbon />

      {/* 3. Featured Products: Top Picks for You */}
      <TopPicksSection products={topPicks} />

      {/* 4. Why Choose Us: More Than Just a Store */}
      <WhyChooseUsBanner />

      {/* 5. Latest Arrivals */}
      <LatestArrivalsSection products={latestArrivals} />

      {/* 6. Journal: Tech Tips & Real Experiences */}
      <JournalSection />

      {/* 7. Testimonials: Loved by Thousands */}
      <TestimonialsSection />

      <FAQ />
    </Box>
  );
}
