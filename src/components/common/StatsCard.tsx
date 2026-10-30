import React, { type ComponentType, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card, CardContent } from "@/components/ui/card";
import { tokens } from "@/theme/theme";

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
    return <IconComp sx={{ fontSize: 20, color: tokens.textSecondary }} />;
  };

  return (
    <Card
      elevation={0}
      sx={{
        p: { xs: 2.25, sm: 2.5 },
        borderRadius: `${tokens.radiusLg}px`,
        border: `1px solid ${tokens.borderDefault}`,
        bgcolor: tokens.bgPanel,
        boxShadow: tokens.shadowSm,
        ...sx,
      }}
    >
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: tokens.textSecondary,
            }}
          >
            {title}
          </Typography>
          {renderIcon()}
        </Box>

        <Typography
          variant='h4'
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.65rem", sm: "1.85rem" },
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
              fontSize: "0.75rem",
              mt: 0.5,
              display: "block",
            }}
          >
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
