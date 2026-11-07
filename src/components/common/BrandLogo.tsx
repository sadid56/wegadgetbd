"use client";

import NextLink from "next/link";
import { tokens } from "@/theme/theme";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export interface BrandLogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  href?: string;
  showText?: boolean;
}

export function BrandLogo({
  variant = "dark",
  size = "md",
  href = "/",
  showText = true,
}: BrandLogoProps) {
  const iconHeight =
    size === "sm" ? 23 : size === "lg" ? 38 : { xs: 25, md: 28 };
  const fontSize =
    size === "sm" ? 16 : size === "lg" ? 21 : { xs: 17, md: 18.5 };
  // optical alignment with the text baseline and cap-height.
  const opticalShift =
    size === "sm" ? -2.5 : size === "lg" ? -3.8 : { xs: -2.5, md: -3 };
  const textColor = variant === "dark" ? tokens.textWhite : tokens.textPrimary;

  // Use high-contrast vibrant teal on dark surfaces, midnight W on light surfaces
  const logoSrc = variant === "dark" ? "/logo-dark.png" : "/logo-light.png";

  const content = (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: { xs: 1, md: 1.25 },
        textDecoration: "none",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {/* Signature We Gadget BD WG Monogram */}
      <Box
        component="img"
        src={logoSrc}
        alt="We Gadget BD"
        sx={{
          height: iconHeight,
          width: "auto",
          flexShrink: 0,
          display: "block",
          objectFit: "contain",
          transform:
            typeof opticalShift === "object"
              ? {
                  xs: `translateY(${opticalShift.xs}px)`,
                  md: `translateY(${opticalShift.md}px)`,
                }
              : `translateY(${opticalShift}px)`,
          filter:
            variant === "dark"
              ? "drop-shadow(0 2px 8px rgba(0, 191, 166, 0.3))"
              : "none",
        }}
      />

      {showText && (
        <Typography
          component="span"
          sx={{
            fontWeight: 800,
            fontSize,
            color: textColor,
            letterSpacing: "-0.025em",
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.6,
          }}
        >
          We Gadget{" "}
          <Box component="span" sx={{ color: tokens.primary }}>
            BD
          </Box>
        </Typography>
      )}
    </Box>
  );

  if (href) {
    return (
      <Box
        component={NextLink}
        href={href}
        sx={{ textDecoration: "none", display: "inline-flex" }}
      >
        {content}
      </Box>
    );
  }

  return content;
}

export default BrandLogo;
