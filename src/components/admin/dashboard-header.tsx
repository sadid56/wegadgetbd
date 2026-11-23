"use client";

import React from "react";
import Box, { type BoxProps } from "@mui/material/Box";
import Typography, { type TypographyProps } from "@mui/material/Typography";
import { type SxProps, type Theme } from "@mui/material/styles";

export interface DashboardHeaderProps extends Omit<BoxProps, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  titleProps?: TypographyProps;
  sx?: SxProps<Theme>;
}

export function DashboardHeader({
  title,
  subtitle,
  description,
  action,
  children,
  titleProps,
  sx,
  ...props
}: DashboardHeaderProps) {
  const sub = description ?? subtitle;

  return (
    <Box
      sx={[
        {
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: { xs: 1.5, sm: 2 },
          flexWrap: "wrap",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    >
      <Box sx={{ flex: "1 1 180px", minWidth: 0 }}>
        <Typography
          component="h1"
          {...titleProps}
          sx={[
            {
              fontSize: { xs: 20, sm: 24 },
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "text.primary",
            },
            ...(Array.isArray(titleProps?.sx) ? titleProps.sx : titleProps?.sx ? [titleProps.sx] : []),
          ]}
        >
          {title}
        </Typography>
        {sub && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: { xs: 13, sm: 14 },
              mt: 0.5,
            }}
          >
            {sub}
          </Typography>
        )}
      </Box>

      {(action || children) && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
            flexShrink: 0,
          }}
        >
          {action}
          {children}
        </Box>
      )}
    </Box>
  );
}

