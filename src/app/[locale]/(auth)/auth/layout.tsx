import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { tokens } from "@/theme/theme";
import { BrandLogo } from "@/components/common/BrandLogo";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export const metadata: Metadata = {
  title: "Account | We Gadget BD",
  description: "Sign in or create an account with We Gadget BD",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("auth");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: tokens.bgCanvas,
        position: "relative",
      }}
    >
      {/* Top Header Navigation */}
      <Box
        component='header'
        sx={{
          px: { xs: 2.5, sm: 4 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${tokens.borderDefault}`,
          bgcolor: tokens.bgPanel,
        }}
      >
        {/* Back to Home Button */}
        <Link href='/' style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: tokens.textSecondary,
              fontSize: { xs: 13, sm: 13.5 },
              fontWeight: 600,
              px: { xs: 1.75, sm: 2.25 },
              py: 0.85,
              borderRadius: `${tokens.radiusPill}px`,
              bgcolor: tokens.bgCanvas,
              border: `1px solid ${tokens.borderDefault}`,
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: tokens.bgSubtle,
                borderColor: tokens.borderElevated,
                color: tokens.textPrimary,
                transform: "translateX(-2px)",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16, color: tokens.primary }} />
            {t("backToHome")}
          </Box>
        </Link>

        {/* Brand Logo in Header & Language Switcher */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <LanguageSwitcher variant="inline" showIcon={false} />
          <BrandLogo variant="light" size="sm" href="/" />
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box
        component='main'
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: { xs: 4, sm: 7 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 440 }}>{children}</Box>
      </Box>

      {/* Clean Minimalist Footer */}
      <Box
        component='footer'
        sx={{
          py: 2.5,
          px: 2,
          textAlign: "center",
          borderTop: `1px solid ${tokens.borderDefault}`,
          bgcolor: tokens.bgPanel,
        }}
      >
        <Typography sx={{ fontSize: 12.5, color: tokens.textMuted }}>
          © {new Date().getFullYear()} We Gadget BD. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
