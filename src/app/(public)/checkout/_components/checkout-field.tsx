"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { tokens } from "@/theme/theme";
import { BN } from "./checkout-constants";

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Typography
          component='label'
          sx={{
            ...BN,
            fontSize: 12,
            fontWeight: 600,
            color: tokens.textSecondary,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </Typography>
        {hint && (
          <Typography component='span' sx={{ ...BN, fontSize: 11, color: tokens.textDisabled }}>
            {hint}
          </Typography>
        )}
      </Box>

      {children}

      {error && (
        <Typography
          component='p'
          sx={{
            ...BN,
            color: tokens.error,
            fontSize: 12,
            fontWeight: 500,
            mt: 0.25,
            m: 0,
          }}
        >
          {error}
        </Typography>
      )}
    </Box>
  );
}
