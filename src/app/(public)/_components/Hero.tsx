"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { tokens } from "@/theme/theme";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/common/SectionContainer";

const SPOTLIGHT_PRODUCTS = [
  {
    id: 1,
    badge: "Best Seller",
    title: "Sony WH-1000XM5",
    subtitle: "Wireless Noise Canceling Headphones",
    rating: "4.8",
    reviewCount: "120+",
    price: "৳24,999",
    originalPrice: "৳30,000",
    image: "/images/sony-headphones.jpg",
    link: "/products/sony-wh-1000xm5",
    quote: "Better Sound, Bigger Moments",
  },
  {
    id: 2,
    badge: "New Arrival",
    title: "MacBook Air M3",
    subtitle: "Supercharged by Apple M3 Silicon",
    rating: "4.9",
    reviewCount: "1200+",
    price: "৳109,999",
    originalPrice: "৳129,999",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    link: "/products",
    quote: "Pure Speed, Infinite Battery",
  },
  {
    id: 3,
    badge: "Flagship",
    title: "iPhone 15 Pro",
    subtitle: "Titanium. So strong. So light.",
    rating: "4.8",
    reviewCount: "950+",
    price: "৳99,999",
    originalPrice: "৳109,999",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
    link: "/products",
    quote: "Cinematic Vision in Your Pocket",
  },
];

