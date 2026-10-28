import React, { type ComponentType, type ReactNode } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { studioTokens } from "@/theme/theme";

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ComponentType<any> | ReactNode;
  description?: ReactNode;
  className?: string;
  sx?: any;
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
    const IconComp = icon as ComponentType<any>;
    return <IconComp sx={{ fontSize: 20, color: studioTokens.primary }} />;
  };

  return (
    <Card
      sx={{
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: studioTokens.borderHover,
          boxShadow: studioTokens.shadowLg,
        },
        ...sx,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: studioTokens.textSecondary }}>
            {title}
          </Typography>
          {renderIcon()}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: studioTokens.textPrimary }}>
          {value}
        </Typography>
        {description && (
          <Typography variant="caption" sx={{ color: studioTokens.textMuted, display: "block", mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
