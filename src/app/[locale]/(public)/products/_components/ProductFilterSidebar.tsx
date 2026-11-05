"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { toBengaliNumber } from "@/lib/i18n-utils";

import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { tokens } from "@/theme/theme";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, MenuItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

export interface CategoryItem {
  id?: string;
  name: string;
  slug: string;
  icon?: string | null;
  count?: number;
}

export interface BrandItem {
  name: string;
  count: number;
}

export interface ProductFilterSidebarProps {
  categories: CategoryItem[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
  minPrice: number | null;
  maxPrice: number | null;
  onPriceChange: (min: number | null, max: number | null) => void;
  brand: string;
  onBrandChange: (brand: string) => void;
  brands?: BrandItem[];
  inStock: boolean | null;
  onInStockChange: (inStock: boolean | null) => void;
  onSale: boolean | null;
  onOnSaleChange: (onSale: boolean | null) => void;
  featured: boolean | null;
  onFeaturedChange: (featured: boolean | null) => void;
  rating: number | null;
  onRatingChange: (rating: number | null) => void;
  hasActiveFilters: boolean;
  onClearAll: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
  totalProductsCount: number;
}

const MAX_SLIDER_PRICE = 300000;

const PRICE_PRESETS = [
  { label: "৳0-10k", min: null, max: 10000 },
  { label: "৳10k-30k", min: 10000, max: 30000 },
  { label: "৳30k+", min: 30000, max: null },
] as const;

const sectionCardSx = {
  bgcolor: "#FFFFFF",
  borderRadius: "14px",
  p: 1.5,
  border: "1px solid rgba(0, 0, 0, 0.06)",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
  transition: "all 0.2s ease",
  "&:hover": {
    borderColor: "rgba(0, 191, 166, 0.28)",
    boxShadow: "0 4px 12px rgba(0, 191, 166, 0.06)",
  },
};

const sectionHeaderSx = {
  all: "unset" as const,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  cursor: "pointer",
  userSelect: "none" as const,
};

const sectionTitleSx = {
  fontSize: "0.8125rem",
  fontWeight: 700,
  color: tokens.textPrimary,
};

interface FilterSectionProps {
  title: string;
  icon?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, icon, open, onToggle, children }: FilterSectionProps) {
  return (
    <Box sx={sectionCardSx}>
      <Box component='button' type='button' onClick={onToggle} aria-expanded={open} sx={{ ...sectionHeaderSx, mb: open ? 0.75 : 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          {icon}
          <Typography sx={sectionTitleSx}>{title}</Typography>
        </Box>
        {open ? (
          <KeyboardArrowUpRoundedIcon sx={{ fontSize: 18, color: tokens.textSecondary }} />
        ) : (
          <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18, color: tokens.textSecondary }} />
        )}
      </Box>
      <Collapse in={open}>{children}</Collapse>
    </Box>
  );
}

function matchesPricePreset(
  preset: { min: number | null; max: number | null },
  minPrice: number | null,
  maxPrice: number | null,
  maxSlider: number,
): boolean {
  const presetMin = preset.min ?? 0;
  const presetMax = preset.max ?? maxSlider;
  const currentMin = minPrice ?? 0;
  const currentMax = maxPrice ?? maxSlider;
  return presetMin === currentMin && presetMax === currentMax;
}

