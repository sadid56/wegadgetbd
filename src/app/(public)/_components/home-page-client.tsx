"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useProducts } from "@/query-client/products";
import { Hero } from "./Hero";
import { HotDealsSection } from "./HotDealsSection";
import { FAQ } from "@/components/common/FAQ";
import { NewArrivalsSection } from "./NewArrivalsSection";
import { WhyChooseUsSection } from "./WhyChooseUsSection";

const LATEST_LIMIT = 8;

export default function LandingPage() {
  const { data, isLoading } = useProducts({ limit: 20, sort: "newest" });

  const latestProducts = useMemo(() => data?.products?.slice(0, LATEST_LIMIT) ?? [], [data?.products]);

  return (
    <Box
      component='main'
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        overflowX: "hidden",
        background: "linear-gradient(to bottom, #FFF7ED33, #FFFFFF)",
      }}
    >
      <Hero />

      <Container maxWidth='xl' sx={{ px: { xs: 1, md: 2 }, py: { xs: 2, md: 3 } }}>
        <HotDealsSection />
      </Container>

      <NewArrivalsSection products={latestProducts} isLoading={isLoading} />

      <WhyChooseUsSection />

      <Box component='section' sx={{ bgcolor: "#fff", pb: 0 }}>
        <FAQ />
      </Box>
    </Box>
  );
}
