"use client";

import NextLink from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import { keyframes } from "@emotion/react";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

import { useCart } from "@/hooks/useCart";
import { useProduct } from "@/query-client/products";
import { createOrder } from "@/actions/orders";
import { authClient } from "@/lib/auth-client";

import { checkoutSchema, type CheckoutValues } from "./checkout-schema";
import { BN } from "./checkout-constants";
import { CheckoutForm } from "./checkout-form";
import { OrderSummary } from "./order-summary";
import { useToast } from "@/context/toast-context";
import { getAssetUrl } from "@/lib/storage";

// ─── Keyframes ──────────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.88) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(100%); }
  to   { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  from { transform: scale(0); }
  to   { transform: scale(1); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const drawCheck = keyframes`
  from { stroke-dashoffset: 50; }
  to   { stroke-dashoffset: 0; }
`;

const pulseDot = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
`;

const shineSweep = keyframes`
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
`;

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
    <Modal open={open} onClose={onCancel} closeAfterTransition>
      <Fade in={open} timeout={200}>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            bgcolor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
            outline: "none",
          }}
        >
          <Box
            sx={{
              ...BN,
              bgcolor: "#fff",
              border: "1.5px solid #fed7aa",
              borderRadius: "24px",
              boxShadow: "0 24px 64px rgba(249,115,22,0.18), 0 4px 16px rgba(0,0,0,0.1)",
              width: "100%",
              maxWidth: 400,
              position: "relative",
              overflow: "hidden",
              animation: `${scaleIn} 320ms cubic-bezier(0.34, 1.4, 0.64, 1) both`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: "linear-gradient(90deg,#fb923c,#f97316,#e11d48)",
              }}
            />

            <Box sx={{ p: "22px 20px 20px" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "linear-gradient(135deg,#fff7ed,#ffedd5)",
                    border: "2px solid #fed7aa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    boxShadow: "0 2px 8px rgba(249,115,22,0.2)",
                  }}
                >
                  🛒
                </Box>
                <Box>
                  <Typography
                    sx={{
                      ...BN,
                      fontWeight: 800,
                      fontSize: 15.5,
                      color: "#111827",
                      lineHeight: 1.3,
                    }}
                  >
                    অর্ডার কনফার্ম করতে...
                  </Typography>
                  <Typography
                    sx={{
                      ...BN,
                      fontSize: 12,
                      color: "#9ca3af",
                      fontWeight: 500,
                      mt: 0.25,
                    }}
                  >
                    নিচের তথ্য একবার মিলিয়ে নিন
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ height: 1, bgcolor: "#f3f4f6", mb: 1.75 }} />

              <Box
                sx={{
                  background: "linear-gradient(135deg,#fafafa,#f9fafb)",
                  borderRadius: "14px",
                  p: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 2.25,
                  border: "1px solid #f3f4f6",
                }}
              >
                {img ? (
                  <Box
                    component='img'
                    src={getAssetUrl(img)}
                    alt={title}
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "12px",
                      objectFit: "cover",
                      border: "2px solid #e5e7eb",
                      flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "12px",
                      bgcolor: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
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
                      fontWeight: 700,
                      fontSize: 13.5,
                      color: "#111827",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      mb: 0.5,
                    }}
                  >
                    {title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      component='span'
                      sx={{
                        fontWeight: 900,
                        color: "#ea580c",
                        fontSize: 17,
                        letterSpacing: "-0.5px",
                      }}
                    >
                      ৳{totalAmount}
                    </Box>
                    <Box
                      component='span'
                      sx={{
                        ...BN,
                        fontSize: 11,
                        color: "#6b7280",
                        bgcolor: "#f3f4f6",
                        border: "1px solid #e5e7eb",
                        px: "7px",
                        py: "1px",
                        borderRadius: "20px",
                        fontWeight: 600,
                      }}
                    >
                      {count}টি আইটেম
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1.25 }}>
                <Box
                  component='button'
                  onClick={onCancel}
                  sx={{
                    ...BN,
                    flex: 1,
                    py: 1.5,
                    borderRadius: "13px",
                    border: "1.5px solid #e5e7eb",
                    bgcolor: "#fff",
                    color: "#6b7280",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": {
                      bgcolor: "#f9fafb",
                      borderColor: "#d1d5db",
                    },
                  }}
                >
                  ✕ &nbsp;বাতিল
                </Box>
                <Box
                  component='button'
                  onClick={onConfirm}
                  sx={{
                    ...BN,
                    flex: 2,
                    py: 1.5,
                    borderRadius: "13px",
                    border: "none",
                    background: "linear-gradient(135deg,#f97316,#e11d48)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(249,115,22,0.4)",
                    transition: "transform 0.15s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  ✓ &nbsp;হ্যাঁ, কনফার্ম করুন
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

// ─── Main page content ─────────────────────────────────────
function CheckoutPageContent() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyNowSlug = searchParams.get("buyNow");
  const buyNowQty = parseInt(searchParams.get("qty") || "1");

  const { cart, totalPrice: cartTotal } = useCart();
  const { data: buyNowProduct, isLoading: isLoadingProduct } = useProduct(buyNowSlug as string);

  const [isBuyNow] = useState(!!buyNowSlug);
  const [localQty, setLocalQty] = useState(buyNowQty);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<CheckoutValues | null>(null);
  const [savedWhatsappUrl, setSavedWhatsappUrl] = useState("");
  const [countdown, setCountdown] = useState(8);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!isBuyNow) setCartItems(cart);
  }, [cart, isBuyNow]);

  useEffect(() => {
    if (!isOrderConfirmed) return;
    setCountdown(8);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsOrderConfirmed(false);
          router.push("/");
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOrderConfirmed, router]);

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

  const productsToOrder = isBuyNow && buyNowProduct ? [{ ...buyNowProduct, qty: localQty }] : cartItems;

  if (isLoadingProduct) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <CircularProgress size={48} sx={{ color: "#f97316" }} />
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 700,
              color: "#6b7280",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Loading Product...
          </Typography>
        </Box>
      </Box>
    );
  }

  const subtotal = isBuyNow && buyNowProduct ? Number(buyNowProduct.discountPrice || buyNowProduct.price) * localQty : cartTotal;
  const originalSubtotal = productsToOrder.reduce((sum, item) => sum + Number(item.price) * (isBuyNow ? localQty : item.qty), 0);
  const discountAmount = Math.max(originalSubtotal - subtotal, 0);
  const deliveryCharge = locationValue === "inside_dhaka" ? 80 : 130;
  const totalAmount = subtotal + deliveryCharge;

  const handleIncreaseQty = (id: string) => {
    if (isBuyNow) {
      setLocalQty((prev) => prev + 1);
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty: item.qty + 1 } : item)));
    }
  };

  const handleDecreaseQty = (id: string) => {
    if (isBuyNow) {
      setLocalQty((prev) => Math.max(1, prev - 1));
    } else {
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item)));
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
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
      const message = `🛍️ নতুন অর্ডার (BONGO NEX)
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
          ...BN,
        }}
      >
        <Box
          sx={{
            width: 96,
            height: 96,
            bgcolor: "#fef2f2",
            color: "#ef4444",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Inventory2OutlinedIcon sx={{ fontSize: 48 }} />
        </Box>
        <Typography
          component='h1'
          sx={{
            ...BN,
            fontSize: 28,
            fontWeight: 900,
            color: "#1f2937",
            mb: 1,
          }}
        >
          পণ্যটি পাওয়া যায়নি
        </Typography>
        <Typography sx={{ ...BN, color: "#6b7280", mb: 4 }}>সম্ভবত পণ্যটি আমাদের সংগ্রহে নেই অথবা ইউআরএল ভুল।</Typography>
        <Button
          component={NextLink}
          href='/products'
          disableElevation
          sx={{
            ...BN,
            px: 4,
            py: 1.5,
            bgcolor: "#f97316",
            color: "#fff",
            borderRadius: 999,
            fontWeight: 700,
            textTransform: "none",
            boxShadow: "0 10px 15px -3px rgba(249,115,22,0.3)",
            "&:hover": { bgcolor: "#ea580c" },
          }}
        >
          শপিং শুরু করুন
        </Button>
      </Box>
    );
  }

  if (!isBuyNow && cartItems.length === 0) {
    if (typeof window !== "undefined") router.push("/cart");
    return null;
  }

  const confirmedProduct = productsToOrder[0];
  const confirmedImg = confirmedProduct?.images?.[0] ?? "";
  const confirmedCount = productsToOrder.reduce((s, p) => s + (isBuyNow ? localQty : p.qty), 0);

  const dialogImg = confirmedImg;
  const dialogTitle =
    productsToOrder.length > 1 ? `${productsToOrder.length}টি পণ্য · মোট ${confirmedCount}টি আইটেম` : (confirmedProduct?.title ?? "");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", pb: 10, position: "relative" }}>
      <ConfirmDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => pendingData && processOrder(pendingData)}
        img={dialogImg}
        title={dialogTitle}
        count={confirmedCount}
        totalAmount={totalAmount}
      />

      {/* ═══ ORDER CONFIRMED MODAL ═══ */}
      <Modal open={isOrderConfirmed} closeAfterTransition>
        <Fade in={isOrderConfirmed} timeout={200}>
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              p: 1.5,
              outline: "none",
            }}
          >
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                bgcolor: "#fff",
                width: "100%",
                borderRadius: "32px",
                maxWidth: { sm: 448 },
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                ...BN,
                animation: `${slideUp} 500ms cubic-bezier(0.34, 1.3, 0.64, 1) both`,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: "linear-gradient(90deg,#4ade80,#22c55e,#10b981)",
                }}
              />

              <Box
                sx={{
                  display: { sm: "none" },
                  justifyContent: "center",
                  pt: 1,
                }}
              >
                <Box sx={{ width: 36, height: 4, borderRadius: 999, bgcolor: "#e5e7eb" }} />
              </Box>

              <Box
                component='button'
                onClick={() => {
                  setIsOrderConfirmed(false);
                  router.push("/");
                }}
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  height: 28,
                  width: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  bgcolor: "#f3f4f6",
                  border: 0,
                  cursor: "pointer",
                  color: "#9ca3af",
                  transition: "background-color 200ms",
                  zIndex: 10,
                  "&:hover": { bgcolor: "#e5e7eb" },
                }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  px: 3,
                  pt: 2,
                  pb: 2,
                  background: "linear-gradient(180deg,#f0fdf4 0%,#ffffff 100%)",
                }}
              >
                <Box sx={{ position: "relative", mb: 1.5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      width: 60,
                      height: 60,
                      background: "linear-gradient(135deg,#22c55e,#10b981)",
                      boxShadow: "0 6px 20px rgba(34,197,94,0.35)",
                      animation: `${popIn} 400ms 100ms cubic-bezier(0.34, 1.5, 0.64, 1) both`,
                    }}
                  >
                    <Box component='svg' width={28} height={28} viewBox='0 0 38 38' fill='none'>
                      <Box
                        component='path'
                        d='M8 19L16 27L30 12'
                        stroke='white'
                        strokeWidth={3.5}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeDasharray='50'
                        sx={{
                          strokeDashoffset: 0,
                          animation: `${drawCheck} 600ms 200ms ease-out both`,
                        }}
                      />
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -4,
                      right: -4,
                      width: 24,
                      height: 24,
                      bgcolor: "#25D366",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #fff",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                      animation: `${popIn} 400ms 500ms cubic-bezier(0.34, 1.5, 0.64, 1) both`,
                    }}
                  >
                    <WhatsAppIcon sx={{ fontSize: 12, color: "#fff" }} />
                  </Box>
                </Box>

                <Typography
                  component='h2'
                  sx={{
                    ...BN,
                    fontSize: { xs: 18, sm: 20 },
                    fontWeight: 900,
                    color: "#1f2937",
                    mb: 0.5,
                    animation: `${fadeInUp} 400ms 250ms ease-out both`,
                  }}
                >
                  অর্ডার কনফার্ম হয়েছে! 🎉
                </Typography>

                <Typography
                  sx={{
                    ...BN,
                    fontSize: 12,
                    color: "#9ca3af",
                    fontWeight: 500,
                    animation: `${fadeInUp} 400ms 350ms ease-out both`,
                  }}
                >
                  আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব
                </Typography>
              </Box>

              <Box sx={{ px: 3, pt: 1 }}>
                <Typography
                  sx={{
                    color: "#6b7280",
                    textAlign: "center",
                    mb: 1,
                    fontSize: 12,
                  }}
                >
                  আপনার যে কোনো প্রয়োজন এ...
                </Typography>
                <Button
                  fullWidth
                  onClick={() => window.open(savedWhatsappUrl, "_blank")}
                  startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
                  disableElevation
                  sx={{
                    bgcolor: "#25D366",
                    color: "#fff",
                    fontWeight: 700,
                    py: 1.25,
                    borderRadius: "12px",
                    fontSize: 13,
                    textTransform: "none",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    "&:hover": { bgcolor: "#1eb455" },
                    "&:active": { transform: "scale(0.95)" },
                  }}
                >
                  <Box component='span' sx={BN}>
                    WhatsApp এ যোগাযোগ করুন
                  </Box>
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  px: 3,
                  pt: 1.5,
                  pb: 2.5,
                  animation: `${fadeIn} 400ms 600ms ease-out both`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {[0, 0.15, 0.3].map((d, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        width: 22,
                        height: 22,
                        background: "linear-gradient(135deg,#22c55e,#10b981)",
                        boxShadow: "0 2px 6px rgba(34,197,94,0.3)",
                        animation: `${popIn} 400ms ${0.65 + d}s cubic-bezier(0.34, 1.5, 0.64, 1) both`,
                      }}
                    >
                      <Box component='svg' width={10} height={10} viewBox='0 0 12 12' fill='none'>
                        <path d='M2 6L5 9L10 3' stroke='white' strokeWidth={1.7} strokeLinecap='round' strokeLinejoin='round' />
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Typography
                  sx={{
                    ...BN,
                    fontSize: 12,
                    color: "#9ca3af",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  <Box component='span' sx={{ fontWeight: 900, color: "#22c55e", fontSize: 14 }}>
                    {countdown}
                  </Box>{" "}
                  সেকেন্ড পরে হোমপেজে নিয়ে যাওয়া হবে
                </Typography>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Background pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.03,
          filter: "grayscale(100%)",
          backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')",
        }}
      />

      {/* Header */}
      <Box
        sx={{
          position: "relative",
          bgcolor: "#fff",
          borderBottom: "1px solid #f3f4f6",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          position_sticky_hack: undefined,
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            bgcolor: "#fff",
          }}
        >
          <Box
            sx={{
              maxWidth: 1280,
              mx: "auto",
              px: { xs: 1, md: 2 },
              py: { xs: 1.5, md: 3 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                component={NextLink}
                href={isBuyNow ? `/products/${buyNowProduct?.slug}` : "/cart"}
                sx={{
                  p: 1,
                  borderRadius: "50%",
                  display: "inline-flex",
                  transition: "background-color 200ms",
                  "&:hover": { bgcolor: "#f3f4f6" },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 24, color: "#4b5563" }} />
              </Box>
              <Box>
                <Typography
                  component='h1'
                  sx={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#111827",
                    letterSpacing: "-0.02em",
                  }}
                >
                  BongoNex Checkout
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#9ca3af",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                  }}
                >
                  Bongo-Nex Premium Shopping
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
                bgcolor: "#fff7ed",
                px: 2,
                py: 1,
                borderRadius: 999,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: "#f97316",
                  borderRadius: "50%",
                  animation: `${pulseDot} 2s ease-in-out infinite`,
                }}
              />
              <Box
                component='span'
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#ea580c",
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                }}
              >
                Order now for fast delivery
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main */}
      <Box
        component='main'
        sx={{
          maxWidth: 1280,
          mx: "auto",
          px: 2,
          mt: { xs: 1, md: 6 },
          position: "relative",
        }}
      >
        <Box
          component='form'
          id='checkout-form'
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(12, minmax(0, 1fr))" },
            gap: { md: 2 },
          }}
        >
          <Box sx={{ gridColumn: { lg: "span 7" } }}>
            <CheckoutForm register={register} errors={errors} locationValue={locationValue} setValue={setValue} />
          </Box>
          <Box sx={{ gridColumn: { lg: "span 5" } }}>
            <OrderSummary
              products={productsToOrder}
              originalSubtotal={originalSubtotal}
              deliveryCharge={deliveryCharge}
              discountAmount={discountAmount}
              totalAmount={totalAmount}
              isBuyNow={isBuyNow}
              localQty={localQty}
              onIncreaseQty={handleIncreaseQty}
              onDecreaseQty={handleDecreaseQty}
              onRemoveItem={handleRemoveItem}
            />
          </Box>
        </Box>
      </Box>

      {/* Fixed bottom button (mobile) */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: { xs: "block", md: "none" },
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            height: 32,
            background: "linear-gradient(to top, rgba(255,255,255,0.8), transparent)",
          }}
        />
        <Box
          sx={{
            pointerEvents: "auto",
            bgcolor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid #f3f4f6",
            boxShadow: "0 -4px 24px rgba(0,0,0,0.07)",
          }}
        >
          <Box sx={{ maxWidth: 672, mx: "auto", px: 2, pt: 0.5, pb: { xs: 1, md: 2 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
                px: 0.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                <Box component='span' sx={{ ...BN, fontSize: 18, color: "#1f2937", fontWeight: 500 }}>
                  সর্বমোট:
                </Box>
                <Box
                  component='span'
                  sx={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#ea580c",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ৳{totalAmount}
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: 10,
                  color: "#047857",
                  fontWeight: 700,
                  bgcolor: "#ecfdf5",
                  border: "1px solid #d1fae5",
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 999,
                }}
              >
                <SecurityOutlinedIcon sx={{ fontSize: 11 }} />
                Cash on Delivery
              </Box>
            </Box>

            <Box
              sx={{
                position: "relative",
                "&:hover .shine": { animation: `${shineSweep} 700ms ease` },
              }}
            >
              <Button
                type='submit'
                form='checkout-form'
                disabled={isSubmitting}
                disableElevation
                fullWidth
                sx={{
                  position: "relative",
                  py: 1,
                  background: "linear-gradient(to right,#f97316,#f97316,#f43f5e)",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 16,
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.25,
                  textTransform: "none",
                  boxShadow: "0 10px 15px -3px rgba(249,115,22,0.3), 0 4px 6px -4px rgba(249,115,22,0.3)",
                  overflow: "hidden",
                  transition: "all 300ms",
                  "&:hover": {
                    background: "linear-gradient(to right,#ea580c,#ea580c,#e11d48)",
                  },
                  "&:active": { transform: "scale(0.98)" },
                  "&.Mui-disabled": { opacity: 0.7, color: "#fff" },
                }}
              >
                <Box
                  className='shine'
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)",
                    pointerEvents: "none",
                  }}
                />
                {isSubmitting ? (
                  <>
                    <CircularProgress size={20} sx={{ color: "#fff" }} />
                    <span>অর্ডার প্রসেস হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Inventory2OutlinedIcon sx={{ display: { xs: "none", md: "flex" }, fontSize: 20 }} />
                    <span>ক্যাশ অন ডেলিভারিতে অর্ডার করুন</span>
                  </>
                )}
              </Button>
            </Box>

            <Typography
              sx={{
                display: { xs: "none", md: "block" },
                textAlign: "center",
                fontSize: 9,
                color: "#d1d5db",
                mt: 1,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
              }}
            >
              By clicking, you agree to our terms and conditions
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Page shell ────────────────────────────────────────────
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#fff",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <CircularProgress size={48} sx={{ color: "#f97316" }} />
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 700,
                color: "#6b7280",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Setting up Secure Checkout...
            </Typography>
          </Box>
        </Box>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
