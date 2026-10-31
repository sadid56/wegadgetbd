"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";

import { tokens } from "@/theme/theme";
import { IconButton } from "@/components/ui/icon-button";
import { Avatar } from "@/components/ui/avatar";
import { SectionContainer } from "@/components/common/SectionContainer";

const REVIEWS = [
  {
    id: 1,
    name: "Rafi Islam",
    role: "Verified Buyer",
    location: "Dhaka, Bangladesh",
    product: "Apple MacBook Air M3",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Amazing service and genuine products! Got my MacBook on time and in perfect condition. Packaging was top-notch.",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Tanjen Ahmed",
    role: "Verified Buyer",
    location: "Chittagong, Bangladesh",
    product: "Sony WH-1000XM5",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Best tech store in Bangladesh. Prices are fair, warranty registration was hassle-free, and customer support is really helpful.",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    role: "Verified Buyer",
    location: "Sylhet, Bangladesh",
    product: "iPhone 15 Pro",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Loved the smooth shopping experience. Official seal intact and fast delivery to Sylhet. Will definitely shop again!",
    date: "2 weeks ago",
  },
  {
    id: 4,
    name: "Fahim Chowdhury",
    role: "Verified Buyer",
    location: "Dhaka, Bangladesh",
    product: "Keychron K2 Keyboard",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Great collection of authentic mechanical keyboards and accessories. Delivery inside Dhaka took less than 24 hours.",
    date: "3 weeks ago",
  },
  {
    id: 5,
    name: "Sadia Rahman",
    role: "Verified Buyer",
    location: "Rajshahi, Bangladesh",
    product: "Apple Watch Series 9",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Customer support guided me through checking the serial on Apple's coverage site before opening. Highly recommended!",
    date: "1 month ago",
  },
  {
    id: 6,
    name: "Mehedi Hasan",
    role: "Verified Buyer",
    location: "Khulna, Bangladesh",
    product: "AirPods Pro 2 USB-C",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Original sealed pack with active warranty. Sound quality is unreal. WeGadget BD is my go-to tech store from now on.",
    date: "1 month ago",
  },
];

export function TestimonialsSection() {
  const [startIndex, setStartIndex] = useState(0);

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const visibleReviews = [
    REVIEWS[startIndex % REVIEWS.length],
    REVIEWS[(startIndex + 1) % REVIEWS.length],
    REVIEWS[(startIndex + 2) % REVIEWS.length],
  ];

  return (
    <SectionContainer
      sx={{
        py: { xs: 3, md: 5 },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: { xs: 2.5, md: 3.5 },
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: tokens.accent,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              mb: 0.5,
            }}
          >
            WHAT OUR CUSTOMERS SAY
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.1rem" },
              color: tokens.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            Loved by Thousands
          </Typography>
        </Box>

        {/* Carousel buttons */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={handlePrev}
            size="small"
            sx={{
              bgcolor: tokens.bgPanel,
              border: `1px solid ${tokens.borderDefault}`,
              color: tokens.textPrimary,
              p: 0.75,
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: tokens.bgSubtle,
                borderColor: tokens.borderHover,
              },
            }}
            aria-label="Previous reviews"
          >
            <ChevronLeftIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            onClick={handleNext}
            size="small"
            sx={{
              bgcolor: tokens.bgPanel,
              border: `1px solid ${tokens.borderDefault}`,
              color: tokens.textPrimary,
              p: 0.75,
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: tokens.bgSubtle,
                borderColor: tokens.borderHover,
              },
            }}
            aria-label="Next reviews"
          >
            <ChevronRightIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>

      {/* 3 Review Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: { xs: 2, sm: 2.5 },
        }}
      >
        {visibleReviews.map((review) => (
          <Box
            key={`${review.id}-${startIndex}`}
            sx={{
              bgcolor: tokens.bgPanel,
              borderRadius: "20px",
              border: `1px solid ${tokens.borderDefault}`,
              boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)",
              p: { xs: 2.5, sm: 3 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
              cursor: "default",
              // Hover interaction disabled as requested
            }}
          >
            {/* Subtle decorative quote watermark */}
            <FormatQuoteRoundedIcon
              sx={{
                position: "absolute",
                right: 18,
                top: 48,
                fontSize: 60,
                color: tokens.borderDefault,
                opacity: 0.28,
                pointerEvents: "none",
              }}
            />

            {/* Top Row: Stars rating */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                mb: 2,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Box sx={{ display: "flex", gap: 0.25 }}>
                {[...Array(review.rating)].map((_, i) => (
                  <StarRoundedIcon
                    key={i}
                    sx={{
                      color: "#f59e0b",
                      fontSize: 18,
                    }}
                  />
                ))}
              </Box>
              <Typography
                sx={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: tokens.textPrimary,
                  ml: 0.25,
                }}
              >
                5.0
              </Typography>
            </Box>

            {/* Comment */}
            <Box sx={{ flex: 1, mb: 2.5, position: "relative", zIndex: 1 }}>
              <Typography
                sx={{
                  fontSize: 13.5,
                  lineHeight: 1.65,
                  color: tokens.textSecondary,
                  fontWeight: 450,
                }}
              >
                &ldquo;{review.comment}&rdquo;
              </Typography>
            </Box>

            {/* Bottom Row: Customer Info & Location */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                pt: 2,
                borderTop: `1px solid ${tokens.borderSubtle}`,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Avatar
                src={review.avatar}
                alt={review.name}
                sx={{
                  width: 44,
                  height: 44,
                  boxShadow: `0 0 0 2px #ffffff, 0 0 0 3px ${tokens.borderDefault}`,
                }}
              />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: tokens.textPrimary,
                    lineHeight: 1.25,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {review.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.35 }}>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: tokens.textMuted,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {review.location}
                  </Typography>
                  <Box
                    sx={{
                      width: 3,
                      height: 3,
                      borderRadius: "50%",
                      bgcolor: tokens.borderElevated,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: 11.5,
                      color: tokens.textDisabled,
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    {review.date}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </SectionContainer>
  );
}

export default TestimonialsSection;
