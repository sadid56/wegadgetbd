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
    <Box
      sx={{
        position: "relative",
        zIndex: 10,
        maxWidth: 1440,
        mx: "auto",
        px: { xs: 2, md: 3 },
        mt: { xs: -2, md: -3.5 },
        mb: { xs: 4, md: 5 },
      }}
    >
      <Box
        sx={{
          bgcolor: tokens.bgPanel,
          borderRadius: { xs: "20px", md: "28px" },
          border: `1px solid ${tokens.borderDefault}`,
          boxShadow: tokens.shadowLg,
          p: { xs: 2.5, md: "20px 28px" },
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          alignItems: { xs: "flex-start", lg: "center" },
          justifyContent: "space-between",
          gap: { xs: 2.5, lg: 3 },
          overflow: "hidden",
        }}
      >
        {/* Left Label */}
        <Box sx={{ flexShrink: 0, minWidth: 170 }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: 15, md: 17 },
              color: tokens.textPrimary,
              lineHeight: 1.2,
            }}
          >
            Shop by Category
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: tokens.textMuted, mt: 0.25 }}>
            Find what you need, faster.
          </Typography>
        </Box>

        {/* Categories Horizontal Scroll / Grid */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1.5, sm: 2, md: 2.5 },
            overflowX: "auto",
            width: "100%",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            py: 0.5,
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
                  gap: 1,
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
                    width: { xs: 54, sm: 60 },
                    height: { xs: 54, sm: 60 },
                    borderRadius: "16px",
                    bgcolor: tokens.bgSubtle,
                    border: `1px solid ${tokens.borderSubtle}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.25s ease",
                  }}
                >
                  <Icon sx={{ fontSize: 24, color: tokens.textPrimary }} />
                </Box>
                <Typography
                  className="cat-name"
                  sx={{
                    fontSize: 12,
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
              gap: 1,
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
                width: { xs: 54, sm: 60 },
                height: { xs: 54, sm: 60 },
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
              <ArrowForwardIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: tokens.textMuted }}>
              More
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CategoryRibbon;

