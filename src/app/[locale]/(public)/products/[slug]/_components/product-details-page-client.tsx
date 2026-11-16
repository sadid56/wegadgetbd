"use client";

import { SectionContainer } from "@/components/common/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import NextImage from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ZoomInIcon from "@mui/icons-material/ZoomIn";

import { useMarkdownComponents } from "@/components/common/MarkdownContent";
import { useToast } from "@/context/toast-context";
import { useCart } from "@/hooks/useCart";
import type { Locale } from "@/i18n/config";
import { formatPrice, toBengaliNumber } from "@/lib/i18n-utils";
import { getAssetUrl } from "@/lib/storage";
import { toVideoEmbedUrl } from "@/lib/video-links";
import { useProduct, useProducts } from "@/query-client/products";
import { tokens } from "@/theme/theme";
import { useLocale, useTranslations } from "next-intl";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ProductCard } from "../../../_components/ProductCard";
import { ProductDetailsSkeleton } from "./ProductDetailsSkeleton";
import { ProductReviews } from "./ProductReviews";

type TabKey = "specs" | "desc" | "packaging" | "video" | "reviews";

type ProductExtras = {
  price?: number;
  discountPrice?: number;
  images?: string[];
  videoLinks?: string[];
  reviewsCount?: number;
  soldCount?: number;
  brand?: string;
  model?: string;
  warranty?: string;
  origin?: string;
  specifications?: any;
  packagingDelivery?: any;
};

const getTabSx = (active: boolean) => ({
  px: { xs: 2, sm: 3 },
  py: 1.75,
  fontSize: { xs: 13, sm: 14 },
  fontWeight: 700,
  color: active ? tokens.primary : tokens.textSecondary,
  bgcolor: active ? "rgba(0, 191, 166, 0.06)" : "transparent",
  border: 0,
  borderBottom: active
    ? `3px solid ${tokens.primary}`
    : "3px solid transparent",
  cursor: "pointer",
  whiteSpace: "nowrap" as const,
  transition: "all 150ms",
  "&:hover": {
    color: tokens.primary,
  },
});

const stepperBtnSx = {
  width: 36,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 18,
  fontWeight: 700,
  color: tokens.textPrimary,
  bgcolor: "transparent",
  border: 0,
  cursor: "pointer",
  transition: "background-color 150ms",
  "&:hover": { bgcolor: tokens.borderSubtle },
};

