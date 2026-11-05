"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { IconButton } from "@/components/ui/icon-button";
import { Divider } from "@/components/ui/divider";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";

import { tokens } from "@/theme/theme";
import { SectionContainer } from "@/components/common/SectionContainer";
import { BrandLogo } from "@/components/common/BrandLogo";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

const linkSx = {
  fontSize: 13.5,
  color: tokens.textDarkMuted,
  textDecoration: "none",
  transition: "color 0.2s ease",
  "&:hover": { color: tokens.primary },
};

export function Footer() {
  const pathname = usePathname();
  const t = useTranslations("footer");
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
        borderTop: `1px solid ${tokens.borderDarkSubtle}`,
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
            <Box sx={{ mb: 1.5 }}>
              <BrandLogo variant="dark" size="md" href="/" />
            </Box>

            <Typography
              sx={{
                fontSize: 13.5,
                color: tokens.textDarkMuted,
                mb: 2.5,
                lineHeight: 1.6,
              }}
            >
              {t("tagline")}
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
              {t("shopTitle")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              <Box component={Link} href="/products" sx={linkSx}>{t("allCategories")}</Box>
              <Box component={Link} href="/products?category=laptops" sx={linkSx}>{t("laptops")}</Box>
              <Box component={Link} href="/products?category=smartphones" sx={linkSx}>{t("smartphones")}</Box>
              <Box component={Link} href="/products?category=accessories" sx={linkSx}>{t("accessories")}</Box>
              <Box component={Link} href="/products?category=audio" sx={linkSx}>{t("audio")}</Box>
              <Box component={Link} href="/products?category=gaming" sx={linkSx}>{t("gaming")}</Box>
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
              {t("supportTitle")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              <Box component={Link} href="/contact-us" sx={linkSx}>{t("helpCenter")}</Box>
              <Box component={Link} href="/terms" sx={linkSx}>{t("shippingPolicy")}</Box>
              <Box component={Link} href="/terms" sx={linkSx}>{t("returnRefund")}</Box>
              <Box component={Link} href="/terms" sx={linkSx}>{t("warranty")}</Box>
              <Box component={Link} href="/contact-us" sx={linkSx}>{t("contactUs")}</Box>
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
              {t("companyTitle")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
              <Box component={Link} href="/about" sx={linkSx}>{t("aboutUs")}</Box>
              <Box component={Link} href="/about" sx={linkSx}>{t("ourStory")}</Box>
              <Box component={Link} href="/about" sx={linkSx}>{t("careers")}</Box>
              <Box component={Link} href="/privacy" sx={linkSx}>{t("privacyPolicy")}</Box>
              <Box component={Link} href="/terms" sx={linkSx}>{t("termsConditions")}</Box>
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
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography sx={{ fontSize: 12.5, color: tokens.textDarkMuted }}>
            © {new Date().getFullYear()} We Gadget BD. {t("copyright")}
          </Typography>

          <LanguageSwitcher variant="footer" />

          <Typography sx={{ fontSize: 12.5, color: tokens.textDarkMuted }}>
            {t("craftedWith")}
          </Typography>
        </Box>
      </SectionContainer>
    </Box>
  );
}

export default Footer;
