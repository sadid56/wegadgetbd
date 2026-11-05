"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { tokens } from "@/theme/theme";

export default function EmptyCart() {
  const t = useTranslations("cart");

  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: tokens.bgCanvas,
        px: 2,
        py: { xs: 6, md: 10 },
      }}
    >
      <EmptyState
        icon={<ShoppingBagOutlinedIcon sx={{ fontSize: 32, color: tokens.primary }} />}
        title={t("emptyTitle")}
        description={t("emptyDesc")}
        action={
          <Button
            component={Link}
            href="/products"
            variant="primary"
            startIcon={<Inventory2OutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{
              height: 44,
              px: 3.5,
              borderRadius: "999px",
              bgcolor: tokens.primary,
              fontWeight: 700,
              fontSize: 14,
              color: tokens.textWhite,
              textTransform: "none",
              "&:hover": { bgcolor: tokens.primaryHover },
            }}
          >
            {t("exploreCollection")}
          </Button>
        }
        sx={{ maxWidth: 480 }}
      />
    </Box>
  );
}