export function ProductFilterSidebar({
  categories,
  activeCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  brand,
  onBrandChange,
  brands = [],
  inStock,
  onInStockChange,
  onSale,
  onOnSaleChange,
  featured,
  onFeaturedChange,
  rating,
  onRatingChange,
  hasActiveFilters,
  onClearAll,
  isMobileDrawer = false,
  onCloseMobileDrawer,
  totalProductsCount,
}: ProductFilterSidebarProps) {
  const t = useTranslations("products");
  const locale = useLocale();
  const [open, setOpen] = useState({
    price: true,
    brand: true,
    rating: false,
    availability: false,
  });
  const toggle = (key: keyof typeof open) => setOpen((o) => ({ ...o, [key]: !o[key] }));

  const [showAllBrands, setShowAllBrands] = useState(false);

  const draggingRef = useRef(false);
  const [sliderVal, setSliderVal] = useState<number[]>([
    minPrice !== null && minPrice >= 0 ? minPrice : 0,
    maxPrice !== null && maxPrice > 0 ? maxPrice : MAX_SLIDER_PRICE,
  ]);

  useEffect(() => {
    if (draggingRef.current) return;
    const next: [number, number] = [
      minPrice !== null && minPrice >= 0 ? minPrice : 0,
      maxPrice !== null && maxPrice > 0 ? maxPrice : MAX_SLIDER_PRICE,
    ];
    setSliderVal((prev) => (prev[0] === next[0] && prev[1] === next[1] ? prev : next));
  }, [minPrice, maxPrice]);

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (!Array.isArray(newValue)) return;
    draggingRef.current = true;
    setSliderVal(newValue);
  };

  const handleSliderCommitted = (_: React.SyntheticEvent | Event, newValue: number | number[]) => {
    draggingRef.current = false;
    if (!Array.isArray(newValue)) return;
    const [min, max] = newValue;
    onPriceChange(min > 0 ? min : null, max < MAX_SLIDER_PRICE ? max : null);
  };

  const brandLower = brand.toLowerCase();

  const filteredBrands = useMemo(() => (showAllBrands ? brands : brands.slice(0, 5)), [brands, showAllBrands]);

  const handleClearAll = () => {
    setShowAllBrands(false);
    onClearAll();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: isMobileDrawer ? "100%" : "auto",
        maxHeight: isMobileDrawer ? "100%" : "unset",
        overflow: "hidden",
        gap: isMobileDrawer ? 0 : 1.25,
      }}
    >
      <Box
        sx={{
          bgcolor: "#0B131D",
          color: "#FFFFFF",
          borderRadius: isMobileDrawer ? 0 : "14px",
          p: isMobileDrawer ? 1.75 : 1.5,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: isMobileDrawer ? "none" : "1px solid rgba(0, 191, 166, 0.25)",
          borderBottom: isMobileDrawer ? "1px solid rgba(0, 191, 166, 0.2)" : undefined,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          position: isMobileDrawer ? "sticky" : "static",
          top: 0,
          zIndex: 10,
          flexShrink: 0,
          touchAction: isMobileDrawer ? "none" : "auto",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <FilterListRoundedIcon sx={{ fontSize: 20, color: tokens.primary }} />
          <Typography sx={{ fontWeight: 700, fontSize: "0.9375rem", color: "#FFFFFF" }}>{t("filterProducts")}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {hasActiveFilters && !isMobileDrawer && (
            <Typography
              component='button'
              type='button'
              onClick={handleClearAll}
              sx={{
                background: "none",
                border: "none",
                color: tokens.primary,
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                p: 0,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {t("clearAll")}
            </Typography>
          )}

          {isMobileDrawer && onCloseMobileDrawer && (
            <IconButton onClick={onCloseMobileDrawer} size='small' color='inherit' aria-label={t("filterProducts")}>
              <CloseRoundedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          p: isMobileDrawer ? 1.5 : 0,
          pb: isMobileDrawer ? 3 : 0,
          flexGrow: isMobileDrawer ? 1 : 0,
          flexShrink: isMobileDrawer ? 1 : 0,
          flexBasis: isMobileDrawer ? "0px" : "auto",
          minHeight: 0,
          overflowY: isMobileDrawer ? "auto" : "visible",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
        }}
      >
        <Box sx={sectionCardSx}>
          <Typography sx={{ ...sectionTitleSx, mb: 0.75 }}>{t("category")}</Typography>

          <Select
            size='small'
            value={activeCategory || "all"}
            onChange={(e) => onSelectCategory(String(e.target.value))}
            IconComponent={KeyboardArrowDownRoundedIcon}
            fullWidth
          >
            {categories.map((cat) => {
              const countVal = cat.slug === "all" ? totalProductsCount : cat.count;
              const formattedCount = countVal != null ? `(${locale === "bn" ? toBengaliNumber(countVal) : countVal.toLocaleString()})` : "";
              const displayName = cat.slug === "all" ? t("allProducts") : cat.name;
              return (
                <MenuItem key={cat.slug} value={cat.slug}>
                  {displayName} {formattedCount}
                </MenuItem>
              );
            })}
          </Select>
        </Box>

        <FilterSection title={t("priceRange")} open={open.price} onToggle={() => toggle("price")}>
          <Box sx={{ px: 0.5, pt: 0.25, pb: 0.25 }}>
            <Slider
              value={sliderVal}
              onChange={handleSliderChange}
              onChangeCommitted={handleSliderCommitted}
              min={0}
              max={MAX_SLIDER_PRICE}
              step={2500}
              valueLabelDisplay='auto'
              valueLabelFormat={(v) => `৳${locale === "bn" ? toBengaliNumber(v) : v.toLocaleString()}`}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.25, mb: 1 }}>
            <Typography sx={{ fontSize: "0.6875rem", color: tokens.textSecondary, fontWeight: 500 }}>
              ৳{locale === "bn" ? toBengaliNumber(0) : "0"}
            </Typography>
            <Typography sx={{ fontSize: "0.6875rem", color: tokens.textSecondary, fontWeight: 500 }}>
              ৳{locale === "bn" ? toBengaliNumber(300000) : "300,000"}+
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {PRICE_PRESETS.map((p) => {
              const isSelected = matchesPricePreset(p, minPrice, maxPrice, MAX_SLIDER_PRICE);
              return (
                <Button
                  key={p.label}
                  variant={isSelected ? "primary" : "outline"}
                  size='sm'
                  onClick={() => {
                    setSliderVal([p.min ?? 0, p.max ?? MAX_SLIDER_PRICE]);
                    onPriceChange(p.min, p.max);
                  }}
                >
                  {p.label}
                </Button>
              );
            })}
          </Box>
        </FilterSection>

        <FilterSection title={t("brand")} open={open.brand} onToggle={() => toggle("brand")}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, pt: 0.25 }}>
            {filteredBrands.map((b) => {
              const isChecked = brandLower === b.name.toLowerCase();
              return (
                <Box
                  key={b.name}
                  onClick={() => onBrandChange(isChecked ? "" : b.name)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    userSelect: "none",
                    px: 0.75,
                    py: 0.25,
                    borderRadius: "8px",
                    bgcolor: isChecked ? "rgba(0, 191, 166, 0.08)" : "transparent",
                    transition: "background-color 0.15s ease",
                    "&:hover": {
                      bgcolor: isChecked ? "rgba(0, 191, 166, 0.12)" : "rgba(0, 0, 0, 0.02)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <Checkbox checked={isChecked} size='small' />
                    <Typography
                      sx={{
                        fontSize: "0.8125rem",
                        color: isChecked ? tokens.primary : tokens.textPrimary,
                        fontWeight: isChecked ? 600 : 400,
                      }}
                    >
                      {b.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: "0.6875rem", color: tokens.textDisabled }}>({b.count})</Typography>
                </Box>
              );
            })}

            {brands.length > 5 && (
              <Typography
                component='button'
                type='button'
                onClick={() => setShowAllBrands((v) => !v)}
                sx={{
                  background: "none",
                  border: "none",
                  color: tokens.primary,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  p: 0,
                  mt: 0.25,
                  px: 0.75,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {showAllBrands ? `${t("showLess")} ▴` : `${t("showMore")} ▾`}
              </Typography>
            )}
          </Box>
        </FilterSection>

        <FilterSection
          title={t("rating")}
          icon={<StarOutlineRoundedIcon sx={{ fontSize: 16, color: tokens.textSecondary }} />}
          open={open.rating}
          onToggle={() => toggle("rating")}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, pt: 0.25 }}>
            {[4, 3].map((val) => {
              const isActive = rating === val;
              return (
                <Box
                  key={val}
                  onClick={() => onRatingChange(isActive ? null : val)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    cursor: "pointer",
                    px: 1,
                    py: 0.35,
                    borderRadius: "8px",
                    bgcolor: isActive ? "rgba(0, 191, 166, 0.12)" : "#F8FAFC",
                    border: `1px solid ${isActive ? "rgba(0, 191, 166, 0.3)" : "rgba(0, 0, 0, 0.04)"}`,
                  }}
                >
                  <StarRoundedIcon sx={{ fontSize: 16, color: tokens.warning }} />
                  <Typography
                    sx={{
                      fontSize: "0.8125rem",
                      color: isActive ? tokens.primary : tokens.textPrimary,
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {locale === "bn" ? toBengaliNumber(val) : val}.0★ {t("ratingAbove")}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </FilterSection>

        <FilterSection
          title={t("availability")}
          icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: 16, color: tokens.textSecondary }} />}
          open={open.availability}
          onToggle={() => toggle("availability")}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25, pt: 0.25 }}>
            <Box
              onClick={() => onInStockChange(inStock ? null : true)}
              sx={{ display: "flex", alignItems: "center", gap: 0.75, cursor: "pointer", px: 0.5, py: 0.25 }}
            >
              <Checkbox checked={!!inStock} size='small' />
              <Typography sx={{ fontSize: "0.8125rem", color: tokens.textPrimary }}>{t("inStockOnly")}</Typography>
            </Box>

            <Box
              onClick={() => onOnSaleChange(onSale ? null : true)}
              sx={{ display: "flex", alignItems: "center", gap: 0.75, cursor: "pointer", px: 0.5, py: 0.25 }}
            >
              <Checkbox checked={!!onSale} size='small' />
              <Typography sx={{ fontSize: "0.8125rem", color: tokens.textPrimary }}>{t("onSale")}</Typography>
            </Box>

            <Box
              onClick={() => onFeaturedChange(featured ? null : true)}
              sx={{ display: "flex", alignItems: "center", gap: 0.75, cursor: "pointer", px: 0.5, py: 0.25 }}
            >
              <Checkbox checked={!!featured} size='small' />
              <Typography sx={{ fontSize: "0.8125rem", color: tokens.textPrimary }}>{t("featured")}</Typography>
            </Box>
          </Box>
        </FilterSection>

        <Box
          sx={{
            position: "relative",
            borderRadius: "14px",
            overflow: "hidden",
            bgcolor: "#07131F",
            backgroundImage: "radial-gradient(at 100% 100%, rgba(0, 191, 166, 0.35) 0px, transparent 60%)",
            border: "1px solid rgba(0, 191, 166, 0.25)",
            p: 1.5,
            color: "#FFFFFF",
            mt: 0.5,
          }}
        >
          <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{t("saveMore")}</Typography>
          <Typography sx={{ fontSize: "0.9375rem", fontWeight: 800, mb: 1, letterSpacing: "-0.01em" }}>{t("shopSmarter")}</Typography>

          <Button component={Link} href='/products?sort=discount' variant='primary' size='sm'>
            {t("viewDeals")}
          </Button>
        </Box>

        {isMobileDrawer && <Box sx={{ height: 64, flexShrink: 0 }} />}
      </Box>

      {isMobileDrawer && onCloseMobileDrawer && (
        <Box
          sx={{
            flexShrink: 0,
            bgcolor: "#FFFFFF",
            borderTop: `1px solid ${tokens.borderDefault}`,
            p: 1.5,
            px: 2,
            pb: "max(14px, env(safe-area-inset-bottom, 14px))",
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            boxShadow: "0 -4px 16px rgba(15, 23, 42, 0.08)",
            zIndex: 10,
            touchAction: "none",
          }}
        >
          {hasActiveFilters && (
            <Button variant='outline' size='sm' onClick={handleClearAll}>
              {t("reset")}
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }}>
            <Button variant='primary' fullWidth onClick={onCloseMobileDrawer}>
              {t("viewProducts", { count: locale === "bn" ? toBengaliNumber(totalProductsCount) : totalProductsCount.toLocaleString() })}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ProductFilterSidebar;
