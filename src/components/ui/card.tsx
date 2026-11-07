import * as React from "react";
import MuiCard, { type CardProps as MuiCardProps } from "@mui/material/Card";
import MuiCardHeader, { type CardHeaderProps as MuiCardHeaderProps } from "@mui/material/CardHeader";
import MuiCardContent, { type CardContentProps as MuiCardContentProps } from "@mui/material/CardContent";
import MuiCardActions, { type CardActionsProps as MuiCardActionsProps } from "@mui/material/CardActions";
import MuiCardMedia, { type CardMediaProps as MuiCardMediaProps } from "@mui/material/CardMedia";
import MuiCardActionArea, { type CardActionAreaProps as MuiCardActionAreaProps } from "@mui/material/CardActionArea";
import MuiPaper, { type PaperProps as MuiPaperProps } from "@mui/material/Paper";
import Typography, { type TypographyProps } from "@mui/material/Typography";
import { type SxProps, type Theme } from "@mui/material";
import { tokens } from "@/theme/theme";

export interface CardProps extends MuiCardProps {
  sx?: SxProps<Theme>;
}

export interface CardHeaderProps extends Omit<MuiCardHeaderProps, "title" | "subheader"> {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  titleTypographyProps?: Record<string, any>;
  subheaderTypographyProps?: Record<string, any>;
}

export type CardContentProps = MuiCardContentProps;
export type CardActionsProps = MuiCardActionsProps;
export type CardMediaProps = MuiCardMediaProps;
export type CardActionAreaProps = MuiCardActionAreaProps;
export type PaperProps = MuiPaperProps;

export const Paper = React.forwardRef<HTMLDivElement, PaperProps>(function Paper(
  { sx, ...props },
  ref
) {
  return (
    <MuiPaper
      ref={ref}
      sx={[
        {
          bgcolor: tokens.bgPanel,
          color: tokens.textPrimary,
          border: `1px solid ${tokens.borderDefault}`,
          borderRadius: `${tokens.radiusLg}px`,
          boxShadow: tokens.elevation1,
          backgroundImage: "none",
          transition: "box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1)",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
});

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { sx, children, ...props },
  ref
) {
  return (
    <MuiCard
      ref={ref}
      sx={[
        {
          bgcolor: tokens.bgPanel,
          color: tokens.textPrimary,
          border: `1px solid ${tokens.borderDefault}`,
          borderRadius: `${tokens.radiusXl}px`,
          boxShadow: tokens.elevation1,
          backgroundImage: "none",
          p: 2.5,
          "&:has(.MuiCardContent-root), &:has(.MuiCardHeader-root)": {
            p: 0,
          },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    >
      {children}
    </MuiCard>
  );
});

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { sx, titleTypographyProps, subheaderTypographyProps, slotProps, ...props },
  ref
) {
  return (
    <MuiCardHeader
      ref={ref}
      slotProps={{
        ...slotProps,
        title: {
          variant: "h6",
          sx: { fontWeight: 700, fontSize: "1.05rem", color: tokens.textPrimary },
          ...titleTypographyProps,
          ...(slotProps as any)?.title,
        },
        subheader: {
          variant: "body2",
          sx: { color: tokens.textMuted, mt: 0.25 },
          ...subheaderTypographyProps,
          ...(slotProps as any)?.subheader,
        },
      }}
      sx={[
        {
          p: 2.5,
          pb: 1.5,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
});

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { sx, ...props },
  ref
) {
  return (
    <MuiCardContent
      ref={ref}
      sx={[
        {
          p: 2.5,
          "&:last-child": { pb: 2.5 },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
});

export const CardActions = React.forwardRef<HTMLDivElement, CardActionsProps>(function CardActions(
  { sx, ...props },
  ref
) {
  return (
    <MuiCardActions
      ref={ref}
      sx={[
        {
          p: 2.5,
          pt: 0,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
      {...props}
    />
  );
});

export const CardMedia = MuiCardMedia;
export const CardActionArea = MuiCardActionArea;

// Backward-compatible helpers for legacy usages
export const CardTitle = React.forwardRef<HTMLDivElement, TypographyProps>(function CardTitle(
  { sx, ...props },
  ref
) {
  return (
    <Typography
      ref={ref}
      variant='h6'
      sx={[{ fontWeight: 700, color: tokens.textPrimary }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      {...props}
    />
  );
});

export const CardDescription = React.forwardRef<HTMLDivElement, TypographyProps>(function CardDescription(
  { sx, ...props },
  ref
) {
  return (
    <Typography
      ref={ref}
      variant='body2'
      sx={[{ color: tokens.textMuted, mt: 0.5 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      {...props}
    />
  );
});

export const CardFooter = CardActions;
export const CardAction = CardActions;

export default Card;
