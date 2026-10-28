"use client";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface SalesChartProps {
  data: {
    date: string;
    amount: number;
  }[];
}

export function SalesChart({ data }: SalesChartProps) {
  const theme = useTheme();
  const primaryColor = theme.palette.primary.main;

  return (
    <Card
      elevation={0}
      sx={{
        gridColumn: { md: "span 4" },
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
            Sales Overview
          </Typography>
        }
        subheader={<Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>Total sales over the last 30 days</Typography>}
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ pl: 1, "&:last-child": { pb: 2 } }}>
        <Box sx={{ height: 350, width: "100%" }}>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={data}>
              <defs>
                <linearGradient id='colorAmount' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={primaryColor} stopOpacity={0.8} />
                  <stop offset='95%' stopColor={primaryColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey='date' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke={theme.palette.divider} />
              <Tooltip
                cursor={{ stroke: theme.palette.divider, strokeWidth: 1 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;

                  return (
                    <Box
                      sx={{
                        borderRadius: "8px",
                        border: "1px solid",
                        borderColor: "divider",
                        bgcolor: "background.paper",
                        p: 1,
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Box
                            component='span'
                            sx={{
                              fontSize: "0.70rem",
                              textTransform: "uppercase",
                              color: "text.secondary",
                              lineHeight: 1.2,
                            }}
                          >
                            Date
                          </Box>
                          <Box
                            component='span'
                            sx={{
                              fontWeight: 700,
                              color: "text.secondary",
                              fontSize: 13,
                              lineHeight: 1.3,
                            }}
                          >
                            {label}
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          <Box
                            component='span'
                            sx={{
                              fontSize: "0.70rem",
                              textTransform: "uppercase",
                              color: "text.secondary",
                              lineHeight: 1.2,
                            }}
                          >
                            Total
                          </Box>
                          <Box
                            component='span'
                            sx={{
                              fontWeight: 700,
                              color: "text.primary",
                              fontSize: 13,
                              lineHeight: 1.3,
                            }}
                          >
                            {new Intl.NumberFormat("en-BD", {
                              style: "currency",
                              currency: "BDT",
                            }).format(payload[0].value as number)}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  );
                }}
              />
              <Area type='monotone' dataKey='amount' stroke={primaryColor} strokeWidth={2} fillOpacity={1} fill='url(#colorAmount)' />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
