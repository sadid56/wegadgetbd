"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import { tokens } from "@/theme/theme";
import { IconButton } from "@/components/ui/icon-button";
import { InputBase } from "@/components/ui/input";
import { SectionContainer } from "@/components/common/SectionContainer";
import { getAssetUrl } from "@/lib/storage";
import { useTranslations } from "next-intl";
import { HeroSearchModal } from "./HeroSearchModal";

const HERO_BACKGROUNDS = [
  getAssetUrl("banners/hero-slide-1.png"),
  getAssetUrl("banners/hero-slide-2.jpg"),
  getAssetUrl("banners/hero-slide-3.jpg"),
  getAssetUrl("banners/hero-slide-4.png"),
];

const CROSSFADE_INTERVAL_MS = 4000;

export function Hero() {
  const t = useTranslations("home");
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    setIsSearchOpen(true);
  };

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: 560, sm: 600, md: 560, lg: 640 },
        display: "flex",
        alignItems: "center",
        bgcolor: tokens.bgDark,
        borderBottomLeftRadius: { xs: 24, md: 36 },
        borderBottomRightRadius: { xs: 24, md: 36 },
        overflow: "hidden",
        pt: { xs: 11, sm: 12, md: 10.5 },
        pb: { xs: 12, sm: 13, md: 12 },
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
              sizes="100vw"
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
            xs: "linear-gradient(180deg, rgba(4, 20, 24, 0.90) 0%, rgba(4, 20, 24, 0.72) 48%, rgba(4, 20, 24, 0.40) 80%, rgba(4, 20, 24, 0.22) 100%)",
            md: "linear-gradient(90deg, rgba(4, 20, 24, 0.88) 0%, rgba(4, 20, 24, 0.74) 30%, rgba(4, 20, 24, 0.32) 48%, rgba(4, 20, 24, 0) 62%)",
          },
        }}
      />

      <SectionContainer
        component="div"
        sx={{
          position: "relative",
          zIndex: 3,
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box sx={{ maxWidth: { xs: "100%", md: 540, lg: 600 } }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", sm: "2.4rem", md: "2.9rem", lg: "3.2rem" },
              lineHeight: { xs: 1.18, md: 1.1 },
              letterSpacing: "-0.03em",
              color: tokens.textWhite,
              mb: { xs: 1.75, md: 2 },
            }}
          >
            {t("heroHeadingPart1")} <br />
            {t("heroHeadingFor")}{" "}
            <Box
              component="span"
              sx={{
                color: tokens.accent,
                background: `linear-gradient(120deg, ${tokens.accent} 0%, ${tokens.primaryLight} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("heroHeadingHighlight")}
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 13.5, sm: 14.5, md: 15 },
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.78)",
              mb: { xs: 3, sm: 3.5 },
              maxWidth: 520,
            }}
          >
            {t("heroSubtitle")}
          </Typography>

          <Box
            onClick={() => setIsSearchOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsSearchOpen(true);
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              bgcolor: "#FFFFFF",
              border: "1px solid rgba(255, 255, 255, 0.9)",
              borderRadius: `${tokens.radiusPill}px`,
              boxShadow: "0 12px 32px -4px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.12)",
              p: { xs: "5px 7px 5px 16px", sm: "6px 8px 6px 18px" },
              maxWidth: 500,
              mb: { xs: 1, md: 0 },
              cursor: "pointer",
            }}
          >
            <SearchIcon sx={{ color: tokens.primary, fontSize: 21 }} />
            <InputBase
              variant="plain"
              placeholder={t("heroSearchPlaceholder")}
              readOnly
              tabIndex={-1}
              fullWidth
              sx={{
                pointerEvents: "none",
                color: "#1E293B",
                fontSize: 14.5,
                fontWeight: 500,
                "& input": {
                  cursor: "pointer",
                  "&::placeholder": {
                    color: "#94A3B8",
                    opacity: 1,
                  },
                },
              }}
            />
            <IconButton
              type="button"
              aria-label="Open search"
              onClick={(e) => {
                e.stopPropagation();
                setIsSearchOpen(true);
              }}
              sx={{
                bgcolor: tokens.primary,
                color: tokens.textWhite,
                width: 38,
                height: 38,
                borderRadius: "50%",
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(0, 191, 166, 0.35)",
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Box>
        </Box>
      </SectionContainer>

      {/* Expandable Hero Search Modal */}
      <HeroSearchModal
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchValue}
      />
    </Box>
  );
}

export default Hero;
