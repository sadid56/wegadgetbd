"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StarIcon from "@mui/icons-material/Star";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Amazing service and genuine products! Got my MacBook on time and in perfect condition.",
  },
  {
    id: 2,
    name: "Tanjen Ahmed",
    role: "Verified Buyer",
    location: "Chittagong, Bangladesh",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Best tech store in Bangladesh. Prices are fair and customer support is really helpful.",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    role: "Verified Buyer",
    location: "Sylhet, Bangladesh",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    comment: "Loved the smooth shopping experience. Will definitely shop again!",
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
              "&:hover": { bgcolor: tokens.bgSubtle },
            }}
            aria-label="Previous review"
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
              "&:hover": { bgcolor: tokens.bgSubtle },
            }}
            aria-label="Next review"
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
        {REVIEWS.map((review) => (
          <Box
            key={review.id}
            sx={{
              bgcolor: tokens.bgPanel,
              borderRadius: "20px",
              border: `1px solid ${tokens.borderDefault}`,
              p: { xs: 2.5, sm: 3 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: tokens.shadowSm,
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: tokens.shadowMd,
              },
            }}
          >
            {/* Header: User Avatar & Info */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Avatar
                src={review.avatar}
                alt={review.name}
                sx={{ width: 44, height: 44 }}
              />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 14.5, color: tokens.textPrimary }}>
                  {review.name}
                </Typography>
                {/* 5 Stars */}
                <Box sx={{ display: "flex", gap: 0.25, mt: 0.25 }}>
                  {[...Array(review.rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: tokens.warning, fontSize: 14 }} />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Comment */}
            <Typography
              sx={{
                fontSize: 13.5,
                color: tokens.textSecondary,
                lineHeight: 1.6,
                fontStyle: "italic",
                mb: 2,
              }}
            >
              &ldquo;{review.comment}&rdquo;
            </Typography>

            {/* Location */}
            <Typography sx={{ fontSize: 12, color: tokens.textMuted, fontWeight: 500 }}>
              {review.location}
            </Typography>
          </Box>
        ))}
      </Box>
    </SectionContainer>
  );
}

export default TestimonialsSection;

