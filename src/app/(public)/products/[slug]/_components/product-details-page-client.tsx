"use client";

import NextLink from "next/link";
import NextImage from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StarIcon from "@mui/icons-material/Star";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import { useProduct, useProducts } from "@/query-client/products";
import { useCart } from "@/hooks/useCart";
import { toVideoEmbedUrl } from "@/lib/video-links";
import { formatBnNumber } from "@/lib/utils";
import { useMarkdownComponents } from "@/components/common/MarkdownContent";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ProductCard } from "../../../_components/ProductCard";
import { getAssetUrl } from "@/lib/storage";
import { tokens } from "@/theme/theme";
import { useToast } from "@/context/toast-context";
import { ProductDetailsSkeleton } from "./ProductDetailsSkeleton";
import { ProductReviews } from "./ProductReviews";

const BN_FONT = "'Hind Siliguri', 'Inter', -apple-system, sans-serif";

type TabKey = "desc" | "video" | "reviews";

type ProductExtras = {
  price?: number;
  discountPrice?: number;
  images?: string[];
  videoLinks?: string[];
  reviewsCount?: number;
  soldCount?: number;
};

const TRUST_BADGES = [
  { Icon: VerifiedUserOutlinedIcon, title: "১০০% অরিজিনাল", subtitle: "জেনুইন ব্র্যান্ড গ্যারান্টি" },
  { Icon: LocalShippingOutlinedIcon, title: "সুপার ফাস্ট ডেলিভারি", subtitle: "সারাদেশে হোম ডেলিভারি" },
  { Icon: ReplayIcon, title: "সহজ রিপ্লেসমেন্ট", subtitle: "৭ দিনের ওয়ারেন্টি" },
  { Icon: PaymentsOutlinedIcon, title: "ক্যাশ অন ডেলিভারি", subtitle: "পণ্য দেখে পেমেন্ট করুন" },
] as const;

const getTabSx = (active: boolean) => ({
  px: { xs: 2.5, md: 4 },
  py: 2,
  fontSize: 14,
  fontWeight: 700,
  color: active ? tokens.primary : tokens.textSecondary,
  bgcolor: active ? tokens.bgPanel : "transparent",
  border: 0,
  borderBottom: active ? `2px solid ${tokens.primary}` : "2px solid transparent",
  cursor: "pointer",
  fontFamily: BN_FONT,
  transition: "color 150ms",
});

