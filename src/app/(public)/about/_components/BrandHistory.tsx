"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";

const fadeInX = (fromX: string) => keyframes`
  from { opacity: 0; transform: translateX(${fromX}); }
  to   { opacity: 1; transform: translateX(0); }
`;

const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
`;

function Reveal({ children, animation, sx }: { children: React.ReactNode; animation: ReturnType<typeof keyframes>; sx?: object }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        animation: visible ? `${animation} 800ms ease-out both` : "none",
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
          opacity: 1,
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

export function BrandHistory() {
  return (
    <Box component='section' sx={{ py: 12, bgcolor: "background.default" }}>
      <Container maxWidth='lg' sx={{ px: { xs: 2, md: 2 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
            gap: 8,
            alignItems: "center",
          }}
        >
          <Reveal animation={fadeInX("-30px")}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, color: "primary.main" }}>
              <Box sx={{ height: 1, width: 48, bgcolor: "primary.main" }} />
              <Box
                component='span'
                sx={{
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Since 2024
              </Box>
            </Box>

            <Typography
              component='h2'
              sx={{
                fontSize: { xs: "1.875rem", md: "3rem" },
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                mb: 4,
              }}
            >
              REDEFINING{" "}
              <Box component='span' sx={{ color: "rgba(115,115,115,0.3)" }}>
                LUXURY
              </Box>
              <br />
              IN THE TECH WORLD
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                color: "text.secondary",
                fontWeight: 300,
                lineHeight: 1.65,
                maxWidth: 576,
              }}
            >
              <Typography>
                Bongo Nex was born from a simple observation: the tech industry lacked a destination that treated gadgets as more than just
                tools—we saw them as lifestyle essentials, as pieces of art that define our modern existence.
              </Typography>
              <Typography>
                What started as a small curated collection has grown into a premier destination for tech enthusiasts who demand excellence.
                Every product in our catalog is hand-picked for its innovation, design, and uncompromising quality.
              </Typography>
              <Typography>
                Today, Bongo Nex stands as a symbol of trusted luxury, bridging the gap between cutting-edge technology and sophisticated
                living.
              </Typography>
            </Box>
          </Reveal>

          <Reveal animation={fadeInScale}>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  borderRadius: "48px",
                  overflow: "hidden",
                  bgcolor: "action.hover",
                  "&:hover .brand-img": { transform: "scale(1.1)" },
                }}
              >
                <Box
                  component='img'
                  className='brand-img'
                  src='https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop'
                  alt='Brand Vision'
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 1000ms",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(59,130,246,0.2)",
                    mixBlendMode: "overlay",
                    pointerEvents: "none",
                  }}
                />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: -40,
                  left: -40,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  p: 4,
                  borderRadius: "32px",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                  display: { xs: "none", md: "block" },
                  maxWidth: 280,
                }}
              >
                <Typography sx={{ fontSize: "2.25rem", fontWeight: 900, color: "primary.main", mb: 1, lineHeight: 1.1 }}>50k+</Typography>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "text.secondary",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    lineHeight: 1.4,
                  }}
                >
                  Happy Customers Across Bangladesh
                </Typography>
              </Box>
            </Box>
          </Reveal>
        </Box>
      </Container>
    </Box>
  );
}
