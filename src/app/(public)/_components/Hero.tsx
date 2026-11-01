"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import { tokens } from "@/theme/theme";
import { IconButton } from "@/components/ui/icon-button";
import { InputBase } from "@/components/ui/input";
import { SectionContainer } from "@/components/common/SectionContainer";
import { getAssetUrl } from "@/lib/storage";

const HERO_BACKGROUNDS = [
  getAssetUrl("banners/hero-slide-1.png"),
  getAssetUrl("banners/hero-slide-2.jpg"),
  getAssetUrl("banners/hero-slide-3.jpg"),
  getAssetUrl("banners/hero-slide-4.png"),
];

const CROSSFADE_INTERVAL_MS = 4000;

export function Hero() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [activeBgIndex, setActiveBgIndex] = useState(0);

  useEffect(() => {
    if (HERO_BACKGROUNDS.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBgIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, CROSSFADE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    if (query) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <Box
      component='section'
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: "auto", md: 540, lg: 640 },
        display: "flex",
        alignItems: "center",
        bgcolor: tokens.bgDark,
        borderBottomLeftRadius: { xs: 24, md: 36 },
        borderBottomRightRadius: { xs: 24, md: 36 },
        overflow: "hidden",
        pt: { xs: 9, md: 10.5 },
        pb: { xs: 10, md: 12 },
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, zIndex: 1, overflow: "hidden" }}>
        {HERO_BACKGROUNDS.map((src, index) => (
          <Box
            key={src}
            sx={{
              position: "absolute",
              inset: 0,
              opacity: index === activeBgIndex ? 1 : 0,
              transition: "opacity 1.4s ease-in-out",
              willChange: "opacity",
              pointerEvents: "none",
            }}
          >
            <Image
              src={src}
              alt={`Hero Banner ${index + 1}`}
              fill
              priority={index === 0}
              unoptimized
              sizes='100vw'
              style={{
                objectFit: "cover",
                objectPosition: "center right",
                imageRendering: "-webkit-optimize-contrast",
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Subtle Left Ambient Overlay for Text Readability */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background: {
            xs: "linear-gradient(180deg, rgba(4, 20, 24, 0.84) 0%, rgba(4, 20, 24, 0.62) 55%, rgba(4, 20, 24, 0.08) 100%)",
            md: "linear-gradient(90deg, rgba(4, 20, 24, 0.88) 0%, rgba(4, 20, 24, 0.74) 30%, rgba(4, 20, 24, 0.32) 48%, rgba(4, 20, 24, 0) 62%)",
          },
        }}
      />

      <SectionContainer
        component='div'
        sx={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ maxWidth: { xs: "100%", md: 540, lg: 600 } }}>
          <Typography
            component='h1'
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
              component='span'
              sx={{
                color: tokens.accent,
                background: `linear-gradient(120deg, ${tokens.accent} 0%, ${tokens.primaryLight} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Brighter You
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 14, sm: 15 },
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.72)",
              mb: 2.5,
              maxWidth: 520,
            }}
          >
            Discover carefully selected tech, from everyday essentials to high-performance gear — designed to make your life smarter, easier
            and more enjoyable.
          </Typography>

          <Box
            component='form'
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
              transition: "border-color 0.2s ease",
              "&:focus-within": {
                borderColor: tokens.primary,
              },
            }}
          >
            <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: 21 }} />
            <InputBase
              placeholder='Search gadgets, brands, or accessories...'
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
              type='submit'
              sx={{
                bgcolor: tokens.primary,
                color: tokens.textWhite,
                width: 38,
                height: 38,
                borderRadius: "50%",
                flexShrink: 0,
                "&:hover": {
                  bgcolor: tokens.primaryHover,
                },
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Box>
        </Box>
      </SectionContainer>
    </Box>
  );
}

export default Hero;