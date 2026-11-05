"use client";

import { Link, useRouter } from "@/i18n/routing";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import { Button } from "@/components/ui/button";
import Typography from "@mui/material/Typography";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { CircularProgress } from "@/components/ui/spinner";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

import { useCart } from "@/hooks/useCart";
import { useProduct } from "@/query-client/products";
import { createOrder } from "@/server/actions/order.action";
import { authClient } from "@/lib/auth-client";

import { getCheckoutSchema, type CheckoutValues } from "./checkout-schema";
import { BN } from "./checkout-constants";
import { CheckoutForm } from "./checkout-form";
import { OrderSummary } from "./order-summary";
import { useToast } from "@/context/toast-context";
import { getAssetUrl } from "@/lib/storage";
import { tokens } from "@/theme/theme";
import { CheckoutStepperHeader } from "@/components/common/CheckoutStepperHeader";
import CheckoutPageSkeleton from "./checkout-page-skeleton";
import { useTranslations, useLocale } from "next-intl";
import { formatPrice, toBengaliNumber } from "@/lib/i18n-utils";

// ─── ConfirmDialog ─────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  img: string;
  title: string;
  count: number;
  totalAmount: number;
}

function ConfirmDialog({ open, onCancel, onConfirm, img, title, count, totalAmount }: ConfirmDialogProps) {
  const t = useTranslations("checkout");
  const locale = useLocale();

  return (
    <AlertDialog
      open={open}
      onClose={onCancel}
      onConfirm={onConfirm}
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: tokens.primaryLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            🛒
          </Box>
          <Typography
            component="span"
            sx={{
              ...BN,
              fontWeight: 800,
              fontSize: 17,
              color: tokens.textPrimary,
            }}
          >
            {t("confirmOrderModalTitle")}
          </Typography>
        </Box>
      }
      description={t("confirmOrderModalDesc")}
      cancelText={t("cancel")}
      confirmText={t("confirm")}
      confirmVariant="primary"
    >
      <Box sx={{ px: 3, pb: 1 }}>
        <Box
          sx={{
            bgcolor: tokens.bgCanvas,
            borderRadius: "8px",
            p: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            border: `1px solid ${tokens.borderDefault}`,
          }}
        >
          {img ? (
            <Box
              component='img'
              src={getAssetUrl(img)}
              alt={title}
              sx={{
                width: 52,
                height: 52,
                borderRadius: "6px",
                objectFit: "contain",
                bgcolor: tokens.bgPanel,
                border: `1px solid ${tokens.borderDefault}`,
                p: 0.5,
                flexShrink: 0,
              }}
            />
          ) : (
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "6px",
                bgcolor: tokens.bgSubtle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Inventory2OutlinedIcon sx={{ fontSize: 24, color: tokens.textMuted }} />
            </Box>
          )}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                ...BN,
                fontSize: 13,
                fontWeight: 700,
                color: tokens.textPrimary,
                lineHeight: 1.35,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: 0.5,
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 800, color: tokens.primary }}>
                {formatPrice(totalAmount, locale)}
              </Typography>
              <Box
                sx={{
                  ...BN,
                  fontSize: 11,
                  color: tokens.textMuted,
                  bgcolor: tokens.bgPanel,
                  border: `1px solid ${tokens.borderDefault}`,
                  px: 0.75,
                  py: "1px",
                  borderRadius: "4px",
                  fontWeight: 600,
                }}
              >
                {t("itemsCount", { count: locale === "bn" ? toBengaliNumber(count) : count })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </AlertDialog>
  );
}

