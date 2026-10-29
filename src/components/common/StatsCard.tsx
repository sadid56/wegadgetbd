import React, { type ComponentType, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

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
    return <IconComp sx={{ fontSize: 20, color: "text.secondary" }} />;
  };

  return (
    <Card
      elevation={0}
      sx={{
        p: { xs: 2.25, sm: 2.5 },
        borderRadius: "12px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        ...sx,
      }}
    >
      <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "text.secondary",
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
            color: "text.primary",
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        {description && (
          <Typography
            sx={{
              color: "text.secondary",
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
