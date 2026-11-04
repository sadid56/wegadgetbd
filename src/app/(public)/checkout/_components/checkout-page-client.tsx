"use client";

import NextLink from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

import { checkoutSchema, type CheckoutValues } from "./checkout-schema";
import { BN } from "./checkout-constants";
import { CheckoutForm } from "./checkout-form";
import { OrderSummary } from "./order-summary";
import { useToast } from "@/context/toast-context";
import { getAssetUrl } from "@/lib/storage";
import { tokens } from "@/theme/theme";
import { CheckoutStepperHeader } from "@/components/common/CheckoutStepperHeader";
import CheckoutPageSkeleton from "./checkout-page-skeleton";

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
            অর্ডার নিশ্চিত করুন
          </Typography>
        </Box>
      }
      description="অর্ডার সম্পন্ন করতে নিচের তথ্যগুলো আরেকবার মিলিয়ে নিন:"
      cancelText="বাতিল"
      confirmText="হ্যাঁ, কনফার্ম করুন"
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
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              📦
            </Box>
          )}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                ...BN,
                fontWeight: 600,
                fontSize: 13,
                color: tokens.textPrimary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                mb: 0.25,
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component='span'
                sx={{
                  fontWeight: 700,
                  color: tokens.primary,
                  fontSize: 15,
                }}
              >
                ৳{totalAmount}
              </Box>
              <Box
                component='span'
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
                {count}টি আইটেম
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

  useEffect(() => {
    if (!isBuyNow && isLoaded && cart.length === 0 && !isOrderConfirmed) {
      router.replace("/cart");
    }
  }, [isBuyNow, isLoaded, cart.length, isOrderConfirmed, router]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { location: "inside_dhaka" },
  });

  const locationValue = watch("location");

  const productsToOrder = isBuyNow && buyNowProduct ? [{ ...buyNowProduct, qty: localQty }] : cart;

  if (isLoadingProduct) {
    return <CheckoutPageSkeleton />;
  }

  if (isBuyNow && !buyNowProduct && !isLoadingProduct) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          textAlign: "center",
          bgcolor: tokens.bgCanvas,
          ...BN,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            bgcolor: tokens.dangerSubtle,
            color: tokens.danger,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2.5,
          }}
        >
          <Inventory2OutlinedIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography
          component='h1'
          sx={{
            ...BN,
            fontSize: 24,
            fontWeight: 800,
            color: tokens.textPrimary,
            mb: 1,
          }}
        >
          পণ্যটি পাওয়া যায়নি
        </Typography>
        <Typography sx={{ ...BN, color: tokens.textMuted, mb: 3, fontSize: 14 }}>
          সম্ভবত পণ্যটি আমাদের সংগ্রহে নেই অথবা ইউআরএল ভুল।
        </Typography>
        <Button
          component={NextLink}
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
          শপিং শুরু করুন
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
    productsToOrder.length > 1 ? `${productsToOrder.length}টি পণ্য · মোট ${confirmedCount}টি আইটেম` : (confirmedProduct?.title ?? "");

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
      const message = `🛍️ নতুন অর্ডার (WE GADGET BD)
━━━━━━━━━━━━━━━
👤 গ্রাহকের নাম: ${data.name}
📞 মোবাইল: ${data.phone}
📍 ঠিকানা: ${data.address}
🚚 এলাকা: ${data.location === "inside_dhaka" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে"}

📦 আইটেম সমূহ:
${orderDetails}

💰 সামারি:
সাবটোটাল: ৳${subtotal}
ডিসকাউন্ট: ৳${discountAmount}
ডেলিভারি চার্জ: ৳${deliveryCharge}
━━━━━━━━━━━━━━━
💵 সর্বমোট: ৳${totalAmount}

🛒 অর্ডারের ধরণ: ${isBuyNow ? "সরাসরি কিনুন" : "কার্ট থেকে"}
🖥️ সোর্স: ${window.location.host}`;

      const res = await createOrder({
        customerName: data.name,
        phoneNumber: data.phone,
        address: data.address,
        city: data.location === "inside_dhaka" ? "Dhaka" : "Outside Dhaka",
        items: orderItems,
        totalAmount,
        shippingCost: deliveryCharge,
        discountAmount,
        paymentMethod: "CASH_ON_DELIVERY",
        whatsappMessage: message,
        userId: session?.user?.id,
      });

      if (res.success) {
        setSavedWhatsappUrl(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
        setIsOrderConfirmed(true);
        reset();
        if (!isBuyNow) clearCart();
      } else {
        toast.error("দুঃখিত, কোনো একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: CheckoutValues) => {
    setPendingData(data);
    setShowConfirm(true);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: tokens.bgCanvas, pb: { xs: 12, md: 10 } }}>
      <ConfirmDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => pendingData && processOrder(pendingData)}
        img={dialogImg}
        title={dialogTitle}
        count={confirmedCount}
        totalAmount={totalAmount}
      />

      {/* ═══ ORDER CONFIRMED ALERT DIALOG ═══ */}
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
              অভিনন্দন! অর্ডার সফল হয়েছে 🎉
            </Typography>
          </Box>
        }
        description="We Gadget BD-তে অর্ডার করার জন্য আপনাকে ধন্যবাদ। আপনার ক্যাশ অন ডেলিভারি অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের টিম খুব শীঘ্রই ফোন করে অর্ডারটি কনফার্ম করবে।"
        cancelText="হোমপেজে যান"
        confirmText="আরও কেনাকাটা করুন"
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
                পেমেন্ট পদ্ধতি:
              </Box>
              <Box component="span" sx={{ ...BN, fontWeight: 700, color: tokens.textPrimary }}>
                ক্যাশ অন ডেলিভারি
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box component="span" sx={{ ...BN, color: tokens.textMuted }}>
                সর্বমোট পরিশোধযোগ্য:
              </Box>
              <Box component="span" sx={{ fontWeight: 800, color: tokens.primary, fontSize: 16 }}>
                ৳{totalAmount}
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
              WhatsApp এ মেসেজ পাঠান
            </Button>
          )}
        </Box>
      </AlertDialog>

      {/* Universal Stepper Header */}
      <CheckoutStepperHeader
        currentStep="checkout"
        backHref={isBuyNow ? `/products/${buyNowProduct?.slug || ""}` : "/cart"}
        backLabel={isBuyNow ? "Back to Product" : "Back to Cart"}
      />

      {/* Main Container */}
      <Box
        component='main'
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pt: { xs: 3, md: 4 },
        }}
      >
        <Box
          component='form'
          id='checkout-form'
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" },
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          <Box>
            <CheckoutForm register={register} errors={errors} locationValue={locationValue} setValue={setValue} />
          </Box>
          <Box>
            <OrderSummary
              products={productsToOrder}
              originalSubtotal={originalSubtotal}
              deliveryCharge={deliveryCharge}
              discountAmount={discountAmount}
              totalAmount={totalAmount}
              isBuyNow={isBuyNow}
              localQty={localQty}
              isSubmitting={isSubmitting}
              onIncreaseQty={handleIncreaseQty}
              onDecreaseQty={handleDecreaseQty}
              onRemoveItem={handleRemoveItem}
            />
          </Box>
        </Box>
      </Box>

      {/* Mobile Fixed Bottom Checkout Bar */}
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
                সর্বমোট:
              </Box>
              <Box
                component='span'
                sx={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: tokens.textPrimary,
                }}
              >
                ৳{totalAmount}
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
              Cash on Delivery
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
                <span>প্রসেস হচ্ছে...</span>
              </>
            ) : (
              "ক্যাশ অন ডেলিভারিতে অর্ডার করুন"
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
