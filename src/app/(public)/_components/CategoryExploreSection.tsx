"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { tokens } from "@/theme/theme";

const FONT = "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

const CATEGORIES = [
  {
    name: "Laptops",
    slug: "laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Smartphones",
    slug: "smartphones",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Smartwatches",
    slug: "smartwatches",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Headphones",
    slug: "audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Earbuds",
    slug: "audio",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Gaming",
    slug: "gaming",
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Audio",
    slug: "audio",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=300&auto=format&fit=crop",
  },
  {
    name: "Smart Home",
    slug: "smart-life",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=300&auto=format&fit=crop",
  },
];

export function CategoryExploreSection() {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        position: "relative",
        zIndex: 2,
        mt: { xs: -2, md: -4 },
        mb: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            p: { xs: 2.5, sm: 3, md: 3.5 },
            borderRadius: "28px",
            bgcolor: tokens.bgPanel,
            border: `1px solid ${tokens.borderDefault}`,
            boxShadow: tokens.shadowMd,
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: { xs: "flex-start", lg: "center" },
            gap: { xs: 2.5, lg: 4 },
          }}
        >
          {/* Left Title Link */}
          <Box
            component={NextLink}
            href="/products"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              textDecoration: "none",
              flexShrink: 0,
              minWidth: { lg: 180 },
              "&:hover .explore-title": { color: tokens.primary },
              "&:hover .explore-arrow": { transform: "translateX(4px)" },
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: tokens.textMuted,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontFamily: FONT,
              }}
            >
              Shop by Category
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Typography
                className="explore-title"
                sx={{
                  fontSize: { xs: 16, sm: 18 },
                  fontWeight: 800,
                  color: tokens.textPrimary,
                  fontFamily: FONT,
                  transition: "color 200ms",
                }}
              >
                Explore Our World
              </Typography>
              <ArrowForwardIcon
                className="explore-arrow"
                sx={{
                  fontSize: 16,
                  color: tokens.textPrimary,
                  transition: "transform 200ms ease",
                }}
              />
            </Box>
          </Box>

          {/* Right Horizontal Categories Scroll/Grid */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2, lg: 2.5 },
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              width: "100%",
              py: 0.5,
            }}
          >
            {CATEGORIES.map((cat) => (
              <Box
                key={cat.name}
                component={NextLink}
                href={`/products?category=${cat.slug}`}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.25,
                  minWidth: { xs: 72, sm: 84 },
                  textDecoration: "none",
                  transition: "transform 200ms ease",
                  flexShrink: 0,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    "& .cat-circle": {
                      borderColor: tokens.primary,
                      boxShadow: tokens.shadowPrimary,
                    },
                    "& .cat-label": {
                      color: tokens.primary,
                    },
                  },
                }}
              >
                <Box
                  className="cat-circle"
                  sx={{
                    width: { xs: 56, sm: 64 },
                    height: { xs: 56, sm: 64 },
                    borderRadius: "20px",
                    bgcolor: tokens.bgCanvas,
                    border: `1px solid ${tokens.borderDefault}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    p: 1,
                    transition: "all 200ms ease",
                  }}
                >
                  <Box
                    component="img"
                    src={cat.image}
                    alt={cat.name}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop";
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      mixBlendMode: "multiply",
                    }}
                  />
                </Box>

                <Typography
                  className="cat-label"
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: tokens.textSecondary,
                    fontFamily: FONT,
                    textAlign: "center",
                    transition: "color 200ms",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

