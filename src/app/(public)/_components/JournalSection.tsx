"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { tokens } from "@/theme/theme";
import { Badge } from "@/components/ui/badge";

const ARTICLES = [
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
    <Box
      component="section"
      sx={{
        maxWidth: 1440,
        mx: "auto",
        px: { xs: 2, md: 3 },
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
            transition: "color 0.2s ease, transform 0.2s ease",
            "&:hover": {
              color: tokens.primary,
              transform: "translateX(3px)",
            },
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
          <Box
            key={article.id}
            component={NextLink}
            href={article.link}
            sx={{
              bgcolor: tokens.bgPanel,
              borderRadius: "20px",
              border: `1px solid ${tokens.borderDefault}`,
              overflow: "hidden",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: tokens.shadowLg,
                borderColor: tokens.primaryBorder,
              },
              "&:hover .art-img": {
                transform: "scale(1.06)",
              },
              "&:hover .art-title": {
                color: tokens.primary,
              },
            }}
          >
            {/* Image Banner */}
            <Box
              sx={{
                width: "100%",
                height: 180,
                overflow: "hidden",
                position: "relative",
                bgcolor: tokens.bgSubtle,
              }}
            >
              <Box
                component="img"
                className="art-img"
                src={article.image}
                alt={article.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                }}
              >
                <Badge
                  variant={article.tagVariant as any || "accent"}
                  label={article.tag}
                  sx={{
                    fontWeight: 700,
                    fontSize: 10,
                    height: 22,
                    backdropFilter: "blur(6px)",
                  }}
                />
              </Box>
            </Box>

            {/* Details */}
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1 }}>
              <Typography
                className="art-title"
                sx={{
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: tokens.textPrimary,
                  lineHeight: 1.35,
                  mb: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  transition: "color 0.2s ease",
                }}
              >
                {article.title}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  mt: "auto",
                  color: tokens.textMuted,
                }}
              >
                <AccessTimeIcon sx={{ fontSize: 14 }} />
                <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                  {article.readTime}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default JournalSection;

