"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Skeleton } from "@/components/ui/skeleton";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";

import { tokens } from "@/theme/theme";
import { IconButton } from "@/components/ui/icon-button";
import { Avatar } from "@/components/ui/avatar";
import { SectionContainer } from "@/components/common/SectionContainer";
import { useTestimonials } from "@/query-client/testimonials";
import { getAssetUrl } from "@/lib/storage";

function TestimonialSkeleton() {
  return (
    <Box
      sx={{
        bgcolor: tokens.bgPanel,
        borderRadius: "20px",
        border: `1px solid ${tokens.borderDefault}`,
        boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.04)",
        p: { xs: 2.5, sm: 3 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 220,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 2 }}>
        <Skeleton animation="wave" width={100} height={20} />
      </Box>
      <Box sx={{ flex: 1, mb: 2.5 }}>
        <Skeleton animation="wave" width="100%" height={16} sx={{ mb: 0.75 }} />
        <Skeleton animation="wave" width="90%" height={16} sx={{ mb: 0.75 }} />
        <Skeleton animation="wave" width="70%" height={16} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pt: 2, borderTop: `1px solid ${tokens.borderSubtle}` }}>
        <Skeleton animation="wave" variant="circular" width={44} height={44} />
        <Box sx={{ flex: 1 }}>
          <Skeleton animation="wave" width="50%" height={16} sx={{ mb: 0.5 }} />
          <Skeleton animation="wave" width="35%" height={12} />
        </Box>
      </Box>
    </Box>
  );
}

export function TestimonialsSection() {
  const { data: reviews, isLoading } = useTestimonials(8);
  const [startIndex, setStartIndex] = useState(0);

  const reviewList = reviews ?? [];
  const total = reviewList.length;

  const handlePrev = () => {
    if (total === 0) return;
    setStartIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    if (total === 0) return;
    setStartIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const visibleReviews =
    total <= 3
      ? reviewList
      : [
          reviewList[startIndex % total],
          reviewList[(startIndex + 1) % total],
          reviewList[(startIndex + 2) % total],
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
        {total > 3 && (
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
        )}
      </Box>

      {/* 3 Review Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            md: `repeat(${Math.min(visibleReviews.length || 3, 3)}, 1fr)`,
          },
          gap: { xs: 2, sm: 2.5 },
        }}
      >
        {isLoading && total === 0 ? (
          Array.from({ length: 3 }).map((_, idx) => <TestimonialSkeleton key={`test-skel-${idx}`} />)
        ) : visibleReviews.length > 0 ? (
          visibleReviews.map((review, i) => (
            <Box
              key={`${review.id}-${startIndex}-${i}`}
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
                  {Array.from({ length: Math.min(Math.max(review.rating, 1), 5) }).map((_, idx) => (
                    <StarRoundedIcon
                      key={idx}
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
                  {Number(review.rating).toFixed(1)}
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
                  src={getAssetUrl(review.avatar) || "/images/default.png"}
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
                      {review.product || review.location}
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
          ))
        ) : (
          <Box
            sx={{
              gridColumn: "1 / -1",
              py: 6,
              textAlign: "center",
              bgcolor: tokens.bgPanel,
              borderRadius: "16px",
              border: `1px dashed ${tokens.borderDefault}`,
            }}
          >
            <Typography sx={{ color: tokens.textMuted, fontSize: 14 }}>
              No customer reviews available yet.
            </Typography>
          </Box>
        )}
      </Box>
    </SectionContainer>
  );
}

export default TestimonialsSection;
