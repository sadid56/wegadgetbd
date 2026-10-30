"use client";

import NextImage from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";
import { tokens } from "@/theme/theme";

interface ProductHeroProps {
  search: string;
  totalProducts: number;
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export function ProductHero({ search, totalProducts }: ProductHeroProps) {
  return (
    <Box
      component='section'
      sx={{
        position: "relative",
        py: { xs: 3, sm: 5, md: 7 },
        overflow: "hidden",
      }}
    >
      {/* Background image + overlay */}
      <Box sx={{ position: "absolute", inset: 0, zIndex: -1 }}>
        <NextImage src='/images/Images/shop benner.jpg' alt='Hero Background' fill priority style={{ objectFit: "cover" }} />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(4px)",
          }}
        />
      </Box>

      <Container maxWidth='xl' sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Box sx={{ maxWidth: 768 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 1, sm: 1.5 },
              animation: `${fadeUp} 400ms ease-out both`,
            }}
          >
            {search ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: tokens.primary,
                    fontSize: { xs: 10, sm: 12 },
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  <Box sx={{ width: 24, height: 2, bgcolor: tokens.primary }} />
                  Search Results
                </Box>

                <Typography
                  component='h1'
                  className='bricolage'
                  sx={{
                    fontSize: {
                      xs: "1.25rem",
                      sm: "1.875rem",
                      md: "2.25rem",
                      lg: "3rem",
                    },
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: tokens.textPrimary,
                    lineHeight: 1.15,
                  }}
                >
                  Showing results for{" "}
                  <Box component='span' sx={{ color: tokens.primary, wordBreak: "break-word" }}>
                    {search}
                  </Box>
                </Typography>

                <Box
                  className='roboto'
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 1,
                    fontSize: { xs: 12, sm: 14, md: 16 },
                    fontWeight: 500,
                    color: tokens.textMuted,
                  }}
                >
                  <Box
                    component='span'
                    sx={{
                      px: 1,
                      py: 0.25,
                      bgcolor: tokens.bgSubtle,
                      borderRadius: "4px",
                      color: tokens.textPrimary,
                      fontWeight: 700,
                      fontSize: 12,
                    }}
                  >
                    {totalProducts}
                  </Box>
                  products matching your search
                </Box>
              </>
            ) : (
              <>
                <Typography
                  component='h1'
                  className='bricolage'
                  sx={{
                    fontSize: {
                      xs: "1.25rem",
                      sm: "1.875rem",
                      md: "2.25rem",
                      lg: "3rem",
                    },
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: tokens.textPrimary,
                    lineHeight: 1.15,
                  }}
                >
                  Explore Our{" "}
                  <Box component='span' className='text-glow-orange' sx={{ color: tokens.primary }}>
                    Tech Universe
                  </Box>
                </Typography>

                <Typography
                  className='roboto'
                  sx={{
                    display: { xs: "none", sm: "block" },
                    fontSize: { sm: 14, md: 16, lg: 18 },
                    color: tokens.textMuted,
                    maxWidth: 576,
                    lineHeight: 1.65,
                  }}
                >
                  Discover the latest in high-performance gadgets and essential tech components, curated for professionals and enthusiasts
                  alike.
                </Typography>

                <Typography
                  className='roboto'
                  sx={{
                    display: { xs: "block", sm: "none" },
                    fontSize: 12,
                    color: tokens.textMuted,
                    lineHeight: 1.4,
                    maxWidth: 320,
                  }}
                >
                  Explore powerful gadgets and essential tech for everyday use.
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
