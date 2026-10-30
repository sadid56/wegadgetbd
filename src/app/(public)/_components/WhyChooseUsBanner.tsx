"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { tokens } from "@/theme/theme";
import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/common/SectionContainer";

const PILLARS = [
  {
    icon: VerifiedUserOutlinedIcon,
    title: "Authentic Products",
    description: "100% genuine & sealed",
  },
  {
    icon: LocalOfferOutlinedIcon,
    title: "Best Price Guarantee",
    description: "Get the best deals always",
  },
  {
    icon: LocalShippingOutlinedIcon,
    title: "Fast & Reliable Delivery",
    description: "Across Bangladesh",
  },
  {
    icon: SupportAgentOutlinedIcon,
    title: "Dedicated Support",
    description: "We're here 24/7",
  },
];

export function WhyChooseUsBanner() {
  return (
    <SectionContainer
      sx={{
        py: { xs: 3, md: 5 },
      }}
    >
      <Box
        sx={{
          bgcolor: tokens.bgDarkSurface,
          borderRadius: { xs: "20px", md: "28px" },
          border: `1px solid ${tokens.borderDark}`,
          p: { xs: 3, md: 4, lg: 5 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "0.85fr 1fr 1fr", lg: "0.8fr 1.1fr 1.1fr" },
          alignItems: "center",
          gap: { xs: 4, md: 4, lg: 5 },
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.4)",
        }}
      >
        {/* Subtle glowing background orb */}
        <Box
          sx={{
            position: "absolute",
            top: "-20%",
            right: "20%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${tokens.primarySubtle} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        {/* 1. Left: Workspace Photo */}
        <Box
          sx={{
            width: "100%",
            height: { xs: 220, md: 260 },
            borderRadius: "18px",
            overflow: "hidden",
            position: "relative",
            border: `1px solid ${tokens.borderDarkSubtle}`,
          }}
        >
          <Box
            component="img"
            src="/images/workspace-banner.jpg"
            alt="Workspace"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.9) contrast(1.05)",
              transition: "transform 0.5s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
          />
        </Box>

        {/* 2. Middle: Story & Headline */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography
            sx={{
              color: tokens.accent,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            WHY CHOOSE US
          </Typography>

          <Typography
            component="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.6rem", md: "2rem" },
              color: tokens.textWhite,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            More Than Just a Store
          </Typography>

          <Typography
            sx={{
              fontSize: 14,
              color: tokens.textDarkMuted,
              lineHeight: 1.6,
              mb: 1,
            }}
          >
            We bring you the best gadgets, trusted brands, and a shopping
            experience that feels personal, fast and reliable.
          </Typography>

          <Button
            component={NextLink}
            href="/about"
            sx={{
              bgcolor: "transparent",
              color: tokens.textWhite,
              border: `1px solid rgba(255, 255, 255, 0.25)`,
              borderRadius: `${tokens.radiusPill}px`,
              py: 0.9,
              px: 2.8,
              fontSize: 13,
              fontWeight: 600,
              width: "fit-content",
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              "&:hover": {
                bgcolor: tokens.primary,
                borderColor: tokens.primary,
                color: tokens.textWhite,
              },
            }}
          >
            Our Story <ArrowForwardIcon sx={{ fontSize: 15 }} />
          </Button>
        </Box>

        {/* 3. Right: 4 Guarantee Pillars */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr" },
            gap: 2.5,
          }}
        >
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Box
                key={pillar.title}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.75,
                }}
              >
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "10px",
                    bgcolor: tokens.primarySubtle,
                    border: `1px solid ${tokens.borderDarkSubtle}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ color: tokens.accent, fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 14,
                      color: tokens.textWhite,
                      lineHeight: 1.25,
                      mb: 0.25,
                    }}
                  >
                    {pillar.title}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: tokens.textDarkMuted }}>
                    {pillar.description}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </SectionContainer>
  );
}

export default WhyChooseUsBanner;

