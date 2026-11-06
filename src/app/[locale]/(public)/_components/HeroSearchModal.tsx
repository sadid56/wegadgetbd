"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

import { tokens } from "@/theme/theme";
import { IconButton } from "@/components/ui/icon-button";
import { InputBase } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useCart } from "@/hooks/useCart";
import { useProducts, useTopPicks } from "@/query-client/products";
import { formatPrice } from "@/lib/i18n-utils";
import { getAssetUrl } from "@/lib/storage";

interface HeroSearchModalProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const POPULAR_SEARCH_TAGS = [
  "Smart Watch",
  "Earbuds",
  "Ring Light",
  "Fabric Shaver",
  "Gaming Mouse",
  "Power Bank",
];

export function HeroSearchModal({
  open,
  onClose,
  initialQuery = "",
}: HeroSearchModalProps) {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { cart, addItem } = useCart();

  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query.trim(), 250);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const tagsScrollRef = useRef<HTMLDivElement>(null);

  // Sync initial query when opened & auto-focus
  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
      setSelectedIndex(-1);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open, initialQuery]);

  // Fetch trending products for default state
  const { data: topPicks = [], isLoading: isLoadingTopPicks } = useTopPicks(5);

  // Fetch search results when query is active
  const hasQuery = debouncedQuery.length > 0;
  const {
    data: searchData,
    isLoading: isSearching,
    isFetching,
  } = useProducts(
    hasQuery
      ? {
          search: debouncedQuery,
          limit: 6,
        }
      : undefined
  );

  const searchResults = searchData?.products ?? [];
  const totalResults = searchData?.total ?? 0;
  const isQueryLoading = hasQuery && (isSearching || isFetching);

  const activeItems = hasQuery ? searchResults : topPicks;

  // Reset selected index when active items change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  const handleNavigateToProduct = (slug: string) => {
    onClose();
    router.push(`/products/${slug}`);
  };

  const handleViewAllResults = () => {
    onClose();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push(`/products`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    const rawImg = item.image || item.images?.[0] || "";
    const imgUrl = rawImg ? getAssetUrl(rawImg) : "";
    const salePrice = Number(item.discountPrice || item.price);
    const origPrice = item.originalPrice
      ? Number(item.originalPrice)
      : item.discountPrice && Number(item.discountPrice) < Number(item.price)
      ? Number(item.price)
      : undefined;

    addItem({
      id: String(item.id),
      title: item.title,
      price: origPrice ? origPrice : salePrice,
      discountPrice: origPrice ? salePrice : undefined,
      images: imgUrl ? [imgUrl] : [],
      slug: item.slug,
    });
  };

  const isItemInCart = (id: string | number) =>
    cart.some((c) => String(c.id) === String(id));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (activeItems.length > 0) {
        setSelectedIndex((prev) => (prev < activeItems.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (activeItems.length > 0) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : activeItems.length - 1));
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && activeItems[selectedIndex]) {
        handleNavigateToProduct(activeItems[selectedIndex].slug);
      } else {
        handleViewAllResults();
      }
    }
  };

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (tagsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tagsScrollRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    }
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(checkScroll, 120);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleScrollTags = (direction: "left" | "right") => {
    if (tagsScrollRef.current) {
      tagsScrollRef.current.scrollBy({
        left: direction === "left" ? -180 : 180,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 320);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      disableRestoreFocus
      fullWidth
      maxWidth="sm"
      scroll="paper"
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          },
        },
        paper: {
          sx: {
            bgcolor: "#FFFFFF",
            color: "#0F172A",
            backgroundImage: "none",
            border: { xs: "none", sm: "1px solid #E2E8F0" },
            borderRadius: { xs: 0, sm: "24px" },
            boxShadow: {
              xs: "none",
              sm: "0 25px 50px -12px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.04)",
            },
            overflow: "hidden",
            m: { xs: 0, sm: 2 },
            maxWidth: { xs: "100%", sm: 620 },
            width: "100%",
            height: { xs: "100%", sm: "auto" },
            maxHeight: { xs: "100%", sm: "85vh" },
            display: "flex",
            flexDirection: "column",
          },
        },
      }}
    >
      {/* Top Search Input Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: { xs: "14px 14px 12px", sm: "16px 18px 14px" },
          borderBottom: "1px solid #F1F5F9",
          bgcolor: "#FFFFFF",
        }}
      >
        {/* Round Material Search Pill Bar */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            bgcolor: "#F8FAFC",
            border: "1.5px solid #E2E8F0",
            borderRadius: "9999px",
            px: 2,
            py: "8px",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            "&:focus-within": {
              borderColor: tokens.primary,
              bgcolor: "#FFFFFF",
              boxShadow: "0 0 0 3px rgba(0, 191, 166, 0.12)",
            },
          }}
        >
          <SearchRoundedIcon
            sx={{
              color: "#64748B",
              fontSize: 21,
              flexShrink: 0,
            }}
          />

          <InputBase
            variant="plain"
            inputRef={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("heroSearchPlaceholder")}
            fullWidth
            sx={{
              border: "none",
              bgcolor: "transparent",
              boxShadow: "none",
              color: "#0F172A",
              fontSize: 14.5,
              fontWeight: 500,
              minHeight: "auto",
              py: 0,
              "& input": {
                p: 0,
                border: "none",
                outline: "none",
                "&::placeholder": {
                  color: "#94A3B8",
                  opacity: 1,
                },
              },
            }}
          />

          {isQueryLoading && (
            <CircularProgress
              size={18}
              thickness={4.5}
              sx={{ color: tokens.primary, flexShrink: 0 }}
            />
          )}

          {query && !isQueryLoading && (
            <IconButton
              size="small"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              sx={{
                color: "#64748B",
                p: 0.3,
                "&:hover": {
                  color: "#0F172A",
                  bgcolor: "#E2E8F0",
                },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}

          {/* ESC Keyboard Pill */}
          <Box
            component="button"
            onClick={onClose}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              alignItems: "center",
              px: 0.8,
              py: 0.25,
              borderRadius: "6px",
              border: "1px solid #CBD5E1",
              bgcolor: "#FFFFFF",
              color: "#64748B",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.04em",
              cursor: "pointer",
              boxShadow: "0 1px 1px rgba(0,0,0,0.05)",
              transition: "all 0.15s ease",
              "&:hover": {
                borderColor: "#94A3B8",
                color: "#0F172A",
              },
            }}
          >
            ESC
          </Box>
        </Box>

        {/* Close (X) Icon Button */}
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            color: "#64748B",
            flexShrink: 0,
            transition: "all 0.15s ease",
            "&:hover": {
              color: "#0F172A",
              bgcolor: "#F1F5F9",
              borderColor: "#CBD5E1",
            },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Popular Searches Section */}
      <Box
        sx={{
          px: 2.25,
          pt: 1.75,
          pb: 1.25,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1.25 }}>
          <WhatshotRoundedIcon
            sx={{
              color: "#8B5CF6",
              fontSize: 18,
            }}
          />
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            {t("searchModalPopularSearches")}
          </Typography>
        </Box>

        {/* Tag pills with scroll buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, position: "relative" }}>
          {canScrollLeft && (
            <IconButton
              size="small"
              onClick={() => handleScrollTags("left")}
              aria-label="Scroll left"
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1px solid #E2E8F0",
                bgcolor: "#FFFFFF",
                color: "#64748B",
                flexShrink: 0,
                p: 0,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                "&:hover": {
                  bgcolor: "#F8FAFC",
                  color: "#0F172A",
                  borderColor: "#CBD5E1",
                },
              }}
            >
              <ArrowBackRoundedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}

          <Box
            ref={tagsScrollRef}
            onScroll={checkScroll}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              py: 0.25,
              flex: 1,
            }}
          >
            {POPULAR_SEARCH_TAGS.map((tag) => (
              <Box
                key={tag}
                component="button"
                onClick={() => {
                  setQuery(tag);
                  inputRef.current?.focus();
                }}
                sx={{
                  border: "1px solid #E2E8F0",
                  borderRadius: "9999px",
                  bgcolor: "#F8FAFC",
                  color: "#334155",
                  fontSize: 12.5,
                  fontWeight: 500,
                  px: 1.6,
                  py: 0.5,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: "#CBD5E1",
                    bgcolor: "#F1F5F9",
                    color: "#0F172A",
                  },
                }}
              >
                {tag}
              </Box>
            ))}
          </Box>

          {canScrollRight && (
            <IconButton
              size="small"
              onClick={() => handleScrollTags("right")}
              aria-label="Scroll right"
              sx={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1px solid #E2E8F0",
                bgcolor: "#FFFFFF",
                color: "#64748B",
                flexShrink: 0,
                p: 0,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                "&:hover": {
                  bgcolor: "#F8FAFC",
                  color: "#0F172A",
                  borderColor: "#CBD5E1",
                },
              }}
            >
              <ArrowForwardRoundedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Trending / Results Section */}
      <Box
        sx={{
          px: { xs: 1.75, sm: 2.25 },
          pt: 1,
          pb: 1.5,
          flex: 1,
          maxHeight: { xs: "none", sm: 390 },
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#CBD5E1 transparent",
          "&::-webkit-scrollbar": { width: 5 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "#CBD5E1",
            borderRadius: 4,
          },
        }}
      >
        {/* Section Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.25,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <TrendingUpRoundedIcon
              sx={{
                color: "#64748B",
                fontSize: 18,
              }}
            />
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#0F172A",
              }}
            >
              {hasQuery
                ? `${t("searchModalResults")} (${totalResults})`
                : t("searchModalTrending")}
            </Typography>
          </Box>

          <Box
            component="button"
            onClick={handleViewAllResults}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.4,
              border: "none",
              bgcolor: "transparent",
              color: "#64748B",
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "pointer",
              p: 0,
              transition: "color 0.15s ease",
              "&:hover": {
                color: tokens.primary,
              },
            }}
          >
            <span>See all</span>
            <ArrowForwardRoundedIcon sx={{ fontSize: 13 }} />
          </Box>
        </Box>

        {/* Product Items List */}
        {isQueryLoading || (!hasQuery && isLoadingTopPicks) ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.75,
                  p: "10px 12px",
                  borderRadius: "14px",
                  bgcolor: "#F8FAFC",
                }}
              >
                <Skeleton
                  variant="rounded"
                  width={48}
                  height={48}
                  sx={{ bgcolor: "#E2E8F0", borderRadius: "10px" }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="55%" height={20} />
                  <Skeleton variant="text" width="35%" height={16} />
                </Box>
                <Skeleton
                  variant="circular"
                  width={34}
                  height={34}
                  sx={{ bgcolor: "#E2E8F0" }}
                />
              </Box>
            ))}
          </Box>
        ) : activeItems.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {activeItems.map((item, index) => {
              const anyItem = item as any;
              const rawImg = anyItem.image || anyItem.images?.[0] || "";
              const imgUrl = rawImg ? getAssetUrl(rawImg) : "";
              const price = Number(anyItem.discountPrice || anyItem.price);
              const origPrice = anyItem.originalPrice
                ? Number(anyItem.originalPrice)
                : anyItem.discountPrice && Number(anyItem.discountPrice) < Number(anyItem.price)
                ? Number(anyItem.price)
                : null;

              const ratingVal = anyItem.rating ? Number(anyItem.rating).toFixed(1) : "4.8";
              const reviewCount =
                anyItem.reviewCount ||
                anyItem.ratingCount ||
                anyItem.soldCount ||
                "120+";

              const inCart = isItemInCart(item.id);
              const isSelected = selectedIndex === index;

              return (
                <Box
                  key={item.id}
                  onClick={() => handleNavigateToProduct(item.slug)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: "9px 12px",
                    borderRadius: "14px",
                    border: `1px solid ${isSelected ? "#E2E8F0" : "transparent"}`,
                    bgcolor: isSelected ? "#F8FAFC" : "#FFFFFF",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: "#F8FAFC",
                      borderColor: "#E2E8F0",
                    },
                  }}
                >
                  {/* Thumbnail Box */}
                  <Box
                    sx={{
                      position: "relative",
                      width: 48,
                      height: 48,
                      borderRadius: "10px",
                      overflow: "hidden",
                      bgcolor: "#F1F5F9",
                      border: "1px solid #E2E8F0",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={item.title}
                        fill
                        sizes="48px"
                        unoptimized
                        style={{ objectFit: "contain", padding: 4 }}
                      />
                    ) : (
                      <SearchRoundedIcon
                        sx={{ color: "#94A3B8", fontSize: 20 }}
                      />
                    )}
                  </Box>

                  {/* Product Details */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#0F172A",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        mb: 0.25,
                      }}
                    >
                      {item.title}
                    </Typography>

                    {/* Price & Rating Row */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        sx={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#0F172A",
                        }}
                      >
                        {formatPrice(price, locale)}
                      </Typography>

                      {origPrice && origPrice > price && (
                        <Typography
                          sx={{
                            fontSize: 12,
                            color: "#94A3B8",
                            textDecoration: "line-through",
                          }}
                        >
                          {formatPrice(origPrice, locale)}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.3,
                          fontSize: 12,
                          color: "#64748B",
                          ml: 0.5,
                        }}
                      >
                        <StarRoundedIcon sx={{ fontSize: 15, color: "#F59E0B" }} />
                        <Typography
                          component="span"
                          sx={{ fontSize: 12, fontWeight: 600, color: "#334155" }}
                        >
                          {ratingVal}
                        </Typography>
                        <Typography component="span" sx={{ fontSize: 11.5, color: "#64748B" }}>
                          ({reviewCount})
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Add to Cart Button */}
                  <IconButton
                    size="small"
                    onClick={(e) => handleAddToCart(e, item)}
                    title={inCart ? "In cart" : "Add to cart"}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      border: `1px solid ${inCart ? tokens.primary : "#E2E8F0"}`,
                      bgcolor: inCart ? "rgba(0, 191, 166, 0.08)" : "#FFFFFF",
                      color: inCart ? tokens.primary : "#475569",
                      flexShrink: 0,
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: inCart ? "rgba(0, 191, 166, 0.14)" : tokens.primary,
                        color: inCart ? tokens.primary : "#FFFFFF",
                        borderColor: tokens.primary,
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {inCart ? (
                      <CheckRoundedIcon sx={{ fontSize: 17 }} />
                    ) : (
                      <ShoppingCartOutlinedIcon sx={{ fontSize: 17 }} />
                    )}
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 4, px: 2 }}>
            <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: "#0F172A", mb: 0.5 }}>
              {t("searchModalNoResults")} &ldquo;{debouncedQuery}&rdquo;
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: "#64748B" }}>
              {t("searchModalTryDifferent")}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Bottom Footer Bar */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.25,
          py: 1.1,
          borderTop: "1px solid #F1F5F9",
          bgcolor: "#F8FAFC",
          fontSize: 11.5,
          color: "#64748B",
        }}
      >
        {/* Left: Navigation Shortcuts */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
            <Box
              component="kbd"
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #CBD5E1",
                borderRadius: "4px",
                px: 0.6,
                py: 0.15,
                fontSize: 11,
                fontWeight: 600,
                color: "#334155",
                boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
              }}
            >
              ↑
            </Box>
            <Box
              component="kbd"
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #CBD5E1",
                borderRadius: "4px",
                px: 0.6,
                py: 0.15,
                fontSize: 11,
                fontWeight: 600,
                color: "#334155",
                boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
              }}
            >
              ↓
            </Box>
            <Typography component="span" sx={{ fontSize: 11.5, color: "#64748B", ml: 0.4 }}>
              to navigate
            </Typography>
          </Box>

          <Typography component="span" sx={{ color: "#CBD5E1" }}>
            •
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.4 }}>
            <Box
              component="kbd"
              sx={{
                bgcolor: "#FFFFFF",
                border: "1px solid #CBD5E1",
                borderRadius: "4px",
                px: 0.7,
                py: 0.15,
                fontSize: 11,
                fontWeight: 600,
                color: "#334155",
                boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
              }}
            >
              Enter
            </Box>
            <Typography component="span" sx={{ fontSize: 11.5, color: "#64748B" }}>
              to select
            </Typography>
          </Box>
        </Box>

        {/* Right: Close Shortcut */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography component="span" sx={{ fontSize: 11.5, color: "#64748B" }}>
            Press
          </Typography>
          <Box
            component="kbd"
            sx={{
              bgcolor: "#FFFFFF",
              border: "1px solid #CBD5E1",
              borderRadius: "4px",
              px: 0.6,
              py: 0.15,
              fontSize: 11,
              fontWeight: 600,
              color: "#334155",
              boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
            }}
          >
            Esc
          </Box>
          <Typography component="span" sx={{ fontSize: 11.5, color: "#64748B" }}>
            to close
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
}

export default HeroSearchModal;
