"use client";

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { keyframes } from "@emotion/react";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MemoryIcon from "@mui/icons-material/Memory";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import BoltIcon from "@mui/icons-material/Bolt";
import ShieldIcon from "@mui/icons-material/Shield";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// ─── Keyframes ─────────────────────────────────────────────
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.4; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(4px); }
`;

const fadeInUp = (fromY: string) => keyframes`
  from { opacity: 0; transform: translateY(${fromY}); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeInX = (fromX: string) => keyframes`
  from { opacity: 0; transform: translateX(${fromX}); }
  to   { opacity: 1; transform: translateX(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
`;

const headlineReveal = keyframes`
  from { opacity: 0; transform: translateY(100%); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ─── Counter ──────────────────────────────────────────────
function Counter({ end, suffix = "", duration = 1600 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const step = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(ease * end));
          if (progress < 1) requestAnimationFrame(step);
          else setCount(end);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.3 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <Box component='span' ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </Box>
  );
}

// ─── Data ──────────────────────────────────────────────────
const STATS = [
  { end: 120, suffix: "k+", label: "Happy Customers", icon: GroupIcon, color: "#3B82F6" },
  { end: 50, suffix: "k+", label: "Products Listed", icon: MemoryIcon, color: "#10B981" },
  { end: 48, suffix: "+", label: "Countries Served", icon: PublicIcon, color: "#A78BFA" },
  { end: 99, suffix: "%", label: "Satisfaction Rate", icon: EmojiEventsIcon, color: "#F59E0B" },
];

const BADGES = [
  { icon: ShieldIcon, text: "Certified Authentic" },
  { icon: BoltIcon, text: "Lightning Delivery" },
  { icon: TrendingUpIcon, text: "Top-Ranked 2025" },
];

// ─── Component ────────────────────────────────────────────
export function AboutHero() {
  return (
    <Box
      component='section'
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        bgcolor: "#060810",
        minHeight: "100svh",
      }}
    >
      {/* Grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* Diagonal accent */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "55%",
            height: "100%",
            opacity: 0.035,
            background: "linear-gradient(135deg, transparent 40%, #3B82F6 40%, #3B82F6 42%, transparent 42%)",
          },
        }}
      />

      {/* Glows */}
      <Box
        sx={{
          position: "absolute",
          top: -192,
          left: -192,
          width: 600,
          height: 600,
          borderRadius: "50%",
          bgcolor: "rgba(37,99,235,0.1)",
          filter: "blur(120px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -128,
          right: -128,
          width: 500,
          height: 500,
          borderRadius: "50%",
          bgcolor: "rgba(139,92,246,0.08)",
          filter: "blur(100px)",
          pointerEvents: "none",
        }}
      />

      {/* Noise */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.025,
          mixBlendMode: "overlay",
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <Container
        maxWidth='lg'
        sx={{
          position: "relative",
          zIndex: 10,
          py: { xs: 12, md: 16 },
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: { lg: "flex-start" },
            justifyContent: { lg: "space-between" },
            gap: { xs: 6, lg: 4 },
            flex: 1,
            pt: 4,
          }}
        >
          {/* LEFT */}
          <Box sx={{ flex: 1, maxWidth: { lg: 672, xl: 768 } }}>
            {/* Kicker */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                mb: 4,
                animation: `${fadeInX("-16px")} 500ms ease-out both`,
              }}
            >
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#3b82f6", animation: `${pulse} 2s ease-in-out infinite` }} />
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "rgba(96,165,250,0.5)",
                    animation: `${pulse} 2s ease-in-out 150ms infinite`,
                  }}
                />
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "rgba(96,165,250,0.2)",
                    animation: `${pulse} 2s ease-in-out 300ms infinite`,
                  }}
                />
              </Box>
              <Box
                component='span'
                sx={{
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(96,165,250,0.8)",
                  border: "1px solid rgba(59,130,246,0.2)",
                  bgcolor: "rgba(59,130,246,0.05)",
                  px: 2,
                  py: 0.75,
                  borderRadius: 999,
                }}
              >
                Our Story &amp; Vision
              </Box>
            </Box>

            {/* Headlines */}
            <Box sx={{ overflow: "hidden", mb: 3 }}>
              <Typography
                component='h1'
                sx={{
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#fff",
                  lineHeight: 0.88,
                  fontSize: "clamp(3rem, 9vw, 7.5rem)",
                  animation: `${headlineReveal} 700ms cubic-bezier(0.16,1,0.3,1) 100ms both`,
                }}
              >
                BEYOND THE
              </Typography>
            </Box>
            <Box sx={{ overflow: "hidden", mb: 5 }}>
              <Typography
                component='h1'
                sx={{
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.88,
                  fontSize: "clamp(3rem, 9vw, 7.5rem)",
                  background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #34D399 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: `${headlineReveal} 700ms cubic-bezier(0.16,1,0.3,1) 200ms both`,
                }}
              >
                GADGET SHOP.
              </Typography>
            </Box>

            {/* Subtitle */}
            <Typography
              sx={{
                color: "rgba(148,163,184,1)",
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.65,
                maxWidth: 576,
                mb: 5,
                animation: `${fadeInUp("20px")} 600ms ease-out 350ms both`,
              }}
            >
              We are a curated ecosystem blending innovation, design, and performance — bringing the next generation of tech directly to
              your hands, backed by genuine expertise and uncompromising quality.
            </Typography>

            {/* CTAs */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                mb: 7,
                animation: `${fadeInUp("16px")} 500ms ease-out 500ms both`,
              }}
            >
              <Button
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                disableElevation
                sx={{
                  height: 48,
                  px: 3.5,
                  borderRadius: "16px",
                  bgcolor: "#2563eb",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 14,
                  textTransform: "none",
                  boxShadow: "0 20px 25px -5px rgba(37,99,235,0.3)",
                  transition: "all 200ms",
                  "&:hover": {
                    bgcolor: "#3b82f6",
                    transform: "translateY(-1px)",
                    boxShadow: "0 20px 25px -5px rgba(59,130,246,0.4)",
                    "& .MuiButton-endIcon svg": { transform: "translateX(4px)" },
                  },
                  "&:active": { transform: "translateY(0)" },
                  "& .MuiButton-endIcon svg": { transition: "transform 200ms" },
                }}
              >
                Explore Our Story
              </Button>
              <Button
                disableElevation
                sx={{
                  height: 48,
                  px: 3.5,
                  borderRadius: "16px",
                  bgcolor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: "none",
                  transition: "all 200ms",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderColor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                Our Products
              </Button>
            </Box>

            {/* Badges */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
                animation: `${fadeIn} 600ms ease-out 650ms both`,
              }}
            >
              {BADGES.map(({ icon: Icon, text }) => (
                <Box
                  key={text}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    px: 1.75,
                    py: 1,
                  }}
                >
                  <Icon sx={{ fontSize: 14, color: "#60a5fa" }} />
                  <Box component='span' sx={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
                    {text}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* RIGHT */}
          <Box
            sx={{
              width: { lg: 380, xl: 420 },
              flexShrink: 0,
              animation: `${fadeInX("32px")} 800ms cubic-bezier(0.16,1,0.3,1) 250ms both`,
            }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(4px)",
                p: { xs: 3, md: 4 },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 192,
                  height: 192,
                  borderRadius: "50%",
                  bgcolor: "rgba(59,130,246,0.1)",
                  filter: "blur(48px)",
                  pointerEvents: "none",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: 128,
                  height: 128,
                  borderRadius: "50%",
                  bgcolor: "rgba(139,92,246,0.1)",
                  filter: "blur(40px)",
                  pointerEvents: "none",
                }}
              />

              <Box sx={{ position: "relative", zIndex: 1, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "12px",
                      bgcolor: "rgba(59,130,246,0.15)",
                      border: "1px solid rgba(59,130,246,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MemoryIcon sx={{ fontSize: 16, color: "#60a5fa" }} />
                  </Box>
                  <Box
                    component='span'
                    sx={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    }}
                  >
                    Company Profile
                  </Box>
                </Box>
                <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 20, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                  Built different.
                  <br />
                  <Box component='span' sx={{ color: "rgba(255,255,255,0.35)" }}>
                    Engineered to last.
                  </Box>
                </Typography>
              </Box>

              <Box sx={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5 }}>
                {STATS.map(({ end, suffix, label, icon: Icon, color }, i) => (
                  <Box
                    key={label}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      bgcolor: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "16px",
                      p: 1.75,
                      transition: "background-color 200ms",
                      animation: `${fadeInScale} 400ms ease-out ${500 + i * 80}ms both`,
                      "&:hover": { bgcolor: "rgba(255,255,255,0.07)" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: `${color}18`,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      <Icon sx={{ fontSize: 14, color }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                        <Counter end={end} suffix={suffix} />
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.4)", mt: 0.25, fontWeight: 500, lineHeight: 1.35 }}>
                        {label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  mt: 2,
                  pt: 2,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box
                  component='span'
                  sx={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.3)",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  Est.
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{ height: 1, width: 64, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)" }}
                  />
                  <Box component='span' sx={{ fontSize: 14, fontWeight: 900, color: "rgba(255,255,255,0.6)" }}>
                    2018
                  </Box>
                  <Box
                    sx={{ height: 1, width: 64, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)" }}
                  />
                </Box>
                <Box
                  component='span'
                  sx={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.3)",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                  }}
                >
                  Global
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                mt: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                background: "linear-gradient(to right, rgba(37,99,235,0.15), rgba(139,92,246,0.1), rgba(16,185,129,0.1))",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                px: 2.5,
                py: 1.5,
                animation: `${fadeInUp("8px")} 500ms ease-out 800ms both`,
              }}
            >
              <EmojiEventsIcon sx={{ fontSize: 16, color: "#fbbf24" }} />
              <Box component='span' sx={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
                Rated{" "}
                <Box component='span' sx={{ color: "#fbbf24", fontWeight: 900 }}>
                  4.9 ★
                </Box>{" "}
                by 18,400+ verified customers
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pt: 6,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            mt: 4,
            animation: `${fadeIn} 600ms ease-out 1000ms both`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component='span'
              sx={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.3em" }}
            >
              Since 2018
            </Box>
            <Box sx={{ height: 1, width: 64, background: "linear-gradient(to right, rgba(255,255,255,0.2), transparent)" }} />
          </Box>

          <Box
            component='button'
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "transparent",
              border: 0,
              cursor: "pointer",
              color: "rgba(255,255,255,0.25)",
              transition: "color 200ms",
              "&:hover": {
                color: "rgba(255,255,255,0.5)",
                "& .scroll-icon": { transform: "translateY(2px)" },
              },
            }}
          >
            <Box component='span' sx={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em" }}>
              Scroll
            </Box>
            <KeyboardArrowDownIcon
              className='scroll-icon'
              sx={{ fontSize: 16, transition: "transform 200ms", animation: `${bounce} 1.5s ease-in-out infinite` }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ height: 1, width: 64, background: "linear-gradient(to left, rgba(255,255,255,0.2), transparent)" }} />
            <Box
              component='span'
              sx={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.3em" }}
            >
              Tech · Redefined
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
