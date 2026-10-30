"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LaptopMacOutlinedIcon from "@mui/icons-material/LaptopMacOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import WatchOutlinedIcon from "@mui/icons-material/WatchOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import GraphicEqOutlinedIcon from "@mui/icons-material/GraphicEqOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import DevicesOtherOutlinedIcon from "@mui/icons-material/DevicesOtherOutlined";
import SpeakerOutlinedIcon from "@mui/icons-material/SpeakerOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { tokens } from "@/theme/theme";
import { SectionContainer } from "@/components/common/SectionContainer";

const CATEGORIES = [
  { name: "Laptops", slug: "laptops", icon: LaptopMacOutlinedIcon },
  { name: "Smartphones", slug: "smartphones", icon: SmartphoneOutlinedIcon },
  { name: "Smartwatches", slug: "smartwatches", icon: WatchOutlinedIcon },
  { name: "Headphones", slug: "audio", icon: HeadphonesOutlinedIcon },
  { name: "Earbuds", slug: "audio", icon: GraphicEqOutlinedIcon },
  { name: "Gaming", slug: "gaming", icon: SportsEsportsOutlinedIcon },
  { name: "Accessories", slug: "accessories", icon: DevicesOtherOutlinedIcon },
  { name: "Audio", slug: "audio", icon: SpeakerOutlinedIcon },
  { name: "Smart Home", slug: "smart-life", icon: VideocamOutlinedIcon },
];

export function CategoryRibbon() {
  return (
    <SectionContainer
      sx={{
        position: "relative",
        zIndex: 10,
        mt: { xs: -4.5, md: -6.5 },
        mb: { xs: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          width: "fit-content",
          maxWidth: "100%",
          mx: "auto",
          bgcolor: tokens.bgPanel,
          borderRadius: { xs: "18px", md: "24px" },
          border: `1px solid ${tokens.borderDefault}`,
          boxShadow: tokens.shadowLg,
          p: { xs: 2, md: "16px 28px" },
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: { xs: "flex-start", lg: "center" },
          justifyContent: "center",
          gap: { xs: 2, lg: 3.5 },
          overflow: "hidden",
        }}
      >
        {/* Left Label */}
        <Box sx={{ flexShrink: 0, pr: { lg: 1 } }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: 14.5, md: 16 },
              color: tokens.textPrimary,
              lineHeight: 1.2,
            }}
          >
            Shop by Category
          </Typography>
          <Typography sx={{ fontSize: 12, color: tokens.textMuted, mt: 0.25 }}>
            Find what you need, faster.
          </Typography>
        </Box>

        {/* Categories Horizontal Scroll / Grid */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, sm: 2, md: 2.25 },
            overflowX: "auto",
            maxWidth: "100%",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            py: 0.25,
          }}
        >
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Box
                key={cat.name}
                component={NextLink}
                href={`/products?category=${cat.slug}`}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.75,
                  textDecoration: "none",
                  flexShrink: 0,
                  group: "cat",
                  "&:hover .cat-box": {
                    bgcolor: tokens.primaryLight,
                    borderColor: tokens.primaryBorder,
                    transform: "translateY(-3px)",
                    boxShadow: tokens.shadowMd,
                  },
                  "&:hover .cat-name": {
                    color: tokens.primary,
                  },
                }}
              >
                <Box
                  className="cat-box"
                  sx={{
                    width: { xs: 48, sm: 52 },
                    height: { xs: 48, sm: 52 },
                    borderRadius: "14px",
                    bgcolor: tokens.bgSubtle,
                    border: `1px solid ${tokens.borderSubtle}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.25s ease",
                  }}
                >
                  <Icon sx={{ fontSize: 22, color: tokens.textPrimary }} />
                </Box>
                <Typography
                  className="cat-name"
                  sx={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: tokens.textSecondary,
                    textAlign: "center",
                    transition: "color 0.2s ease",
                  }}
                >
                  {cat.name}
                </Typography>
              </Box>
            );
          })}

          {/* More Arrow */}
          <Box
            component={NextLink}
            href="/products"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.75,
              textDecoration: "none",
              flexShrink: 0,
              "&:hover .more-btn": {
                bgcolor: tokens.primary,
                color: tokens.textWhite,
                transform: "scale(1.05)",
              },
            }}
          >
            <Box
              className="more-btn"
              sx={{
                width: { xs: 48, sm: 52 },
                height: { xs: 48, sm: 52 },
                borderRadius: "50%",
                bgcolor: tokens.bgSubtle,
                border: `1px solid ${tokens.borderDefault}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: tokens.textPrimary,
                transition: "all 0.25s ease",
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Box>
            <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: tokens.textMuted }}>
              More
            </Typography>
          </Box>
        </Box>
      </Box>
    </SectionContainer>
  );
}

export default CategoryRibbon;

