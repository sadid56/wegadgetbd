"use client";

import React from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import WatchOutlinedIcon from "@mui/icons-material/WatchOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

import { tokens } from "@/theme/theme";
import { getAssetUrl } from "@/lib/storage";

export interface NavbarMegaMenuProps {
  open: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const PRIMARY_COLLECTIONS = [
  {
    title: "All Products",
    description: "Browse the complete 100% genuine tech catalog",
    href: "/products",
    icon: StorefrontOutlinedIcon,
    badge: null,
  },
  {
    title: "Trending",
    description: "Most viewed & viral gear this week",
    href: "/products?sort=popular",
    icon: TrendingUpRoundedIcon,
    badge: "POPULAR",
    badgeColor: "#0ea5e9",
  },
  {
    title: "Best Sellers",
    description: "Top-rated gadgets loved by thousands",
    href: "/products?sort=rating",
    icon: StarOutlineRoundedIcon,
    badge: "TOP RATED",
    badgeColor: "#f59e0b",
  },
  {
    title: "New Arrivals",
    description: "Fresh tech drops & latest official releases",
    href: "/products?sort=newest",
    icon: AutoAwesomeOutlinedIcon,
    badge: "JUST IN",
    badgeColor: tokens.primary,
  },
];

const QUICK_DISCOVERY = [
  {
    label: "Flash Deals",
    sub: "Up to 40% Off",
    href: "/products?sort=discount",
    icon: LocalOfferOutlinedIcon,
  },
  {
    label: "Audio & Music",
    sub: "TWS, Speakers & IEMs",
    href: "/products?category=audio-sound",
    icon: HeadphonesOutlinedIcon,
  },
  {
    label: "Smart Wearables",
    sub: "Watches & Health Bands",
    href: "/products?category=smart-wearables",
    icon: WatchOutlinedIcon,
  },
  {
    label: "Gaming Gear",
    sub: "Peripherals & Accessories",
    href: "/products?category=gaming-entertainment",
    icon: SportsEsportsOutlinedIcon,
  },
];

export function NavbarMegaMenu({
  open,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: NavbarMegaMenuProps) {
  if (!open) return null;

  return (
    <Box
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        position: "absolute",
        top: "calc(100% + 10px)",
        left: 0,
        right: 0,
        mx: "auto",
        zIndex: 1200,
        maxWidth: { md: "840px", lg: "900px" },
        width: "100%",
        bgcolor: "#ffffff",
        borderRadius: "24px",
        border: "1px solid rgba(15, 23, 42, 0.08)",
        boxShadow:
          "0 25px 60px -15px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(0, 191, 166, 0.08)",
        overflow: "hidden",
        animation: "megaMenuSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "@keyframes megaMenuSlideDown": {
          from: {
            opacity: 0,
            transform: "translateY(-6px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        // Subtle top glowing neon hairline
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: "2px",
          background: "linear-gradient(90deg, transparent, #00BFA6, transparent)",
          zIndex: 10,
        },
      }}
    >
      <Box sx={{ p: { xs: 2.5, md: 3 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1.2fr 1fr 240px" },
            gap: 2.5,
            alignItems: "stretch",
          }}
        >
          {/* Column 1: Core Product Feeds (All Products, Trending, Best Sellers, New Arrivals) */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#64748b",
                px: 1,
                mb: 0.5,
              }}
            >
              Featured Feeds
            </Typography>

            {PRIMARY_COLLECTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <Box
                  key={item.title}
                  component={NextLink}
                  href={item.href}
                  onClick={onClose}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.25,
                    borderRadius: "14px",
                    textDecoration: "none",
                    bgcolor: "transparent",
                    transition: "background-color 0.18s ease",
                    "&:hover": {
                      bgcolor: "rgba(0, 191, 166, 0.08)",
                      "& .feed-title": {
                        color: tokens.primary,
                      },
                      "& .feed-icon": {
                        color: tokens.primary,
                        bgcolor: "rgba(0, 191, 166, 0.12)",
                      },
                      "& .feed-arrow": {
                        color: tokens.primary,
                      },
                    },
                  }}
                >
                  <Box
                    className="feed-icon"
                    sx={{
                      width: 40,
                      height: 40,
                      minWidth: 40,
                      borderRadius: "10px",
                      bgcolor: "rgba(15, 23, 42, 0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#334155",
                      transition: "all 0.18s ease",
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.25 }}>
                      <Typography
                        className="feed-title"
                        sx={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: "#0f172a",
                          lineHeight: 1.2,
                          transition: "color 0.18s ease",
                        }}
                      >
                        {item.title}
                      </Typography>

                      {item.badge && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: 9,
                            fontWeight: 800,
                            px: 0.7,
                            py: 0.15,
                            borderRadius: "999px",
                            bgcolor: item.badgeColor,
                            color: "#ffffff",
                            letterSpacing: "0.03em",
                          }}
                        >
                          {item.badge}
                        </Box>
                      )}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: 11.5,
                        color: "#64748b",
                        lineHeight: 1.3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>

                  <ChevronRightRoundedIcon
                    className="feed-arrow"
                    sx={{
                      fontSize: 18,
                      color: "#cbd5e1",
                      transition: "color 0.18s ease",
                      flexShrink: 0,
                    }}
                  />
                </Box>
              );
            })}
          </Box>

          {/* Column 2: Quick Discovery Shortcuts */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              borderLeft: "1px solid rgba(0, 0, 0, 0.06)",
              pl: 2.5,
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#64748b",
                px: 1,
                mb: 0.5,
              }}
            >
              Quick Discovery
            </Typography>

            {QUICK_DISCOVERY.map((item) => {
              const Icon = item.icon;
              return (
                <Box
                  key={item.label}
                  component={NextLink}
                  href={item.href}
                  onClick={onClose}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    p: 1.1,
                    borderRadius: "12px",
                    textDecoration: "none",
                    bgcolor: "transparent",
                    transition: "background-color 0.18s ease",
                    "&:hover": {
                      bgcolor: "rgba(0, 191, 166, 0.08)",
                      "& .disc-title": {
                        color: tokens.primary,
                      },
                      "& .disc-icon": {
                        color: tokens.primary,
                      },
                    },
                  }}
                >
                  <Icon
                    className="disc-icon"
                    sx={{
                      fontSize: 19,
                      color: "#64748b",
                      transition: "color 0.18s ease",
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      className="disc-title"
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1e293b",
                        lineHeight: 1.2,
                        transition: "color 0.18s ease",
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 11,
                        color: "#94a3b8",
                        lineHeight: 1.25,
                      }}
                    >
                      {item.sub}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Column 3: Featured 3D Promo Banner */}
          <Box
            sx={{
              borderRadius: "18px",
              p: 2.5,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid rgba(0, 191, 166, 0.35)",
              boxShadow: "0 8px 20px -6px rgba(0, 191, 166, 0.25)",
              backgroundImage: `url('${getAssetUrl("banners/nav-promo-banner.png")}')`,
              backgroundSize: "cover",
              backgroundPosition: "center right",
            }}
          >
            {/* Soft text backing gradient */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(220, 252, 248, 0.94) 0%, rgba(220, 252, 248, 0.72) 55%, rgba(220, 252, 248, 0.12) 100%)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1,
                  py: 0.3,
                  borderRadius: "999px",
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(8px)",
                  fontSize: 9.5,
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  mb: 1.25,
                }}
              >
                ✨ Trending Tech
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  color: "#0f172a",
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  mb: 0.75,
                }}
              >
                Smarter Tech.
                <br />
                Better Life.
              </Typography>

              <Typography
                sx={{
                  fontSize: 11.5,
                  color: "#1e293b",
                  lineHeight: 1.4,
                  fontWeight: 600,
                  mb: 2,
                }}
              >
                100% authentic gear with official warranty.
              </Typography>

              <Box
                component={NextLink}
                href="/products"
                onClick={onClose}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.6,
                  bgcolor: "#101820",
                  color: "#ffffff",
                  px: 1.8,
                  py: 0.7,
                  borderRadius: "999px",
                  fontSize: 11.5,
                  fontWeight: 700,
                  textDecoration: "none",
                  transition: "background-color 0.18s ease",
                  boxShadow: "0 4px 10px rgba(16, 24, 32, 0.2)",
                  "&:hover": {
                    bgcolor: tokens.primary,
                  },
                }}
              >
                Explore More
                <ArrowForwardRoundedIcon sx={{ fontSize: 13 }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom Service Bar */}
      <Box
        sx={{
          bgcolor: "#f8fafc",
          borderTop: "1px solid rgba(0, 0, 0, 0.05)",
          px: 3,
          py: 1.15,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <LocalShippingOutlinedIcon sx={{ fontSize: 15, color: tokens.primary }} />
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>
            Fast Nationwide Delivery
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <VerifiedUserOutlinedIcon sx={{ fontSize: 15, color: tokens.primary }} />
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>
            100% Genuine with Official Warranty
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <AutorenewOutlinedIcon sx={{ fontSize: 15, color: tokens.primary }} />
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>
            7-Day Seamless Replacement
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default NavbarMegaMenu;