export default function ProductDetailsPage() {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const locale = useLocale() as Locale;
  const toast = useToast();
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>("specs");
  const [mediaMode, setMediaMode] = useState<"photos" | "video">("photos");

  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const tabsSectionRef = useRef<HTMLDivElement | null>(null);

  const handleJumpToReviews = () => {
    setActiveTab("reviews");
    tabsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!transformRef.current || mediaMode !== "photos") return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = 2.4;
    const targetX = (rect.width / 2 - x) * (scale - 1);
    const targetY = (rect.height / 2 - y) * (scale - 1);

    transformRef.current.setTransform(targetX, targetY, scale, 0);
  };

  const handleMouseLeave = () => {
    if (transformRef.current && mediaMode === "photos") {
      transformRef.current.resetTransform(220);
    }
  };

  const handleSelectImage = (idx: number) => {
    setActiveImg(idx);
    transformRef.current?.resetTransform(0);
  };

  const { data: product, isLoading } = useProduct(slug as string);
  const { data: relatedData } = useProducts({
    category: product?.category?.slug,
    limit: 5,
  });
  const { addItem, removeItem, cart } = useCart();
  const markdownComponents = useMarkdownComponents();

  const formatNumber = useCallback(
    (val: number | string | null | undefined) => {
      if (val === null || val === undefined) return "";
      return locale === "bn" ? toBengaliNumber(val) : val.toString();
    },
    [locale],
  );

  useEffect(() => {
    setQty(1);
    setActiveImg(0);
    setActiveTab("specs");
    setMediaMode("photos");
  }, [slug]);

  const extras = (product ?? {}) as unknown as ProductExtras;

  const images = useMemo(
    () => (extras.images ?? []).map(getAssetUrl),
    [extras.images],
  );

  const videoLinks = useMemo(
    () => (extras.videoLinks ?? []).filter((l) => l && l.trim() !== ""),
    [extras.videoLinks],
  );

  const pricing = useMemo(() => {
    const base = Number(extras.price || 0);
    const discounted = Number(extras.discountPrice || extras.price || 0);
    const discount = Math.max(base - discounted, 0);
    const percent = base > 0 ? Math.round((discount / base) * 100) : 0;
    return { base, discounted, discount, percent };
  }, [extras.price, extras.discountPrice]);

  const relatedProducts = useMemo(
    () =>
      relatedData?.products
        ?.filter((p: any) => p.id !== product?.id)
        .slice(0, 4) ?? [],
    [relatedData?.products, product?.id],
  );

  const isInCart = useMemo(
    () => cart.some((i: { id: string }) => i.id === product?.id),
    [cart, product?.id],
  );

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    if (isInCart) {
      removeItem(product.id);
      return;
    }
    addItem(product, qty);
  }, [product, isInCart, qty, addItem, removeItem]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    router.push(`/checkout?buyNow=${product.slug}&qty=${qty}`);
  }, [product, qty, router]);

  // Construct Alibaba-style Key Attributes List purely from specifications
  const keyAttributes = useMemo(() => {
    const list: { key: string; value: string }[] = [];

    // Parse specifications JSON (array or key-value object)
    if (extras.specifications) {
      if (Array.isArray(extras.specifications)) {
        extras.specifications.forEach((item: any) => {
          if (typeof item === "object" && item?.key && item?.value) {
            list.push({
              key: String(item.key).trim(),
              value: String(item.value).trim(),
            });
          } else if (typeof item === "string") {
            const parts = item.split(":");
            if (parts.length > 1) {
              list.push({
                key: parts[0].trim(),
                value: parts.slice(1).join(":").trim(),
              });
            } else {
              list.push({ key: "Feature", value: item });
            }
          }
        });
      } else if (typeof extras.specifications === "object") {
        Object.entries(extras.specifications).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") {
            list.push({ key: k, value: String(v) });
          }
        });
      }
    }

    return list;
  }, [extras.specifications]);

  // Construct Packaging & Delivery Data
  const packagingInfo = useMemo(() => {
    const pkg = extras.packagingDelivery || {};
    return {
      packaging: pkg.packaging || t("defaultPackaging"),
      boxDimensions: pkg.dimensions || "21.5 x 15.0 x 6.2 cm",
      grossWeight: pkg.weight || "0.480 kg",
      couriers: pkg.couriers || t("courierPartners"),
    };
  }, [extras.packagingDelivery, t]);

  const whatsappLink = useMemo(() => {
    if (!product) return "#";
    const msg = encodeURIComponent(
      t("whatsappMessage", { title: product.title }),
    );
    return `https://wa.me/8801819000000?text=${msg}`;
  }, [product, t]);

  if (isLoading) return <ProductDetailsSkeleton />;

  if (!product) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: tokens.bgCanvas,
          p: 3,
          textAlign: "center",
        }}
      >
        <Inventory2OutlinedIcon
          sx={{ fontSize: 64, color: tokens.textMuted, mb: 2 }}
        />
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            color: tokens.textPrimary,
            mb: 1,
          }}
        >
          {t("detailsNotFoundTitle")}
        </Typography>
        <Typography sx={{ fontSize: 14, color: tokens.textSecondary, mb: 3 }}>
          {t("detailsNotFoundDesc")}
        </Typography>
        <Button variant="primary" onClick={() => router.push("/products")}>
          {t("detailsViewAll")}
        </Button>
      </Box>
    );
  }

  const reviewsCount = extras.reviewsCount ?? 0;
  const soldCount = extras.soldCount || 360;

  const tabs: { key: TabKey; label: string }[] = [
    { key: "specs", label: t("tabKeyAttributes") },
    { key: "desc", label: t("tabDescription") },
    { key: "packaging", label: t("tabPackaging") },
    ...(videoLinks.length > 0
      ? [
          {
            key: "video" as TabKey,
            label: t("tabVideo", { count: formatNumber(videoLinks.length) }),
          },
        ]
      : []),
    {
      key: "reviews",
      label: t("tabCustomerReviews", { count: formatNumber(reviewsCount) }),
    },
  ];

  return (
    <Box sx={{ bgcolor: tokens.bgCanvas, minHeight: "100vh" }}>
      <SectionContainer sx={{ py: { xs: 2.5, md: 4 } }}>
        {/* Breadcrumb Navigation */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2.5,
            flexWrap: "wrap",
            fontSize: 13,
            color: tokens.textMuted,
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: tokens.textSecondary,
              fontWeight: 500,
            }}
          >
            {t("home")}
          </Link>
          <Box component="span">/</Box>
          {product.category?.name && (
            <>
              <Link
                href={`/products?category=${product.category.slug || ""}`}
                style={{
                  textDecoration: "none",
                  color: tokens.textSecondary,
                  fontWeight: 500,
                }}
              >
                {product.category.name}
              </Link>
              <Box component="span">/</Box>
            </>
          )}
          <Typography
            component="span"
            noWrap
            sx={{
              fontSize: 13,
              color: tokens.textPrimary,
              fontWeight: 600,
              maxWidth: { xs: 220, sm: 400 },
            }}
          >
            {product.title}
          </Typography>
        </Box>

        {/* ========================================================================= */}
        {/* TOP MAIN GRID: Left (Gallery + Center Info) & Right (Sticky Alibaba Buy Box) */}
        {/* ========================================================================= */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.15fr 1fr" },
            gap: { xs: 3, lg: 3.5 },
            alignItems: "start",
            mb: 4,
          }}
        >
          {/* Main Left Section: Gallery Card */}
          <Box
            sx={{
              bgcolor: tokens.bgPanel,
              border: "none",
              borderRadius: `${tokens.radiusXl}px`,
              boxShadow: "none",
              p: { xs: 2, sm: 3 },
            }}
          >
            {/* 1. Left Gallery Column (Vertical Thumbnails + Main View) */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  flexDirection: { xs: "column-reverse", sm: "row" },
                }}
              >
                {/* Vertical Thumbnails on Desktop / Tablet */}
                {images.length > 1 && mediaMode === "photos" && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "row", sm: "column" },
                      gap: 1.25,
                      overflowY: { sm: "auto" },
                      overflowX: { xs: "auto", sm: "hidden" },
                      maxHeight: { sm: 400 },
                      pb: { xs: 1, sm: 0 },
                      "&::-webkit-scrollbar": { width: 4, height: 4 },
                      "&::-webkit-scrollbar-thumb": {
                        bgcolor: tokens.borderDefault,
                        borderRadius: 2,
                      },
                    }}
                  >
                    {images.map((img, idx) => (
                      <Box
                        key={idx}
                        component="button"
                        type="button"
                        onClick={() => handleSelectImage(idx)}
                        onMouseEnter={() => handleSelectImage(idx)}
                        sx={{
                          position: "relative",
                          width: { xs: 60, sm: 64 },
                          height: { xs: 60, sm: 64 },
                          flexShrink: 0,
                          borderRadius: "10px",
                          overflow: "hidden",
                          border: "2px solid",
                          borderColor:
                            activeImg === idx
                              ? tokens.primary
                              : tokens.borderDefault,
                          bgcolor: tokens.bgCanvas,
                          p: 0,
                          cursor: "pointer",
                          transition: "border-color 150ms",
                          "&:hover": { borderColor: tokens.primaryHover },
                        }}
                      >
                        <NextImage
                          src={img}
                          alt=""
                          fill
                          sizes="64px"
                          style={{ objectFit: "contain", padding: 4 }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Main Large Image / Video Player with Hover Zoom */}
                <Box
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  sx={{
                    position: "relative",
                    flex: 1,
                    aspectRatio: "1 / 1",
                    borderRadius: "14px",
                    overflow: "hidden",
                    bgcolor: tokens.bgCanvas,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {mediaMode === "video" && videoLinks.length > 0 ? (
                    <Box
                      component="iframe"
                      src={toVideoEmbedUrl(videoLinks[0])}
                      title="Product Video"
                      allowFullScreen
                      sx={{ width: "100%", height: "100%", border: 0 }}
                    />
                  ) : images[activeImg] ? (
                    <>
                      <TransformWrapper
                        ref={transformRef}
                        initialScale={1}
                        minScale={1}
                        maxScale={4}
                        centerOnInit
                        disabled={mediaMode !== "photos"}
                        wheel={{ disabled: false, step: 0.15 }}
                        panning={{ disabled: false }}
                      >
                        <TransformComponent
                          wrapperStyle={{
                            width: "100%",
                            height: "100%",
                            cursor: "zoom-in",
                            overflow: "hidden",
                          }}
                          contentStyle={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <NextImage
                              src={images[activeImg]}
                              alt={product.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 560px"
                              style={{
                                objectFit: "contain",
                                padding: 12,
                                pointerEvents: "none",
                              }}
                              priority
                            />
                          </Box>
                        </TransformComponent>
                      </TransformWrapper>

                      {/* Zoom hint badge */}
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 12,
                          right: 12,
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          px: 1,
                          py: 0.35,
                          borderRadius: "6px",
                          bgcolor: "rgba(0,0,0,0.55)",
                          color: "#fff",
                          fontSize: 11,
                          fontWeight: 600,
                          pointerEvents: "none",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        <ZoomInIcon sx={{ fontSize: 14 }} />
                        <span>
                          {locale === "bn"
                            ? "জুম করতে হোভার করুন"
                            : "Hover to zoom"}
                        </span>
                      </Box>
                    </>
                  ) : (
                    <Inventory2OutlinedIcon
                      sx={{ fontSize: 72, color: tokens.borderDefault }}
                    />
                  )}

                  {/* Sale Discount Badge */}
                  {pricing.percent > 0 && mediaMode === "photos" && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 2,
                      }}
                    >
                      <Badge
                        variant="sale"
                        label={t("offPercent", {
                          percent: formatNumber(pricing.percent),
                        })}
                      />
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Photos / Video Switcher Pills (Alibaba style) */}
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5 }}>
                <Button
                  size="small"
                  variant={mediaMode === "photos" ? "primary" : "outline"}
                  onClick={() => setMediaMode("photos")}
                  startIcon={<PhotoLibraryOutlinedIcon sx={{ fontSize: 16 }} />}
                  sx={{ borderRadius: "20px", px: 2, fontSize: 12 }}
                >
                  {t("photos")}
                </Button>
                {videoLinks.length > 0 && (
                  <Button
                    size="small"
                    variant={mediaMode === "video" ? "primary" : "outline"}
                    onClick={() => setMediaMode("video")}
                    startIcon={<PlayArrowIcon sx={{ fontSize: 16 }} />}
                    sx={{ borderRadius: "20px", px: 2, fontSize: 12 }}
                  >
                    {t("video")}
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

          {/* ========================================================================= */}
          {/* 2. RIGHT COLUMN: Flagship Product Info & Buy Box Card                     */}
          {/* ========================================================================= */}
          <Box
            sx={{
              position: { xs: "static", lg: "sticky" },
              top: 84,
              bgcolor: tokens.bgPanel,
              border: "none",
              borderRadius: `${tokens.radiusXl}px`,
              p: { xs: 2.5, sm: 3.5 },
              display: "flex",
              flexDirection: "column",
              gap: 2.25,
              boxShadow: "none",
            }}
          >
            {/* Top Row: Category & Stock Status */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              {product.category?.name ? (
                <Link
                  href={`/products?category=${product.category.slug || ""}`}
                  style={{
                    textDecoration: "none",
                    fontSize: 12,
                    fontWeight: 700,
                    color: tokens.primary,
                    letterSpacing: "0.03em",
                    textTransform: "uppercase",
                  }}
                >
                  {product.category.name}
                </Link>
              ) : (
                <Box />
              )}
              <Badge
                variant={product.inStock ? "success" : "destructive"}
                label={
                  product.inStock ? tCommon("inStock") : tCommon("outOfStock")
                }
              />
            </Box>

            {/* Product Title */}
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.45rem", sm: "1.75rem" },
                fontWeight: 800,
                color: tokens.textPrimary,
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
              }}
            >
              {product.title}
            </Typography>

            {/* Rating & Delivered Row */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
              }}
            >
              <Box
                onClick={handleJumpToReviews}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  cursor: "pointer",
                  "&:hover": { opacity: 0.8 },
                }}
              >
                <StarIcon
                  sx={{
                    fontSize: 18,
                    color:
                      reviewsCount > 0 ? tokens.warning : tokens.borderDefault,
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: tokens.textPrimary,
                  }}
                >
                  {formatNumber(
                    reviewsCount > 0
                      ? Number(product.rating || 0).toFixed(1)
                      : "0.0",
                  )}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: tokens.primary,
                    textDecoration: "underline",
                    fontWeight: 600,
                  }}
                >
                  {reviewsCount > 0
                    ? t("reviewsCount", { count: formatNumber(reviewsCount) })
                    : locale === "bn"
                      ? "(কোনো রিভিউ নেই)"
                      : "(No reviews yet)"}
                </Typography>
              </Box>

              {soldCount ? (
                <>
                  <Box component="span" sx={{ color: tokens.borderDefault }}>
                    •
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: tokens.textSecondary,
                      fontWeight: 500,
                    }}
                  >
                    {t("deliveredCount", { count: formatNumber(soldCount) })}
                  </Typography>
                </>
              ) : null}
            </Box>

            {/* Single Clean Price Surface */}
            <Box
              sx={{
                p: 2,
                bgcolor: tokens.bgCanvas,
                borderRadius: "14px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 1.5,
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: "1.85rem", sm: "2.25rem" },
                    fontWeight: 900,
                    color: tokens.primary,
                    lineHeight: 1,
                  }}
                >
                  {formatPrice(pricing.discounted, locale)}
                </Typography>
                {pricing.discount > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        color: tokens.textMuted,
                        textDecoration: "line-through",
                      }}
                    >
                      {formatPrice(pricing.base, locale)}
                    </Typography>
                    <Badge
                      variant="default"
                      label={t("saveAmount", {
                        amount: formatNumber(pricing.discount.toLocaleString()),
                      })}
                    />
                  </>
                )}
              </Box>
              {qty > 1 && (
                <Typography
                  sx={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: tokens.textPrimary,
                    mt: 0.85,
                  }}
                >
                  {locale === "bn"
                    ? `মোট (${formatNumber(qty)}টি): ${formatPrice(pricing.discounted * qty, locale)}`
                    : `Subtotal (${qty} items): ${formatPrice(pricing.discounted * qty, locale)}`}
                </Typography>
              )}
            </Box>

            {/* Quick Key Attributes / Product Highlights */}
            {keyAttributes.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: tokens.textMuted,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {locale === "bn" ? "মূল বৈশিষ্ট্য" : "Key Specifications"}
                  </Typography>
                  {keyAttributes.length > 6 && (
                    <Box
                      component="button"
                      type="button"
                      onClick={() => {
                        setActiveTab("specs");
                        tabsSectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                      sx={{
                        border: 0,
                        background: "none",
                        p: 0,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 700,
                        color: tokens.primary,
                      }}
                    >
                      {locale === "bn" ? "সব দেখুন →" : "All specs →"}
                    </Box>
                  )}
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1.25,
                  }}
                >
                  {keyAttributes.slice(0, 6).map((attr, i) => (
                    <Box
                      key={`${attr.key}-${i}`}
                      sx={{
                        p: 1.25,
                        borderRadius: "12px",
                        bgcolor: tokens.bgCanvas,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          color: tokens.textMuted,
                          fontWeight: 600,
                          mb: 0.25,
                        }}
                      >
                        {attr.key}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 12.5,
                          color: tokens.textPrimary,
                          fontWeight: 700,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {attr.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : product.tags && product.tags.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {product.tags.slice(0, 6).map((tag: string, i: number) => (
                  <Box
                    key={`${tag}-${i}`}
                    sx={{
                      px: 1.5,
                      py: 0.6,
                      borderRadius: "9999px",
                      bgcolor: tokens.bgCanvas,
                      fontSize: 12,
                      fontWeight: 600,
                      color: tokens.textPrimary,
                    }}
                  >
                    {tag}
                  </Box>
                ))}
              </Box>
            ) : null}

            {/* Quantity Stepper + Add to Cart Row */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1.5, pt: 0.5 }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: `${tokens.radiusPill}px`,
                  bgcolor: tokens.bgCanvas,
                  overflow: "hidden",
                  flexShrink: 0,
                  height: 46,
                }}
              >
                <Box
                  component="button"
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  sx={{ ...stepperBtnSx, height: 46, width: 40 }}
                >
                  −
                </Box>
                <Box
                  sx={{
                    minWidth: 40,
                    height: 46,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 700,
                    color: tokens.textPrimary,
                  }}
                >
                  {formatNumber(qty)}
                </Box>
                <Box
                  component="button"
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  sx={{ ...stepperBtnSx, height: 46, width: 40 }}
                >
                  +
                </Box>
              </Box>

              <Button
                fullWidth
                size="large"
                variant="outline"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                startIcon={<ShoppingCartIcon sx={{ fontSize: 18 }} />}
                sx={{ height: 46, fontSize: 14, fontWeight: 700 }}
              >
                {isInCart ? t("inCartAlready") : t("addToCart")}
              </Button>
            </Box>

            {/* Primary Order Now + WhatsApp */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              <Button
                fullWidth
                size="large"
                variant="primary"
                onClick={handleBuyNow}
                disabled={!product.inStock}
                startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />}
                sx={{
                  py: 1.5,
                  fontSize: 15,
                  fontWeight: 800,
                  boxShadow: "none",
                }}
              >
                {t("orderNow")}
              </Button>

              <Button
                fullWidth
                size="large"
                component="a"
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={
                  <WhatsAppIcon sx={{ fontSize: 20, color: "#fff" }} />
                }
                sx={{
                  py: 1.25,
                  fontSize: 14,
                  fontWeight: 700,
                  bgcolor: "#25D366",
                  color: "#fff",
                  "&:hover": { bgcolor: "#20BA5A" },
                }}
              >
                {t("chatNow")}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* ========================================================================= */}
        {/* BELOW THE FOLD: Tabs (Key Attributes Striped Table, Description, Reviews) */}
        {/* ========================================================================= */}
        <Box
          ref={tabsSectionRef}
          sx={{
            bgcolor: tokens.bgPanel,
            border: "none",
            borderRadius: `${tokens.radiusXl}px`,
            boxShadow: "none",
            overflow: "hidden",
            mb: { xs: 5, md: 7 },
          }}
        >
          {/* Tab Headers */}
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              borderBottom: "1px solid",
              borderColor: tokens.borderSubtle,
              bgcolor: tokens.bgPanel,
              "&::-webkit-scrollbar": { height: 3 },
              "&::-webkit-scrollbar-thumb": { bgcolor: tokens.borderDefault },
            }}
          >
            {tabs.map((tab) => (
              <Box
                key={tab.key}
                component="button"
                type="button"
                onClick={() => setActiveTab(tab.key)}
                sx={getTabSx(activeTab === tab.key)}
              >
                {tab.label}
              </Box>
            ))}
          </Box>

          {/* Tab Content Panes */}
          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            {/* 1. Key Attributes & Specifications Striped Table (Alibaba Style) */}
            {activeTab === "specs" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: tokens.textPrimary,
                  }}
                >
                  {t("keyAttributes")}
                </Typography>

                {keyAttributes.length > 0 ? (
                  <Box
                    sx={{
                      border: "1px solid",
                      borderColor: tokens.borderDefault,
                      borderRadius: "12px",
                      overflow: "hidden",
                    }}
                  >
                    <Table sx={{ minWidth: 320 }}>
                      <TableBody>
                        {/* Render pairs of 2 attributes per row on desktop (4 cells: label, val, label, val) */}
                        {Array.from({
                          length: Math.ceil(keyAttributes.length / 2),
                        }).map((_, rowIndex) => {
                          const first = keyAttributes[rowIndex * 2];
                          const second = keyAttributes[rowIndex * 2 + 1];
                          const isEvenRow = rowIndex % 2 === 0;

                          return (
                            <TableRow
                              key={rowIndex}
                              sx={{
                                bgcolor: isEvenRow
                                  ? tokens.bgCanvas
                                  : tokens.bgPanel,
                                "&:last-child td": { borderBottom: 0 },
                              }}
                            >
                              {/* Pair 1 Label */}
                              <TableCell
                                sx={{
                                  width: { xs: "35%", md: "20%" },
                                  py: 1.5,
                                  px: 2,
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: tokens.textSecondary,
                                  bgcolor: isEvenRow
                                    ? "action.hover"
                                    : tokens.bgCanvas,
                                  borderRight: "1px solid",
                                  borderColor: tokens.borderSubtle,
                                  textTransform: "capitalize",
                                }}
                              >
                                {first.key}
                              </TableCell>
                              {/* Pair 1 Value */}
                              <TableCell
                                sx={{
                                  width: { xs: "65%", md: "30%" },
                                  py: 1.5,
                                  px: 2,
                                  fontSize: 13.5,
                                  fontWeight: 700,
                                  color: tokens.textPrimary,
                                  borderRight: { md: "1px solid" },
                                  borderColor: tokens.borderSubtle,
                                }}
                              >
                                {first.value}
                              </TableCell>

                              {/* Pair 2 Label (Desktop) */}
                              {second ? (
                                <>
                                  <TableCell
                                    sx={{
                                      display: { xs: "none", md: "table-cell" },
                                      width: "20%",
                                      py: 1.5,
                                      px: 2,
                                      fontSize: 13,
                                      fontWeight: 600,
                                      color: tokens.textSecondary,
                                      bgcolor: isEvenRow
                                        ? "action.hover"
                                        : tokens.bgCanvas,
                                      borderRight: "1px solid",
                                      borderColor: tokens.borderSubtle,
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {second.key}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      display: { xs: "none", md: "table-cell" },
                                      width: "30%",
                                      py: 1.5,
                                      px: 2,
                                      fontSize: 13.5,
                                      fontWeight: 700,
                                      color: tokens.textPrimary,
                                    }}
                                  >
                                    {second.value}
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell
                                    sx={{
                                      display: { xs: "none", md: "table-cell" },
                                      width: "20%",
                                    }}
                                  />
                                  <TableCell
                                    sx={{
                                      display: { xs: "none", md: "table-cell" },
                                      width: "30%",
                                    }}
                                  />
                                </>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 4,
                      textAlign: "center",
                      borderRadius: "12px",
                      bgcolor: tokens.bgCanvas,
                      border: "1px dashed",
                      borderColor: tokens.borderDefault,
                    }}
                  >
                    <Typography
                      sx={{ color: tokens.textSecondary, fontSize: 14 }}
                    >
                      {locale === "bn"
                        ? "এই পণ্যের নির্দিষ্ট টেকনিক্যাল স্পেসিফিকেশন শীঘ্রই যুক্ত করা হবে।"
                        : "Specific technical attributes for this gadget will be added soon."}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* 2. Detailed Markdown Description */}
            {activeTab === "desc" && (
              <Box
                sx={{
                  color: tokens.textPrimary,
                  lineHeight: 1.7,
                  fontSize: 14.5,
                }}
              >
                {product.markdown_description ? (
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {product.markdown_description}
                  </Markdown>
                ) : (
                  <Typography sx={{ color: tokens.textMuted, fontSize: 14 }}>
                    {t("noDescAvailable")}
                  </Typography>
                )}
              </Box>
            )}

            {/* 3. Packaging & Delivery Details */}
            {activeTab === "packaging" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: tokens.textPrimary,
                  }}
                >
                  {t("packagingDelivery")}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      bgcolor: tokens.bgCanvas,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: tokens.textPrimary,
                        mb: 1,
                      }}
                    >
                      📦 {t("packagingDetails")}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13.5,
                        color: tokens.textSecondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {packagingInfo.packaging}
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: 12.5, color: tokens.textMuted }}
                      >
                        <strong>Dimensions:</strong>{" "}
                        {packagingInfo.boxDimensions}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 12.5, color: tokens.textMuted }}
                      >
                        <strong>Gross Weight:</strong>{" "}
                        {packagingInfo.grossWeight}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: "14px",
                      bgcolor: tokens.bgCanvas,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: tokens.textPrimary,
                        mb: 1,
                      }}
                    >
                      🚚 {t("deliveryTimeline")}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13.5,
                        color: tokens.textSecondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {packagingInfo.couriers}
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.75,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12.5,
                          color: tokens.textPrimary,
                          fontWeight: 600,
                        }}
                      >
                        • {t("deliveryDhaka")}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: 12.5,
                          color: tokens.textPrimary,
                          fontWeight: 600,
                        }}
                      >
                        • {t("deliveryOutside")}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}

            {/* 4. Video Embeds */}
            {activeTab === "video" && videoLinks.length > 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                  gap: 3,
                }}
              >
                {videoLinks.map((link, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      position: "relative",
                      aspectRatio: "16 / 9",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: tokens.borderDefault,
                    }}
                  >
                    <Box
                      component="iframe"
                      src={toVideoEmbedUrl(link)}
                      title={`Product Video ${idx + 1}`}
                      allowFullScreen
                      sx={{ width: "100%", height: "100%", border: 0 }}
                    />
                  </Box>
                ))}
              </Box>
            )}

            {/* 5. Interactive Reviews & Threaded Replies (Alibaba Style) */}
            {activeTab === "reviews" && (
              <ProductReviews
                productId={product.id}
                rating={product.rating}
                reviewsCount={reviewsCount}
              />
            )}
          </Box>
        </Box>

        {/* Related Gadgets Carousel */}
        {relatedProducts.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 18, md: 22 },
                  fontWeight: 800,
                  color: tokens.textPrimary,
                }}
              >
                {t("relatedGadgets")}
              </Typography>
              <Link
                href={`/products?category=${product.category?.slug || ""}`}
                style={{
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  color: tokens.primary,
                }}
              >
                {t("viewAllArrow")}
              </Link>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: { xs: 2, sm: 2.5 },
              }}
            >
              {relatedProducts.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Box>
          </Box>
        )}
      </SectionContainer>
    </Box>
  );
}
