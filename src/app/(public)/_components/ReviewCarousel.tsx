"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { CircularProgress } from "@/components/ui/spinner";
import { tokens } from "@/theme/theme";
import { useApprovedReviews } from "@/query-client/reviews/index";
import { ReviewCard } from "./ReviewCard";

const CARD_PAD = "max(1rem, calc((100vw - 1200px) / 2))";

export function ReviewCarousel() {
  const { data: reviews, isLoading } = useApprovedReviews();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress size={32} sx={{ color: tokens.primary }} />
      </Box>
    );
  }

  if (!reviews || reviews.length === 0) return null;

  return (
    <Box
      component='section'
      sx={{
        py: 12,
        background: `linear-gradient(to bottom, ${tokens.bgPanel}, ${tokens.bgCanvas})`,
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: tokens.borderDefault,
        overflow: "hidden",
      }}
    >
      <Container maxWidth='lg' sx={{ mb: 8, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <Box sx={{ height: 1, width: 32, bgcolor: tokens.primary, mb: 1 }} />
          <Typography
            component='span'
            sx={{
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: tokens.primary,
            }}
          >
            Testimonials
          </Typography>
        </Box>
        <Typography
          component='h2'
          sx={{
            fontSize: { xs: "1.875rem", md: "3rem" },
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: tokens.textPrimary,
          }}
        >
          TRUSTED BY{" "}
          <Box component='span' sx={{ color: tokens.primary }}>
            GAMERS
          </Box>
        </Typography>
      </Container>

      <Box sx={{ position: "relative", width: "100%" }}>
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 96,
            background: `linear-gradient(to right, ${tokens.bgPanel}, transparent)`,
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 96,
            background: `linear-gradient(to left, ${tokens.bgPanel}, transparent)`,
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 3,
            px: 2,
            pt: 2,
            pb: 6,
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {reviews.map((review: any, index: number) => {
            const isFirst = index === 0;
            const isLast = index === reviews.length - 1;
            return (
              <Box
                key={review.id}
                sx={{
                  flexShrink: 0,
                  scrollSnapAlign: "center",
                  pl: isFirst ? { xs: 2, md: CARD_PAD } : 0,
                  pr: isLast ? { xs: 2, md: CARD_PAD } : 0,
                }}
              >
                <ReviewCard review={review} />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
