import * as React from "react";
import { Box, Card as MuiCard, Typography, type CardProps as MuiCardProps, type SxProps, type Theme } from "@mui/material";
import { tokens } from "@/theme/theme";

export interface CardProps extends MuiCardProps {
  sx?: SxProps<Theme>;
}

export function Card({ sx, children, ...props }: CardProps) {
  return (
    <MuiCard
      sx={{
        bgcolor: tokens.bgPanel,
        color: tokens.textPrimary,
        border: `1px solid ${tokens.borderDefault}`,
        borderRadius: `${tokens.radiusLg}px`,
        boxShadow: tokens.shadowMd,
        p: 2.5,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
}

export function CardHeader({ sx, children, ...props }: { sx?: SxProps<Theme>; children?: React.ReactNode; [key: string]: any }) {
  return (
    <Box sx={{ mb: 2, ...sx }} {...props}>
      {children}
    </Box>
  );
}

export function CardTitle({ sx, children, ...props }: { sx?: SxProps<Theme>; children?: React.ReactNode; [key: string]: any }) {
  return (
    <Typography variant='h6' sx={{ fontWeight: 700, color: tokens.textPrimary, ...sx }} {...props}>
      {children}
    </Typography>
  );
}

export function CardDescription({ sx, children, ...props }: { sx?: SxProps<Theme>; children?: React.ReactNode; [key: string]: any }) {
  return (
    <Typography variant='body2' sx={{ color: tokens.textMuted, mt: 0.5, ...sx }} {...props}>
      {children}
    </Typography>
  );
}

export function CardContent({ sx, children, ...props }: { sx?: SxProps<Theme>; children?: React.ReactNode; [key: string]: any }) {
  return (
    <Box sx={{ ...sx }} {...props}>
      {children}
    </Box>
  );
}

export function CardFooter({ sx, children, ...props }: { sx?: SxProps<Theme>; children?: React.ReactNode; [key: string]: any }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", pt: 2, ...sx }} {...props}>
      {children}
    </Box>
  );
}

export function CardAction({ sx, children, ...props }: { sx?: SxProps<Theme>; children?: React.ReactNode; [key: string]: any }) {
  return (
    <Box sx={{ ...sx }} {...props}>
      {children}
    </Box>
  );
}
