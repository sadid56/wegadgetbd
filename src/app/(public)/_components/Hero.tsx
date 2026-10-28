"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { keyframes } from "@emotion/react";

const SLIDE_OFFSET = 40;
const TRANSITION_MS = 400;
const AUTOPLAY_MS = 4000;

type Media = { id: number; image: string; link: string };

const slides: Media[] = [
  {
    id: 1,
    image: "https://www.outletexpense.xyz/uploads/3-Emdad/1772787338_69aa968a3f57d.jpg",
    link: "/products",
  },
  {
    id: 2,
    image: "https://www.outletexpense.xyz/uploads/3-Emdad/1772787088_69aa9590cf694.jpg",
    link: "/products",
  },
  {
    id: 3,
    image: "https://www.outletexpense.xyz/uploads/3-Emdad/1772787102_69aa959e36231.jpg",
    link: "/products",
  },
  {
    id: 4,
    image: "https://www.outletexpense.xyz/uploads/3-Emdad/1772787166_69aa95decf3bb.jpg",
    link: "/products",
  },
];

const banners: Media[] = [
  {
    id: 1,
    image: "https://www.outletexpense.xyz/uploads/3-Emdad/1772797867_69aabfabb2467.jpg",
    link: "/collection",
  },
  {
    id: 2,
    image: "https://www.outletexpense.xyz/uploads/3-Emdad/1772787200_69aa96008760f.jpg",
    link: "/collection",
  },
];

const bannerIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const arrowButtonSx = {
  position: "absolute" as const,
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 3,
  width: 36,
  height: 36,
  bgcolor: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(4px)",
  boxShadow: 1,
  opacity: 0,
  transition: "opacity 200ms ease, background-color 200ms ease",
  "&:hover": { bgcolor: "#fff" },
  "&:focus-visible": { opacity: 1 },
};

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [exitingSlide, setExitingSlide] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isHovered, setIsHovered] = useState(false);
  const currentRef = useRef(0);

  const goToSlide = useCallback((index: number) => {
    const from = currentRef.current;
    if (from === index) return;
    setDirection(index > from ? 1 : -1);
    setExitingSlide(from);
    currentRef.current = index;
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentRef.current + 1) % slides.length);
  }, [goToSlide]);

  const previousSlide = useCallback(() => {
    goToSlide((currentRef.current - 1 + slides.length) % slides.length);
  }, [goToSlide]);

  useEffect(() => {
    if (isHovered) return;
    const timer = window.setInterval(nextSlide, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [nextSlide, isHovered]);

  const offset = direction > 0 ? SLIDE_OFFSET : -SLIDE_OFFSET;

  return (
    <Box component='section' sx={{ width: "100%" }}>
      <Container maxWidth='xl' sx={{ pt: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box
          sx={{
            display: "grid",
            gap: { xs: 1.5, md: 2 },
            gridTemplateColumns: { xs: "1fr", md: "repeat(6, 1fr)" },
          }}
        >
          <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
              position: "relative",
              gridColumn: { md: "span 4" },
              minHeight: { xs: 224, lg: 420 },
              borderRadius: { xs: 1.5, sm: 2 },
              overflow: "hidden",
              bgcolor: "grey.100",
              "&:hover .MuiIconButton-root": { opacity: 1 },
            }}
          >
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              const isExiting = index === exitingSlide;

              return (
                <Box
                  key={slide.id}
                  component={NextLink}
                  href={slide.link}
                  tabIndex={isActive ? 0 : -1}
                  aria-hidden={!isActive}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "block",
                    zIndex: isActive ? 2 : isExiting ? 1 : 0,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateX(0)" : isExiting ? `translateX(${-offset}px)` : `translateX(${offset}px)`,
                    transition: `opacity ${TRANSITION_MS}ms ease-in-out, transform ${TRANSITION_MS}ms ease-in-out`,
                    pointerEvents: isActive ? "auto" : "none",
                    willChange: "opacity, transform",
                  }}
                >
                  <Box
                    component='img'
                    src={slide.image}
                    alt=''
                    draggable={false}
                    sx={{
                      display: "block",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      userSelect: "none",
                    }}
                  />
                </Box>
              );
            })}

            <IconButton onClick={previousSlide} aria-label='Previous slide' sx={{ ...arrowButtonSx, left: 12 }}>
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <IconButton onClick={nextSlide} aria-label='Next slide' sx={{ ...arrowButtonSx, right: 12 }}>
              <ChevronRightIcon sx={{ fontSize: 16 }} />
            </IconButton>

            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 1,
                zIndex: 3,
              }}
            >
              {slides.map((slide, index) => {
                const isActive = index === currentSlide;
                return (
                  <Box
                    key={slide.id}
                    component='button'
                    type='button'
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={isActive}
                    sx={{
                      p: 0,
                      border: 0,
                      cursor: "pointer",
                      borderRadius: 999,
                      transition: "width 300ms, height 300ms, background-color 300ms",
                      width: isActive ? 24 : 8,
                      height: isActive ? 6 : 8,
                      bgcolor: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          <Box
            sx={{
              gridColumn: { md: "span 2" },
              display: "grid",
              gap: { xs: 1.5, md: 2 },
              gridTemplateColumns: { xs: "repeat(2, 1fr)", lg: "1fr" },
              gridTemplateRows: { lg: "repeat(2, 1fr)" },
            }}
          >
            {banners.map((banner, index) => (
              <Box
                key={banner.id}
                component={NextLink}
                href={banner.link}
                sx={{
                  display: "block",
                  height: "100%",
                  borderRadius: { xs: 1.5, sm: 2 },
                  overflow: "hidden",
                  bgcolor: "grey.100",
                  transition: "box-shadow 300ms ease",
                  "&:hover": { boxShadow: 4 },
                  "&:hover img": { transform: "scale(1.05)" },
                  animation: `${bannerIn} ${TRANSITION_MS}ms ease-out ${150 + index * 100}ms both`,
                  "@media (prefers-reduced-motion: reduce)": {
                    animation: "none",
                  },
                }}
              >
                <Box
                  component='img'
                  src={banner.image}
                  alt=''
                  draggable={false}
                  sx={{
                    display: "block",
                    width: "100%",
                    height: { xs: "100%", lg: 256 },
                    objectFit: "cover",
                    transition: "transform 500ms ease",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