const stepperBtnSx = {
  width: 38,
  height: 38,
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
  const toast = useToast();
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>("desc");

  const { data: product, isLoading } = useProduct(slug as string);
  const { data: relatedData } = useProducts({ category: product?.category?.slug, limit: 5 });
  const { addItem, cart } = useCart();
  const markdownComponents = useMarkdownComponents();

  useEffect(() => {
    setQty(1);
    setActiveImg(0);
    setActiveTab("desc");
  }, [slug]);

  const extras = (product ?? {}) as unknown as ProductExtras;

  const images = useMemo(() => (extras.images ?? []).map(getAssetUrl), [extras.images]);

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
    () => relatedData?.products?.filter((p: any) => p.id !== product?.id).slice(0, 4) ?? [],
    [relatedData?.products, product?.id],
  );

  const isInCart = useMemo(
    () => cart.some((i: { id: string }) => i.id === product?.id),
    [cart, product?.id],
  );

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem(product, qty);
    toast.success("পণ্যটি কার্টে যুক্ত করা হয়েছে");
  }, [product, qty, addItem, toast]);

  const handleBuyNow = useCallback(() => {
    if (!product) return;
    router.push(`/checkout?buyNow=${product.slug}&qty=${qty}`);
  }, [product, qty, router]);

  if (isLoading) return <ProductDetailsSkeleton />;

  if (!product) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", bgcolor: tokens.bgCanvas, p: 3, textAlign: "center" }}>
        <Inventory2OutlinedIcon sx={{ fontSize: 64, color: tokens.textMuted, mb: 2 }} />
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: tokens.textPrimary, mb: 1, fontFamily: BN_FONT }}>
          দুঃখিত, পণ্যটি পাওয়া যায়নি
        </Typography>
        <Typography sx={{ fontSize: 14, color: tokens.textSecondary, mb: 3, fontFamily: BN_FONT }}>
          হয়তো পণ্যটি স্টক আউট হয়েছে বা লিংকটি পরিবর্তিত হয়েছে।
        </Typography>
        <Button variant="primary" onClick={() => router.push("/products")}>
          সব পণ্য দেখুন
        </Button>
      </Box>
    );
  }

  const reviewsCount = extras.reviewsCount || 12;
  const soldCount = extras.soldCount;

  const tabs: { key: TabKey; label: string }[] = [
    { key: "desc", label: "পণ্যের বিবরণ ও স্পেসিফিকেশন" },
    ...(videoLinks.length > 0
      ? [{ key: "video" as TabKey, label: `ভিডিও রিভিউ (${videoLinks.length})` }]
      : []),
    { key: "reviews", label: `কাস্টমার রিভিউ (${formatBnNumber(reviewsCount)})` },
  ];

  return (
    <Box sx={{ bgcolor: tokens.bgCanvas, minHeight: "100vh", py: { xs: 2.5, md: 5 }, fontFamily: BN_FONT }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, flexWrap: "wrap", fontSize: 13, color: tokens.textMuted }}>
          <NextLink href="/" style={{ textDecoration: "none", color: tokens.textSecondary, fontWeight: 500 }}>
            হোম
          </NextLink>
          <Box component="span">/</Box>
          {product.category?.name && (
            <>
              <NextLink
                href={`/products?category=${product.category.slug || ""}`}
                style={{ textDecoration: "none", color: tokens.textSecondary, fontWeight: 500 }}
              >
                {product.category.name}
              </NextLink>
              <Box component="span">/</Box>
            </>
          )}
          <Typography component="span" noWrap sx={{ fontSize: 13, color: tokens.textPrimary, fontWeight: 600, maxWidth: 300 }}>
            {product.title}
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: { xs: 3, lg: 5 }, mb: { xs: 5, md: 7 }, alignItems: "start" }}>
          <Box sx={{ bgcolor: tokens.bgPanel, border: "1px solid", borderColor: tokens.borderDefault, borderRadius: "20px", p: { xs: 2, sm: 3 } }}>
            <Box sx={{ position: "relative", width: "100%", aspectRatio: "1 / 1", borderRadius: "14px", overflow: "hidden", bgcolor: tokens.bgPanel, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {images[activeImg] ? (
                <NextImage
                  src={images[activeImg]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 550px"
                  style={{ objectFit: "contain", padding: 8 }}
                  priority
                />
              ) : (
                <Inventory2OutlinedIcon sx={{ fontSize: 72, color: tokens.borderDefault }} />
              )}

              {pricing.percent > 0 && (
                <Box sx={{ position: "absolute", top: 14, left: 14 }}>
                  <Badge variant="sale" label={`-${pricing.percent}% ছাড়`} />
                </Box>
              )}

              {videoLinks.length > 0 && (
                <Box sx={{ position: "absolute", bottom: 14, right: 14 }}>
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => setActiveTab("video")}
                    startIcon={<PlayArrowIcon sx={{ fontSize: 16 }} />}
                  >
                    ভিডিও রিভিউ
                  </Button>
                </Box>
              )}
            </Box>

            {images.length > 1 && (
              <Box sx={{ display: "flex", gap: 1.5, mt: 2.5, overflowX: "auto", pb: 0.5, "&::-webkit-scrollbar": { height: 4 }, "&::-webkit-scrollbar-thumb": { bgcolor: tokens.borderDefault, borderRadius: 2 } }}>
                {images.map((img, idx) => (
                  <Box
                    key={idx}
                    component="button"
                    type="button"
                    onClick={() => setActiveImg(idx)}
                    sx={{
                      position: "relative",
                      width: 68,
                      height: 68,
                      flexShrink: 0,
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: "2px solid",
                      borderColor: activeImg === idx ? tokens.primary : tokens.borderDefault,
                      bgcolor: tokens.bgPanel,
                      p: 0,
                      cursor: "pointer",
                      transition: "border-color 150ms",
                      "&:hover": { borderColor: tokens.primaryHover },
                    }}
                  >
                    <NextImage src={img} alt="" fill sizes="68px" style={{ objectFit: "contain", padding: 4 }} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ bgcolor: tokens.bgPanel, border: "1px solid", borderColor: tokens.borderDefault, borderRadius: "20px", p: { xs: 2.5, sm: 3.5 }, display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
              {product.category?.name ? <Badge variant="default" label={product.category.name} /> : <Box />}
              <Badge variant={product.inStock ? "success" : "destructive"} label={product.inStock ? "ইন স্টক" : "আউট অব স্টক"} />
            </Box>

            <Typography component="h1" sx={{ fontSize: { xs: "1.45rem", md: "1.95rem" }, fontWeight: 800, color: tokens.textPrimary, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
              {product.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", borderBottom: "1px solid", borderColor: tokens.borderSubtle, pb: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <StarIcon sx={{ fontSize: 18, color: tokens.warning }} />
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: tokens.textPrimary }}>
                  {Number(product.rating || 5).toFixed(1)}
                </Typography>
                <Typography sx={{ fontSize: 13, color: tokens.textMuted }}>
                  ({formatBnNumber(reviewsCount)}+ রিভিউ)
                </Typography>
              </Box>
              {soldCount ? (
                <Typography sx={{ fontSize: 13, color: tokens.textSecondary, fontWeight: 500 }}>
                  🔥 <Box component="span" sx={{ fontWeight: 700, color: tokens.textPrimary }}>{formatBnNumber(soldCount)}+</Box> সফলভাবে ডেলিভারি হয়েছে
                </Typography>
              ) : null}
            </Box>

            <Box sx={{ bgcolor: tokens.bgCanvas, border: "1px solid", borderColor: tokens.borderSubtle, borderRadius: "14px", p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, flexWrap: "wrap" }}>
                <Typography sx={{ fontSize: { xs: "1.85rem", md: "2.25rem" }, fontWeight: 900, color: tokens.primary, lineHeight: 1 }}>
                  ৳{pricing.discounted.toLocaleString()}
                </Typography>
                {pricing.discount > 0 && (
                  <>
                    <Typography sx={{ fontSize: "1.1rem", fontWeight: 500, color: tokens.textMuted, textDecoration: "line-through" }}>
                      ৳{pricing.base.toLocaleString()}
                    </Typography>
                    <Box sx={{ ml: "auto" }}>
                      <Badge variant="default" label={`৳${pricing.discount.toLocaleString()} সাশ্রয়`} />
                    </Box>
                  </>
                )}
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: tokens.textPrimary }}>
                পরিমাণ নির্বাচন করুন:
              </Typography>
              <Box sx={{ display: "inline-flex", alignItems: "center", border: "1px solid", borderColor: tokens.borderDefault, borderRadius: "10px", bgcolor: tokens.bgCanvas, overflow: "hidden" }}>
                <Box component="button" type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} sx={stepperBtnSx}>
                  −
                </Box>
                <Box sx={{ minWidth: 44, height: 38, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: tokens.textPrimary, borderLeft: "1px solid", borderRight: "1px solid", borderColor: tokens.borderSubtle, bgcolor: tokens.bgPanel }}>
                  {formatBnNumber(qty)}
                </Box>
                <Box component="button" type="button" onClick={() => setQty((q) => q + 1)} sx={stepperBtnSx}>
                  +
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, pt: 1 }}>
              <Button fullWidth size="large" variant="primary" onClick={handleBuyNow} disabled={!product.inStock} startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />}>
                অর্ডার করুন
              </Button>
              <Button fullWidth size="large" variant="outline" onClick={handleAddToCart} disabled={!product.inStock} startIcon={<ShoppingCartIcon sx={{ fontSize: 18 }} />}>
                {isInCart ? "কার্টে আছে ✓" : "কার্টে যোগ করুন"}
              </Button>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5, pt: 1.5, borderTop: "1px solid", borderColor: tokens.borderSubtle }}>
              {TRUST_BADGES.map(({ Icon, title, subtitle }) => (
                <Box key={title} sx={{ display: "flex", alignItems: "center", gap: 1.25, p: 1.25, bgcolor: tokens.bgCanvas, borderRadius: "10px" }}>
                  <Icon sx={{ fontSize: 20, color: tokens.primary }} />
                  <Box>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: tokens.textPrimary, lineHeight: 1.2 }}>{title}</Typography>
                    <Typography sx={{ fontSize: 11, color: tokens.textSecondary }}>{subtitle}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box sx={{ bgcolor: tokens.bgPanel, border: "1px solid", borderColor: tokens.borderDefault, borderRadius: "20px", overflow: "hidden", mb: { xs: 5, md: 7 } }}>
          <Box sx={{ display: "flex", borderBottom: "1px solid", borderColor: tokens.borderDefault, bgcolor: tokens.bgCanvas }}>
            {tabs.map((tab) => (
              <Box key={tab.key} component="button" type="button" onClick={() => setActiveTab(tab.key)} sx={getTabSx(activeTab === tab.key)}>
                {tab.label}
              </Box>
            ))}
          </Box>

          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            {activeTab === "desc" && (
              <Box sx={{ color: tokens.textPrimary, lineHeight: 1.7, fontSize: 14.5 }}>
                {product.markdown_description ? (
                  <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {product.markdown_description}
                  </Markdown>
                ) : product.description ? (
                  <Typography sx={{ whiteSpace: "pre-line", fontSize: 14.5, color: tokens.textSecondary, lineHeight: 1.7 }}>
                    {product.description}
                  </Typography>
                ) : (
                  <Typography sx={{ color: tokens.textMuted, fontSize: 14 }}>
                    এই পণ্যের জন্য বিস্তারিত বিবরণ শীঘ্রই যোগ করা হবে।
                  </Typography>
                )}
              </Box>
            )}

            {activeTab === "video" && videoLinks.length > 0 && (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
                {videoLinks.map((link, idx) => (
                  <Box key={idx} sx={{ position: "relative", aspectRatio: "16 / 9", borderRadius: "14px", overflow: "hidden", border: "1px solid", borderColor: tokens.borderDefault }}>
                    <Box component="iframe" src={toVideoEmbedUrl(link)} title={`Product Video ${idx + 1}`} allowFullScreen sx={{ width: "100%", height: "100%", border: 0 }} />
                  </Box>
                ))}
              </Box>
            )}

            {activeTab === "reviews" && (
              <ProductReviews productId={product.id} rating={product.rating} reviewsCount={reviewsCount} />
            )}
          </Box>
        </Box>

        {relatedProducts.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 800, color: tokens.textPrimary }}>
                সম্পর্কিত গ্যাজেটসমূহ
              </Typography>
              <NextLink href={`/products?category=${product.category?.slug || ""}`} style={{ textDecoration: "none", fontSize: 13, fontWeight: 600, color: tokens.primary }}>
                সবগুলো দেখুন →
              </NextLink>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }, gap: { xs: 2, sm: 2.5 } }}>
              {relatedProducts.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}