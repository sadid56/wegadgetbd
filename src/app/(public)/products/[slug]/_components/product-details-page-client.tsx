"use client";

import NextLink from "next/link";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/context/toast-context";
import { keyframes } from "@emotion/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { useProduct, useProducts } from "@/query-client/products";
import { orpcClient } from "@/lib/orpc/client";
import { useCart } from "@/hooks/useCart";
import { createOrder } from "@/actions/orders";
import { authClient } from "@/lib/auth-client";
import { toVideoEmbedUrl } from "@/lib/video-links";
import { formatBnNumber } from "@/lib/utils";
import { useMarkdownComponents } from "@/components/common/MarkdownContent";
import { ProductCard } from "../../../_components/ProductCard";

const BN = { fontFamily: "'Hind Siliguri','Noto Sans Bengali',sans-serif" };

// ─── Keyframes ─────────────────────────────────────────────
const expandPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50%      { transform: scale(1.3); opacity: 1; }
`;
const contractPulse = keyframes`
  0%, 100% { transform: scale(1.1); opacity: 0.8; }
  50%      { transform: scale(0.9); opacity: 0.4; }
`;
const spinCW = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;
const spinCCW = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
`;
const corePulse = keyframes`
  0%, 100% { transform: scale(0.92); opacity: 0.8; }
  50%      { transform: scale(1.06); opacity: 1; }
`;
const dotBlink = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50%      { opacity: 1; transform: scale(1.2); }
`;
const barShift = keyframes`
  0%, 100% { width: 6px; opacity: 0.3; }
  50%      { width: 18px; opacity: 1; }
`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.92) translateY(16px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const slideUpFromBottom = keyframes`
  from { opacity: 0; transform: translateY(80px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const popIn = keyframes`
  from { transform: scale(0); }
  to   { transform: scale(1); }
`;
const spinSmall = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const shrinkToCenter = keyframes`
  from { transform: scale(1); }
  to   { transform: scale(0); }
`;

// ─── Reveal wrapper ────────────────────────────────────────
function Reveal({ children, sx, delay = 0 }: { children: React.ReactNode; sx?: object; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px" },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 400ms ease ${delay}s, transform 400ms ease ${delay}s`,
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          opacity: 1,
          transform: "none",
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

// ─── PremiumLoader ─────────────────────────────────────────
function PremiumLoader() {
  const dots = [
    { top: "-18px", left: "50%", delay: "0s" },
    { top: "50%", left: "-18px", delay: "0.4s" },
    { top: "50%", right: "-18px", delay: "0.8s" },
    { bottom: "-18px", left: "50%", delay: "1.2s" },
  ];

  return (
    <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", bgcolor: "#f8f9fa" }}>
      <Box sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <Box
          sx={{
            position: "absolute",
            width: 224,
            height: 224,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
            animation: `${expandPulse} 3s ease-in-out infinite`,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: 144,
            height: 144,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)",
            animation: `${contractPulse} 2.2s ease-in-out infinite`,
          }}
        />
        <Box sx={{ position: "relative", width: 96, height: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: "2px dashed #a7f3d0",
              animation: `${spinCW} 8s linear infinite`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 0,
              height: 0,
              animation: `${spinCW} 2.2s linear infinite`,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 10,
                top: -6,
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#34d399",
                boxShadow: "0 0 12px 4px rgba(16,185,129,0.5)",
              }}
            />
          </Box>
          <Box
            sx={{
              position: "absolute",
              inset: 8,
              borderRadius: "50%",
              border: "2px solid transparent",
              borderTopColor: "#10b981",
              borderRightColor: "#34d399",
              animation: `${spinCCW} 1.4s linear infinite`,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 20,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #34d399, #14b8a6)",
              boxShadow: "0 0 20px 6px rgba(16,185,129,0.35)",
              animation: `${corePulse} 1.8s ease-in-out infinite`,
            }}
          />
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              color: "#fff",
              animation: `${corePulse} 1.8s ease-in-out infinite`,
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 20 }} />
          </Box>
        </Box>
        {dots.map((dot, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "#6ee7b7",
              top: dot.top,
              left: dot.left,
              right: (dot as any).right,
              bottom: (dot as any).bottom,
              animation: `${dotBlink} 1.6s ${dot.delay} ease-in-out infinite`,
            }}
          />
        ))}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, zIndex: 1 }}>
          <Box sx={{ display: "flex", gap: 0.75, alignItems: "center" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  borderRadius: 999,
                  bgcolor: "#34d399",
                  height: 3,
                  animation: `${barShift} 1.2s ${i * 0.15}s ease-in-out infinite`,
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── StarRating ────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon
          key={s}
          sx={{
            fontSize: 14,
            color: s <= Math.round(rating) ? "#fbbf24" : "#e5e7eb",
          }}
        />
      ))}
    </Box>
  );
}

