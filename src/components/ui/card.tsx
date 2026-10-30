import * as React from "react";
import {
  Box,
  Card as MuiCard,
  Paper as MuiPaper,
  Typography,
  type CardProps as MuiCardProps,
  type PaperProps as MuiPaperProps,
  type SxProps,
  type Theme,
} from "@mui/material";
import { tokens } from "@/theme/theme";

export interface CardProps extends MuiCardProps {
  sx?: SxProps<Theme>;
}

export type PaperProps = MuiPaperProps;

export function Paper({ sx, ...props }: PaperProps) {
  return (
    <MuiPaper
      sx={[
        {
          bgcolor: tokens.bgPanel,
          color: tokens.textPrimary,
          border: `1px solid ${tokens.borderDefault}`,
          borderRadius: `${tokens.radiusLg}px`,
          boxShadow: tokens.shadowSm,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
}

export function Card({ sx, children, ...props }: CardProps) {
  return (
    <MuiCard
      sx={[
        {
          bgcolor: tokens.bgPanel,
          color: tokens.textPrimary,
          border: `1px solid ${tokens.borderDefault}`,
          borderRadius: `${tokens.radiusLg}px`,
          boxShadow: tokens.shadowSm,
          p: 2.5,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    >
      {children}
    </MuiCard>
  );
}

export function CardHeader({
  sx,
  title,
  subheader,
  action,
  titleTypographyProps,
  subheaderTypographyProps,
  children,
  ...props
}: {
  sx?: SxProps<Theme>;
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  action?: React.ReactNode;
  titleTypographyProps?: Record<string, any>;
  subheaderTypographyProps?: Record<string, any>;
  children?: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <Box
      sx={{
        mb: 2,
        display: action ? "flex" : "block",
        alignItems: action ? "center" : undefined,
        justifyContent: action ? "space-between" : undefined,
        ...sx,
      }}
      {...props}
    >
      {(title || subheader) ? (
        <Box>
          {title &&
            (React.isValidElement(title) ? (
              title
            ) : (
              <Typography
                component={titleTypographyProps?.component || "div"}
                variant={titleTypographyProps?.variant || "h6"}
                sx={{ fontWeight: 700, color: tokens.textPrimary, ...titleTypographyProps?.sx }}
              >
                {title}
              </Typography>
            ))}
          {subheader &&
            (React.isValidElement(subheader) ? (
              subheader
            ) : (
              <Typography
                component={subheaderTypographyProps?.component || "div"}
                variant={subheaderTypographyProps?.variant || "body2"}
                sx={{ color: tokens.textMuted, mt: 0.25, ...subheaderTypographyProps?.sx }}
              >
                {subheader}
              </Typography>
            ))}
        </Box>
      ) : null}
      {children}
      {action}
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
