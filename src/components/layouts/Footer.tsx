"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";

import { tokens } from "@/theme/theme";
import { SectionContainer } from "@/components/common/SectionContainer";

const FOOTER_GROUPS = {
  shop: {
    title: "Shop",
    links: [
      { label: "All Categories", href: "/products" },
      { label: "Laptops", href: "/products?category=laptops" },
      { label: "Smartphones", href: "/products?category=smartphones" },
      { label: "Accessories", href: "/products?category=accessories" },
      { label: "Audio", href: "/products?category=audio" },
      { label: "Gaming", href: "/products?category=gaming" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { label: "Help Center", href: "/contact-us" },
      { label: "Shipping Policy", href: "/terms" },
      { label: "Return & Refund", href: "/terms" },
      { label: "Warranty", href: "/terms" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog / Journal", href: "/about" },
      { label: "Careers", href: "/about" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
};

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: tokens.bgDark,
        color: tokens.textWhite,
        pt: { xs: 8, md: 10 },
        pb: 4,
        borderTopLeftRadius: { xs: 24, md: 36 },
        borderTopRightRadius: { xs: 24, md: 36 },
        borderTop: "1px solid rgba(16, 185, 129, 0.2)",
        overflow: "hidden",
      }}
    >
      <SectionContainer component="div">
        {/* Main 5-column layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "2fr 1fr 1fr 1fr",
            },
            gap: { xs: 4, md: 5, lg: 6 },
            mb: { xs: 6, md: 8 },
          }}
        >
          {/* 1. Brand column */}
          <Box sx={{ maxWidth: 320 }}>
            <Box
              component={NextLink}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                textDecoration: "none",
                mb: 1.5,
              }}
            >
              {/* Clover / Sparkle icon */}
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "3px",
                  p: "3px",
                  alignItems: "center",
                  justifyItems: "center",
                }}
              >
                <Box sx={{ width: 9, height: 9, bgcolor: tokens.accent, borderRadius: "50% 50% 0 50%" }} />
                <Box sx={{ width: 9, height: 9, bgcolor: tokens.primary, borderRadius: "50% 50% 50% 0" }} />
                <Box sx={{ width: 9, height: 9, bgcolor: tokens.primary, borderRadius: "50% 0 50% 50%" }} />
                <Box sx={{ width: 9, height: 9, bgcolor: tokens.accent, borderRadius: "0 50% 50% 50%" }} />
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 18,
                  color: tokens.textWhite,
                  letterSpacing: "-0.02em",
                }}
              >
                We Gadget BD
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: 13.5,
                color: tokens.textDarkMuted,
                mb: 2.5,
                lineHeight: 1.6,
              }}
            >
              Smarter Tech • Brighter Days
            </Typography>

            {/* Social Icons */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                size="small"
                sx={{
                  color: tokens.textDarkMuted,
                  border: `1px solid ${tokens.borderDark}`,
                  "&:hover": { color: tokens.textWhite, bgcolor: "rgba(255, 255, 255, 0.08)" },
                }}
              >
                <FacebookIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                component="a"
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                size="small"
                sx={{
                  color: tokens.textDarkMuted,
                  border: `1px solid ${tokens.borderDark}`,
                  "&:hover": { color: tokens.textWhite, bgcolor: "rgba(255, 255, 255, 0.08)" },
                }}
              >
                <YouTubeIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                size="small"
                sx={{
                  color: tokens.textDarkMuted,
                  border: `1px solid ${tokens.borderDark}`,
                  "&:hover": { color: tokens.textWhite, bgcolor: "rgba(255, 255, 255, 0.08)" },
                }}
              >
                <InstagramIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                component="a"
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                size="small"
                sx={{
                  color: tokens.textDarkMuted,
                  border: `1px solid ${tokens.borderDark}`,
                  "&:hover": { color: tokens.textWhite, bgcolor: "rgba(255, 255, 255, 0.08)" },
                }}
              >
                <XIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>

          {/* 2. Shop links */}
          <Box>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: tokens.textWhite,
                mb: 2,
              }}
            >
              {FOOTER_GROUPS.shop.title}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              {FOOTER_GROUPS.shop.links.map((link) => (
                <Box
                  key={link.label}
                  component={NextLink}
                  href={link.href}
                  sx={{
                    fontSize: 13.5,
                    color: tokens.textDarkMuted,
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    "&:hover": { color: tokens.primary },
                  }}
                >
                  {link.label}
                </Box>
              ))}
            </Box>
          </Box>

          {/* 3. Support links */}
          <Box>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: tokens.textWhite,
                mb: 2,
              }}
            >
              {FOOTER_GROUPS.support.title}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              {FOOTER_GROUPS.support.links.map((link) => (
                <Box
                  key={link.label}
                  component={NextLink}
                  href={link.href}
                  sx={{
                    fontSize: 13.5,
                    color: tokens.textDarkMuted,
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    "&:hover": { color: tokens.primary },
                  }}
                >
                  {link.label}
                </Box>
              ))}
            </Box>
          </Box>

          {/* 4. Company links */}
          <Box>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: tokens.textWhite,
                mb: 2,
              }}
            >
              {FOOTER_GROUPS.company.title}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              {FOOTER_GROUPS.company.links.map((link) => (
                <Box
                  key={link.label}
                  component={NextLink}
                  href={link.href}
                  sx={{
                    fontSize: 13.5,
                    color: tokens.textDarkMuted,
                    textDecoration: "none",
                    transition: "color 0.2s ease",
                    "&:hover": { color: tokens.primary },
                  }}
                >
                  {link.label}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Divider sx={{ borderColor: tokens.borderDark, mb: 3 }} />

        {/* Bottom bar */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Typography sx={{ fontSize: 12.5, color: tokens.textDarkMuted }}>
            © {new Date().getFullYear()} We Gadget BD. All rights reserved.
          </Typography>

          <Typography sx={{ fontSize: 12.5, color: tokens.textDarkMuted }}>
            Made with 💚 for tech lovers
          </Typography>
        </Box>
      </SectionContainer>
    </Box>
  );
}

export default Footer;
