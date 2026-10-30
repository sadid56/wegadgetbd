"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";
import { tokens } from "@/theme/theme";
import { getAssetUrl } from "@/lib/storage";

interface ReviewCardProps {
  review: {
    id: string;
    customerName: string;
    customerPic?: string | null;
    rating: number;
    review: string;
    createdAt: string | Date;
  };
  className?: string;
  sx?: object;
}

export function ReviewCard({ review, className, sx }: ReviewCardProps) {
  return (
    <Box
      className={className}
      sx={{
        position: "relative",
        p: 4,
        borderRadius: "24px",
        bgcolor: tokens.bgPanel,
        border: "1px solid",
        borderColor: tokens.borderDefault,
        boxShadow: tokens.shadowSm,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        minWidth: { xs: 320, md: 400 },
        maxWidth: { xs: 320, md: 400 },
        flexShrink: 0,
        transition: "transform 300ms, box-shadow 300ms",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: tokens.shadowElevated,
          "& .review-quote": { color: tokens.primary, opacity: 0.2 },
          "& .review-avatar": { borderColor: tokens.primary },
          "& .review-initial": { borderColor: tokens.primary },
        },
        ...sx,
      }}
    >
      <Box
        className='review-quote'
        sx={{
          position: "absolute",
          top: 24,
          right: 32,
          color: tokens.primary,
          opacity: 0.1,
          transition: "color 300ms, opacity 300ms",
        }}
      >
        <FormatQuoteIcon sx={{ fontSize: 48, transform: "rotate(180deg)" }} />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {review.customerPic ? (
          <Box
            component='img'
            className='review-avatar'
            src={getAssetUrl(review.customerPic)}
            alt={review.customerName}
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid",
              borderColor: tokens.primaryBorder,
              transition: "border-color 300ms",
            }}
          />
        ) : (
          <Box
            className='review-initial'
            sx={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: tokens.primarySubtle,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: tokens.primary,
              fontWeight: 700,
              fontSize: 18,
              border: "2px solid",
              borderColor: tokens.primaryBorder,
              transition: "border-color 300ms",
            }}
          >
            {review.customerName.charAt(0).toUpperCase()}
          </Box>
        )}
        <Box>
          <Typography component='h4' sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.2, color: tokens.textPrimary }}>
            {review.customerName}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                sx={{
                  fontSize: 14,
                  color: i < review.rating ? tokens.warning : tokens.textDisabled,
                  transition: "color 200ms",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Typography
        sx={{
          color: tokens.textSecondary,
          fontWeight: 300,
          lineHeight: 1.65,
          position: "relative",
          zIndex: 1,
          fontStyle: "italic",
        }}
      >
        &quot;{review.review}&quot;
      </Typography>
    </Box>
  );
}
