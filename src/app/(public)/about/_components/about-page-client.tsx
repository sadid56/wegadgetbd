"use client";

import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MemoryIcon from "@mui/icons-material/Memory";
import GroupIcon from "@mui/icons-material/Group";
import PublicIcon from "@mui/icons-material/Public";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ShieldIcon from "@mui/icons-material/Shield";
import BoltIcon from "@mui/icons-material/Bolt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PlaceIcon from "@mui/icons-material/Place";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import HandshakeIcon from "@mui/icons-material/Handshake";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReplayIcon from "@mui/icons-material/Replay";
import PercentIcon from "@mui/icons-material/Percent";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { AboutHero } from "./AboutHero";
import { BrandHistory } from "./BrandHistory";
import { MissionVision } from "./MissionVision";

const FONT_FAMILY = "system-ui, -apple-system, 'Segoe UI', sans-serif";

// ─── Counter ────────────────────────────────────────────────
function Counter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const duration = 1800;
        const startTime = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setCount(Math.floor(ease * end));
          if (p < 1) requestAnimationFrame(tick);
          else setCount(end);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <Box component='span' ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </Box>
  );
}

// ─── FadeUp — IntersectionObserver + CSS ───────────────────
function FadeUp({ children, delay = 0, sx }: { children: React.ReactNode; delay?: number; sx?: object }) {
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
      { rootMargin: "-60px" },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          opacity: 1,
          transform: "none",
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

// ─── SectionLabel ───────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
      <Box sx={{ width: 4, height: 16, borderRadius: 999, bgcolor: "#60a5fa" }} />
      <Typography
        component='span'
        sx={{
          fontSize: 10,
          fontWeight: 900,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(96,165,250,0.8)",
          fontFamily: FONT_FAMILY,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

// ─── Data ───────────────────────────────────────────────────
const STATS = [
  { label: "Established", value: 2024, suffix: "", icon: ScheduleIcon, color: "#3B82F6" },
  { label: "Products", value: 1000, suffix: "+", icon: Inventory2Icon, color: "#10B981" },
  { label: "Districts", value: 64, suffix: "", icon: PlaceIcon, color: "#A78BFA" },
  { label: "Support", value: "24/7" as const, suffix: "", icon: HandshakeIcon, color: "#F59E0B" },
];

const TIMELINE = [
  { year: "2024", title: "The Beginning", desc: "Founded with a vision to make premium tech accessible to everyone across Bangladesh." },
  { year: "2024", title: "First 1,000 Orders", desc: "Reached our first milestone — 1,000 happy customers within the first six months." },
  { year: "2025", title: "64-District Reach", desc: "Expanded nationwide delivery to all 64 districts with same-day options in Dhaka." },
  { year: "2025", title: "10k+ Products", desc: "Crossed 10,000 curated tech SKUs spanning phones, laptops, audio, wearables, and more." },
];

const VALUES = [
  {
    icon: ShieldIcon,
    title: "Authenticity First",
    desc: "Every product is sourced directly from verified distributors. No counterfeits. Ever.",
    iconColor: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
  },
  {
    icon: BoltIcon,
    title: "Speed & Reliability",
    desc: "From order to doorstep in record time. Our logistics network is built for efficiency.",
    iconColor: "#facc15",
    bg: "rgba(250,204,21,0.1)",
    border: "rgba(250,204,21,0.2)",
  },
  {
    icon: TrendingUpIcon,
    title: "Curated Excellence",
    desc: "Not everything makes the cut. Our team handpicks products that earn a place in our catalog.",
    iconColor: "#60a5fa",
    bg: "rgba(96,165,250,0.1)",
    border: "rgba(96,165,250,0.2)",
  },
  {
    icon: HandshakeIcon,
    title: "Customer First",
    desc: "Every policy, every process, every decision starts with one question: is this good for the customer?",
    iconColor: "#a78bfa",
    bg: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
  },
];

const WHY_US = [
  { icon: EmojiEventsIcon, text: "ISO-certified supply chain", sub: "Verified quality at every step" },
  { icon: StarIcon, text: "4.9/5 average rating", sub: "From 18,400+ verified customers" },
  { icon: LocalShippingIcon, text: "Nationwide in 2–4 days", sub: "Free for orders above ৳999" },
  { icon: ReplayIcon, text: "30-day hassle-free returns", sub: "No questions asked policy" },
  { icon: PercentIcon, text: "Price match guarantee", sub: "Find it cheaper, we'll match it" },
  { icon: CheckCircleIcon, text: "Genuine products only", sub: "Every item 100% authenticated" },
];

const PILLARS = [
  {
    num: "01",
    title: "Authenticity",
    icon: ShieldIcon,
    desc: "Every SKU goes through a multi-stage authentication process before it ever reaches our warehouse.",
    color: "#10B981",
  },
  {
    num: "02",
    title: "Performance",
    icon: MemoryIcon,
    desc: "We only carry products that score in the top tier for performance benchmarks in their respective category.",
    color: "#3B82F6",
  },
  {
    num: "03",
    title: "Experience",
    icon: AutoAwesomeIcon,
    desc: "From browsing to delivery to after-sales, every touchpoint is designed to feel effortless.",
    color: "#A78BFA",
  },
];

// ────────────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#060810",
        overflowX: "hidden",
        fontFamily: FONT_FAMILY,
      }}
    >
      <AboutHero />

      {/* ═══ Stats ═══ */}
      <Box
        component='section'
        sx={{
          position: "relative",
          bgcolor: "#060810",
          py: { xs: 8, md: 10 },
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: 0.025,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          },
        }}
      >
        <Container maxWidth='lg' sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              gap: { xs: 3, md: 0 },
              ...{ "@media (min-width:900px)": { "& > *:not(:last-child)": { borderRight: "1px solid rgba(255,255,255,0.08)" } } },
            }}
          >
            {STATS.map(({ label, value, suffix, icon: Icon, color }, i) => (
              <FadeUp key={label} delay={i * 0.08}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", px: 3, py: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      bgcolor: `${color}15`,
                      border: `1px solid ${color}25`,
                      transition: "transform 300ms",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  >
                    <Icon sx={{ fontSize: 20, color }} />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.3)",
                      mb: 1.5,
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "2rem", md: "3rem" },
                      fontWeight: 900,
                      letterSpacing: "-0.03em",
                      color: "#fff",
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: 1,
                    }}
                  >
                    {typeof value === "number" ? (
                      <Counter end={value} suffix={suffix} />
                    ) : (
                      <>
                        {value}
                        {suffix}
                      </>
                    )}
                  </Typography>
                </Box>
              </FadeUp>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ═══ Brand Story ═══ */}
      <Box
        component='section'
        sx={{
          position: "relative",
          bgcolor: "#080c14",
          py: { xs: 10, md: 14 },
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -128,
            left: "33.333%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            bgcolor: "rgba(37,99,235,0.06)",
            filter: "blur(100px)",
            pointerEvents: "none",
          },
        }}
      >
        <Container maxWidth='lg' sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" }, gap: { xs: 6, lg: 10 }, alignItems: "center" }}
          >
            <FadeUp>
              <SectionLabel text='Our Story' />
              <Typography
                component='h2'
                sx={{
                  fontSize: { xs: "1.875rem", md: "3rem" },
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: "#fff",
                  lineHeight: 0.92,
                  mb: 3,
                }}
              >
                Born from a{" "}
                <Box component='span' sx={{ fontStyle: "italic", color: "#60a5fa" }}>
                  frustration
                </Box>{" "}
                with mediocre tech retail.
              </Typography>
              <Typography sx={{ color: "rgba(148,163,184,1)", fontSize: 16, lineHeight: 1.65, mb: 3 }}>
                We started because we were tired of overpriced gadgets, counterfeit products, and zero after-sales support. We set out to
                build something different — a tech store that actually{" "}
                <Box component='em' sx={{ color: "rgba(255,255,255,0.7)", fontStyle: "normal", fontWeight: 600 }}>
                  cares
                </Box>{" "}
                about what you get.
              </Typography>
              <Typography sx={{ color: "rgba(100,116,139,1)", fontSize: 14, lineHeight: 1.65, mb: 4 }}>
                Today, we operate across all 64 districts of Bangladesh, serving tens of thousands of customers who trust us to deliver
                genuine products, on time, every time.
              </Typography>
              <Box
                component={NextLink}
                href='/collection'
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#60a5fa",
                  textDecoration: "none",
                  transition: "color 200ms",
                  "&:hover": { color: "#93c5fd", "& .arrow-icon": { transform: "translateX(4px)" } },
                }}
              >
                Browse the collection
                <ArrowForwardIcon className='arrow-icon' sx={{ fontSize: 16, transition: "transform 200ms" }} />
              </Box>
            </FadeUp>

            <FadeUp delay={0.15}>
              <Box sx={{ position: "relative", pl: 4, borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
                {TIMELINE.map((item) => (
                  <Box key={item.title} sx={{ position: "relative", mb: 4, "&:last-of-type": { mb: 0 } }}>
                    <Box
                      sx={{
                        position: "absolute",
                        left: "-37px",
                        top: 4,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: "#3b82f6",
                        boxShadow: "0 0 0 4px rgba(59,130,246,0.15)",
                      }}
                    />
                    <Typography
                      component='span'
                      sx={{
                        display: "block",
                        fontSize: 10,
                        fontWeight: 900,
                        color: "rgba(96,165,250,0.6)",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        mb: 0.5,
                      }}
                    >
                      {item.year}
                    </Typography>
                    <Typography component='h4' sx={{ fontSize: 14, fontWeight: 900, color: "#fff", mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "rgba(100,116,139,1)", lineHeight: 1.65 }}>{item.desc}</Typography>
                  </Box>
                ))}
              </Box>
            </FadeUp>
          </Box>
        </Container>
        <Container maxWidth='lg' sx={{ mt: 8 }}>
          <BrandHistory />
        </Container>
      </Box>

      {/* ═══ Values ═══ */}
      <Box
        component='section'
        sx={{
          position: "relative",
          bgcolor: "#060810",
          py: { xs: 10, md: 14 },
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Container maxWidth='lg' sx={{ position: "relative", zIndex: 1 }}>
          <FadeUp sx={{ textAlign: "center", mb: 7 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <SectionLabel text='What We Stand For' />
            </Box>
            <Typography
              component='h2'
              sx={{ fontSize: { xs: "1.875rem", md: "3rem" }, fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1 }}
            >
              Values that drive
              <br />
              <Box component='span' sx={{ color: "rgba(255,255,255,0.3)" }}>
                every decision.
              </Box>
            </Typography>
          </FadeUp>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
            {VALUES.map(({ icon: Icon, title, desc, iconColor, bg, border }, i) => (
              <FadeUp key={title} delay={i * 0.09}>
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    gap: 2.5,
                    bgcolor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "16px",
                    p: 3,
                    transition: "all 300ms",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(255,255,255,0.1)",
                      "& .value-title": { color: "#dbeafe" },
                      "& .value-corner": { bgcolor: "rgba(96,165,250,0.5)" },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      bgcolor: bg,
                      border: `1px solid ${border}`,
                      color: iconColor,
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      component='h3'
                      className='value-title'
                      sx={{ fontSize: 14, fontWeight: 900, color: "#fff", mb: 1, transition: "color 300ms" }}
                    >
                      {title}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "rgba(100,116,139,1)", lineHeight: 1.65 }}>{desc}</Typography>
                  </Box>
                  <Box
                    className='value-corner'
                    sx={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.1)",
                      transition: "background-color 300ms",
                    }}
                  />
                </Box>
              </FadeUp>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ═══ Mission & Vision ═══ */}
      <Box component='section' sx={{ bgcolor: "#080c14", py: { xs: 10, md: 14 }, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Container maxWidth='lg'>
          <FadeUp sx={{ mb: 6 }}>
            <SectionLabel text='Mission & Vision' />
          </FadeUp>
          <MissionVision />
        </Container>
      </Box>

      {/* ═══ Why Us ═══ */}
      <Box
        component='section'
        sx={{ position: "relative", bgcolor: "#060810", py: { xs: 10, md: 14 }, borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <Container maxWidth='lg' sx={{ position: "relative", zIndex: 1 }}>
          <FadeUp sx={{ textAlign: "center", mb: 7 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <SectionLabel text='Why Choose Us' />
            </Box>
            <Typography
              component='h2'
              sx={{ fontSize: { xs: "1.875rem", md: "3rem" }, fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1 }}
            >
              The difference you
              <br />
              <Box component='span' sx={{ color: "rgba(255,255,255,0.3)" }}>
                actually feel.
              </Box>
            </Typography>
          </FadeUp>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
              gap: 1.5,
            }}
          >
            {WHY_US.map(({ icon: Icon, text, sub }, i) => (
              <FadeUp key={text} delay={i * 0.07}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    height: "100%",
                    bgcolor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "16px",
                    p: 2.5,
                    transition: "all 300ms",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(255,255,255,0.12)",
                      "& .why-icon": { bgcolor: "rgba(59,130,246,0.15)" },
                    },
                  }}
                >
                  <Box
                    className='why-icon'
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "12px",
                      bgcolor: "rgba(59,130,246,0.1)",
                      border: "1px solid rgba(59,130,246,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background-color 300ms",
                    }}
                  >
                    <Icon sx={{ fontSize: 16, color: "#60a5fa" }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#fff", mb: 0.25 }}>{text}</Typography>
                    <Typography sx={{ fontSize: 11, color: "rgba(100,116,139,1)", lineHeight: 1.35 }}>{sub}</Typography>
                  </Box>
                </Box>
              </FadeUp>
            ))}
          </Box>

          <FadeUp delay={0.2} sx={{ mt: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                bgcolor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
                px: 4,
                py: 2.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ display: "flex" }}>
                  {["#3B82F6", "#10B981", "#A78BFA", "#F59E0B", "#EF4444"].map((c, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        border: "2px solid #060810",
                        bgcolor: `${c}40`,
                        ml: i > 0 ? "-8px" : 0,
                      }}
                    />
                  ))}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>120,000+</Typography>
                  <Typography sx={{ fontSize: 10, color: "rgba(100,116,139,1)" }}>Happy customers</Typography>
                </Box>
              </Box>
              <Box sx={{ display: { xs: "none", sm: "block" }, width: 1, height: 40, bgcolor: "rgba(255,255,255,0.08)" }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} sx={{ fontSize: 16, color: "#fbbf24" }} />
                ))}
                <Typography sx={{ fontSize: 14, fontWeight: 900, color: "#fff" }}>4.9</Typography>
                <Typography sx={{ fontSize: 11, color: "rgba(100,116,139,1)" }}>/ 5 from 18,400+ reviews</Typography>
              </Box>
              <Box sx={{ display: { xs: "none", sm: "block" }, width: 1, height: 40, bgcolor: "rgba(255,255,255,0.08)" }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: "#34d399" }} />
                <Typography sx={{ fontSize: 12, color: "rgba(148,163,184,1)", fontWeight: 500 }}>ISO-certified supply chain</Typography>
              </Box>
            </Box>
          </FadeUp>
        </Container>
      </Box>

      {/* ═══ Video feature ═══ */}
      <Box component='section' sx={{ bgcolor: "#080c14", py: { xs: 10, md: 14 }, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Container maxWidth='lg'>
          <FadeUp>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "24px",
                bgcolor: "#0f172a",
                minHeight: 280,
                "&:hover": { "& .video-bg": { transform: "scale(1.05)" } },
              }}
            >
              <Box
                className='video-bg'
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "transform 700ms",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to right, rgba(2,6,23,0.85), rgba(2,6,23,0.4), rgba(2,6,23,0.1))",
                }}
              />
              <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(2,6,23,0.6), transparent)" }} />

              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "center", md: "flex-end" },
                  gap: 3,
                  p: { xs: 4, md: 6 },
                  minHeight: 280,
                }}
              >
                <IconButton
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    bgcolor: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    backdropFilter: "blur(4px)",
                    color: "#fff",
                    flexShrink: 0,
                    transition: "all 200ms",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.25)", transform: "scale(1.1)" },
                    "&:active": { transform: "scale(0.95)" },
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: 24, ml: 0.5 }} />
                </IconButton>
                <Box>
                  <Typography
                    sx={{
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                      mb: 0.75,
                    }}
                  >
                    Behind the Brand
                  </Typography>
                  <Typography
                    component='h3'
                    sx={{
                      fontSize: { xs: "1.5rem", md: "1.875rem" },
                      fontWeight: 900,
                      color: "#fff",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.2,
                    }}
                  >
                    See how we source, verify,
                    <br /> and deliver.
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.4)", mt: 1 }}>4 min · Our full process explained</Typography>
                </Box>
              </Box>

              <Box sx={{ position: "absolute", top: 24, right: 24, display: { xs: "none", md: "flex" }, flexDirection: "column", gap: 1 }}>
                {[
                  { val: "100%", label: "Genuine" },
                  { val: "48h", label: "Avg. Delivery" },
                ].map((s) => (
                  <Box
                    key={s.label}
                    sx={{
                      bgcolor: "rgba(0,0,0,0.5)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      px: 2,
                      py: 1.25,
                      textAlign: "right",
                    }}
                  >
                    <Typography sx={{ fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{s.val}</Typography>
                    <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{s.label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </FadeUp>
        </Container>
      </Box>

      {/* ═══ Pillars ═══ */}
      <Box component='section' sx={{ bgcolor: "#060810", py: { xs: 10, md: 14 }, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Container maxWidth='lg'>
          <FadeUp sx={{ textAlign: "center", mb: 7 }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <SectionLabel text='Our Pillars' />
            </Box>
            <Typography
              component='h2'
              sx={{ fontSize: { xs: "1.875rem", md: "3rem" }, fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1 }}
            >
              Three things we
              <br />
              <Box component='span' sx={{ color: "rgba(255,255,255,0.3)" }}>
                never compromise on.
              </Box>
            </Typography>
          </FadeUp>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2 }}>
            {PILLARS.map(({ num, title, icon: Icon, desc, color }, i) => (
              <FadeUp key={num} delay={i * 0.1}>
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "24px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: `linear-gradient(to bottom, ${color}14, transparent)`,
                    p: 4,
                    height: "100%",
                    transition: "all 300ms",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.12)",
                      "& .pillar-icon": { transform: "scale(1.1)" },
                      "& .pillar-cta": { color: "#60a5fa" },
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontSize: 80,
                      fontWeight: 900,
                      color: "rgba(255,255,255,0.025)",
                      lineHeight: 1,
                      userSelect: "none",
                    }}
                  >
                    {num}
                  </Box>
                  <Box
                    className='pillar-icon'
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      bgcolor: `${color}18`,
                      border: `1px solid ${color}28`,
                      transition: "transform 300ms",
                    }}
                  >
                    <Icon sx={{ fontSize: 24, color }} />
                  </Box>
                  <Typography component='h3' sx={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", mb: 1.5 }}>
                    {title}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: "rgba(100,116,139,1)", lineHeight: 1.65 }}>{desc}</Typography>
                  <Box
                    className='pillar-cta'
                    sx={{
                      mt: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.2)",
                      transition: "color 300ms",
                    }}
                  >
                    Learn more <ChevronRightIcon sx={{ fontSize: 14 }} />
                  </Box>
                </Box>
              </FadeUp>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ═══ CTA ═══ */}
      <Box component='section' sx={{ bgcolor: "#080c14", py: { xs: 12, md: 16 } }}>
        <Container maxWidth='lg'>
          <FadeUp>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: "24px",
                bgcolor: "#060810",
                border: "1px solid rgba(255,255,255,0.08)",
                px: { xs: 4, md: 8 },
                py: { xs: 8, md: 10 },
                textAlign: "center",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
                  backgroundSize: "42px 42px",
                },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -128,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 500,
                  height: 200,
                  borderRadius: "50%",
                  bgcolor: "rgba(37,99,235,0.1)",
                  filter: "blur(80px)",
                  pointerEvents: "none",
                }}
              />

              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "rgba(59,130,246,0.1)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    color: "#60a5fa",
                    fontSize: 10,
                    fontWeight: 900,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    px: 2,
                    py: 0.75,
                    borderRadius: 999,
                    mb: 4,
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 12 }} />
                  Ready to Upgrade?
                </Box>

                <Typography
                  component='h2'
                  sx={{
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    color: "#fff",
                    lineHeight: 0.9,
                    mb: 3,
                    fontSize: "clamp(2.5rem, 7vw, 6rem)",
                  }}
                >
                  EXPERIENCE THE
                  <br />
                  <Box
                    component='span'
                    sx={{
                      background: "linear-gradient(135deg, #60A5FA 0%, #A78BFA 50%, #34D399 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    NEXT LEVEL
                  </Box>
                  <br />
                  <Box component='span' sx={{ color: "rgba(255,255,255,0.2)" }}>
                    OF TECH.
                  </Box>
                </Typography>

                <Typography sx={{ color: "rgba(148,163,184,1)", fontSize: 16, maxWidth: 560, mx: "auto", lineHeight: 1.65, mb: 5 }}>
                  Thousands of genuine products. Nationwide delivery. A buying experience that actually feels good.
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    component={NextLink}
                    href='/products'
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                    disableElevation
                    sx={{
                      height: 52,
                      px: 4,
                      borderRadius: "16px",
                      bgcolor: "#2563eb",
                      color: "#fff",
                      fontWeight: 900,
                      fontSize: 14,
                      textTransform: "none",
                      boxShadow: "0 20px 25px -5px rgba(37,99,235,0.3)",
                      transition: "all 200ms",
                      "&:hover": { bgcolor: "#3b82f6", transform: "translateY(-2px)" },
                      "&:active": { transform: "translateY(0)" },
                      "&:hover .MuiButton-endIcon svg": { transform: "translateX(4px)" },
                      "& .MuiButton-endIcon svg": { transition: "transform 200ms" },
                    }}
                  >
                    Browse Collection
                  </Button>
                  <Button
                    component={NextLink}
                    href='/contact'
                    disableElevation
                    sx={{
                      height: 52,
                      px: 4,
                      borderRadius: "16px",
                      bgcolor: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)",
                      fontWeight: 700,
                      fontSize: 14,
                      textTransform: "none",
                      transition: "all 200ms",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)", color: "#fff" },
                    }}
                  >
                    Contact Us
                  </Button>
                </Box>

                <Box sx={{ mt: 5, display: "flex", alignItems: "center", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
                  {["Free delivery over ৳999", "30-day returns", "100% authentic"].map((t) => (
                    <Box key={t} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <CheckCircleIcon sx={{ fontSize: 14, color: "#34d399" }} />
                      <Typography sx={{ fontSize: 11, color: "rgba(100,116,139,1)", fontWeight: 500 }}>{t}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </FadeUp>
        </Container>
      </Box>
    </Box>
  );
}