// ─── Main page content ─────────────────────────────────────
function CheckoutPageContent() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowSlug = searchParams.get("buyNow");
  const buyNowQty = parseInt(searchParams.get("qty") || "1");

  const { cart, totalPrice: cartTotal, updateQty, removeItem, clearCart, isLoaded } = useCart();
  const { data: buyNowProduct, isLoading: isLoadingProduct } = useProduct(buyNowSlug as string);

  const [isBuyNow] = useState(!!buyNowSlug);
  const [localQty, setLocalQty] = useState(buyNowQty);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<CheckoutValues | null>(null);
  const [savedWhatsappUrl, setSavedWhatsappUrl] = useState("");
  const { data: session } = authClient.useSession();

  const formatNumber = (val: number | string) => (locale === "bn" ? toBengaliNumber(val) : val.toString());

  useEffect(() => {
    if (!isBuyNow && isLoaded && cart.length === 0 && !isOrderConfirmed) {
      router.replace("/cart");
    }
  }, [isBuyNow, isLoaded, cart.length, isOrderConfirmed, router]);

  const schema = useMemo(() => getCheckoutSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(schema),
    defaultValues: { location: "inside_dhaka" },
  });

  const locationValue = watch("location");

  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setValue("name", session.user.name);
      if (session.user.phoneNumber) setValue("phone", session.user.phoneNumber);
    }
  }, [session, setValue]);

  const productsToOrder = isBuyNow
    ? buyNowProduct
      ? [
          {
            id: buyNowProduct.id,
            title: buyNowProduct.title,
            slug: buyNowProduct.slug,
            price: Number(buyNowProduct.price),
            discountPrice: buyNowProduct.discountPrice ? Number(buyNowProduct.discountPrice) : undefined,
            images: buyNowProduct.images,
            qty: localQty,
          },
        ]
      : []
    : cart;

  if (isBuyNow && isLoadingProduct) {
    return <CheckoutPageSkeleton />;
  }

  if (isBuyNow && !buyNowProduct && !isLoadingProduct) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: tokens.bgCanvas,
            border: `1px solid ${tokens.borderDefault}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5,
          }}
        >
          <Inventory2OutlinedIcon sx={{ fontSize: 32, color: tokens.textMuted }} />
        </Box>
        <Typography
          sx={{
            ...BN,
            fontSize: 24,
            fontWeight: 800,
            color: tokens.textPrimary,
            mb: 1,
          }}
        >
          {t("productNotFound")}
        </Typography>
        <Typography sx={{ ...BN, color: tokens.textMuted, mb: 3, fontSize: 14 }}>
          {t("productNotFoundDesc")}
        </Typography>
        <Button
          component={Link}
          href='/products'
          disableElevation
          sx={{
            ...BN,
            px: 3.5,
            py: 1.25,
            bgcolor: tokens.primary,
            color: tokens.textWhite,
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: 14,
            textTransform: "none",
            "&:hover": { bgcolor: tokens.primaryHover },
          }}
        >
          {t("startShopping")}
        </Button>
      </Box>
    );
  }

  if (!isBuyNow && !isOrderConfirmed && !isLoaded) {
    return <CheckoutPageSkeleton />;
  }

  if (!isBuyNow && !isOrderConfirmed && cart.length === 0) {
    return null;
  }

  const confirmedProduct = productsToOrder[0];
  const confirmedImg = confirmedProduct?.images?.[0] ?? "";
  const confirmedCount = productsToOrder.reduce((s, p) => s + (isBuyNow ? localQty : p.qty), 0);

  const dialogImg = confirmedImg;
  const dialogTitle =
    productsToOrder.length > 1
      ? t("productsCount", { count: formatNumber(productsToOrder.length), items: formatNumber(confirmedCount) })
      : (confirmedProduct?.title ?? "");

  const subtotal = isBuyNow && buyNowProduct ? Number(buyNowProduct.discountPrice || buyNowProduct.price) * localQty : cartTotal;
  const originalSubtotal = productsToOrder.reduce((sum, item) => sum + Number(item.price) * (isBuyNow ? localQty : item.qty), 0);
  const discountAmount = Math.max(originalSubtotal - subtotal, 0);
  const deliveryCharge = locationValue === "inside_dhaka" ? 80 : 130;
  const totalAmount = subtotal + deliveryCharge;

  const handleIncreaseQty = (id: string) => {
    if (isBuyNow) {
      setLocalQty((prev) => prev + 1);
    } else {
      const item = cart.find((i) => i.id === id);
      if (item) updateQty(id, item.qty + 1);
    }
  };

  const handleDecreaseQty = (id: string) => {
    if (isBuyNow) {
      setLocalQty((prev) => Math.max(1, prev - 1));
    } else {
      const item = cart.find((i) => i.id === id);
      if (item) updateQty(id, Math.max(1, item.qty - 1));
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const processOrder = async (data: CheckoutValues) => {
    setShowConfirm(false);
    setIsSubmitting(true);
    try {
      const whatsappNumber = "+8801576641142";
      const orderItems = productsToOrder.map((item) => ({
        id: item.id,
        title: item.title,
        qty: isBuyNow ? localQty : item.qty,
        price: Number(item.discountPrice || item.price),
        image: item.images?.[0] || "",
      }));
      const orderDetails = orderItems.map((i) => `• ${i.title} (x${i.qty}) - ৳${i.price * i.qty}`).join("\n");
      const message = `🛍️ New Order (WE GADGET BD)
