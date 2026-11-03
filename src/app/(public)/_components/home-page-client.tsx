"use client";

import Box from "@mui/material/Box";
import { tokens } from "@/theme/theme";

import { Hero } from "./Hero";
import { CategoryRibbon } from "./CategoryRibbon";
import { TopPicksSection } from "./TopPicksSection";
import { WhyChooseUsBanner } from "./WhyChooseUsBanner";
import { LatestArrivalsSection } from "./LatestArrivalsSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { FAQ } from "@/components/common/FAQ";

export default function LandingPage() {
  return (
    <Box
      component="main"
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

      {/* 3. Featured Products: Top Picks for You (Dynamic from backend) */}
      <TopPicksSection />

      {/* 4. Why Choose Us: More Than Just a Store */}
      <WhyChooseUsBanner />

      {/* 5. Latest Arrivals (Dynamic from backend) */}
      <LatestArrivalsSection />

      {/* 6. Testimonials: Loved by Thousands (Dynamic from backend) */}
      <TestimonialsSection />

      <FAQ />
    </Box>
  );
}
