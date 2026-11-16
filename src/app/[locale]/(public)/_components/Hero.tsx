"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { SectionContainer } from "@/components/common/SectionContainer";
import { getAssetUrl } from "@/lib/storage";
import { useTranslations } from "next-intl";

const HERO_SLIDES = [
  getAssetUrl("banners/hero-slide-1.png"),
  getAssetUrl("banners/hero-slide-2.jpg"),
  getAssetUrl("banners/hero-slide-3.jpg"),
  getAssetUrl("banners/hero-slide-4.png"),
];

const SLIDE_INTERVAL_MS = 4500;

export function Hero() {
  const t = useTranslations("home");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        bgcolor: "#F1F5F9",
        pt: { xs: 10, sm: 11, md: 12 },
        pb: { xs: 7, sm: 8, md: 9.5 },
      }}
    >
      <SectionContainer>
        {/* ========================================================================= */}
        {/* BENTO GRID HERO LAYOUT                                                    */}
        {/* ========================================================================= */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.35fr 1fr" },
            gap: { xs: 2, sm: 2.25, md: 2.5 },
            alignItems: "stretch",
          }}
        >
          {/* ===================================================================== */}
          {/* 1. LEFT MAIN FLAGSHIP HERO CARD (~58% width)                          */}
          {/* ===================================================================== */}
          <Box
            sx={{
              position: "relative",
              borderRadius: { xs: "28px", sm: "32px", md: "36px" },
              bgcolor: "#06181C",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              boxShadow: "0 20px 45px -15px rgba(6, 24, 28, 0.22)",
              p: { xs: 3, sm: 4, md: 4.5, lg: 5 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              minHeight: { xs: 420, sm: 460, md: 490 },
            }}
          >
            {/* Background Image Carousel */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              {HERO_SLIDES.map((src, index) => (
                <Box
                  key={src}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    opacity: index === activeSlide ? 1 : 0,
                    transition: "opacity 0.8s ease-in-out",
                    willChange: "opacity",
                  }}
                >
                  <Box
                    component="img"
                    src={src}
                    alt={`Hero Slide ${index + 1}`}
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = "/images/hero/hero-flagship-combo.jpg";
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center right",
                      display: "block",
                    }}
                  />
                </Box>
              ))}
            </Box>

            {/* Dark Ambient Scrim for Crisp White Text Readability */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
                background: {
                  xs: "linear-gradient(180deg, rgba(4, 20, 24, 0.90) 0%, rgba(4, 20, 24, 0.72) 55%, rgba(4, 20, 24, 0.35) 100%)",
                  md: "linear-gradient(90deg, rgba(4, 20, 24, 0.92) 0%, rgba(4, 20, 24, 0.78) 42%, rgba(4, 20, 24, 0.30) 68%, rgba(4, 20, 24, 0.05) 100%)",
                },
              }}
            />

            {/* Left Content Column */}
            <Box
              sx={{
                flex: 1,
                zIndex: 2,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
                maxWidth: { sm: 340, md: 380, lg: 410 },
              }}
            >
              {/* Main Heading & CTA */}
              <Box>
                {/* Main Heading */}
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: "2rem", sm: "2.35rem", md: "2.75rem", lg: "3.1rem" },
                    fontWeight: 900,
                    lineHeight: { xs: 1.15, md: 1.1 },
                    letterSpacing: "-0.035em",
                    color: "#FFFFFF",
                    mb: 1.75,
                  }}
                >
                  {t("heroHeadingPart1")}
                  <br />
                  {t("heroHeadingFor")}{" "}
                  <Box
                    component="span"
                    sx={{
                      color: "#00E5C7",
                      display: "inline-block",
                    }}
                  >
                    {t("heroHeadingHighlight")}
                  </Box>
                </Typography>

                {/* Subtitle */}
                <Typography
                  sx={{
                    fontSize: { xs: 13.5, sm: 14, md: 14.5 },
                    lineHeight: 1.6,
                    color: "rgba(255, 255, 255, 0.82)",
                    fontWeight: 400,
                    mb: { xs: 3, sm: 3.5 },
                    maxWidth: 360,
                  }}
                >
                  {t("heroSubtitle")}
                </Typography>

                {/* Action Button */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    component={Link}
                    href="/products"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: "#00BFA6",
                      color: "#041418",
                      borderRadius: "9999px",
                      px: { xs: 2.75, sm: 3.25 },
                      py: { xs: 1.25, sm: 1.4 },
                      fontSize: { xs: 13, sm: 14 },
                      fontWeight: 800,
                      textDecoration: "none",
                      boxShadow: "none",
                    }}
                  >
                    {t("heroCta")}
                    <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ===================================================================== */}
          {/* 2. RIGHT ASYMMETRICAL BENTO COLUMN (High-Res Problem-Solving Cards)    */}
          {/* ===================================================================== */}
          <Box
            sx={{
              display: "grid",
              gridTemplateRows: { xs: "auto auto", lg: "1.12fr 1fr" },
              gap: { xs: 2, sm: 2.25 },
              height: "100%",
            }}
          >
            {/* ----------------------------------------------------------------- */}
            {/* Top Wide Bento Card: Smart Lint Shaver (Problem Solver)           */}
            {/* ----------------------------------------------------------------- */}
            <Box
              component={Link}
              href="/products?search=lint+remover"
              sx={{
                position: "relative",
                borderRadius: { xs: "24px", sm: "28px" },
                border: "1px solid #DCE6EE",
                boxShadow: "0 10px 30px -15px rgba(15, 23, 42, 0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "100%",
                minHeight: { xs: 200, sm: 220, lg: "unset" },
                p: { xs: 2.5, sm: 3, md: 3.25 },
                overflow: "hidden",
                textDecoration: "none",
                bgcolor: "#E6F5F1",
              }}
            >
              <Box
                component="img"
                src={getAssetUrl("banners/hero-bento-card-1.jpg")}
                alt="Smart Lint Shaver - Renew Your Clothes"
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "85% center",
                  display: "block",
                }}
              />

              {/* Subtle left fade for crisp text contrast */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1,
                  pointerEvents: "none",
                  background:
                    "linear-gradient(90deg, rgba(235, 248, 245, 0.90) 0%, rgba(235, 248, 245, 0.65) 42%, rgba(235, 248, 245, 0) 65%)",
                }}
              />

              {/* Text content on left */}
              <Box sx={{ position: "relative", zIndex: 2, maxWidth: { xs: "60%", sm: "50%" } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.38rem" },
                    fontWeight: 800,
                    lineHeight: 1.22,
                    letterSpacing: "-0.02em",
                    color: "#0F172A",
                  }}
                >
                  {t("bentoLintTitle")}
                  <Box component="span" sx={{ color: "#009E89", display: "block" }}>
                    {t("bentoLintHighlight")}
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 10.5, sm: 11.5 },
                    color: "#475569",
                    fontWeight: 500,
                    mt: 0.75,
                    lineHeight: 1.4,
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  {t("bentoLintSubtitle")}
                </Typography>
              </Box>

              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "#0F172A",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 1.5,
                }}
              >
                <ArrowForwardIcon sx={{ fontSize: 15 }} />
              </Box>
            </Box>

            {/* ----------------------------------------------------------------- */}
            {/* Bottom Row: 2 Split Square Bento Cards (Smart Living + Audio)     */}
            {/* ----------------------------------------------------------------- */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: { xs: 1.75, sm: 2.25 },
                height: "100%",
              }}
            >
              {/* Bottom Left Card: Smart Living 360 AI Camera */}
              <Box
                component={Link}
                href="/products?category=smart-home"
                sx={{
                  position: "relative",
                  borderRadius: { xs: "22px", sm: "26px" },
                  border: "1px solid #DCE6EE",
                  boxShadow: "0 10px 30px -15px rgba(15, 23, 42, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 185, sm: 205, lg: "unset" },
                  p: { xs: 2, sm: 2.25 },
                  overflow: "hidden",
                  textDecoration: "none",
                  bgcolor: "#E6F5F1",
                }}
              >
                <Box
                  component="img"
                  src={getAssetUrl("banners/hero-bento-card-2.jpg")}
                  alt="Smarter Home - 360 AI Security"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "90% center",
                    display: "block",
                  }}
                />

                {/* Subtle left fade so text never clashes with camera */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: "none",
                    background:
                      "linear-gradient(90deg, rgba(235, 248, 245, 0.92) 0%, rgba(235, 248, 245, 0.70) 42%, rgba(235, 248, 245, 0) 65%)",
                  }}
                />

                <Box sx={{ position: "relative", zIndex: 2, maxWidth: "52%" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.95rem", sm: "1.08rem" },
                      fontWeight: 800,
                      lineHeight: 1.2,
                      letterSpacing: "-0.02em",
                      color: "#0F172A",
                    }}
                  >
                    {t("bentoCameraTitle1")}
                    <br />
                    {t("bentoCameraTitle2")}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#475569",
                      fontWeight: 500,
                      mt: 0.5,
                      lineHeight: 1.35,
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    {t("bentoCameraSubtitle")}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    bgcolor: "#0F172A",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: 14 }} />
                </Box>
              </Box>

              {/* Bottom Right Card: Wireless Earbuds */}
              <Box
                component={Link}
                href="/products?category=audio"
                sx={{
                  position: "relative",
                  borderRadius: { xs: "22px", sm: "26px" },
                  border: "1px solid #DCE6EE",
                  boxShadow: "0 10px 30px -15px rgba(15, 23, 42, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  width: "100%",
                  height: "100%",
                  minHeight: { xs: 185, sm: 205, lg: "unset" },
                  p: { xs: 2, sm: 2.25 },
                  overflow: "hidden",
                  textDecoration: "none",
                  bgcolor: "#E6F5F1",
                }}
              >
                <Box
                  component="img"
                  src={getAssetUrl("banners/hero-bento-card-3.jpg")}
                  alt="TWS Earbuds - Pure Sound & Audio"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "90% center",
                    display: "block",
                  }}
                />

                {/* Subtle left fade so text never clashes with earbuds */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: "none",
                    background:
                      "linear-gradient(90deg, rgba(235, 248, 245, 0.92) 0%, rgba(235, 248, 245, 0.70) 42%, rgba(235, 248, 245, 0) 65%)",
                  }}
                />

                <Box sx={{ position: "relative", zIndex: 2, maxWidth: "52%" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.95rem", sm: "1.08rem" },
                      fontWeight: 800,
                      lineHeight: 1.2,
                      letterSpacing: "-0.02em",
                      color: "#0F172A",
                    }}
                  >
                    {t("bentoAudioTitle1")}
                    <br />
                    {t("bentoAudioTitle2")}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 10,
                      color: "#475569",
                      fontWeight: 500,
                      mt: 0.5,
                      lineHeight: 1.35,
                      display: { xs: "none", sm: "block" },
                    }}
                  >
                    {t("bentoAudioSubtitle")}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    bgcolor: "#0F172A",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  <ArrowForwardIcon sx={{ fontSize: 14 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </SectionContainer>
    </Box>
  );
}

export default Hero;
