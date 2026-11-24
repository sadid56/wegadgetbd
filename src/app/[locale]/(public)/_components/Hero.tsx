"use client";

import React, { useRef, useState } from "react";
import NextImage from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { CircularProgress } from "@/components/ui/spinner";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WhatshotRoundedIcon from "@mui/icons-material/WhatshotRounded";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

import { useProducts, useTopPicks } from "@/query-client/products";
import { useDebounce } from "@/hooks/use-debounce";
import { useClickOutside } from "@/hooks/use-click-outside";
import { openAiShoppingDrawer } from "@/lib/ai-drawer";
import { getAssetUrl } from "@/lib/storage";
import { formatPrice } from "@/lib/i18n-utils";
import { tokens } from "@/theme/theme";
import heroBgImg from "../../../../../public/images/hero-bg-gadgets.jpg";

const TRENDING_TAGS = ["Smart Watch", "TWS Earbuds", "Cleaning Kit", "Mini Blower", "Lint Remover"] as const;

export function Hero() {
  const router = useRouter();
  const locale = useLocale();
  const isBn = locale === "bn";
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [isNormalExpanded, setIsNormalExpanded] = useState(false);
  const [hasFocusedSearch, setHasFocusedSearch] = useState(false);

  const debouncedQuery = useDebounce(searchQuery.trim(), 250);
  const { data: searchData, isFetching: isSearching } = useProducts(
    { search: debouncedQuery, limit: 5 },
    { enabled: isNormalExpanded && debouncedQuery.length > 0 },
  );
  const { data: topPicks, isFetching: isLoadingTopPicks } = useTopPicks(4, {
    enabled: hasFocusedSearch,
  });

  const isDropdownLoading = debouncedQuery.length > 0 ? isSearching : isLoadingTopPicks;
  const normalResults = debouncedQuery.length > 0 ? (searchData?.products ?? []) : (topPicks ?? []);

  // Close normal dropdown on outside click or Escape
  useClickOutside(searchBoxRef, () => setIsNormalExpanded(false), {
    enabled: isNormalExpanded,
  });

  const handleSubmit = (e: React.ChangeEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    setIsNormalExpanded(false);
    router.push(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products");
  };

  return (
    <Box
      component='section'
      sx={{
        position: "relative",
        zIndex: isNormalExpanded ? 60 : 25, // Stacks above CategoryRibbon (zIndex: 10) so search dropdown never hides under it
        width: "100%",
        maxWidth: 1440,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4, lg: 5 },
        pt: { xs: "74px", sm: "84px", md: "98px", lg: "104px" },
        pb: 0,
      }}
    >
      {/* ── FLOATING ROUNDED HERO CONTAINER ── */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: { xs: 420, sm: 500, md: 540, lg: 570 },
          borderRadius: { xs: "22px", sm: "28px", md: "32px", lg: "36px" },
          border: `1px solid ${tokens.borderDefault}`,
          boxShadow: "0 18px 48px -12px rgba(17, 24, 23, 0.08), 0 4px 16px -2px rgba(17, 24, 23, 0.03)",
          bgcolor: "#EDF8F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1.75, sm: 3, md: 4 },
          py: { xs: 4.5, sm: 6.5, md: 7.5, lg: 8 },
        }}
      >
        {/* Clipped Background Layer (Pure, raw 4K visual - crisp & vibrant) */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <NextImage
            src={heroBgImg}
            alt='We Gadget BD Smart Gear'
            fill
            preload
            loading='eager'
            decoding='sync'
            fetchPriority='high'
            placeholder='blur'
            quality={85}
            sizes='(max-width: 768px) 100vw, (max-width: 1440px) 95vw, 1360px'
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />

          {/* Soft Center Radial Contrast Spotlight */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: {
                xs: "radial-gradient(ellipse 64% 50% at 50% 38%, rgba(241, 245, 249, 0.84) 0%, rgba(241, 245, 249, 0.46) 40%, rgba(241, 245, 249, 0.12) 72%, rgba(241, 245, 249, 0) 100%)",
                sm: "radial-gradient(ellipse 48% 52% at 50% 40%, rgba(241, 245, 249, 0.88) 0%, rgba(241, 245, 249, 0.52) 36%, rgba(241, 245, 249, 0.16) 68%, rgba(241, 245, 249, 0) 100%)",
              },
            }}
          />
        </Box>

        {/* All Hero Content - Strictly Center Aligned */}
        <Box
          sx={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: 740,
            mx: "auto",
            width: "100%",
          }}
        >
          {/* Main Display Heading (Bilingual BN & EN) */}
          <Typography
            component='h1'
            sx={{
              fontSize: { xs: 28, sm: 38, md: 46, xl: 52 },
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: isBn ? "normal" : "-0.03em",
              color: tokens.textPrimary,
              mb: 1.5,
            }}
          >
            {isBn ? (
              <>
                আপনার কী প্রয়োজন জানান...
                <br />
                <Box
                  component='span'
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    color: tokens.primary,
                    pb: "4px",
                  }}
                >
                  AI
                  <Box
                    component='svg'
                    viewBox='0 0 60 10'
                    fill='none'
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: "100%",
                      height: 8,
                      pointerEvents: "none",
                    }}
                  >
                    <path d='M2 7C18 2 42 2 58 7' stroke={tokens.primary} strokeWidth='3.5' strokeLinecap='round' />
                  </Box>
                </Box>{" "}
                খুঁজে দেবে আপনার জন্য!
              </>
            ) : (
              <>
                Tell us what you need...
                <br />
                Let{" "}
                <Box
                  component='span'
                  sx={{
                    position: "relative",
                    display: "inline-block",
                    color: tokens.primary,
                    pb: "4px",
                  }}
                >
                  AI
                  <Box
                    component='svg'
                    viewBox='0 0 60 10'
                    fill='none'
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      width: "100%",
                      height: 8,
                      pointerEvents: "none",
                    }}
                  >
                    <path d='M2 7C18 2 42 2 58 7' stroke={tokens.primary} strokeWidth='3.5' strokeLinecap='round' />
                  </Box>
                </Box>{" "}
                find it for you!
              </>
            )}
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontSize: { xs: 13.5, sm: 15, md: 15.5 },
              fontWeight: 600,
              lineHeight: 1.5,
              color: tokens.textPrimary,
              maxWidth: 520,
              mx: "auto",
              mb: 2.5,
            }}
          >
            {isBn
              ? "দৈনন্দিন সমাধান থেকে ইউনিক গ্যাজেট — আরও সহজ, স্মার্ট ও আপনার মনের মতো!"
              : "From everyday solutions to unique gadgets — smarter, easier, and just for you!"}
          </Typography>

          {/* Clean Search Container + 1-Click Concierge Shortcut */}
          <Box
            ref={searchBoxRef}
            sx={{
              position: "relative",
              zIndex: isNormalExpanded ? 80 : 20,
              width: "100%",
              maxWidth: 620,
              minHeight: 54,
              mb: 2,
            }}
          >
            <Box
              component='form'
              onSubmit={handleSubmit}
              sx={{
                position: "relative",
                zIndex: 90,
                width: "100%",
                borderRadius: "999px",
                bgcolor: tokens.bgPanel,
                boxShadow: isNormalExpanded
                  ? "0 14px 40px rgba(17, 24, 23, 0.13), 0 3px 12px rgba(17, 24, 23, 0.04)"
                  : "0 6px 22px rgba(17, 24, 23, 0.08)",
                transition: "box-shadow 220ms ease",
                display: "flex",
                alignItems: "center",
                gap: { xs: 0.75, sm: 1 },
                pl: { xs: 1.75, sm: 2.25 },
                pr: 1,
                py: 0.9,
              }}
            >
              <SearchRoundedIcon sx={{ fontSize: 20, color: tokens.textMuted, flexShrink: 0 }} />

              <Box
                component='input'
                type='text'
                aria-label={isBn ? "গ্যাজেট খুঁজুন" : "Search gadgets"}
                value={searchQuery}
                onFocus={() => {
                  setHasFocusedSearch(true);
                  setIsNormalExpanded(true);
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchQuery(e.target.value);
                  if (!hasFocusedSearch) setHasFocusedSearch(true);
                  if (!isNormalExpanded) setIsNormalExpanded(true);
                }}
                placeholder={isBn ? "গ্যাজেট, ইয়ারবাডস, স্মার্টওয়াচ খুঁজুন..." : "Search gadgets, earbuds, smartwatches..."}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  height: 36,
                  border: "none",
                  outline: "none",
                  bgcolor: "transparent",
                  fontFamily: "inherit",
                  fontSize: { xs: 13.5, sm: 14 },
                  fontWeight: 500,
                  color: tokens.textPrimary,
                  "&::placeholder": { color: tokens.textMuted, opacity: 1 },
                }}
              />

              {/* Single Entry Point to AI Shopping Bot Drawer */}
              <Box
                component='button'
                type='button'
                onClick={() => {
                  setIsNormalExpanded(false);
                  openAiShoppingDrawer(searchQuery.trim() || undefined);
                }}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.6,
                  px: { xs: 1.2, sm: 1.5 },
                  py: 0.65,
                  borderRadius: "999px",
                  border: "1px solid rgba(0, 191, 166, 0.38)",
                  background: "linear-gradient(135deg, rgba(0, 191, 166, 0.12) 0%, rgba(6, 182, 212, 0.14) 100%)",
                  boxShadow: "0 2px 10px rgba(0, 191, 166, 0.14)",
                  color: tokens.primaryDark,
                  fontSize: { xs: 11.5, sm: 12 },
                  fontWeight: 700,
                  cursor: "pointer",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  transition: "all 180ms ease",
                  "&:hover": {
                    background: "linear-gradient(135deg, rgba(0, 191, 166, 0.18) 0%, rgba(6, 182, 212, 0.2) 100%)",
                    borderColor: "rgba(0, 191, 166, 0.55)",
                    boxShadow: "0 3px 12px rgba(0, 191, 166, 0.18)",
                  },
                }}
              >
                <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: tokens.primary }} />
                <span>{isBn ? "বটকে জিজ্ঞেস করুন" : "Ask Bot"}</span>
              </Box>

              <IconButton
                type='submit'
                aria-label='Search products'
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: tokens.primary,
                  color: tokens.onPrimary,
                  flexShrink: 0,
                  boxShadow: tokens.shadowPrimary,
                  "&:hover": { bgcolor: tokens.primaryHover },
                }}
              >
                <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            {/* ── FLOATING NORMAL SEARCH DROPDOWN ── */}
            <Box
              sx={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                zIndex: 95,
                bgcolor: tokens.bgPanel,
                borderRadius: { xs: "20px", sm: "24px" },
                boxShadow: "0 14px 40px rgba(17, 24, 23, 0.13), 0 3px 12px rgba(17, 24, 23, 0.04)",
                display: "grid",
                gridTemplateRows: isNormalExpanded ? "1fr" : "0fr",
                opacity: isNormalExpanded ? 1 : 0,
                pointerEvents: isNormalExpanded ? "auto" : "none",
                transition: "grid-template-rows 240ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease",
                overflow: "hidden",
              }}
            >
              <Box sx={{ overflow: "hidden" }}>
                <Box
                  sx={{
                    pt: 1.5,
                    px: { xs: 2, sm: 2.25 },
                    pb: 2,
                    textAlign: "left",
                  }}
                >
                  {/* Header + Close */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
                    <Typography
                      sx={{ fontSize: 11.5, fontWeight: 700, color: tokens.textMuted, display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <TrendingUpRoundedIcon sx={{ fontSize: 14, color: tokens.primary }} />
                      {debouncedQuery
                        ? isBn
                          ? "খুঁজে পাওয়া পণ্য"
                          : "Matching Products"
                        : isBn
                          ? "জনপ্রিয় সার্চ ও সেরা পছন্দ"
                          : "Popular Searches & Top Picks"}
                    </Typography>
                    <IconButton
                      size='small'
                      aria-label={isBn ? "সার্চ বন্ধ করুন" : "Close search results"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsNormalExpanded(false);
                      }}
                      sx={{ p: 0.25 }}
                    >
                      <CloseRoundedIcon sx={{ fontSize: 16, color: tokens.textMuted }} />
                    </IconButton>
                  </Box>

                  {/* Trending Chips */}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1.75 }}>
                    {TRENDING_TAGS.map((tag) => (
                      <Box
                        key={tag}
                        component='button'
                        type='button'
                        onClick={() => {
                          setSearchQuery(tag);
                        }}
                        sx={{
                          px: 1.25,
                          py: 0.45,
                          borderRadius: `${tokens.radiusPill}px`,
                          border: `1px solid ${tokens.borderDefault}`,
                          bgcolor: tokens.bgSurface,
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: tokens.textSecondary,
                          cursor: "pointer",
                          transition: "all 140ms ease",
                          "&:hover": { borderColor: tokens.primary, color: tokens.primaryDark, bgcolor: tokens.primaryLight },
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </Box>

                  {/* Live Results */}
                  {isDropdownLoading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 2, justifyContent: "center", color: tokens.textMuted }}>
                      <CircularProgress size={16} sx={{ color: tokens.primary }} />
                      <Typography sx={{ fontSize: 12.5 }}>{isBn ? "খোঁজা হচ্ছে..." : "Searching..."}</Typography>
                    </Box>
                  ) : normalResults.length === 0 ? (
                    <Box sx={{ py: 1.5, textAlign: "center" }}>
                      <Typography sx={{ fontSize: 12.5, color: tokens.textMuted, mb: 1 }}>
                        {isBn ? "সরাসরি কোনো পণ্য পাওয়া যায়নি।" : "No matching products found."}
                      </Typography>
                      <Box
                        component='button'
                        type='button'
                        onClick={() => {
                          setIsNormalExpanded(false);
                          openAiShoppingDrawer(searchQuery.trim());
                        }}
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.65,
                          px: 1.75,
                          py: 0.7,
                          borderRadius: "999px",
                          border: "none",
                          background: "linear-gradient(135deg, #00897B 0%, #00BFA6 55%, #06B6D4 100%)",
                          boxShadow: "0 4px 14px rgba(0, 191, 166, 0.28)",
                          color: tokens.onPrimary,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          transition: "transform 160ms ease, box-shadow 160ms ease",
                          "&:hover": {
                            transform: "translateY(-1px)",
                            boxShadow: "0 6px 18px rgba(0, 191, 166, 0.36)",
                          },
                        }}
                      >
                        <AutoAwesomeRoundedIcon sx={{ fontSize: 14 }} />
                        <span>{isBn ? "বটকে জিজ্ঞেস করুন" : "Ask Bot"}</span>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, maxHeight: 280, overflowY: "auto", pr: 0.5 }}>
                      {normalResults.map((item) => {
                        const rawImg = item.thumbnail || "";
                        const imgSrc = (rawImg ? getAssetUrl(rawImg) : null) || "/images/default.png";
                        const itemDiscount = "discountPrice" in item ? item.discountPrice : undefined;
                        const effectivePrice = Number(itemDiscount || item.price || 0);
                        return (
                          <Box
                            key={item.id}
                            component={Link}
                            href={`/products/${item.slug}`}
                            onClick={() => setIsNormalExpanded(false)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              p: 1,
                              borderRadius: "14px",
                              textDecoration: "none",
                              transition: "background-color 140ms ease",
                              "&:hover": { bgcolor: tokens.bgSubtle },
                            }}
                          >
                            <Box
                              component='img'
                              src={imgSrc}
                              alt={item.title}
                              sx={{
                                width: 42,
                                height: 42,
                                borderRadius: "10px",
                                objectFit: "cover",
                                bgcolor: tokens.bgSubtle,
                                flexShrink: 0,
                              }}
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: tokens.textPrimary,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Typography sx={{ fontSize: 12, fontWeight: 700, color: tokens.primaryDark }}>
                                {formatPrice(effectivePrice, locale)}
                              </Typography>
                            </Box>
                            <ArrowForwardRoundedIcon sx={{ fontSize: 16, color: tokens.textDisabled }} />
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Quick Suggestion Pills */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0.75, sm: 1 },
              maxWidth: { xs: 360, sm: "100%" },
            }}
          >
            <Box
              component={Link}
              href='/products?sort=best-selling'
              prefetch={false}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: { xs: 1.35, sm: 1.6 },
                py: { xs: 0.55, sm: 0.65 },
                borderRadius: `${tokens.radiusPill}px`,
                bgcolor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: { xs: "none", md: "blur(10px)" },
                border: `1px solid ${tokens.borderSubtle}`,
                boxShadow: tokens.shadowSm,
                fontSize: { xs: 11.5, sm: 12.5 },
                fontWeight: 600,
                color: tokens.textPrimary,
                textDecoration: "none",
                cursor: "pointer",
                transition: "none",
                "&:hover": {
                  transform: "none",
                  bgcolor: "rgba(255, 255, 255, 0.90)",
                  borderColor: tokens.borderSubtle,
                  boxShadow: tokens.shadowSm,
                  color: tokens.textPrimary,
                },
                "&:active": {
                  transform: "none",
                },
              }}
            >
              <WhatshotRoundedIcon sx={{ fontSize: 16, color: "#F97316" }} />
              <span>{isBn ? "ট্রেন্ডিং" : "Trending"}</span>
            </Box>
            <Box
              component={Link}
              href='/products?category=winter-comfort-gadgets'
              prefetch={false}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: { xs: 1.35, sm: 1.6 },
                py: { xs: 0.55, sm: 0.65 },
                borderRadius: `${tokens.radiusPill}px`,
                bgcolor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: { xs: "none", md: "blur(10px)" },
                border: `1px solid ${tokens.borderSubtle}`,
                boxShadow: tokens.shadowSm,
                fontSize: { xs: 11.5, sm: 12.5 },
                fontWeight: 600,
                color: tokens.textPrimary,
                textDecoration: "none",
                cursor: "pointer",
                transition: "none",
                "&:hover": {
                  transform: "none",
                  bgcolor: "rgba(255, 255, 255, 0.90)",
                  borderColor: tokens.borderSubtle,
                  boxShadow: tokens.shadowSm,
                  color: tokens.textPrimary,
                },
                "&:active": {
                  transform: "none",
                },
              }}
            >
              <AcUnitRoundedIcon sx={{ fontSize: 15, color: "#0284C7" }} />
              <span>{isBn ? "উইন্টার এসেনশিয়ালস" : "Winter Essentials"}</span>
            </Box>
            <Box
              component={Link}
              href='/products?sort=price-asc'
              prefetch={false}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                px: { xs: 1.35, sm: 1.6 },
                py: { xs: 0.55, sm: 0.65 },
                borderRadius: `${tokens.radiusPill}px`,
                bgcolor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: { xs: "none", md: "blur(10px)" },
                border: `1px solid ${tokens.borderSubtle}`,
                boxShadow: tokens.shadowSm,
                fontSize: { xs: 11.5, sm: 12.5 },
                fontWeight: 600,
                color: tokens.textPrimary,
                textDecoration: "none",
                cursor: "pointer",
                transition: "none",
                "&:hover": {
                  transform: "none",
                  bgcolor: "rgba(255, 255, 255, 0.90)",
                  borderColor: tokens.borderSubtle,
                  boxShadow: tokens.shadowSm,
                  color: tokens.textPrimary,
                },
                "&:active": {
                  transform: "none",
                },
              }}
            >
              <SavingsRoundedIcon sx={{ fontSize: 16, color: "#EAB308" }} />
              <span>{isBn ? "বেস্ট বাজেট" : "Best Budget"}</span>
            </Box>
            <IconButton
              component={Link}
              href='/products'
              prefetch={false}
              aria-label='Browse all products'
              size='small'
              sx={{
                width: 32,
                height: 32,
                bgcolor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: { xs: "none", md: "blur(10px)" },
                border: `1px solid ${tokens.borderSubtle}`,
                boxShadow: tokens.shadowSm,
                color: tokens.textPrimary,
                p: 0,
                transition: "none",
                "&:hover": {
                  transform: "none",
                  bgcolor: "rgba(255, 255, 255, 0.90)",
                  borderColor: tokens.borderSubtle,
                  boxShadow: tokens.shadowSm,
                  color: tokens.textPrimary,
                },
                "&:active": {
                  transform: "none",
                },
              }}
            >
              <ArrowForwardRoundedIcon sx={{ fontSize: 15, color: tokens.textPrimary }} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
