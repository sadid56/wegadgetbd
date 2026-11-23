import React, { type ComponentType, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { type SxProps, type Theme } from "@mui/material";
import { Card } from "@/components/ui/card";
import { tokens } from "@/theme/theme";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ComponentType<{ sx?: SxProps<Theme> }> | ReactNode;
  description?: ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  sx,
}: StatsCardProps) {
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComp = icon as ComponentType<{ sx?: SxProps<Theme> }>;
    return <IconComp sx={{ fontSize: 20, color: tokens.textSecondary }} />;
  };

  return (
    <Card
      sx={[
        {
          p: { xs: 1.75, sm: 2.5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "none",
          boxShadow: "none",
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.75, mb: { xs: 0.75, sm: 1.25 } }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: { xs: "0.78rem", sm: "0.875rem" },
            color: tokens.textSecondary,
          }}
          noWrap
        >
          {title}
        </Typography>
        {renderIcon()}
      </Box>

      <Typography
        variant='h4'
        sx={{
          fontWeight: 700,
          fontSize: { xs: "1.35rem", sm: "1.85rem" },
          color: tokens.textPrimary,
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>

      {description && (
        <Typography
          sx={{
            color: tokens.textSecondary,
            fontSize: { xs: "0.7rem", sm: "0.75rem" },
            mt: { xs: 0.5, sm: 0.75 },
            display: "block",
          }}
        >
          {description}
        </Typography>
      )}
    </Card>
  );
}
