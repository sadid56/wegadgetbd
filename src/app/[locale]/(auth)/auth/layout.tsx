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
        px: 2,
        py: { xs: 3, sm: 5 },
      }}
    >
      {/* Top Floating Controls: Back to Home + Language Switcher */}
      <Box
        sx={{
          position: { xs: "static", sm: "absolute" },
          top: { sm: 24 },
          left: { sm: 28 },
          right: { sm: 28 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: { xs: 3, sm: 0 },
          zIndex: 10,
        }}
      >
        {/* User-friendly Back to Store / Home Button */}
        <Link href='/' style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: tokens.textSecondary,
              fontSize: 13,
              fontWeight: 600,
              px: 2,
              py: 0.9,
              borderRadius: `${tokens.radiusPill}px`,
              bgcolor: tokens.bgPanel,
              border: `1px solid ${tokens.borderDefault}`,
              boxShadow: tokens.shadowSm,
              transition: "all 0.18s ease",
              "&:hover": {
                bgcolor: tokens.bgSubtle,
                borderColor: tokens.borderElevated,
                color: tokens.textPrimary,
                transform: "translateX(-3px)",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16, color: tokens.primary }} />
            <span>{t("backToHome")}</span>
          </Box>
        </Link>

        {/* Language Switcher */}
        <LanguageSwitcher variant="inline" showIcon={false} />
      </Box>

      {/* Main Centered Content */}
      <Box
        component='main'
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          my: "auto",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 440,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Brand Logo Above Card */}
          <Box sx={{ mb: 3 }}>
            <BrandLogo variant="light" size="md" href="/" />
          </Box>

          {children}
        </Box>
      </Box>
    </Box>
  );
}
