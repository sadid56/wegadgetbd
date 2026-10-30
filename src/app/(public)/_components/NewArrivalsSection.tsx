"use client";

import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { keyframes } from "@emotion/react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/ui/spinner";
import { tokens } from "@/theme/theme";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  brand?: string | null;
  createdAt: string | Date;
  images?: string[];
  [key: string]: any;
}

interface NewArrivalsSectionProps {
  products: Product[];
  isLoading: boolean;
}

const ringPulse = keyframes`
  from { transform: scale(1); opacity: 0.2; }
  to   { transform: scale(1.6); opacity: 0; }
`;

const textPulse = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
`;

export function NewArrivalsSection({ products, isLoading }: NewArrivalsSectionProps) {
  const latestProducts = products.slice(0, 8);

  return (
    <Box
      component='section'
      sx={{
        position: "relative",
        py: { xs: 4, md: 6 },
        maxWidth: 1400,
        mx: "auto",
        px: { xs: 1, md: 2 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          pb: 2,
          borderBottom: "2px solid",
          borderColor: tokens.primaryBorder,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 4,
              height: 32,
              borderRadius: 999,
              background: `linear-gradient(to bottom, ${tokens.primary}, ${tokens.accent})`,
            }}
          />
          <Typography
            component='h2'
            className='bricolage'
            sx={{
              fontSize: { xs: "1.5rem", md: "1.875rem" },
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: tokens.textPrimary,
              lineHeight: 1.2,
            }}
          >
            New Arrivals
          </Typography>
        </Box>

        <Button
          component={NextLink}
          href='/products'
          variant='text'
          endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
          sx={{
            border: 1,
            borderColor: tokens.borderDefault,
            borderRadius: "6px",
            color: tokens.primary,
            fontWeight: 600,
            textTransform: "none",
            transition: "all 300ms",
            "&:hover": {
              bgcolor: tokens.primary,
              color: tokens.textWhite,
              "& .MuiButton-endIcon svg": { transform: "translateX(4px)" },
            },
            "& .MuiButton-endIcon svg": { transition: "transform 200ms" },
          }}
        >
          View All
        </Button>
      </Box>

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
          }}
        >
          <Box sx={{ position: "relative", width: 64, height: 64 }}>
            <CircularProgress size={64} thickness={3} sx={{ color: tokens.primary }} />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                color: tokens.accent,
                animation: `${ringPulse} 1s ease-out infinite`,
              }}
            >
              <CircularProgress size={64} thickness={3} sx={{ color: "inherit" }} />
            </Box>
          </Box>

          <Typography
            sx={{
              mt: 3,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: tokens.textSecondary,
              animation: `${textPulse} 1.5s ease-in-out infinite`,
            }}
          >
            Loading Amazing Products...
          </Typography>
        </Box>
      ) : latestProducts.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: { xs: 1, md: 2 },
          }}
        >
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            borderRadius: "16px",
            border: "2px dashed",
            borderColor: tokens.primaryBorder,
            bgcolor: tokens.bgPanel,
          }}
        >
          <Typography sx={{ fontWeight: 500, color: tokens.textSecondary }}>No products found.</Typography>
        </Box>
      )}
    </Box>
  );
}