// ─── ConfirmDialog ─────────────────────────────────────────
function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
  img,
  title,
  count,
  totalAmount,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  img: string;
  title: string;
  count: number;
  totalAmount: number;
}) {
  return (
    <Modal open={open} onClose={onCancel} closeAfterTransition>
      <Fade in={open} timeout={200}>
        <Box
          onClick={(e) => e.target === e.currentTarget && onCancel()}
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            bgcolor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            outline: "none",
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              ...BN,
              bgcolor: "#fff",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              width: "100%",
              maxWidth: 384,
              overflow: "hidden",
              animation: `${scaleIn} 280ms cubic-bezier(0.34, 1.3, 0.64, 1) both`,
            }}
          >
            <Box sx={{ height: 4, width: "100%", background: "linear-gradient(to right, #34d399, #10b981, #14b8a6)" }} />
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "#ecfdf5",
                    border: "1px solid #d1fae5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  🛒
                </Box>
                <Box>
                  <Typography sx={{ ...BN, fontWeight: 700, color: "#111827", fontSize: 15 }}>অর্ডার নিশ্চিত করুন</Typography>
                  <Typography sx={{ ...BN, fontSize: 12, color: "#9ca3af", mt: 0.25 }}>নিচের তথ্য একবার মিলিয়ে নিন</Typography>
                </Box>
              </Box>
              <Box sx={{ height: 1, bgcolor: "#f3f4f6", mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  bgcolor: "#f9fafb",
                  borderRadius: "12px",
                  border: "1px solid #f3f4f6",
                  mb: 2.5,
                }}
              >
                {img ? (
                  <Box
                    component='img'
                    src={img}
                    alt={title}
                    sx={{ width: 56, height: 56, borderRadius: "8px", objectFit: "cover", border: "1px solid #e5e7eb", flexShrink: 0 }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "8px",
                      bgcolor: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
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
                      color: "#111827",
                      fontSize: 14,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <Box component='span' sx={{ fontSize: 18, fontWeight: 900, color: "#059669" }}>
                      ৳{totalAmount.toLocaleString()}
                    </Box>
                    <Box
                      component='span'
                      sx={{ ...BN, fontSize: 12, color: "#6b7280", bgcolor: "#f3f4f6", px: 1, py: 0.25, borderRadius: 999 }}
                    >
                      {count}টি পণ্য
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Box
                  component='button'
                  onClick={onCancel}
                  sx={{
                    ...BN,
                    flex: 1,
                    height: 44,
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    bgcolor: "#fff",
                    color: "#4b5563",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    transition: "background-color 200ms",
                    "&:hover": { bgcolor: "#f9fafb" },
                  }}
                >
                  বাতিল
                </Box>
                <Box
                  component='button'
                  onClick={onConfirm}
                  sx={{
                    ...BN,
                    flex: 2,
                    height: 44,
                    borderRadius: "12px",
                    bgcolor: "#10b981",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    border: 0,
                    cursor: "pointer",
                    boxShadow: "0 10px 15px -3px #d1fae5",
                    transition: "background-color 200ms",
                    "&:hover": { bgcolor: "#059669" },
                  }}
                >
                  ✓ হ্যাঁ, কনফার্ম করুন
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

// ─── OrderConfirmedModal ───────────────────────────────────
function OrderConfirmedModal({
  open,
  onClose,
  countdown,
  savedWhatsappUrl,
}: {
  open: boolean;
  onClose: () => void;
  countdown: number;
  savedWhatsappUrl: string;
}) {
  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open} timeout={200}>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            display: "flex",
            alignItems: { xs: "flex-end", sm: "center" },
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            p: 2,
            outline: "none",
          }}
        >
          <Box
            sx={{
              ...BN,
              position: "relative",
              bgcolor: "#fff",
              width: "100%",
              maxWidth: 384,
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              overflow: "hidden",
              animation: `${slideUpFromBottom} 400ms cubic-bezier(0.34, 1.2, 0.64, 1) both`,
            }}
          >
            <Box sx={{ height: 4, width: "100%", background: "linear-gradient(to right, #4ade80, #10b981)" }} />
            <IconButton
              onClick={onClose}
              size='small'
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 28,
                height: 28,
                bgcolor: "#f3f4f6",
                color: "#9ca3af",
                zIndex: 1,
                "&:hover": { bgcolor: "#e5e7eb" },
              }}
            >
              <CloseIcon sx={{ fontSize: 13 }} />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                px: 3,
                pt: 3,
                pb: 2,
                background: "linear-gradient(to bottom, rgba(240,253,244,0.8), #fff)",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4ade80, #10b981)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.5,
                  boxShadow: "0 10px 15px -3px #bbf7d0",
                  animation: `${popIn} 400ms 100ms cubic-bezier(0.34, 1.5, 0.64, 1) both`,
                }}
              >
                <Box component='svg' width={28} height={28} viewBox='0 0 38 38' fill='none'>
                  <path d='M8 19L16 27L30 12' stroke='white' strokeWidth='3.5' strokeLinecap='round' strokeLinejoin='round' />
                </Box>
              </Box>
              <Typography component='h2' sx={{ ...BN, fontSize: 20, fontWeight: 900, color: "#111827" }}>
                অর্ডার কনফার্ম! 🎉
              </Typography>
              <Typography sx={{ ...BN, fontSize: 12, color: "#9ca3af", mt: 0.5, textAlign: "center" }}>
                আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব
              </Typography>
            </Box>
            <Box sx={{ px: 3, pb: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Typography sx={{ ...BN, fontSize: 12, color: "#6b7280", textAlign: "center" }}>
                যেকোনো প্রয়োজনে WhatsApp এ যোগাযোগ করুন
              </Typography>
              <Button
                fullWidth
                disableElevation
                onClick={() => window.open(savedWhatsappUrl, "_blank")}
                startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
                sx={{
                  ...BN,
                  height: 44,
                  bgcolor: "#25D366",
                  color: "#fff",
                  fontWeight: 700,
                  borderRadius: "12px",
                  fontSize: 14,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#20bd5a" },
                }}
              >
                WhatsApp এ মেসেজ করুন
              </Button>
              <Typography sx={{ ...BN, textAlign: "center", fontSize: 12, color: "#9ca3af" }}>
                <Box component='span' sx={{ fontWeight: 700, color: "#10b981", fontSize: 14 }}>
                  {countdown}
                </Box>{" "}
                সেকেন্ড পরে হোমপেজে যাবেন
              </Typography>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

// ─── TrustBadge ────────────────────────────────────────────
function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.75,
        p: 1.5,
        bgcolor: "#fff",
        borderRadius: "12px",
        border: "1px solid #f3f4f6",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        mb: { md: 1 },
      }}
    >
      <Box sx={{ color: "#10b981" }}>{icon}</Box>
      <Typography sx={{ fontSize: 10, fontWeight: 600, color: "#4b5563", textAlign: "center", lineHeight: 1.3 }}>{label}</Typography>
    </Box>
  );
}

