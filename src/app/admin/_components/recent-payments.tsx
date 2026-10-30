"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Chip } from "@/components/ui/badge";
import { tokens } from "@/theme/theme";

interface RecentPaymentsProps {
  payments: {
    id: string;
    amount: number;
    method: string;
    status: string;
    date: string;
    user: {
      name: string | null;
      email: string | null;
      image: string | null;
    } | null;
  }[];
}

const statusChipSx = (status: string) => {
  const base = {
    height: 20,
    fontSize: 10,
    fontWeight: 700,
    borderRadius: "6px",
    "& .MuiChip-label": { px: 0.75, lineHeight: 1.2 },
  } as const;

  switch (status) {
    case "COMPLETED":
      return {
        ...base,
        bgcolor: "primary.main",
        color: "primary.contrastText",
      };
    case "PENDING":
      return {
        ...base,
        bgcolor: "action.hover",
        color: "text.primary",
      };
    default:
      return {
        ...base,
        bgcolor: "error.main",
        color: "error.contrastText",
      };
  }
};

export function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <Card
      elevation={0}
      sx={{
        gridColumn: { md: "span 3" },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}
    >
      <CardHeader
        title={
          <Typography
            component='h3'
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.3,
            }}
          >
            Recent Payments
          </Typography>
        }
        subheader={<Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>Latest financial transactions.</Typography>}
        sx={{ pb: 1 }}
      />

      <CardContent>
        {payments.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
            <Typography sx={{ fontSize: 14 }}>No recent payments recorded.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {payments.map((payment) => (
              <Box key={payment.id} sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={payment.user?.image || "/avatars/01.png"}
                alt={payment.user?.name || "Avatar"}
                sx={{
                  display: { xs: "none", sm: "flex" },
                  width: 36,
                  height: 36,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {payment.user?.name?.[0]?.toUpperCase() || "U"}
              </Avatar>

              <Box sx={{ ml: 2, display: "flex", flexDirection: "column", gap: 0.5, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    lineHeight: 1.2,
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {payment.user?.name || "Unknown User"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "text.secondary",
                    lineHeight: 1.3,
                  }}
                >
                  {payment.method}
                </Typography>
              </Box>

              <Box
                sx={{
                  ml: "auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 0.5,
                }}
              >
                <Box component='span' sx={{ fontWeight: 500, fontSize: 14, color: "text.primary" }}>
                  {new Intl.NumberFormat("en-BD", {
                    style: "currency",
                    currency: "BDT",
                  }).format(payment.amount)}
                </Box>
                <Chip label={payment.status} size='small' sx={statusChipSx(payment.status)} />
              </Box>
            </Box>
          ))}
        </Box>
        )}
      </CardContent>
    </Card>
  );
}
