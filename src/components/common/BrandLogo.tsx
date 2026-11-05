"use client";

import { Link } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { tokens } from "@/theme/theme";

export interface BrandLogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  href?: string;
  showText?: boolean;
}

export function BrandLogo({ variant = "dark", size = "md", href = "/", showText = true }: BrandLogoProps) {
  // Height tuned to tightly cropped glyph: 28px (sm), 36px (md), 46px (lg)
  const iconHeight = size === "sm" ? 28 : size === "lg" ? 46 : 36;
  const fontSize = size === "sm" ? 17 : size === "lg" ? 22 : { xs: 18, md: 20 };
  const textColor = variant === "dark" ? tokens.textWhite : tokens.textPrimary;

  // Use high-contrast vibrant teal on dark surfaces, midnight W on light surfaces
  const logoSrc = variant === "dark" ? "/logo-dark.png" : "/logo-light.png";

  const content = (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: { xs: 1.25, md: 1.5 },
        textDecoration: "none",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {/* Signature We Gadget BD WG Monogram */}
      <Box
        component='img'
        src={logoSrc}
        alt='We Gadget BD'
        sx={{
          height: iconHeight,
          width: "auto",
          flexShrink: 0,
          display: "block",
          objectFit: "contain",
          filter: variant === "dark" ? "drop-shadow(0 2px 10px rgba(0, 191, 166, 0.35))" : "none",
        }}
      />

      {showText && (
        <Typography
          component='span'
          sx={{
            fontWeight: 800,
            fontSize,
            color: textColor,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
          }}
        >
          We Gadget{" "}
          <Box component='span' sx={{ color: tokens.primary }}>
            BD
          </Box>
        </Typography>
      )}
    </Box>
  );

  if (href) {
    return (
      <Box component={Link} href={href} sx={{ textDecoration: "none", display: "inline-flex" }}>
        {content}
      </Box>
    );
  }

  return content;
}

export default BrandLogo;
