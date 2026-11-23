"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import { InputBase } from "@/components/ui/input";
import { AlertDialog } from "@/components/ui/alert-dialog";

import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CloseIcon from "@mui/icons-material/Close";

import { useCart } from "@/hooks/useCart";
import { usePromoCode } from "@/hooks/usePromoCode";
import { useToast } from "@/context/toast-context";
import { tokens } from "@/theme/theme";
import { CheckoutStepperHeader } from "@/components/common/CheckoutStepperHeader";
import { toBengaliNumber } from "@/lib/i18n-utils";

import CartPageSkeleton from "./cart-page-skeleton";
import EmptyCart from "./empty-cart";
import CartItemRow from "./cart-item-row";
import OrderSummary from "./order-summery";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const toast = useToast();
  const { cart, removeItem, updateQty, totalPrice, totalCount, clearCart, isLoaded } = useCart();
  const [promoInput, setPromoInput] = useState("");
  const { appliedPromo, isValidating, promoError, setPromoError, applyPromoCode, removePromoCode } =
    usePromoCode(totalPrice);
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: "single"; id: string; title: string }
    | { type: "all" }
    | null
  >(null);

  if (!isLoaded) return <CartPageSkeleton />;
  if (cart.length === 0) return <EmptyCart />;

  const handleApplyPromo = async () => {
    const res = await applyPromoCode(promoInput);
    if (res.success) {
      toast.success(res.message);
      setPromoInput("");
    } else {
      toast.error(res.message);
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "single") {
      removeItem(deleteTarget.id);
    } else {
      clearCart();
    }
    setDeleteTarget(null);
  };

  const savings = cart.reduce((acc, item) => {
    const orig = Number(item.price || 0);
    const disc = Number(item.discountPrice || item.price || 0);
    return acc + (orig - disc) * item.qty;
  }, 0);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: tokens.bgCanvas, pb: { xs: 12, md: 10 } }}>
      {/* Top Stepper Navigation */}
      <CheckoutStepperHeader
        currentStep="cart"
        backHref="/products"
        backLabel={t("exploreCollection")}
        rightAction={
          <Box
            component="button"
            onClick={() => setDeleteTarget({ type: "all" })}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: { xs: 12, sm: 13 },
              fontWeight: 600,
              color: tokens.danger,
              p: 0,
              whiteSpace: "nowrap",
              transition: "opacity 150ms ease",
              "&:hover": { opacity: 0.8 },
            }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
            <span>{t("clearCart")}</span>
          </Box>
        }
      />

      {/* Main Container */}
      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, sm: 3 }, pt: { xs: 2, md: 4 } }}>
        <Box sx={{ mb: { xs: 2, md: 3 } }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 21, md: 28 },
              fontWeight: 800,
              color: tokens.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            {t("title")}
          </Typography>
          <Typography sx={{ fontSize: { xs: 13, sm: 14 }, color: tokens.textMuted, mt: 0.4 }}>
            {t("itemsInCart", { count: locale === "bn" ? toBengaliNumber(totalCount) : totalCount })}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
            gap: { xs: 2, md: 3 },
            alignItems: "flex-start",
          }}
        >
          {/* Left Column: Products List + Coupon */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 2.5 } }}>
            <Box
              sx={{
                bgcolor: tokens.bgPanel,
                border: "none",
                borderRadius: { xs: "16px", sm: "12px" },
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: { xs: "none", sm: "grid" },
                  gridTemplateColumns: "1fr 110px 130px 110px 44px",
                  alignItems: "center",
                  px: 2.5,
                  py: 1.5,
                  bgcolor: "#F8FAFC",
                  borderBottom: `1px solid ${tokens.borderSubtle}`,
                  fontSize: 11,
                  fontWeight: 700,
                  color: tokens.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                <Box>{t("productHeader")}</Box>
                <Box sx={{ textAlign: "right" }}>{t("priceHeader")}</Box>
                <Box sx={{ textAlign: "center" }}>{t("quantity")}</Box>
                <Box sx={{ textAlign: "right" }}>{t("total")}</Box>
                <Box></Box>
              </Box>

              {cart.map((item, index) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  isLast={index === cart.length - 1}
                  onUpdateQty={updateQty}
                  onRemove={(targetItem) =>
                    setDeleteTarget({
                      type: "single",
                      id: String(targetItem.id),
                      title: targetItem.title || "this item",
                    })
                  }
                />
              ))}
            </Box>

            {/* Promo Code Box */}
            <Box
              sx={{
                bgcolor: tokens.bgPanel,
                border: "none",
                borderRadius: { xs: "16px", sm: "12px" },
                p: { xs: 1.75, sm: 2.5 },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <LocalOfferOutlinedIcon sx={{ fontSize: 16, color: tokens.primary }} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: tokens.textPrimary }}>
                  {t("havePromoCode")}
                </Typography>
              </Box>

              {appliedPromo ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5,
                    px: 2,
                    py: 1.25,
                    borderRadius: "8px",
                    bgcolor: tokens.successSubtle,
                    border: `1px solid ${tokens.successBorder}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleRoundedIcon sx={{ fontSize: 18, color: tokens.successText }} />
                    <Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: tokens.textPrimary }}>
                        {appliedPromo.code}{" "}
                        <Box component="span" sx={{ color: tokens.successText, fontWeight: 600 }}>
                          (-৳{appliedPromo.discountAmount.toLocaleString()})
                        </Box>
                      </Typography>
                      <Typography sx={{ fontSize: 11.5, color: tokens.textSecondary }}>
                        {appliedPromo.discountType === "PERCENTAGE"
                          ? `${appliedPromo.discountValue}% discount applied`
                          : `৳${appliedPromo.discountValue.toLocaleString()} flat discount applied`}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    onClick={removePromoCode}
                    sx={{ minWidth: "auto", p: 0.75, color: tokens.textSecondary, "&:hover": { color: tokens.danger } }}
                    aria-label="Remove promo code"
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </Button>
                </Box>
              ) : (
                <>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <InputBase
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase());
                        if (promoError) setPromoError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApplyPromo();
                        }
                      }}
                      placeholder={t("couponCode")}
                      sx={{
                        flex: 1,
                        height: 42,
                        px: 2,
                        borderRadius: "8px",
                        border: `1px solid ${promoError ? tokens.error : tokens.borderDefault}`,
                        bgcolor: tokens.bgCanvas,
                        fontSize: 13,
                        fontWeight: 600,
                        color: tokens.textPrimary,
                        "&.Mui-focused": {
                          borderColor: promoError ? tokens.error : tokens.primary,
                          bgcolor: tokens.bgPanel,
                        },
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      loading={isValidating}
                      onClick={handleApplyPromo}
                      sx={{
                        height: 42,
                        px: 3,
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: 13,
                        bgcolor: tokens.bgDark,
                        color: tokens.textWhite,
                        borderColor: "transparent",
                        "&:hover": { bgcolor: tokens.bgDarkSurface, color: tokens.textWhite, borderColor: "transparent" },
                      }}
                    >
                      {t("applyCoupon")}
                    </Button>
                  </Box>
                  {promoError && (
                    <Typography sx={{ fontSize: 12, color: tokens.error, fontWeight: 500, mt: 0.75 }}>
                      {promoError}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Box>

          {/* Right Column: Order Summary */}
          <OrderSummary
            totalPrice={totalPrice}
            totalCount={totalCount}
            savings={savings}
            promoCode={appliedPromo?.code}
            promoDiscount={appliedPromo?.discountAmount ?? 0}
          />
        </Box>
      </Box>

      {/* Unified Delete Confirmation Dialog */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === "all" ? "Clear shopping cart?" : "Remove item from cart?"}
        description={
          deleteTarget?.type === "all"
            ? "Are you sure you want to remove all items from your shopping cart? This action cannot be undone."
            : `Are you sure you want to remove "${deleteTarget?.title}" from your shopping cart?`
        }
        confirmText={deleteTarget?.type === "all" ? "Clear All" : "Remove"}
        cancelText="Cancel"
        confirmVariant="destructive"
      />
    </Box>
  );
}
