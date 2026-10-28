"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";

import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const VALUES = [
  {
    icon: TrackChangesOutlinedIcon,
    title: "Mission",
    desc: "To empower individuals by providing access to world-class tech that inspires creativity and simplifies life.",
  },
  {
    icon: VisibilityOutlinedIcon,
    title: "Vision",
    desc: "To be the ultimate benchmark for luxury and trust in the digital retail landscape of Bangladesh.",
  },
  {
    icon: VerifiedUserOutlinedIcon,
    title: "Values",
    desc: "Integrity, innovation, and an unwavering commitment to customer satisfaction define everything we do.",
  },
];

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
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
        animation: visible ? `${fadeUp} 600ms ease-out ${delay}s both` : "none",
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
          opacity: 1,
        },
      }}
    >
      {children}
    </Box>
  );
}

export function MissionVision() {
  return (
    <Box component='section' sx={{ py: { xs: 10, md: 16 }, bgcolor: "action.hover" }}>
      <Container maxWidth='lg' sx={{ px: { xs: 2, md: 2 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: { xs: 4, md: 6 },
          }}
        >
          {VALUES.map(({ icon: Icon, title, desc }, index) => (
            <Reveal key={title} delay={index * 0.1}>
              <Box
                sx={{
                  height: "100%",
                  p: 5,
                  borderRadius: "40px",
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "transform 500ms",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    "& .mv-icon": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <Box
                  className='mv-icon'
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "16px",
                    bgcolor: "rgba(59,130,246,0.1)",
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 4,
                    transition: "background-color 500ms, color 500ms",
                  }}
                >
                  <Icon sx={{ fontSize: 32 }} />
                </Box>

                <Typography
                  component='h3'
                  sx={{
                    fontSize: 24,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    mb: 2,
                    lineHeight: 1.15,
                  }}
                >
                  {title}
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontWeight: 300,
                    lineHeight: 1.65,
                  }}
                >
                  {desc}
                </Typography>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