━━━━━━━━━━━━━━━
👤 Name: ${data.name}
📞 Mobile: ${data.phone}
📍 Address: ${data.address}
🚚 Area: ${data.location === "inside_dhaka" ? "Inside Dhaka" : "Outside Dhaka"}

📦 Items:
${orderDetails}

💰 Summary:
Subtotal: ৳${subtotal}
Discount: ৳${discountAmount}
Delivery: ৳${deliveryCharge}
━━━━━━━━━━━━━━━
💵 Total: ৳${totalAmount}

🛒 Type: ${isBuyNow ? "Buy Now" : "Cart"}
🖥️ Source: ${window.location.host}`;

      const res = await createOrder({
        customerName: data.name,
        phoneNumber: data.phone,
        address: data.address,
        city: data.location === "inside_dhaka" ? "Dhaka" : "Outside Dhaka",
        items: orderItems,
        totalAmount,
        shippingCost: deliveryCharge,
        discountAmount,
      });

      if (!res.success) {
        toast.error(res.message || "Something went wrong! Please try again.");
        return;
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      setSavedWhatsappUrl(whatsappUrl);

      if (!isBuyNow) {
        clearCart();
      }

      reset();
      setIsOrderConfirmed(true);
    } catch {
      toast.error("Network error! Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInitialSubmit = (data: CheckoutValues) => {
    setPendingData(data);
    setShowConfirm(true);
  };

  return (
    <Box sx={{ bgcolor: tokens.bgCanvas, minHeight: "100vh", pb: { xs: 12, md: 8 } }}>
      {/* Step 1: Pre-order Confirmation Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          if (pendingData) processOrder(pendingData);
        }}
        img={dialogImg}
        title={dialogTitle}
        count={confirmedCount}
        totalAmount={totalAmount}
      />

      {/* Step 2: Post-order Success Dialog */}
      <AlertDialog
        open={isOrderConfirmed}
        onClose={() => {
          setIsOrderConfirmed(false);
          router.push("/");
        }}
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                bgcolor: tokens.primaryLight,
                color: tokens.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CheckCircleRoundedIcon sx={{ fontSize: 22 }} />
            </Box>
            <Typography
              component="span"
              sx={{
                ...BN,
                fontSize: 17,
                fontWeight: 800,
                color: tokens.textPrimary,
              }}
            >
              {t("orderSuccessTitle")}
            </Typography>
          </Box>
        }
        description={t("orderSuccessDesc")}
        cancelText={t("goToHome")}
        confirmText={t("continueShopping")}
        confirmVariant="primary"
        onConfirm={() => {
          setIsOrderConfirmed(false);
          router.push("/products");
        }}
      >
        <Box sx={{ px: 3, pb: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box
            sx={{
              bgcolor: tokens.bgCanvas,
              borderRadius: "8px",
              p: 1.5,
              border: `1px solid ${tokens.borderDefault}`,
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
              fontSize: 13,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box component="span" sx={{ ...BN, color: tokens.textMuted }}>
                {t("paymentMethodLabel")}
              </Box>
              <Box component="span" sx={{ ...BN, fontWeight: 700, color: tokens.textPrimary }}>
                {t("paymentMethodValue")}
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box component="span" sx={{ ...BN, color: tokens.textMuted }}>
                {t("totalPayable")}
              </Box>
              <Box component="span" sx={{ fontWeight: 800, color: tokens.primary, fontSize: 16 }}>
                {formatPrice(totalAmount, locale)}
              </Box>
            </Box>
          </Box>

          {savedWhatsappUrl && (
            <Button
              fullWidth
              onClick={() => window.open(savedWhatsappUrl, "_blank")}
              startIcon={<WhatsAppIcon sx={{ fontSize: 18 }} />}
              disableElevation
              sx={{
                ...BN,
                bgcolor: "#25D366",
                color: "#ffffff",
                fontWeight: 700,
                py: 1.25,
                borderRadius: "8px",
                fontSize: 13,
                textTransform: "none",
                "&:hover": { bgcolor: "#20BD5A" },
              }}
            >
              {t("sendWhatsapp")}
            </Button>
          )}
        </Box>
      </AlertDialog>

      {/* Universal Stepper Header */}
      <CheckoutStepperHeader
        currentStep="checkout"
        backHref={isBuyNow ? `/products/${buyNowProduct?.slug || ""}` : "/cart"}
        backLabel={isBuyNow ? t("backToProduct") : t("backToCart")}
      />

      {/* Main Container */}
      <Box
        component='main'
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: { xs: 2.5, md: 4 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
            gap: { xs: 3, md: 4 },
            alignItems: "start",
          }}
        >
          {/* Left: Form */}
          <Box>
            <CheckoutForm
              register={register}
              errors={errors}
              locationValue={locationValue}
              setValue={setValue}
            />
          </Box>

          {/* Right: Order Summary */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <OrderSummary
              products={productsToOrder}
              isBuyNow={isBuyNow}
              localQty={localQty}
              originalSubtotal={originalSubtotal}
              discountAmount={discountAmount}
              deliveryCharge={deliveryCharge}
              totalAmount={totalAmount}
              onIncreaseQty={handleIncreaseQty}
              onDecreaseQty={handleDecreaseQty}
              onRemoveItem={handleRemoveItem}
              isSubmitting={isSubmitting}
            />
          </Box>
        </Box>
      </Box>

      {/* Mobile Sticky Bottom Checkout Bar */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: { xs: "block", md: "none" },
          bgcolor: tokens.bgPanel,
          borderTop: `1px solid ${tokens.borderDefault}`,
          p: 1.5,
          boxShadow: tokens.shadowLg,
        }}
      >
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
              <Box component='span' sx={{ ...BN, fontSize: 13, color: tokens.textSecondary }}>
                {t("totalLabel")}
              </Box>
              <Box
                component='span'
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: tokens.textPrimary,
                }}
              >
                {formatPrice(totalAmount, locale)}
              </Box>
            </Box>
            <Box
              sx={{
                fontSize: 11,
                color: tokens.successText,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <SecurityOutlinedIcon sx={{ fontSize: 13 }} />
              {t("cashOnDelivery")}
            </Box>
          </Box>

          <Button
            type='submit'
            form='checkout-form'
            disabled={isSubmitting}
            fullWidth
            disableElevation
            sx={{
              ...BN,
              bgcolor: tokens.primary,
              color: tokens.textWhite,
              py: 1.25,
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: 14,
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              "&:hover": { bgcolor: tokens.primaryHover },
              "&.Mui-disabled": { opacity: 0.6, bgcolor: tokens.primary, color: tokens.textWhite },
            }}
          >
            {isSubmitting ? (
              <>
                <CircularProgress size={16} sx={{ color: tokens.textWhite }} />
                <span>{t("processing")}</span>
              </>
            ) : (
              t("orderWithCod")
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Page shell ────────────────────────────────────────────
export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutPageSkeleton />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
