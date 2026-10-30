"use client";

import React from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { tokens } from "@/theme/theme";

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
  const iconDim = size === "sm" ? 30 : size === "lg" ? 40 : 34;
  const fontSize = size === "sm" ? 16.5 : size === "lg" ? 21 : { xs: 17.5, md: 19 };
  const textColor = variant === "dark" ? tokens.textWhite : tokens.textPrimary;
  const uid = React.useId().replace(/:/g, "");

  const content = (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1.25,
        textDecoration: "none",
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      {/* Signature We Gadget BD 3D-Ribbon "W" + Navigation Pointer + Broken Circle Mark */}
      <Box
        component="svg"
        viewBox="0 0 512 512"
        fill="none"
        sx={{
          width: iconDim,
          height: iconDim,
          flexShrink: 0,
          display: "block",
        }}
      >
        <defs>
          <linearGradient id={`ringGrad-${uid}`} x1="80" y1="60" x2="430" y2="450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="45%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          <linearGradient id={`seg1Grad-${uid}`} x1="105" y1="190" x2="215" y2="395" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="45%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          <linearGradient id={`seg2Grad-${uid}`} x1="195" y1="365" x2="255" y2="255" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#090e1c" />
            <stop offset="55%" stopColor="#1e3a8a" />
            <stop offset="100%" stopColor="#090e1c" />
          </linearGradient>

          <linearGradient id={`seg3Grad-${uid}`} x1="245" y1="220" x2="345" y2="395" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="38%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          <linearGradient id={`seg4Grad-${uid}`} x1="330" y1="365" x2="425" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#090e1c" />
            <stop offset="30%" stopColor="#1e3a8a" />
            <stop offset="68%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <linearGradient id={`arrowTopGrad-${uid}`} x1="125" y1="145" x2="220" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>

          <linearGradient id={`arrowBotGrad-${uid}`} x1="168" y1="152" x2="215" y2="195" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          <mask id={`wRibbonMask-${uid}`} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
            <rect x="0" y="0" width="512" height="512" fill="black" />
            <path
              d="M 122 232 L 194 358 L 262 262 L 330 358 L 402 232"
              stroke="white"
              strokeWidth="84"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>

        {/* Outer Broken Emerald Ring */}
        <path
          d="M 483.5 202.5 A 236 236 0 1 0 488.5 224.5 L 476.5 215.5 L 460.5 246.5 A 204 204 0 1 1 441.5 170.5 L 483.5 202.5 Z"
          fill={`url(#ringGrad-${uid})`}
        />

        {/* Two-Facet Navigation Pointer */}
        <path
          d="M 218 110 L 124 146 C 120 147.5 120.5 151.5 124.5 152.5 L 168 161 L 218 110 Z"
          fill={`url(#arrowTopGrad-${uid})`}
        />
        <path
          d="M 218 110 L 168 161 L 176.5 201 C 177.5 205 181.5 205.5 183 201.5 L 218 110 Z"
          fill={`url(#arrowBotGrad-${uid})`}
        />

        {/* 3D Folded Ribbon W */}
        <g mask={`url(#wRibbonMask-${uid})`}>
          <line
            x1="194"
            y1="358"
            x2="262"
            y2="262"
            stroke={`url(#seg2Grad-${uid})`}
            strokeWidth="88"
            strokeLinecap="round"
          />
          <line
            x1="330"
            y1="358"
            x2="402"
            y2="232"
            stroke={`url(#seg4Grad-${uid})`}
            strokeWidth="88"
            strokeLinecap="round"
          />
          <circle cx="122" cy="232" r="44" fill={`url(#seg1Grad-${uid})`} />
          <path
            d="M 75 253 L 159.5 211 L 231.5 337 L 208 408 L 75 408 Z"
            fill={`url(#seg1Grad-${uid})`}
          />
          <path
            d="M 205 270 L 227 236 C 242 214 282 214 297 236 L 365.5 335 L 343 408 L 278 408 L 246 314 C 235 270 218 256 205 270 Z"
            fill={`url(#seg3Grad-${uid})`}
          />
        </g>
      </Box>

      {showText && (
        <Typography
          component="span"
          sx={{
            fontWeight: 800,
            fontSize,
            color: textColor,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          We Gadget{" "}
          <Box component="span" sx={{ color: tokens.accent }}>
            BD
          </Box>
        </Typography>
      )}
    </Box>
  );

  if (href) {
    return (
      <Box component={NextLink} href={href} sx={{ textDecoration: "none", display: "inline-flex" }}>
        {content}
      </Box>
    );
  }

  return content;
}

export default BrandLogo;
