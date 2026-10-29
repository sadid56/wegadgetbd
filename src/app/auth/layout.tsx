import type { Metadata } from "next";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { tokens } from "@/theme/theme";

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

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#f8fafc",
        position: "relative",
      }}
    >
      {/* Top Header Navigation */}
      <Box
        component='header'
        sx={{
          px: { xs: 2.5, sm: 4 },
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        {/* Back to Home Button */}
        <NextLink href='/' style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: "#334155",
              fontSize: { xs: 13, sm: 13.5 },
              fontWeight: 600,
              px: { xs: 1.75, sm: 2.25 },
              py: 0.85,
              borderRadius: "9999px",
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              transition: "all 0.15s ease",
              "&:hover": {
                bgcolor: "#f1f5f9",
                borderColor: "#cbd5e1",
                color: "#0f172a",
                transform: "translateX(-2px)",
              },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16, color: tokens.primary }} />
            Back to Home
          </Box>
        </NextLink>

        {/* Brand Logo in Header */}
        <NextLink href='/' style={{ textDecoration: "none" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.2,
            }}
          >
            {/* Clover / Sparkle icon */}
            <Box
              sx={{
                width: 28,
                height: 28,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2.5px",
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
                fontSize: { xs: 17, sm: 19 },
                letterSpacing: "-0.03em",
                color: "#0f172a",
              }}
            >
              We Gadget{" "}
              <Box component='span' sx={{ color: tokens.primary }}>
                BD
              </Box>
            </Typography>
          </Box>
        </NextLink>
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
          borderTop: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Typography sx={{ fontSize: 12.5, color: "#64748b" }}>
          © {new Date().getFullYear()} We Gadget BD. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
