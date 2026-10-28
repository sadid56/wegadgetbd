"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";

const features = [
  {
    icon: VerifiedUserOutlinedIcon,
    title: "Verified Products",
    desc: "100% authentic gadgets and high-performance components sourced directly from trusted global manufacturers.",
    tag: "Authenticity",
  },
  {
    icon: LocalShippingOutlinedIcon,
    title: "Fast Shipping",
    desc: "Elite logistics network ensuring your tech reaches you within 24-48 hours with real-time tracking.",
    tag: "Logistics",
  },
  {
    icon: HandshakeOutlinedIcon,
    title: "Dedicated Support",
    desc: "Our expert tech team is available 24/7 to provide technical assistance and after-sales care.",
    tag: "Support",
  },
];

export function WhyChooseUsSection() {
  return (
    <Box
      component='section'
      sx={{
        position: "relative",
        py: { xs: 3, md: 12 },
        bgcolor: "#fff",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "33.333%",
          height: "100%",
          background: "linear-gradient(to left, rgba(255,237,213,0.2), transparent)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth='lg' sx={{ px: { xs: 2, md: 3 }, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            maxWidth: 672,
            mx: "auto",
            textAlign: "center",
            mb: { xs: 6, md: 8 },
          }}
        >
          <Typography
            component='h2'
            sx={{
              fontSize: {
                xs: "1.5rem",
                sm: "1.875rem",
                md: "2.25rem",
                lg: "3rem",
              },
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "grey.900",
              lineHeight: 1.15,
              mb: { xs: 2, md: 3 },
            }}
          >
            Quality{" "}
            <Box component='span' sx={{ color: "#ff7319" }}>
              tech products
            </Box>{" "}
            you can trust.
          </Typography>

          <Typography
            sx={{
              color: "grey.500",
              fontSize: { xs: 14, sm: 16, md: 18 },
              lineHeight: 1.65,
            }}
          >
            We deliver reliability, speed, and premium service to power your digital experience.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: { xs: 2, md: 3, lg: 4 },
          }}
        >
          {features.map(({ icon: Icon, title, desc, tag }) => (
            <Box
              key={title}
              sx={{
                position: "relative",
                bgcolor: "#fff",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: { xs: "16px", md: "24px" },
                p: { xs: 3, md: 4 },
                transition: "all 300ms",
                "&:hover": {
                  borderColor: "rgba(255,115,25,0.4)",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
                  transform: "translateY(-4px)",
                  "& .feature-icon-box": {
                    bgcolor: "#ff7319",
                    transform: "scale(1.05)",
                  },
                  "& .feature-icon": { color: "#fff" },
                  "& .feature-tag": { color: "#ff7319" },
                  "& .feature-title": { color: "#ff7319" },
                  "& .feature-corner": { opacity: 1 },
                },
              }}
            >
              <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
                <Box
                  className='feature-icon-box'
                  sx={{
                    width: { xs: 48, md: 56 },
                    height: { xs: 48, md: 56 },
                    borderRadius: { xs: "12px", md: "16px" },
                    bgcolor: "grey.50",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 300ms",
                  }}
                >
                  <Icon
                    className='feature-icon'
                    sx={{
                      fontSize: { xs: 20, md: 24 },
                      color: "#ff7319",
                      transition: "color 300ms",
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 1, md: 1.5 } }}>
                <Typography
                  component='span'
                  className='feature-tag'
                  sx={{
                    fontSize: { xs: 9, md: 10 },
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "grey.400",
                    transition: "color 300ms",
                  }}
                >
                  {tag}
                </Typography>

                <Typography
                  component='h3'
                  className='feature-title'
                  sx={{
                    fontSize: { xs: "1.125rem", md: "1.25rem" },
                    fontWeight: 700,
                    color: "grey.900",
                    transition: "color 300ms",
                  }}
                >
                  {title}
                </Typography>

                <Typography
                  sx={{
                    color: "grey.500",
                    fontSize: 14,
                    lineHeight: 1.65,
                  }}
                >
                  {desc}
                </Typography>
              </Box>

              <Box
                className='feature-corner'
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  width: 12,
                  height: 12,
                  opacity: 0,
                  transition: "opacity 300ms",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderTop: "1px solid",
                    borderRight: "1px solid",
                    borderColor: "rgba(255,237,213,1)",
                    borderTopRightRadius: "2px",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
