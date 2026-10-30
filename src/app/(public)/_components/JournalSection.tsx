"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { tokens } from "@/theme/theme";
import { SectionContainer } from "@/components/common/SectionContainer";
import { ProductCard, type ProductCardItem } from "./ProductCard";

const ARTICLES: ProductCardItem[] = [
  {
    id: 1,
    tag: "GUIDE",
    tagVariant: "guide",
    title: "How to Choose the Right Laptop in 2025",
    readTime: "5 min read",
    image: "/images/workspace-banner.jpg",
    link: "/about",
  },
  {
    id: 2,
    tag: "REVIEW",
    tagVariant: "review",
    title: "Best Budget Earbuds Under ৳5,000",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=800&auto=format&fit=crop",
    link: "/about",
  },
  {
    id: 3,
    tag: "TIPS",
    tagVariant: "tips",
    title: "10 Ways to Make Your iPhone Last Longer",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
    link: "/about",
  },
  {
    id: 4,
    tag: "GAMING",
    tagVariant: "gaming",
    title: "Build the Ultimate Gaming Setup",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    link: "/about",
  },
];

export function JournalSection() {
  return (
    <SectionContainer
      sx={{
        py: { xs: 3, md: 5 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: { xs: 2.5, md: 3.5 },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: tokens.accent,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              mb: 0.5,
            }}
          >
            JOURNAL
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.1rem" },
              color: tokens.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            Tech Tips &amp; Real Experiences
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: tokens.textMuted, mt: 0.5 }}>
            Guides, reviews, and honest stories to help you get the most out of your devices.
          </Typography>
        </Box>

        <Box
          component={NextLink}
          href="/about"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: 13.5,
            fontWeight: 700,
            color: tokens.textPrimary,
            textDecoration: "none",
          }}
        >
          View All Articles <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Box>
      </Box>

      {/* 4 Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: { xs: 2, sm: 2.5 },
        }}
      >
        {ARTICLES.map((article) => (
          <ProductCard key={article.id} product={article} />
        ))}
      </Box>
    </SectionContainer>
  );
}

export default JournalSection;