export function Hero() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const activeProduct = SPOTLIGHT_PRODUCTS[currentIndex];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? SPOTLIGHT_PRODUCTS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === SPOTLIGHT_PRODUCTS.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "auto", md: 540, lg: 580 },
        display: "flex",
        alignItems: "center",
        bgcolor: tokens.bgDark,
        borderBottomLeftRadius: { xs: 24, md: 36 },
        borderBottomRightRadius: { xs: 24, md: 36 },
        borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
        overflow: "hidden",
        pt: { xs: 9, md: 10.5 },
        pb: { xs: 10, md: 12 },
      }}
    >
      {/* ═══ 1. BACKGROUND IMAGE & AMBIENT OVERLAY ═══ */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/images/hero-banner-dark.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center right",
          filter: "brightness(0.92) contrast(1.05)",
          zIndex: 1,
        }}
      />

      {/* Dark moody vignette & gradient */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: {
            xs: "linear-gradient(180deg, rgba(8,18,14,0.92) 0%, rgba(8,18,14,0.85) 60%, rgba(8,18,14,0.95) 100%)",
            md: "linear-gradient(90deg, rgba(8,18,14,0.95) 0%, rgba(8,18,14,0.86) 42%, rgba(8,18,14,0.30) 75%, rgba(8,18,14,0.85) 100%)",
          },
          zIndex: 2,
        }}
      />

      {/* ═══ 2. MAIN CONTAINER ═══ */}
      <SectionContainer
        component="div"
        sx={{
          position: "relative",
          zIndex: 3,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr", lg: "1.2fr 0.8fr" },
          alignItems: "center",
          gap: { xs: 6, md: 4, lg: 6 },
        }}
      >
        {/* ═══ LEFT CONTENT ═══ */}
        <Box sx={{ maxWidth: 640 }}>

          {/* Headline: The Right Gadgets for a Brighter You */}
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2.1rem", sm: "2.6rem", md: "2.9rem", lg: "3.2rem" },
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: tokens.textWhite,
              mb: 2,
            }}
          >
            The Right Gadgets <br />
            for a{" "}
            <Box
              component="span"
              sx={{
                color: tokens.accent,
                background: `linear-gradient(120deg, ${tokens.accent} 0%, #6ee7b7 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Brighter You
            </Box>
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontSize: { xs: 14, sm: 15 },
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.72)",
              mb: 2.5,
              maxWidth: 520,
            }}
          >
            Discover carefully selected tech, from everyday essentials to
            high-performance gear — designed to make your life smarter, easier
            and more enjoyable.
          </Typography>

          {/* Frosted Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              bgcolor: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: `1px solid ${tokens.borderDarkSubtle}`,
              borderRadius: `${tokens.radiusPill}px`,
              p: "5px 7px 5px 16px",
              maxWidth: 500,
              mb: 2.5,
              boxShadow: "0 8px 24px -6px rgba(0, 0, 0, 0.4)",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              "&:focus-within": {
                borderColor: tokens.primary,
                boxShadow: `0 8px 24px -4px ${tokens.primarySubtle}`,
              },
            }}
          >
            <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 21 }} />
            <InputBase
              placeholder="Search gadgets, brands, or accessories..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              fullWidth
              sx={{
                color: tokens.textWhite,
                fontSize: 14.5,
                "& input::placeholder": {
                  color: "rgba(255, 255, 255, 0.45)",
                  opacity: 1,
                },
              }}
            />
            <IconButton
              type="submit"
              sx={{
                bgcolor: tokens.primary,
                color: tokens.textWhite,
                width: 38,
                height: 38,
                borderRadius: "50%",
                flexShrink: 0,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: tokens.primaryHover,
                  transform: "scale(1.05)",
                },
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Box>

          {/* 3 Trust Badges */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: { xs: 2.5, sm: 3.5 },
              pt: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <LocalShippingOutlinedIcon sx={{ color: tokens.primary, fontSize: 22 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: tokens.textWhite, lineHeight: 1.2 }}>
                  Free Shipping
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: "rgba(255, 255, 255, 0.55)" }}>
                  On orders over ৳2000
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <VerifiedUserOutlinedIcon sx={{ color: tokens.primary, fontSize: 22 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: tokens.textWhite, lineHeight: 1.2 }}>
                  Secure Payment
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: "rgba(255, 255, 255, 0.55)" }}>
                  100% safe & trusted
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <HeadsetMicOutlinedIcon sx={{ color: tokens.primary, fontSize: 22 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 13, color: tokens.textWhite, lineHeight: 1.2 }}>
                  24/7 Support
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: "rgba(255, 255, 255, 0.55)" }}>
                  We&apos;re here to help
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ═══ RIGHT: SPOTLIGHT PRODUCT CARD ═══ */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-end" },
            position: "relative",
          }}
        >
          {/* Spotlight Card */}
          <Box
            sx={{
              width: "100%",
              maxWidth: 340,
              bgcolor: "rgba(255, 255, 255, 0.96)",
              borderRadius: "20px",
              p: { xs: 2, sm: 2.2 },
              boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(12px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Top row: Badge & Wishlist */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Box
                sx={{
                  bgcolor: tokens.primaryLight,
                  color: tokens.primaryHover,
                  px: 1.25,
                  py: 0.3,
                  borderRadius: `${tokens.radiusPill}px`,
                  fontSize: 10.5,
                  fontWeight: 700,
                  border: `1px solid ${tokens.primaryBorder}`,
                }}
              >
                {activeProduct.badge}
              </Box>
            </Box>

            {/* Title & Subtitle */}
            <Typography sx={{ fontWeight: 800, fontSize: 17, color: tokens.textPrimary, mb: 0.2 }}>
              {activeProduct.title}
            </Typography>
            <Typography sx={{ fontSize: 12, color: tokens.textMuted, mb: 1 }}>
              {activeProduct.subtitle}
            </Typography>

            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
              <StarIcon sx={{ color: tokens.warning, fontSize: 15 }} />
              <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: tokens.textPrimary }}>
                {activeProduct.rating}
              </Typography>
              <Typography sx={{ fontSize: 11.5, color: tokens.textMuted }}>
                ({activeProduct.reviewCount})
              </Typography>
            </Box>

            {/* Price */}
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1.5 }}>
              <Typography sx={{ fontSize: 19, fontWeight: 800, color: tokens.textPrimary }}>
                {activeProduct.price}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  color: tokens.textDisabled,
                  textDecoration: "line-through",
                  fontWeight: 500,
                }}
              >
                {activeProduct.originalPrice}
              </Typography>
            </Box>

            {/* CTA Button */}
            <Button
              component={NextLink}
              href={activeProduct.link}
              sx={{
                bgcolor: "#08120e",
                color: tokens.textWhite,
                borderRadius: `${tokens.radiusPill}px`,
                py: 0.8,
                px: 2.4,
                fontSize: 12.5,
                fontWeight: 700,
                width: "fit-content",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                mb: 1.75,
                "&:hover": {
                  bgcolor: tokens.primaryHover,
                  color: tokens.textWhite,
                },
              }}
            >
              Shop Now <ArrowForwardIcon sx={{ fontSize: 14 }} />
            </Button>

            {/* Product Cutout Image */}
            <Box
              sx={{
                width: "100%",
                height: 165,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f8fafc",
                borderRadius: "14px",
                p: 1.5,
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={activeProduct.image}
                alt={activeProduct.title}
                sx={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  transition: "transform 0.4s ease",
                  "&:hover": { transform: "scale(1.06)" },
                }}
              />
            </Box>
          </Box>

          {/* Script Quote on desk */}
          <Typography
            sx={{
              fontFamily: "'Brush Script MT', 'Dancing Script', cursive, sans-serif",
              fontSize: { xs: 18, md: 21 },
              color: "rgba(255, 255, 255, 0.8)",
              mt: 1.5,
              textAlign: "right",
              letterSpacing: "0.02em",
              fontStyle: "italic",
            }}
          >
            {activeProduct.quote}
          </Typography>

          {/* Bottom Pagination: 01 / 03  <  > */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mt: 1,
              color: "rgba(255, 255, 255, 0.75)",
            }}
          >
            <Typography sx={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.1em" }}>
              0{currentIndex + 1} <Box component="span" sx={{ opacity: 0.5 }}>/ 0{SPOTLIGHT_PRODUCTS.length}</Box>
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                onClick={handlePrev}
                size="small"
                sx={{
                  color: tokens.textWhite,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  p: 0.5,
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton
                onClick={handleNext}
                size="small"
                sx={{
                  color: tokens.textWhite,
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  p: 0.5,
                  "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </SectionContainer>
    </Box>
  );
}

export default Hero;