// ─── ProductReviews ────────────────────────────────────────
function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [perSlide, setPerSlide] = useState(2);

  useEffect(() => {
    const update = () => setPerSlide(window.innerWidth < 768 ? 1 : 2);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!productId) return;
    orpcClient.products
      .reviews({ productId })
      .then((data) => {
        setReviews((data as any) || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (reviews.length <= perSlide) return;
    const totalSlides = Math.ceil(reviews.length / perSlide);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews, perSlide]);

  if (loading || !reviews.length) return null;

  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
  const totalSlides = Math.ceil(reviews.length / perSlide);
  const visibleReviews = reviews.slice(currentSlide * perSlide, currentSlide * perSlide + perSlide);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);

  return (
    <Reveal sx={{ maxWidth: 1152, mx: "auto", px: 1, mt: 3 }}>
      <Box
        sx={{
          ...BN,
          bgcolor: "#fff",
          borderRadius: "12px",
          border: "1px solid #f3f4f6",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
            borderBottom: "1px solid #f3f4f6",
            background: "linear-gradient(to right, #fffbeb, #fff)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  bgcolor: "#fbbf24",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <StarIcon sx={{ fontSize: 16, color: "#fff" }} />
              </Box>
              <Box>
                <Typography sx={{ ...BN, fontSize: 16, fontWeight: 700, color: "#111827" }}>কাস্টমারদের রিভিউ</Typography>
                <Typography sx={{ ...BN, fontSize: 12, color: "#9ca3af" }}>{reviews.length}জন কাস্টমারদের রিভিউ দিয়েছেন</Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Box component='div' sx={{ fontSize: 24, fontWeight: 900, color: "#f59e0b" }}>
                {avgRating.toFixed(1)}
              </Box>
              <StarRating rating={avgRating} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ position: "relative" }}>
            {totalSlides > 1 && (
              <IconButton
                onClick={prevSlide}
                sx={{
                  position: "absolute",
                  left: { xs: -8, md: -16 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: 32,
                  height: 32,
                  bgcolor: "#fff",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  "&:hover": { bgcolor: "#f9fafb", transform: "translateY(-50%) scale(1.1)" },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: 16, color: "#4b5563" }} />
              </IconButton>
            )}

            <Box sx={{ px: { xs: 1, md: 2 } }}>
              <Box
                key={currentSlide}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                  gap: 2,
                  animation: `${slideInRight} 300ms ease both`,
                }}
              >
                {visibleReviews.map((review) => (
                  <Box
                    key={review.id}
                    sx={{
                      bgcolor: "#fff",
                      borderRadius: "16px",
                      border: "1px solid #f3f4f6",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      overflow: "hidden",
                      transition: "box-shadow 300ms",
                      "&:hover": { boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
                    }}
                  >
                    {review.mediaUrl && (
                      <Box sx={{ position: "relative", width: "100%", borderRadius: "32px" }}>
                        {review.mediaType === "video" ? (
                          <Box
                            component='video'
                            src={review.mediaUrl}
                            controls
                            playsInline
                            sx={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: "32px" }}
                          />
                        ) : (
                          <Box
                            component='img'
                            src={review.mediaUrl}
                            alt='review'
                            sx={{ width: "100%", maxHeight: 176, objectFit: "cover", px: 0.5, py: 0.5, borderRadius: "32px" }}
                          />
                        )}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: "rgba(0,0,0,0.6)",
                            backdropFilter: "blur(4px)",
                            borderRadius: "8px",
                            px: 1,
                            py: 0.5,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <StarIcon sx={{ fontSize: 12, color: "#fbbf24" }} />
                          <Box component='span' sx={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                            {review.rating}.0
                          </Box>
                        </Box>
                      </Box>
                    )}

                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                        {review.customerPic ? (
                          <Box
                            component='img'
                            src={review.customerPic}
                            alt={review.customerName}
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid #d1fae5",
                              flexShrink: 0,
                              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 44,
                              height: 44,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #34d399, #14b8a6)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              fontSize: 14,
                              fontWeight: 900,
                              color: "#fff",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            }}
                          >
                            {review.customerName.substring(0, 2).toUpperCase()}
                          </Box>
                        )}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0.5 }}>
                            <Typography
                              sx={{
                                ...BN,
                                fontWeight: 700,
                                fontSize: 14,
                                color: "#111827",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {review.customerName}
                            </Typography>
                            <Box component='span' sx={{ ...BN, fontSize: 10, color: "#9ca3af", flexShrink: 0 }}>
                              {new Date(review.createdAt).toLocaleDateString("bn-BD")}
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                            <StarRating rating={review.rating} />
                            {!review.mediaUrl && (
                              <Box component='span' sx={{ ...BN, fontSize: 12, fontWeight: 700, color: "#f59e0b" }}>
                                {review.rating}.0
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          bgcolor: "#f9fafb",
                          borderRadius: "12px",
                          px: 1.5,
                          py: 1.25,
                          border: "1px solid #f3f4f6",
                          mb: 1.5,
                        }}
                      >
                        <Typography sx={{ ...BN, fontSize: 14, color: "#4b5563", lineHeight: 1.65 }}>
                          <Box component='span' sx={{ color: "#10b981", fontWeight: 700, fontSize: 18, lineHeight: 1 }}>
                            &quot;
                          </Box>
                          {review.review}
                          <Box component='span' sx={{ color: "#10b981", fontWeight: 700, fontSize: 18, lineHeight: 1 }}>
                            &quot;
                          </Box>
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              bgcolor: "#10b981",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Box component='svg' width={8} height={8} viewBox='0 0 12 12' fill='none'>
                              <path d='M2 6l3 3 5-5' stroke='white' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                            </Box>
                          </Box>
                          <Box component='span' sx={{ ...BN, fontSize: 10, color: "#059669", fontWeight: 600 }}>
                            Regular customer
                          </Box>
                        </Box>
                        {review.mediaUrl && review.mediaType === "video" && (
                          <Box
                            component='span'
                            sx={{
                              ...BN,
                              fontSize: 10,
                              bgcolor: "#eff6ff",
                              color: "#3b82f6",
                              border: "1px solid #dbeafe",
                              px: 1,
                              py: 0.25,
                              borderRadius: 999,
                              fontWeight: 500,
                            }}
                          >
                            📹 ভিডিও রিভিউ
                          </Box>
                        )}
                        {review.mediaUrl && review.mediaType === "image" && (
                          <Box
                            component='span'
                            sx={{
                              ...BN,
                              fontSize: 10,
                              bgcolor: "#faf5ff",
                              color: "#8b5cf6",
                              border: "1px solid #ede9fe",
                              px: 1,
                              py: 0.25,
                              borderRadius: 999,
                              fontWeight: 500,
                            }}
                          >
                            📸 ফটো রিভিউ
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {totalSlides > 1 && (
              <IconButton
                onClick={nextSlide}
                sx={{
                  position: "absolute",
                  right: { xs: -8, md: -16 },
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: 32,
                  height: 32,
                  bgcolor: "#fff",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  "&:hover": { bgcolor: "#f9fafb", transform: "translateY(-50%) scale(1.1)" },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: 16, color: "#4b5563" }} />
              </IconButton>
            )}
          </Box>

          {totalSlides > 1 && (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mt: 2.5 }}>
              <Box
                component='button'
                onClick={prevSlide}
                sx={{
                  ...BN,
                  fontSize: 12,
                  color: "#9ca3af",
                  bgcolor: "transparent",
                  border: 0,
                  cursor: "pointer",
                  "&:hover": { color: "#4b5563" },
                }}
              >
                ‹ আগে
              </Box>
              <Box sx={{ display: "flex", gap: 0.75 }}>
                {Array.from({ length: totalSlides }).map((_, idx) => (
                  <Box
                    key={idx}
                    component='button'
                    onClick={() => setCurrentSlide(idx)}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      border: 0,
                      cursor: "pointer",
                      p: 0,
                      bgcolor: idx === currentSlide ? "#10b981" : "#e5e7eb",
                      width: idx === currentSlide ? 24 : 8,
                      transition: "all 300ms",
                      "&:hover": { bgcolor: idx === currentSlide ? "#10b981" : "#d1d5db" },
                    }}
                  />
                ))}
              </Box>
              <Box
                component='button'
                onClick={nextSlide}
                sx={{
                  ...BN,
                  fontSize: 12,
                  color: "#9ca3af",
                  bgcolor: "transparent",
                  border: 0,
                  cursor: "pointer",
                  "&:hover": { color: "#4b5563" },
                }}
              >
                পরে ›
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Reveal>
  );
}

// ─── Main Page ─────────────────────────────────────────────
export default function ProductDetailsPage() {
  const toast = useToast();
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [showBottomSummary, setShowBottomSummary] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [familyCount, setFamilyCount] = useState(1);

  const [showCODModal, setShowCODModal] = useState(false);
  const [codName, setCodName] = useState("");
  const [codPhone, setCodPhone] = useState("");
  const [codAddress, setCodAddress] = useState("");
  const [codShipping, setCodShipping] = useState(80);
  const [codNote, setCodNote] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const [savedWhatsappUrl, setSavedWhatsappUrl] = useState("");

  const { data: session } = authClient.useSession();
  const { data: product, isLoading } = useProduct(slug as string);
  const { data: relatedData } = useProducts({ category: product?.category?.slug, limit: 5 });
  const { data: bestSellingData } = useProducts({ limit: 24 });
  const { addItem, cart } = useCart();
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const allImagesRef = useRef<HTMLDivElement>(null);
  const markdownComponents = useMarkdownComponents();

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

  useEffect(() => {
    const onScroll = () => setShowBottomSummary(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let start = 1;
    const end = 10000;
    const stepTime = 10;
    const step = Math.ceil(end / (2000 / stepTime));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setFamilyCount(end);
        clearInterval(timer);
      } else setFamilyCount(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, []);

  const relatedProducts = relatedData?.products.filter((p: any) => p.id !== product?.id).slice(0, 4) || [];
  const bestSellingProducts =
    bestSellingData?.products
      ?.filter((p: any) => p.id !== product?.id)
      .sort((a: any, b: any) => {
        const aScore = (a.label === "BEST_SELLER" ? 10 : 0) + (a.isFeatured ? 5 : 0) + Number(a.rating || 0);
        const bScore = (b.label === "BEST_SELLER" ? 10 : 0) + (b.isFeatured ? 5 : 0) + Number(b.rating || 0);
        return bScore - aScore;
      })
      .slice(0, 4) || [];

  if (isLoading) return <PremiumLoader />;
  if (!product) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#9ca3af" }}>
        পণ্য পাওয়া যায়নি
      </Box>
    );
  }

  const productAny = product as any;
  const isInCart = cart.some((i: any) => i.id === product.id);

  const basePrice = Number(productAny.price || 0);
  const discountedPrice = Number(productAny.discountPrice || productAny.price || 0);
  const discountAmount = Math.max(basePrice - discountedPrice, 0);
  const discountPercent = basePrice > 0 ? Math.round((discountAmount / basePrice) * 100) : 0;
  const totalPrice = discountedPrice * qty;
  const totalOriginal = basePrice * qty;
  const totalDiscount = discountAmount * qty;
  const totalAmount = totalPrice + codShipping;

  const images: string[] = (product as any).images || [];
  const videoLinks: string[] = ((product as any).videoLinks || []).filter((l: string) => l.trim() !== "");

  const scrollToVideos = () => videoSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const scrollToAllImages = () => allImagesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleBuyNow = () => setShowCODModal(true);
  const addToCart = () => addItem(product, qty);

  const handleConfirmOrderClick = () => {
    if (!codName.trim()) return toast.error("আপনার নাম দিন");
    if (!codPhone.trim() || !/^01[3-9]\d{8}$/.test(codPhone)) return toast.error("সঠিক ফোন নম্বর দিন");
    if (!codAddress.trim()) return toast.error("ঠিকানা দিন");
    setShowConfirmDialog(true);
  };

  const processOrder = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);
    try {
      const whatsappNumber = "+8801576641142";
      const orderItems = [
        {
          id: product.id,
          title: product.title,
          qty,
          price: Number(productAny.discountPrice || productAny.price),
          image: images?.[0] || "",
        },
      ];
      const shippingLabel = codShipping === 80 ? "সিটির ভিতরে" : "সিটির বাইরে";
      const orderDetails = orderItems.map((i: any) => `• ${i.title} (x${i.qty}) - ৳${i.price * i.qty}`).join("\n");
      const message = `🛍️ নতুন অর্ডার (BONGO NEX)\n━━━━━━━━━━━━━━━\n👤 গ্রাহকের নাম: ${codName}\n📞 মোবাইল: ${codPhone}\n📍 ঠিকানা: ${codAddress}\n🚚 এলাকা: ${shippingLabel}\n📝 নোট: ${codNote || "N/A"}\n\n📦 আইটেম সমূহ:\n${orderDetails}\n\n💰 সামারি:\nসাবটোটাল: ৳${totalPrice}\nডেলিভারি চার্জ: ৳${codShipping}\n━━━━━━━━━━━━━━━\n💵 সর্বমোট: ৳${totalAmount}\n\n🖥️ সোর্স: ${window.location.host}`;

      const res = await createOrder({
        customerName: codName,
        phoneNumber: codPhone,
        address: codAddress,
        city: codShipping === 80 ? "Dhaka" : "Outside Dhaka",
        items: orderItems,
        totalAmount,
        shippingCost: codShipping,
        discountAmount: totalDiscount,
        paymentMethod: "CASH_ON_DELIVERY",
        whatsappMessage: message,
        userId: session?.user?.id,
      } as any);

      if (res.success) {
        setSavedWhatsappUrl(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
        setShowCODModal(false);
        setIsOrderConfirmed(true);
      } else {
        toast.error("কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch {
      toast.error("কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmOrder2 = () => {
    if (!codName.trim() || !codPhone.trim() || !codAddress.trim()) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }
    const shippingLabel = codShipping === 130 ? "ঢাকা সিটির বাইরে" : "ঢাকা সিটির ভিতরে";
    const msg = `🛒 নতুন অর্ডার!\n\n📦 পণ্য: ${product.title}\n🔢 পরিমাণ: ${qty} পিস\n💰 মূল্য: Tk ${totalPrice}\n🚚 ডেলিভারি: Tk ${codShipping} (${shippingLabel})\n💵 সর্বমোট: Tk ${totalAmount}\n\n👤 নাম: ${codName}\n📞 ফোন: ${codPhone}\n📍 এড্রেস: ${codAddress}${codNote ? `\n📝 নোট: ${codNote}` : ""}`;
    window.open(`https://wa.me/+8801576641142?text=${encodeURIComponent(msg)}`, "_blank");
    setShowCODModal(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa", color: "#111827" }}>
      <ConfirmDialog
        open={showConfirmDialog}
        onCancel={() => setShowConfirmDialog(false)}
        onConfirm={processOrder}
        img={images?.[0] ?? ""}
        title={product.title}
        count={qty}
        totalAmount={totalAmount}
      />
      <OrderConfirmedModal
        open={isOrderConfirmed}
        onClose={() => {
          setIsOrderConfirmed(false);
          router.push("/");
        }}
        countdown={countdown}
        savedWhatsappUrl={savedWhatsappUrl}
      />

      {/* Breadcrumb (hidden) */}
      <Box sx={{ display: "none", bgcolor: "#fff", borderBottom: "1px solid #f3f4f6" }}>
        <Box sx={{ maxWidth: 1152, mx: "auto", px: 2, py: 1.5 }}>
          <NextLink href='/products' style={{ textDecoration: "none" }}>
            <Box
              component='button'
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                fontSize: 12,
                fontWeight: 500,
                color: "#6b7280",
                bgcolor: "transparent",
                border: 0,
                cursor: "pointer",
                transition: "color 200ms",
                "&:hover": { color: "#111827" },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 14 }} />
              সব পণ্য
            </Box>
          </NextLink>
        </Box>
      </Box>

      {/* ═══ Main product grid ═══ */}
      <Box sx={{ maxWidth: 1152, mx: "auto", px: { xs: 1, md: 2 }, py: { xs: 0, md: 3 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(12, minmax(0, 1fr))" }, gap: { xs: 2.5, lg: 4 } }}>
          {/* Images */}
          <Box sx={{ gridColumn: { lg: "span 5" } }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: "4px",
                overflow: "hidden",
                bgcolor: "#fff",
                border: "1px solid #f3f4f6",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {images?.[activeImg] ? (
                <NextImage
                  src={images[activeImg]}
                  alt={product.title}
                  fill
                  sizes='(max-width: 768px) 100vw, 500px'
                  style={{ objectFit: "cover" }}
                  priority
                />
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#d1d5db" }}>
                  <Inventory2OutlinedIcon sx={{ fontSize: 64 }} />
                </Box>
              )}
              {discountPercent > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    bgcolor: "#ef4444",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 900,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                >
                  -{discountPercent}%
                </Box>
              )}
              <Box sx={{ position: "absolute", bottom: 12, right: 12, display: "flex", gap: 1 }}>
                <Box
                  component='button'
                  onClick={scrollToVideos}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontSize: 12,
                    fontWeight: 600,
                    bgcolor: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid #f3f4f6",
                    color: "#374151",
                    px: 1.25,
                    py: 0.75,
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    transition: "background-color 200ms",
                    "&:hover": { bgcolor: "#f9fafb" },
                  }}
                >
                  <PlayArrowIcon sx={{ fontSize: 12, color: "#ef4444" }} /> Video
                </Box>
                <Box
                  component='button'
                  onClick={scrollToAllImages}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontSize: 12,
                    fontWeight: 600,
                    bgcolor: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid #f3f4f6",
                    color: "#374151",
                    px: 1.25,
                    py: 0.75,
                    borderRadius: "8px",
                    cursor: "pointer",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    transition: "background-color 200ms",
                    "&:hover": { bgcolor: "#f9fafb" },
                  }}
                >
                  <CollectionsOutlinedIcon sx={{ fontSize: 12, color: "#3b82f6" }} /> Image
                </Box>
              </Box>
            </Box>
            {images?.length > 1 && (
              <Box sx={{ mt: 1.5, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1 }}>
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    component='button'
                    onClick={() => setActiveImg(idx)}
                    sx={{
                      position: "relative",
                      aspectRatio: "1 / 1",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "2px solid",
                      borderColor: activeImg === idx ? "#10b981" : "transparent",
                      boxShadow: activeImg === idx ? "0 4px 6px -1px #d1fae5" : "none",
                      p: 0,
                      bgcolor: "transparent",
                      cursor: "pointer",
                      transition: "all 200ms",
                      "&:hover": { borderColor: activeImg === idx ? "#10b981" : "#e5e7eb" },
                    }}
                  >
                    <NextImage src={img} alt={`thumb-${idx}`} fill sizes='80px' style={{ objectFit: "cover" }} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Product info */}
          <Box
            sx={{
              ...BN,
              gridColumn: { lg: "span 7" },
              display: "flex",
              flexDirection: "column",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              px: { md: 0.5 },
            }}
          >
            {product.category?.name && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  component='span'
                  sx={{
                    display: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#059669",
                    bgcolor: "#ecfdf5",
                    border: "1px solid #d1fae5",
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 999,
                  }}
                >
                  {product.category.name}
                </Box>
                {productAny.label === "BEST_SELLER" && (
                  <Box
                    component='span'
                    sx={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#d97706",
                      bgcolor: "#fffbeb",
                      border: "1px solid #fef3c7",
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 999,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 12 }} /> বেস্ট সেলার
                  </Box>
                )}
              </Box>
            )}
            <Typography
              component='h1'
              sx={{
                ...BN,
                fontSize: { xs: 24, md: 36 },
                fontWeight: 600,
                fontFamily: "serif",
                color: "#374151",
                lineHeight: 1.35,
                mt: { md: 0.5 },
                py: 1.5,
                bgcolor: "#fff",
                px: 1.5,
              }}
            >
              {product.title}
            </Typography>
            <Box
              sx={{ bgcolor: "#fff", border: "1px solid #f3f4f6", p: 1.5, boxShadow: "0 1px 2px rgba(0,0,0,0.05)", borderRadius: "4px" }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.5, mb: 1.5 }}>
                <Box>
                  <Typography sx={{ ...BN, fontSize: 12, color: "#6b7280" }}>Price:</Typography>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                    <Box component='span' sx={{ fontSize: 20, fontWeight: 900, color: "#f97316" }}>
                      ৳{(discountedPrice > 0 ? discountedPrice : basePrice).toLocaleString()}
                    </Box>
                    {discountAmount > 0 && (
                      <Box component='span' sx={{ fontSize: 14, color: "#d1d5db", textDecoration: "line-through", fontWeight: 500 }}>
                        ৳{basePrice.toLocaleString()}
                      </Box>
                    )}
                  </Box>
                </Box>
                {discountAmount > 0 && (
                  <Box sx={{ ml: "auto", textAlign: "right" }}>
                    <Typography sx={{ ...BN, fontSize: 12, color: "#9ca3af" }}>ছাড়:</Typography>
                    <Typography sx={{ ...BN, fontSize: 12, fontWeight: 900, color: "#6b7280" }}>
                      ৳{discountAmount.toLocaleString()} ({discountPercent}%)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {product.description && (
              <Box sx={{ display: { xs: "none", md: "block" }, bgcolor: "#fff", border: "1px solid #f3f4f6", p: 2 }}>
                <Box
                  sx={{
                    fontSize: 14,
                    color: "#4b5563",
                    lineHeight: 1.65,
                    overflow: "hidden",
                    transition: "max-height 300ms",
                    maxHeight: descExpanded ? 240 : 40,
                  }}
                >
                  {product.description}
                </Box>
                {product.description.length > 100 && (
                  <Box
                    component='button'
                    onClick={() => setDescExpanded((v) => !v)}
                    sx={{
                      ...BN,
                      mt: 1,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#059669",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      bgcolor: "transparent",
                      border: 0,
                      cursor: "pointer",
                      "&:hover": { color: "#047857" },
                    }}
                  >
                    {descExpanded ? (
                      <>
                        <ExpandLessIcon sx={{ fontSize: 12 }} /> কম দেখুন
                      </>
                    ) : (
                      <>
                        <ExpandMoreIcon sx={{ fontSize: 12 }} /> আরও পড়ুন
                      </>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {(product.rating || productAny.soldCount) && (
              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "flex-end", gap: 1.5, mx: "auto", fontSize: 14, py: 0.5 }}>
                {product.rating && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <StarRating rating={Number(product.rating)} />
                    <Box component='span' sx={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                      {Number(product.rating).toFixed(1)}
                    </Box>
                  </Box>
                )}
                {productAny.soldCount && (
                  <Box component='span' sx={{ fontSize: 12, color: "#9ca3af" }}>
                    {formatBnNumber(productAny.soldCount)}+ বিক্রি হয়েছে
                  </Box>
                )}
              </Box>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#fff",
                border: "1px solid #f3f4f6",
                px: 2,
                py: 1,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <Typography sx={{ ...BN, fontSize: 14, fontFamily: "serif", fontWeight: 600, color: "#111827" }}>পরিমাণ</Typography>
              <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #e5e7eb", borderRadius: "6px", overflow: "hidden" }}>
                <Box
                  component='button'
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  sx={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#374151",
                    bgcolor: "transparent",
                    border: 0,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#f9fafb" },
                  }}
                >
                  −
                </Box>
                <Box
                  component='span'
                  sx={{
                    ...BN,
                    width: 48,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111827",
                    borderLeft: "1px solid #e5e7eb",
                    borderRight: "1px solid #e5e7eb",
                    fontFamily: "serif",
                  }}
                >
                  {qty}
                </Box>
                <Box
                  component='button'
                  onClick={() => setQty((q) => q + 1)}
                  sx={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#374151",
                    bgcolor: "transparent",
                    border: 0,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#f9fafb" },
                  }}
                >
                  +
                </Box>
              </Box>
            </Box>

            {qty > 1 && (
              <Box sx={{ bgcolor: "#fff", border: "1px solid #f3f4f6", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                <Box sx={{ px: 2, py: 1.25, display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <Box component='span' sx={{ ...BN, color: "#6b7280", fontFamily: "serif" }}>
                    পণ্যের মূল্য ({qty}টি) :
                  </Box>
                  <Box component='span' sx={{ color: "#9ca3af", textDecoration: "line-through" }}>
                    ৳{totalOriginal.toLocaleString()}
                  </Box>
                </Box>
                {totalDiscount > 0 && (
                  <Box
                    sx={{
                      px: 2,
                      py: { xs: 1, md: 1.25 },
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      borderTop: "1px solid #f9fafb",
                    }}
                  >
                    <Box component='span' sx={{ ...BN, color: "#6b7280", fontFamily: "serif" }}>
                      ছাড়
                    </Box>
                    <Box component='span' sx={{ color: "#10b981", fontWeight: 600 }}>
                      -৳{totalDiscount.toLocaleString()}
                    </Box>
                  </Box>
                )}
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #f3f4f6",
                    bgcolor: "#f9fafb",
                  }}
                >
                  <Box component='span' sx={{ ...BN, fontWeight: 600, color: "#1f2937", fontFamily: "serif" }}>
                    মোট{" "}
                    <Box component='span' sx={{ fontSize: 14, color: "#4b5563" }}>
                      ({qty}টি
                    </Box>
                    ):
                  </Box>
                  <Box component='span' sx={{ fontSize: 16, fontWeight: 900, color: "#111827" }}>
                    ৳{totalPrice.toLocaleString()}
                  </Box>
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1.5, pb: 1 }}>
              <Button
                fullWidth
                disableElevation
                onClick={handleBuyNow}
                disabled={!product.inStock}
                startIcon={<WhatsAppIcon sx={{ fontSize: 20 }} />}
                sx={{
                  ...BN,
                  height: 52,
                  borderRadius: "5px",
                  bgcolor: "#f97316",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  textTransform: "none",
                  boxShadow: "0 10px 15px -3px #d1fae5",
                  transition: "all 200ms",
                  "&:hover": { bgcolor: "#ea580c" },
                  "&:active": { transform: "scale(0.98)" },
                  "&.Mui-disabled": { opacity: 0.5, color: "#fff" },
                }}
              >
                ক্যাশ অন ডেলিভারিতে অর্ডার করুন
              </Button>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 1.5 }}>
                <Box
                  component='button'
                  onClick={() => !isInCart && addToCart()}
                  disabled={isInCart || !product.inStock}
                  sx={{
                    ...BN,
                    display: { xs: "none", md: "flex" },
                    height: 44,
                    borderRadius: "6px",
                    fontWeight: 600,
                    fontSize: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    border: "1px solid",
                    borderColor: isInCart ? "#a7f3d0" : product.inStock ? "#e5e7eb" : "#f3f4f6",
                    bgcolor: isInCart ? "#ecfdf5" : product.inStock ? "#fff" : "#f9fafb",
                    color: isInCart ? "#059669" : product.inStock ? "#374151" : "#d1d5db",
                    cursor: isInCart ? "default" : product.inStock ? "pointer" : "not-allowed",
                    transition: "all 200ms",
                    "&:hover": !isInCart && product.inStock ? { borderColor: "#d1d5db", bgcolor: "#f9fafb" } : {},
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: 16 }} />
                  {isInCart ? "কার্টে আছে ✓" : "কার্টে যোগ করুন"}
                </Box>
                <Box
                  component='button'
                  onClick={() => window.open("https://wa.me/8801576641142", "_blank")}
                  sx={{
                    ...BN,
                    height: 44,
                    borderRadius: "6px",
                    bgcolor: "#25D366",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    border: 0,
                    cursor: "pointer",
                    transition: "background-color 200ms",
                    "&:hover": { bgcolor: "#20bd5a" },
                  }}
                >
                  <Box
                    component='img'
                    src='https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
                    alt='WhatsApp'
                    sx={{ height: 16, width: 16 }}
                  />
                  WhatsApp এ কথা বলে অর্ডার করুন
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
              <TrustBadge icon={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 16 }} />} label='১০০% অরিজিনাল' />
              <TrustBadge icon={<LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />} label='দ্রুত ডেলিভারি' />
              <TrustBadge icon={<ReplayIcon sx={{ fontSize: 16 }} />} label='সহজ রিটার্ন' />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Markdown description */}
      <Box sx={{ maxWidth: 1152, mx: "auto", px: 1, mt: 2 }}>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: "6px",
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            p: { xs: 3, md: 4 },
          }}
        >
          <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {(product as any).markdown_description}
          </Markdown>
        </Box>
      </Box>

      {/* Trust / family counter */}
      <Box sx={{ ...BN, maxWidth: 1152, mx: "auto", px: 1, mt: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: "6px",
              border: "1px solid #f3f4f6",
              p: 3,
              textAlign: "center",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <Box sx={{ fontSize: 36, fontWeight: 900, color: "#111827", mb: 0.5 }}>{familyCount.toLocaleString()}+</Box>
            <Typography sx={{ ...BN, fontSize: 14, fontWeight: 600, color: "#4b5563" }}>সন্তুষ্ট পরিবার</Typography>
            <Typography sx={{ ...BN, fontSize: 12, color: "#9ca3af", mt: 1 }}>প্রতিদিন নতুন গ্রাহকরা আমাদের উপর আস্থা রাখছেন</Typography>
          </Box>
          <Box sx={{ bgcolor: "#111827", borderRadius: "6px", p: 3, textAlign: "center", color: "#fff" }}>
            <Typography sx={{ ...BN, fontSize: 16, fontWeight: 700, lineHeight: 1.65 }}>
              প্রথমে দেখুন, তারপর{" "}
              <Box component='span' sx={{ color: "#34d399" }}>
                ডেলিভারি ম্যান
              </Box>
              কে টাকা দিন
            </Typography>
            <Typography sx={{ ...BN, fontSize: 12, color: "#9ca3af", mt: 1.5 }}>ক্যাশ অন ডেলিভারি সুবিধায় নিরাপদ কেনাকাটা করুন</Typography>
          </Box>
        </Box>
      </Box>

      <ProductReviews productId={product.id} />

      {/* All images */}
      <Reveal sx={{ maxWidth: 1152, mx: "auto", px: 1, mt: 3 }}>
        <Box
          ref={allImagesRef}
          sx={{ bgcolor: "#fff", borderRadius: "6px", border: "1px solid #f3f4f6", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", p: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <CollectionsOutlinedIcon sx={{ fontSize: 16, color: "#3b82f6" }} />
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>পণ্যের সব ছবি</Typography>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(4, 1fr)", sm: "repeat(6, 1fr)", md: "repeat(8, 1fr)" }, gap: 1 }}>
            {images.map((img, idx) => (
              <Box
                key={idx}
                component='button'
                onClick={() => {
                  setActiveImg(idx);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                sx={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  borderRadius: "12px",
                  overflow: "hidden",
                  border: "2px solid",
                  borderColor: activeImg === idx ? "#34d399" : "transparent",
                  boxShadow: activeImg === idx ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none",
                  p: 0,
                  bgcolor: "transparent",
                  cursor: "pointer",
                  transition: "all 200ms",
                  "&:hover": {
                    transform: "scale(1.05)",
                    borderColor: activeImg === idx ? "#34d399" : "#e5e7eb",
                  },
                }}
              >
                <NextImage src={img} alt={`${product.title} ${idx + 1}`} fill style={{ objectFit: "cover" }} sizes='120px' />
              </Box>
            ))}
          </Box>
        </Box>
      </Reveal>

      {/* Videos */}
      {videoLinks.length > 0 && (
        <Reveal sx={{ maxWidth: 1152, mx: "auto", px: 1, mt: 3 }}>
          <Box
            ref={videoSectionRef}
            sx={{ bgcolor: "#fff", borderRadius: "6px", border: "1px solid #f3f4f6", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", p: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  bgcolor: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PlayArrowIcon sx={{ fontSize: 14, color: "#fff" }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>পণ্যের ভিডিও</Typography>
                <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>ভিডিওতে সরাসরি দেখুন</Typography>
              </Box>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
              {videoLinks.map((link, idx) => (
                <Box key={idx} sx={{ aspectRatio: "16 / 9", borderRadius: "12px", overflow: "hidden", border: "1px solid #f3f4f6" }}>
                  <Box
                    component='iframe'
                    src={toVideoEmbedUrl(link)}
                    title={`Product Video ${idx + 1}`}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    sx={{ width: "100%", height: "100%", border: 0 }}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        </Reveal>
      )}

      {/* Why buy */}
      {!!productAny.whyBuyText && (
        <Reveal sx={{ ...BN, maxWidth: 1152, mx: "auto", px: 1, mt: 3 }}>
          <Box sx={{ bgcolor: "#fff", borderRadius: "6px", border: "1px solid #f3f4f6", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
              <AutoAwesomeIcon sx={{ fontSize: 16, color: "#fbbf24" }} />
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>কেন কিনবেন?</Typography>
            </Box>
            <Typography sx={{ ...BN, fontSize: 14, color: "#4b5563", lineHeight: 1.65, whiteSpace: "pre-line" }}>
              {productAny.whyBuyText}
            </Typography>
          </Box>
        </Reveal>
      )}

      {/* Promise */}
      <Reveal sx={{ ...BN, maxWidth: 1152, mx: "auto", px: 1, mt: 3 }}>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            bgcolor: "#fff",
            borderRadius: "6px",
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            p: { xs: 3, md: 4 },
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#111827", mb: 0.5 }}>আমাদের প্রতিশ্রুতি</Typography>
          <Typography sx={{ fontSize: 12, color: "#9ca3af", mb: 2.5 }}>আপনার সন্তুষ্টি আমাদের সর্বোচ্চ অগ্রাধিকার</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { sm: "repeat(2, 1fr)" }, gap: 1.5 }}>
            {[
              {
                icon: <WorkspacePremiumOutlinedIcon sx={{ fontSize: 20, color: "#f59e0b" }} />,
                bg: "#fffbeb",
                border: "#fef3c7",
                iconBg: "#fef3c7",
                title: "১০০% অরিজিনাল পণ্য",
                desc: "সরাসরি ব্র্যান্ড থেকে আসল পণ্য — গুণমান নিশ্চিত।",
              },
              {
                icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 20, color: "#10b981" }} />,
                bg: "#ecfdf5",
                border: "#d1fae5",
                iconBg: "#d1fae5",
                title: "সহজ রিটার্ন পলিসি",
                desc: "পণ্যে কোনো ত্রুটি থাকলে সহজেই রিটার্ন বা রিপ্লেসমেন্ট করা যাবে।",
              },
              {
                icon: <LocalShippingOutlinedIcon sx={{ fontSize: 20, color: "#3b82f6" }} />,
                bg: "#eff6ff",
                border: "#dbeafe",
                iconBg: "#dbeafe",
                title: "দ্রুত ডেলিভারি",
                desc: "ঢাকার ভেতরে ১-২ দিনে এবং সারাদেশে ২-৩ দিনে ডেলিভারি।",
              },
              {
                icon: <ShoppingCartIcon sx={{ fontSize: 20, color: "#8b5cf6" }} />,
                bg: "#faf5ff",
                border: "#ede9fe",
                iconBg: "#ede9fe",
                title: "ক্যাশ অন ডেলিভারি",
                desc: "পণ্য হাতে পেয়ে দেখে তারপর টাকা দিন — ঝুঁকিমুক্ত কেনাকাটা।",
              },
            ].map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 2,
                  borderRadius: "12px",
                  border: "1px solid",
                  bgcolor: item.bg,
                  borderColor: item.border,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    bgcolor: item.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography sx={{ ...BN, fontWeight: 700, fontSize: 14, color: "#111827", mb: 0.5 }}>{item.title}</Typography>
                  <Typography sx={{ ...BN, fontSize: 12, color: "#6b7280", lineHeight: 1.65 }}>{item.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Reveal>

      {/* Big CTA */}
      <Box sx={{ ...BN, maxWidth: 1152, mx: { xs: 1, md: "auto" }, px: 1, mt: 3 }}>
        <Box
          component='button'
          onClick={handleBuyNow}
          sx={{
            ...BN,
            width: "100%",
            height: 56,
            borderRadius: "6px",
            bgcolor: "#111827",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            border: 0,
            cursor: "pointer",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            transition: "background-color 200ms",
            "&:hover": { bgcolor: "#1f2937" },
            "&:active": { transform: "scale(0.99)" },
          }}
        >
          <TrendingUpIcon sx={{ fontSize: 20, color: "#34d399" }} />
          {formatBnNumber(productAny.soldCount || 360)}+ পিস বিক্রি — এখনই অর্ডার করুন
        </Box>
      </Box>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <Box
          sx={{
            ...BN,
            maxWidth: 1152,
            mx: "auto",
            px: 1,
            mt: 2.5,
            pb: 4,
            bgcolor: "#fff",
            borderRadius: "6px",
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 2.5, px: 1, mt: 1 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: "#ef4444" }} />
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Related</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: "#9ca3af", mt: 0.25 }}>একই ক্যাটাগরির আরও পণ্য</Typography>
            </Box>
            <NextLink href={`/products?category=${product.category?.slug}`} style={{ textDecoration: "none" }}>
              <Box
                component='button'
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#f97316",
                  border: "1px solid #ddd6fe",
                  borderRadius: "6px",
                  px: 2,
                  py: 0.75,
                  bgcolor: "transparent",
                  cursor: "pointer",
                  transition: "background-color 200ms",
                  "&:hover": { bgcolor: "#f5f3ff" },
                }}
              >
                সব দেখুন →
              </Box>
            </NextLink>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 1.5, px: 1 }}>
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Box>
        </Box>
      )}

      {/* Best selling */}
      {bestSellingProducts.length > 0 && (
        <Box
          sx={{
            ...BN,
            maxWidth: 1152,
            mx: "auto",
            px: 1,
            mt: 3,
            pb: { xs: 16, md: 6 },
            bgcolor: "#fff",
            borderRadius: "6px",
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", mb: 2.5, px: 1, mt: 1 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
                <TrendingUpIcon sx={{ fontSize: 16, color: "#ef4444" }} />
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>Top selling</Typography>
              </Box>
              <Typography sx={{ fontSize: 12, color: "#9ca3af" }}>সবচেয়ে বেশি বিক্রি হওয়া পণ্যগুলো</Typography>
            </Box>
            <NextLink href='/products' style={{ textDecoration: "none" }}>
              <Box
                component='button'
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#f97316",
                  border: "1px solid #ddd6fe",
                  borderRadius: "6px",
                  px: 2,
                  py: 0.75,
                  bgcolor: "transparent",
                  cursor: "pointer",
                  transition: "background-color 200ms",
                  "&:hover": { bgcolor: "#f5f3ff" },
                }}
              >
                সব দেখুন →
              </Box>
            </NextLink>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 1.5, px: 1 }}>
            {bestSellingProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Box>
        </Box>
      )}

      {/* Bottom sticky summary */}
      {showBottomSummary && product && (
        <Box
          sx={{
            ...BN,
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            backdropFilter: "blur(20px)",
            bgcolor: "rgba(255,255,255,0.8)",
            borderTop: "1px solid #e5e7eb",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
            animation: `${slideUpFromBottom} 300ms ease both`,
          }}
        >
          <Box sx={{ maxWidth: 1152, mx: "auto", px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "6px",
                overflow: "hidden",
                bgcolor: "#f3f4f6",
                flexShrink: 0,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {images?.[0] && (
                <Box
                  component='img'
                  src={images[0]}
                  alt=''
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 300ms",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                />
              )}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 12, color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {productAny.title}
              </Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
                ৳{discountedPrice.toLocaleString()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              <Box
                component='button'
                onClick={() => addItem(product)}
                sx={{
                  height: 40,
                  px: 2,
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  bgcolor: "#fff",
                  color: "#374151",
                  fontSize: 14,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  transition: "all 200ms",
                  "&:hover": { bgcolor: "#f3f4f6", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" },
                  "&:active": { transform: "scale(0.95)" },
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: 16 }} />
                <Box component='span' sx={{ display: { xs: "none", sm: "inline" } }}>
                  কার্ট
                </Box>
              </Box>
              <Box
                component='button'
                onClick={handleBuyNow}
                sx={{
                  ...BN,
                  height: 40,
                  px: 2.5,
                  borderRadius: "6px",
                  background: "linear-gradient(to right, #10b981, #059669)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  border: 0,
                  cursor: "pointer",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  transition: "all 200ms",
                  "&:hover": { boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", transform: "scale(1.03)" },
                  "&:active": { transform: "scale(0.95)" },
                }}
              >
                অর্ডার করুন
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* COD Modal */}
      <Modal open={showCODModal} onClose={() => setShowCODModal(false)} closeAfterTransition>
        <Slide in={showCODModal} direction='up' timeout={300}>
          <Box
            onClick={(e) => e.target === e.currentTarget && setShowCODModal(false)}
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              bgcolor: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              outline: "none",
            }}
          >
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                ...BN,
                width: "100%",
                maxWidth: 512,
                bgcolor: "#fff",
                borderRadius: "24px 24px 0 0",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                overflow: "hidden",
                maxHeight: "94vh",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "center", pt: 1.5, pb: 0.5 }}>
                <Box sx={{ width: 40, height: 4, borderRadius: 999, bgcolor: "#e5e7eb" }} />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  px: 2.5,
                  pt: 1.5,
                  pb: 2,
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <Box>
                  <Typography sx={{ ...BN, fontSize: 18, fontWeight: 700, color: "#111827" }}>ক্যাশ অন ডেলিভারি</Typography>
                  <Typography sx={{ ...BN, fontSize: 12, color: "#9ca3af", mt: 0.25 }}>তথ্য দিন এবং অর্ডার কনফার্ম করুন</Typography>
                </Box>
                <IconButton
                  onClick={() => setShowCODModal(false)}
                  size='small'
                  sx={{ width: 32, height: 32, bgcolor: "#f3f4f6", color: "#6b7280", "&:hover": { bgcolor: "#e5e7eb" } }}
                >
                  <CloseIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Box>

              <Box
                sx={{
                  overflowY: "auto",
                  px: 2.5,
                  pt: 2,
                  pb: 4,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maxHeight: "calc(94vh - 100px)",
                }}
              >
                {[
                  { label: "আপনার নাম", value: codName, set: setCodName, placeholder: "আপনার নাম লিখুন" },
                  {
                    label: "ফোন নম্বর",
                    value: codPhone,
                    set: (v: string) => setCodPhone(v.replace(/\D/g, "")),
                    placeholder: "01XXXXXXXXX",
                    isPhone: true,
                  },
                  { label: "ডেলিভারি ঠিকানা", value: codAddress, set: setCodAddress, placeholder: "জেলা, থানা, বিস্তারিত ঠিকানা" },
                ].map((f) => (
                  <Box key={f.label}>
                    <Typography sx={{ ...BN, fontSize: 14, fontWeight: 600, color: "#374151", mb: 1 }}>
                      {f.label}{" "}
                      <Box component='span' sx={{ color: "#ef4444" }}>
                        *
                      </Box>
                    </Typography>
                    <Box
                      component='input'
                      type={f.isPhone ? "tel" : "text"}
                      value={f.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => f.set(e.target.value)}
                      inputMode={f.isPhone ? "numeric" : "text"}
                      maxLength={f.isPhone ? 11 : undefined}
                      placeholder={f.placeholder}
                      sx={{
                        ...BN,
                        width: "100%",
                        height: 48,
                        px: 2,
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        bgcolor: "#f9fafb",
                        fontSize: 14,
                        color: "#111827",
                        outline: "none",
                        transition: "all 200ms",
                        "&::placeholder": { color: "#d1d5db" },
                        "&:focus": { borderColor: "transparent", boxShadow: "0 0 0 2px #34d399" },
                      }}
                    />
                  </Box>
                ))}

                <Box>
                  <Typography sx={{ ...BN, fontSize: 14, fontWeight: 600, color: "#374151", mb: 1 }}>ডেলিভারি এলাকা</Typography>
                  <Box
                    sx={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      overflow: "hidden",
                      "& > *:not(:last-child)": { borderBottom: "1px solid #f3f4f6" },
                    }}
                  >
                    {[
                      { label: "ঢাকা সিটির ভিতরে", price: 80 },
                      { label: "বগুড়া সিটির ভিতরে", price: 80 },
                      { label: "ঢাকা ও বগুড়ার বাইরে", price: 130 },
                    ].map((item, idx) => {
                      const isSelected = idx === 2 ? codShipping === 130 : codShipping === 80;
                      return (
                        <Box
                          key={idx}
                          component='label'
                          onClick={() => setCodShipping(item.price)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            px: 2,
                            py: 1.75,
                            cursor: "pointer",
                            transition: "background-color 150ms",
                            bgcolor: isSelected ? "#ecfdf5" : "#fff",
                            "&:hover": { bgcolor: isSelected ? "#ecfdf5" : "#f9fafb" },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                border: "2px solid",
                                borderColor: isSelected ? "#10b981" : "#d1d5db",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 200ms",
                              }}
                            >
                              {isSelected && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981" }} />}
                            </Box>
                            <Typography sx={{ ...BN, fontSize: 14, color: "#374151" }}>{item.label}</Typography>
                          </Box>
                          <Typography sx={{ ...BN, fontSize: 14, fontWeight: 700, color: "#111827" }}>৳{item.price}</Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                <Box>
                  <Typography sx={{ ...BN, fontSize: 14, fontWeight: 600, color: "#374151", mb: 1 }}>
                    অর্ডার নোট{" "}
                    <Box component='span' sx={{ color: "#9ca3af", fontWeight: 400 }}>
                      (ঐচ্ছিক)
                    </Box>
                  </Typography>
                  <Box
                    component='input'
                    type='text'
                    value={codNote}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCodNote(e.target.value)}
                    placeholder='বিশেষ কোনো নির্দেশনা থাকলে লিখুন'
                    sx={{
                      ...BN,
                      width: "100%",
                      height: 48,
                      px: 2,
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      bgcolor: "#f9fafb",
                      fontSize: 14,
                      color: "#111827",
                      outline: "none",
                      transition: "all 200ms",
                      "&::placeholder": { color: "#d1d5db" },
                      "&:focus": { borderColor: "transparent", boxShadow: "0 0 0 2px #34d399" },
                    }}
                  />
                </Box>

                <Box sx={{ borderRadius: "12px", border: "1px solid #f3f4f6", overflow: "hidden", bgcolor: "#f9fafb" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2, bgcolor: "#fff", borderBottom: "1px solid #f3f4f6" }}>
                    {images?.[0] && (
                      <Box
                        sx={{
                          position: "relative",
                          width: 48,
                          height: 48,
                          borderRadius: "8px",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "1px solid #f3f4f6",
                        }}
                      >
                        <NextImage src={images[0]} alt={product.title} fill style={{ objectFit: "cover" }} sizes='48px' />
                        <Box
                          sx={{
                            position: "absolute",
                            top: -4,
                            right: -4,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            bgcolor: "#10b981",
                            color: "#fff",
                            fontSize: 9,
                            fontWeight: 900,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {qty}
                        </Box>
                      </Box>
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          ...BN,
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#111827",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {product.title}
                      </Typography>
                      <Typography sx={{ ...BN, fontSize: 12, color: "#9ca3af", mt: 0.25 }}>{qty}টি পণ্য</Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700, color: "#111827" }}>৳{totalPrice.toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ "& > *:not(:last-child)": { borderBottom: "1px solid #f3f4f6" } }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, py: 1.25, fontSize: 14 }}>
                      <Typography sx={{ ...BN, color: "#6b7280" }}>সাব-টোটাল</Typography>
                      <Typography sx={{ ...BN, fontWeight: 500, color: "#374151" }}>৳{totalPrice.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, py: 1.25, fontSize: 14 }}>
                      <Typography sx={{ ...BN, color: "#6b7280" }}>ডেলিভারি চার্জ</Typography>
                      <Typography sx={{ ...BN, fontWeight: 500, color: "#374151" }}>৳{codShipping}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, py: 1.5, bgcolor: "#fff" }}>
                      <Typography sx={{ ...BN, fontWeight: 700, color: "#111827" }}>সর্বমোট</Typography>
                      <Typography sx={{ ...BN, fontSize: 18, fontWeight: 900, color: "#059669" }}>
                        ৳{totalAmount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box
                  component='button'
                  onClick={handleConfirmOrderClick}
                  disabled={isSubmitting}
                  sx={{
                    ...BN,
                    width: "100%",
                    height: 56,
                    borderRadius: "12px",
                    fontWeight: 700,
                    fontSize: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    border: 0,
                    cursor: "pointer",
                    transition: "all 200ms",
                    bgcolor: "#10b981",
                    color: "#fff",
                    boxShadow: "0 10px 15px -3px #d1fae5",
                    "&:hover": { bgcolor: "#059669" },
                    "&:active": { transform: "scale(0.98)" },
                    "&.Mui-disabled": { opacity: 0.7, color: "#fff" },
                  }}
                >
                  {isSubmitting ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          border: "2px solid rgba(255,255,255,0.3)",
                          borderTopColor: "#fff",
                          borderRadius: "50%",
                          animation: `${spinSmall} 0.8s linear infinite`,
                        }}
                      />
                      <Box component='span'>অর্ডার প্রসেস হচ্ছে...</Box>
                    </Box>
                  ) : (
                    "✓ ক্যাশ অন ডেলিভারিতে অর্ডার কনফার্ম করুন"
                  )}
                </Box>

                <Typography sx={{ ...BN, textAlign: "center", fontSize: 12, color: "#9ca3af", mt: -1 }}>
                  উপরের বাটনে ক্লিক করলে অর্ডারটি সাথে সাথে কনফার্ম হয়ে যাবে
                </Typography>

                <Box
                  component='button'
                  onClick={handleConfirmOrder2}
                  sx={{
                    ...BN,
                    width: "100%",
                    height: 44,
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    bgcolor: "#fff",
                    color: "#374151",
                    fontWeight: 600,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    cursor: "pointer",
                    transition: "background-color 200ms",
                    "&:hover": { bgcolor: "#f9fafb" },
                  }}
                >
                  <Box
                    component='img'
                    src='https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
                    alt='WhatsApp'
                    sx={{ height: 16, width: 16 }}
                  />
                  WhatsApp এ অর্ডার করুন
                </Box>
              </Box>
            </Box>
          </Box>
        </Slide>
      </Modal>
    </Box>
  );
}
