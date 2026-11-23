"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Card } from "@/components/ui/card";
import { formatBdt } from "@/lib/utils";
import { tokens } from "@/theme/theme";

interface ProductWiseRow {
  productName: string;
  soldQty: number;
}

interface SalesSummaryProps {
  totals?: {
    totalSoldQuantity: number;
    totalSellPrices: number;
    cancelCount: number;
    returnCount: number;
  };
  productWise?: {
    today: ProductWiseRow[];
    last7Days: ProductWiseRow[];
    last30Days: ProductWiseRow[];
  };
}

export function SalesSummary({ totals, productWise }: SalesSummaryProps) {
  const safeTotals = totals ?? {
    totalSoldQuantity: 0,
    totalSellPrices: 0,
    cancelCount: 0,
    returnCount: 0,
  };

  const statCards = [
    { label: "Sold Qty", value: safeTotals.totalSoldQuantity, color: "text.primary" },
    { label: "All Sell Prices", value: formatBdt(safeTotals.totalSellPrices), color: "text.primary" },
    { label: "Cancel Count", value: safeTotals.cancelCount, color: tokens.badgeSale },
    { label: "Return Count", value: safeTotals.returnCount, color: tokens.danger },
  ];

  const safeProductWise = productWise ?? {
    today: [],
    last7Days: [],
    last30Days: [],
  };

  const productWiseCards = [
    { label: "Today", rows: safeProductWise.today },
    { label: "Last 7 Days", rows: safeProductWise.last7Days },
    { label: "Last 30 Days", rows: safeProductWise.last30Days },
  ];

  return (
    <>
      {/* Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
          gap: { xs: 1.25, sm: 1.5 },
        }}
      >
        {statCards.map((card) => (
          <Card key={card.label} sx={{ p: { xs: 1.75, sm: 2.5 } }}>
            <Box
              component='p'
              sx={{
                fontSize: { xs: 10.5, sm: 12 },
                color: "text.secondary",
                textTransform: "uppercase",
                m: 0,
                letterSpacing: "0.04em",
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {card.label}
            </Box>
            <Box
              component='p'
              sx={{
                fontSize: { xs: 18, sm: 22 },
                fontWeight: 800,
                color: card.color,
                m: 0,
                mt: 0.5,
                lineHeight: 1.2,
              }}
            >
              {card.value}
            </Box>
          </Card>
        ))}
      </Box>

      {/* Product-wise Summary */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
          gap: 1.5,
        }}
      >
        {productWiseCards.map((item) => (
          <Card key={item.label}>
            <Typography component='h3' sx={{ fontSize: 14, fontWeight: 700, mb: 1.5, color: "text.primary" }}>
              {item.label}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                maxHeight: 208,
                overflowY: "auto",
                pr: 0.5,
              }}
            >
              {item.rows.length === 0 ? (
                <Box component='p' sx={{ fontSize: 12, color: "text.secondary", m: 0 }}>
                  No product sales
                </Box>
              ) : (
                item.rows.slice(0, 8).map((row) => (
                  <Box
                    key={`${item.label}-${row.productName}`}
                    sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}
                  >
                    <Box
                      component='span'
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mr: 1,
                        color: "text.primary",
                      }}
                    >
                      {row.productName}
                    </Box>
                    <Box component='span' sx={{ fontWeight: 600, color: "text.primary", flexShrink: 0 }}>
                      {row.soldQty} pcs
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Card>
        ))}
      </Box>
    </>
  );
}
