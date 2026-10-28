"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
            color: "grey.600",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </Typography>
        {hint && (
          <Typography component='span' sx={{ ...BN, fontSize: 11, color: "grey.400" }}>
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
            color: "error.main",
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
