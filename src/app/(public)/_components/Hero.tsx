"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { tokens } from "@/theme/theme";
import { IconButton } from "@/components/ui/icon-button";
import { InputBase } from "@/components/ui/input";
import { SectionContainer } from "@/components/common/SectionContainer";

const SPOTLIGHT_PRODUCTS = [
  {
    id: 1,
    category: "Wireless Audio",
    title: "Sony WH-1000XM5",
    subtitle: "Noise Canceling Headphones",
    rating: "4.8",
    price: "৳24,999",
    originalPrice: "৳30,000",
    image: "/images/sony-headphones.jpg",
    link: "/products/sony-wh-1000xm5",
  },
  {
    id: 2,
    category: "Laptops",
    title: "MacBook Air M3",
    subtitle: "13-inch • Apple M3 Chip",
    rating: "4.9",
    price: "৳109,999",
    originalPrice: "৳129,999",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    link: "/products",
  },
  {
    id: 3,
    category: "Smartphones",
    title: "iPhone 15 Pro",
    subtitle: "256GB • Natural Titanium",
    rating: "4.9",
    price: "৳99,999",
    originalPrice: "৳109,999",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
    link: "/products",
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
        position: 'relative',
        width: '100%',
        minHeight: { xs: 'auto', md: 540, lg: 640 },
        display: 'flex',
        alignItems: 'center',
        bgcolor: tokens.bgDark,
        borderBottomLeftRadius: { xs: 24, md: 36 },
        borderBottomRightRadius: { xs: 24, md: 36 },
        borderBottom: `1px solid ${tokens.borderDark}`,
        overflow: 'hidden',
        pt: { xs: 9, md: 10.5 },
        pb: { xs: 10, md: 12 },
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/images/hero-banner-dark.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          filter: 'brightness(0.9) contrast(1.05)',
          zIndex: 1,
        }}
      />

      {/* Dark Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: {
            xs: 'linear-gradient(180deg, rgba(9,14,28,0.92) 0%, rgba(9,14,28,0.86) 60%, rgba(9,14,28,0.95) 100%)',
            md: 'linear-gradient(90deg, rgba(9,14,28,0.95) 0%, rgba(9,14,28,0.86) 45%, rgba(9,14,28,0.45) 75%, rgba(9,14,28,0.85) 100%)',
          },
          zIndex: 2,
        }}
      />

      {/* Main Content */}
      <SectionContainer
        component="div"
        sx={{
          position: 'relative',
          zIndex: 3,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr', lg: '1.2fr 0.8fr' },
          alignItems: 'center',
          gap: { xs: 5, md: 4, lg: 6 },
        }}
      >
        {/* ═══ LEFT CONTENT ═══ */}
        <Box sx={{ maxWidth: 640 }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.1rem', sm: '2.6rem', md: '2.9rem', lg: '3.2rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: tokens.textWhite,
              mb: 2,
            }}
          >
            The Right Gadgets <br />
            for a{' '}
            <Box
              component="span"
              sx={{
                color: tokens.accent,
                background: `linear-gradient(120deg, ${tokens.accent} 0%, ${tokens.primaryLight} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Brighter You
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 14, sm: 15 },
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.72)',
              mb: 2.5,
              maxWidth: 520,
            }}
          >
            Discover carefully selected tech, from everyday essentials to high-performance gear —
            designed to make your life smarter, easier and more enjoyable.
          </Typography>

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              bgcolor: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: `1px solid ${tokens.borderDarkSubtle}`,
              borderRadius: `${tokens.radiusPill}px`,
              p: '5px 7px 5px 16px',
              maxWidth: 500,
              mb: 2.5,
              transition: 'border-color 0.2s ease',
              '&:focus-within': {
                borderColor: tokens.primary,
              },
            }}
          >
            <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 21 }} />
            <InputBase
              placeholder="Search gadgets, brands, or accessories..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              fullWidth
              sx={{
                color: tokens.textWhite,
                fontSize: 14.5,
                '& input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.45)',
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
                borderRadius: '50%',
                flexShrink: 0,
                '&:hover': {
                  bgcolor: tokens.primaryHover,
                },
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Box>
        </Box>

        {/* ═══ RIGHT: MINIMAL EDITORIAL PRODUCT CARD ═══ */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', md: 'flex-end' },
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 340,
              bgcolor: tokens.bgPanel,
              borderRadius: `${tokens.radiusLg}px`,
              border: `1px solid ${tokens.borderDefault}`,
              p: 1.75,
              '&:hover .hero-card-thumb': {
                transform: 'scale(1.05)',
              },
            }}
          >
            {/* Clean Product Thumbnail (no pills/clutter) */}
            <Box
              component={NextLink}
              href={activeProduct.link}
              sx={{
                display: 'block',
                width: '100%',
                height: 190,
                borderRadius: `${tokens.radiusMd}px`,
                bgcolor: tokens.bgSubtle,
                overflow: 'hidden',
                mb: 1.75,
              }}
            >
              <Box
                component="img"
                className="hero-card-thumb"
                src={activeProduct.image}
                alt={activeProduct.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.35s ease',
                }}
              />
            </Box>

            {/* Category + Rating Row */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 0.4,
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: tokens.textMuted,
                }}
              >
                {activeProduct.category}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                <StarIcon sx={{ color: tokens.warning, fontSize: 14 }} />
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: tokens.textPrimary }}>
                  {activeProduct.rating}
                </Typography>
              </Box>
            </Box>

            {/* Title & Subtitle */}
            <Typography
              component={NextLink}
              href={activeProduct.link}
              sx={{
                display: 'block',
                fontWeight: 700,
                fontSize: 16.5,
                color: tokens.textPrimary,
                textDecoration: 'none',
                lineHeight: 1.3,
                mb: 0.25,
              }}
            >
              {activeProduct.title}
            </Typography>

            <Typography
              sx={{
                fontSize: 12.5,
                color: tokens.textMuted,
                mb: 1.75,
              }}
            >
              {activeProduct.subtitle}
            </Typography>

            {/* Bottom Row: Price + Minimal Action Button */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 1.25,
                borderTop: `1px solid ${tokens.borderSubtle}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.8 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: tokens.textPrimary }}>
                  {activeProduct.price}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: tokens.textDisabled,
                    textDecoration: 'line-through',
                  }}
                >
                  {activeProduct.originalPrice}
                </Typography>
              </Box>

              <IconButton
                component={NextLink}
                href={activeProduct.link}
                aria-label={`View ${activeProduct.title}`}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: tokens.primarySubtle,
                  color: tokens.primary,
                  border: `1px solid ${tokens.primaryBorder}`,
                  '&:hover': {
                    bgcolor: tokens.primary,
                    color: tokens.textWhite,
                  },
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: 17 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Minimal Slider Counter & Prev/Next */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: 340,
              mt: 1.25,
              px: 0.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 12.5,
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.7)',
                letterSpacing: '0.08em',
              }}
            >
              0{currentIndex + 1}{' '}
              <Box component="span" sx={{ opacity: 0.45 }}>
                / 0{SPOTLIGHT_PRODUCTS.length}
              </Box>
            </Typography>

            <Box sx={{ display: 'flex', gap: 0.75 }}>
              <IconButton
                onClick={handlePrev}
                size="small"
                sx={{
                  width: 28,
                  height: 28,
                  color: tokens.textWhite,
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton
                onClick={handleNext}
                size="small"
                sx={{
                  width: 28,
                  height: 28,
                  color: tokens.textWhite,
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.08)' },
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
