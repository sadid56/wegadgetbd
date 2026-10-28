import * as React from "react";
import { Box, Card as MuiCard, Typography, type CardProps as MuiCardProps, type SxProps, type Theme } from "@mui/material";
import { studioTokens } from "@/theme/theme";

export interface CardProps extends MuiCardProps {
  sx?: SxProps<Theme>;
}

export function Card({ sx, children, ...props }: CardProps) {
  return (
    <MuiCard
      sx={{
        bgcolor: studioTokens.bgPanel,
        color: studioTokens.textPrimary,
        border: `1px solid ${studioTokens.borderDefault}`,
        borderRadius: `${studioTokens.radiusLg}px`,
        boxShadow: studioTokens.shadowMd,
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
    <Typography variant="h6" sx={{ fontWeight: 700, color: studioTokens.textPrimary, ...sx }} {...props}>
      {children}
    </Typography>
  );
}

export function CardDescription({ sx, children, ...props }: { sx?: SxProps<Theme>; children?: React.ReactNode; [key: string]: any }) {
  return (
    <Typography variant="body2" sx={{ color: studioTokens.textMuted, mt: 0.5, ...sx }} {...props}>
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
