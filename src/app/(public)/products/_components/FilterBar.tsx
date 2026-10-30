"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { IconButton } from "@/components/ui/icon-button";
import { Menu } from "@/components/ui/menu";
import { MenuItem } from "@/components/ui/select";
import { Drawer } from "@/components/ui/drawer";
import { ButtonBase } from "@/components/ui/button";
import { keyframes } from "@emotion/react";
import { tokens } from "@/theme/theme";

import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ScheduleIcon from "@mui/icons-material/Schedule";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GridViewIcon from "@mui/icons-material/GridView";
import ViewListIcon from "@mui/icons-material/ViewList";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PercentIcon from "@mui/icons-material/Percent";
import StarIcon from "@mui/icons-material/Star";
import BoltIcon from "@mui/icons-material/Bolt";
import Inventory2Icon from "@mui/icons-material/Inventory2";

// ─── Types ────────────────────────────────────────────────
interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface FilterBarProps {
  search: string;
  category: string;
  sort: string;
  categories: Category[];
  hasActiveFilters: boolean;
  onParamChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  totalResults?: number;
  viewMode?: "grid" | "list";
  onViewChange?: (mode: "grid" | "list") => void;
}

// ─── Keyframes ────────────────────────────────────────────
const popIn = keyframes`
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// ─── Constants ────────────────────────────────────────────
const SORT_OPTIONS = [
  { id: "newest", label: "Newest", icon: ScheduleIcon },
  { id: "popular", label: "Popular", icon: TrendingUpIcon },
  { id: "price-asc", label: "Price ↑", icon: ArrowDownwardIcon },
  { id: "price-desc", label: "Price ↓", icon: ArrowUpwardIcon },
  { id: "rating", label: "Top Rated", icon: StarIcon },
  { id: "discount", label: "Best Deal", icon: PercentIcon },
];

const QUICK_FILTERS = [
  {
    id: "on_sale",
    label: "On Sale",
    icon: LocalOfferIcon,
    active: { bgcolor: tokens.danger, borderColor: tokens.danger, color: tokens.textWhite },
    inactive: { bgcolor: tokens.dangerSubtle, borderColor: tokens.dangerBorder, color: tokens.danger },
  },
  {
    id: "new_arrival",
    label: "New Arrivals",
    icon: AutoAwesomeIcon,
    active: { bgcolor: tokens.badgeGaming, borderColor: tokens.badgeGaming, color: tokens.textWhite },
    inactive: { bgcolor: tokens.badgeGamingSubtle, borderColor: tokens.badgeGaming, color: tokens.badgeGaming },
  },
  {
    id: "top_rated",
    label: "Top Rated",
    icon: StarIcon,
    active: { bgcolor: tokens.warning, borderColor: tokens.warning, color: tokens.textWhite },
    inactive: { bgcolor: tokens.warningSubtle, borderColor: tokens.warningBorder, color: tokens.warningHover },
  },
  {
    id: "best_seller",
    label: "Best Sellers",
    icon: TrendingUpIcon,
    active: { bgcolor: tokens.successText, borderColor: tokens.successText, color: tokens.textWhite },
    inactive: { bgcolor: tokens.primaryLight, borderColor: tokens.successBorder, color: tokens.successText },
  },
  {
    id: "flash_deal",
    label: "Flash Deals",
    icon: BoltIcon,
    active: { bgcolor: tokens.badgeSale, borderColor: tokens.badgeSale, color: tokens.textWhite },
    inactive: { bgcolor: tokens.badgeSaleSubtle, borderColor: tokens.badgeSale, color: tokens.badgeSale },
  },
  {
    id: "in_stock",
    label: "In Stock",
    icon: Inventory2Icon,
    active: { bgcolor: tokens.infoHover, borderColor: tokens.infoHover, color: tokens.textWhite },
    inactive: { bgcolor: tokens.infoSubtle, borderColor: tokens.infoBorder, color: tokens.infoHover },
  },
] as const;

// ─── Active pill chip ─────────────────────────────────────
function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Box
      component='span'
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        height: 24,
        pl: 1.25,
        pr: 0.75,
        borderRadius: 999,
        bgcolor: tokens.textPrimary,
        color: tokens.textWhite,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
        flexShrink: 0,
        animation: `${popIn} 140ms ease-out both`,
      }}
    >
      {label}
      <Box
        component='button'
        type='button'
        onClick={onRemove}
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.2)",
          color: tokens.textWhite,
          border: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 0,
          transition: "background-color 150ms",
          "&:hover": { bgcolor: "rgba(255,255,255,0.4)" },
        }}
      >
        <CloseIcon sx={{ fontSize: 8 }} />
      </Box>
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────
export function FilterBar({
  search,
  category,
  sort,
  categories,
  hasActiveFilters,
  onParamChange,
  onClearFilters,
  totalResults,
  viewMode = "grid",
  onViewChange,
}: FilterBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [activeQuick, setActiveQuick] = useState<string[]>([]);

  useEffect(() => {
    if (mobileSearchOpen) setTimeout(() => searchRef.current?.focus(), 80);
  }, [mobileSearchOpen]);

  const toggleQuick = (id: string) => setActiveQuick((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const currentSort = SORT_OPTIONS.find((s) => s.id === sort) ?? SORT_OPTIONS[0];
  const CurrentSortIcon = currentSort.icon;
  const activeCatObj = categories.find((c) => c.slug === category);

  const pills: { label: string; key: string; resetTo?: string }[] = [
    ...(search ? [{ label: `"${search}"`, key: "search", resetTo: "" }] : []),
    ...(activeCatObj ? [{ label: activeCatObj.name, key: "category", resetTo: "" }] : []),
    ...(sort && sort !== "newest" ? [{ label: currentSort.label, key: "sort", resetTo: "newest" }] : []),
    ...activeQuick.map((id) => ({
      label: QUICK_FILTERS.find((q) => q.id === id)?.label ?? id,
      key: `quick_${id}`,
    })),
  ];

  const clearAll = () => {
    onClearFilters();
    setActiveQuick([]);
  };

  const hasAnyFilter = hasActiveFilters || activeQuick.length > 0;

  return (
    <>
      {/* ═══ Sticky filter surface ═══ */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 40, mb: 2.5 }}>
        <Box
          sx={{
            borderRadius: "16px",
            border: "1px solid",
            borderColor: tokens.borderDefault,
            bgcolor: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(20px)",
            boxShadow: tokens.shadowMd,
          }}
        >
          {/* Row 1: Search + Sort + Controls */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1.25,
              borderBottom: `1px solid ${tokens.borderSubtle}`,
            }}
          >
            {/* Desktop search */}
            <Box sx={{ position: "relative", display: { xs: "none", md: "flex" }, flex: 1, minWidth: 0 }}>
              <SearchIcon
                sx={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 16,
                  color: tokens.textDisabled,
                  pointerEvents: "none",
                }}
              />
              <Box
                component='input'
                type='search'
                placeholder='Search products, brands, categories…'
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onParamChange("search", e.target.value)}
                sx={{
                  width: "100%",
                  height: 40,
                  pl: "40px",
                  pr: "36px",
                  fontSize: 14,
                  bgcolor: tokens.bgCanvas,
                  border: `1px solid ${tokens.borderDefault}`,
                  borderRadius: "12px",
                  outline: "none",
                  color: tokens.textPrimary,
                  fontWeight: 500,
                  transition: "all 200ms",
                  "&::placeholder": { color: tokens.textDisabled, opacity: 1 },
                  "&:focus": {
                    borderColor: tokens.accent,
                    bgcolor: tokens.bgInput,
                    boxShadow: "0 0 0 4px rgba(52,211,153,0.25)",
                  },
                }}
              />
              {search && (
                <Box
                  component='button'
                  type='button'
                  onClick={() => onParamChange("search", "")}
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    bgcolor: tokens.borderElevated,
                    border: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: tokens.textWhite,
                    p: 0,
                    animation: `${popIn} 140ms ease-out both`,
                    "&:hover": { bgcolor: tokens.textDisabled },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 12 }} />
                </Box>
              )}
            </Box>

            {/* Mobile search/controls */}
            <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1, flex: 1 }}>
              {mobileSearchOpen ? (
                <Box sx={{ position: "relative", flex: 1 }}>
                  <SearchIcon
                    sx={{
                      position: "absolute",
                      left: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 16,
                      color: tokens.textDisabled,
                      pointerEvents: "none",
                    }}
                  />
                  <Box
                    component='input'
                    ref={searchRef}
                    type='search'
                    placeholder='Search…'
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => onParamChange("search", e.target.value)}
                    sx={{
                      width: "100%",
                      height: 40,
                      pl: "36px",
                      pr: "36px",
                      fontSize: 14,
                      bgcolor: tokens.bgCanvas,
                      border: `1px solid ${tokens.borderDefault}`,
                      borderRadius: "12px",
                      outline: "none",
                      color: tokens.textPrimary,
                      fontWeight: 500,
                      transition: "all 200ms",
                      "&::placeholder": { color: tokens.textDisabled, opacity: 1 },
                      "&:focus": {
                        borderColor: tokens.accent,
                        boxShadow: "0 0 0 4px rgba(52,211,153,0.25)",
                      },
                    }}
                  />
                  <Box
                    component='button'
                    type='button'
                    onClick={() => setMobileSearchOpen(false)}
                    sx={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      bgcolor: tokens.borderDefault,
                      border: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: tokens.textSecondary,
                      p: 0,
                      "&:hover": { bgcolor: tokens.borderElevated },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 12 }} />
                  </Box>
                </Box>
              ) : (
                <>
                  <Box
                    component='button'
                    type='button'
                    onClick={() => setMobileSearchOpen(true)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flex: 1,
                      height: 40,
                      px: 1.75,
                      borderRadius: "12px",
                      bgcolor: tokens.bgCanvas,
                      border: `1px solid ${tokens.borderDefault}`,
                      color: tokens.textDisabled,
                      cursor: "pointer",
                      transition: "border-color 200ms",
                      "&:hover": { borderColor: tokens.borderElevated },
                    }}
                  >
                    <SearchIcon sx={{ fontSize: 16, flexShrink: 0 }} />
                    <Box component='span' sx={{ fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      Search products…
                    </Box>
                  </Box>
                  <IconButton
                    onClick={() => setDrawerOpen(true)}
                    sx={{
                      position: "relative",
                      height: 40,
                      width: 40,
                      borderRadius: "12px",
                      bgcolor: tokens.bgCanvas,
                      border: `1px solid ${tokens.borderDefault}`,
                      color: tokens.textMuted,
                      flexShrink: 0,
                      "&:hover": { bgcolor: tokens.bgSubtle },
                    }}
                  >
                    <TuneIcon sx={{ fontSize: 16 }} />
                    {hasAnyFilter && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: tokens.primary,
                          boxShadow: `0 0 0 2px ${tokens.bgPanel}`,
                          animation: `${popIn} 140ms ease-out both`,
                        }}
                      />
                    )}
                  </IconButton>
                </>
              )}
            </Box>

            {/* Divider */}
            <Box sx={{ display: { xs: "none", md: "block" }, height: 24, width: "1px", bgcolor: tokens.borderDefault, flexShrink: 0 }} />

            {/* Sort dropdown */}
            <Box sx={{ display: { xs: "none", md: "block" }, flexShrink: 0 }}>
              <Box
                component='button'
                type='button'
                onClick={(e) => setSortAnchor(e.currentTarget)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  height: 40,
                  px: 1.75,
                  borderRadius: "12px",
                  border: `1px solid ${tokens.borderDefault}`,
                  bgcolor: tokens.bgPanel,
                  color: tokens.textSecondary,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 200ms",
                  "&:hover": { borderColor: tokens.borderElevated, bgcolor: tokens.bgCanvas },
                }}
              >
                <CurrentSortIcon sx={{ fontSize: 14, color: tokens.textMuted }} />
                <Box component='span'>{currentSort.label}</Box>
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: 14,
                    color: tokens.textDisabled,
                    transition: "transform 200ms",
                    transform: sortAnchor ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </Box>
              <Menu
                anchorEl={sortAnchor}
                open={Boolean(sortAnchor)}
                onClose={() => setSortAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      width: 192,
                      borderRadius: "16px",
                      border: `1px solid ${tokens.borderDefault}`,
                      boxShadow: "0 20px 25px -5px rgba(203,213,225,0.4)",
                      py: 0.75,
                    },
                  },
                }}
              >
                {SORT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = sort === opt.id;
                  return (
                    <MenuItem
                      key={opt.id}
                      onClick={() => {
                        onParamChange("sort", opt.id);
                        setSortAnchor(null);
                      }}
                      sx={{
                        px: 2,
                        py: 1.25,
                        gap: 1.5,
                        fontSize: 14,
                        fontWeight: 500,
                        color: isActive ? tokens.successText : tokens.textSecondary,
                        bgcolor: isActive ? tokens.primaryLight : "transparent",
                        "&:hover": { bgcolor: isActive ? tokens.primarySubtle : tokens.bgCanvas },
                      }}
                    >
                      <Icon sx={{ fontSize: 14, color: isActive ? tokens.primary : tokens.textDisabled }} />
                      <Box component='span' sx={{ flex: 1 }}>
                        {opt.label}
                      </Box>
                      {isActive && <CheckCircleIcon sx={{ fontSize: 14, color: tokens.primary }} />}
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>

            {/* View toggle */}
            {onViewChange && (
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  bgcolor: tokens.bgSubtle,
                  border: `1px solid ${tokens.borderDefault}`,
                  borderRadius: "12px",
                  p: 0.5,
                  gap: 0.25,
                  flexShrink: 0,
                }}
              >
                {(["grid", "list"] as const).map((v) => {
                  const Icon = v === "grid" ? GridViewIcon : ViewListIcon;
                  const isActive = viewMode === v;
                  return (
                    <Box
                      key={v}
                      component='button'
                      type='button'
                      onClick={() => onViewChange(v)}
                      sx={{
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                        border: 0,
                        cursor: "pointer",
                        color: isActive ? tokens.textPrimary : tokens.textDisabled,
                        bgcolor: isActive ? tokens.bgPanel : "transparent",
                        boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                        transition: "all 200ms",
                        "&:hover": { color: isActive ? tokens.textPrimary : tokens.textSecondary },
                      }}
                    >
                      <Icon sx={{ fontSize: 16 }} />
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Result count */}
            {typeof totalResults === "number" && (
              <Box
                sx={{
                  display: { xs: "none", lg: "flex" },
                  alignItems: "center",
                  gap: 0.5,
                  height: 40,
                  px: 1.75,
                  borderRadius: "12px",
                  bgcolor: tokens.bgCanvas,
                  border: `1px solid ${tokens.borderDefault}`,
                  flexShrink: 0,
                }}
              >
                <Box component='span' sx={{ fontSize: 14, fontWeight: 900, color: tokens.textPrimary }}>
                  {totalResults.toLocaleString()}
                </Box>
                <Box component='span' sx={{ fontSize: 12, color: tokens.textDisabled, fontWeight: 500 }}>
                  results
                </Box>
              </Box>
            )}

            {/* Clear all (desktop) */}
            {hasAnyFilter && (
              <Box
                component='button'
                type='button'
                onClick={clearAll}
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  gap: 0.75,
                  height: 40,
                  px: 1.75,
                  borderRadius: "12px",
                  fontSize: 14,
                  fontWeight: 600,
                  color: tokens.danger,
                  bgcolor: tokens.dangerSubtle,
                  border: `1px solid ${tokens.dangerBorder}`,
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "background-color 150ms",
                  "&:hover": { bgcolor: tokens.errorSubtle },
                  animation: `${fadeIn} 150ms ease-out both`,
                }}
              >
                <RefreshIcon sx={{ fontSize: 14, flexShrink: 0 }} />
                <Box component='span' sx={{ whiteSpace: "nowrap" }}>
                  Clear all
                </Box>
              </Box>
            )}
          </Box>

          {/* Row 2: Category horizontal scroll */}
          <Box
            sx={{
              overflowX: "auto",
              overflowY: "hidden",
              userSelect: "none",
              bgcolor: "rgba(248,250,252,0.5)",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 0.75,
                px: 1.5,
                py: 1.25,
                width: "max-content",
                minWidth: "100%",
                justifyContent: { md: "center" },
              }}
            >
              {categories.map((cat) => {
                const active = category === cat.slug;
                return (
                  <Box
                    key={cat.id}
                    component='button'
                    type='button'
                    onClick={() => onParamChange("category", cat.slug)}
                    sx={{
                      position: "relative",
                      px: 2,
                      py: 1,
                      borderRadius: "12px",
                      fontSize: 11,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                      border: active ? `1px solid ${tokens.textPrimary}` : `1px solid ${tokens.borderDefault}`,
                      bgcolor: active ? tokens.textPrimary : tokens.bgPanel,
                      color: active ? tokens.textWhite : tokens.textMuted,
                      cursor: "pointer",
                      transition: "all 150ms",
                      "&:hover": {
                        borderColor: active ? tokens.textPrimary : tokens.borderElevated,
                        color: active ? tokens.textWhite : tokens.textSecondary,
                      },
                    }}
                  >
                    {cat.name}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Row 3: Quick filters */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1,
              borderTop: `1px solid ${tokens.borderSubtle}`,
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Box
              component='span'
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: 10,
                fontWeight: 700,
                color: tokens.textDisabled,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                flexShrink: 0,
              }}
            >
              Quick filters
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" }, width: "1px", height: 16, bgcolor: tokens.borderDefault, flexShrink: 0 }} />
            {QUICK_FILTERS.map((qf) => {
              const Icon = qf.icon;
              const active = activeQuick.includes(qf.id);
              const style = active ? qf.active : qf.inactive;
              return (
                <Box
                  key={qf.id}
                  component='button'
                  type='button'
                  onClick={() => toggleQuick(qf.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    height: 28,
                    px: 1.5,
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    cursor: "pointer",
                    border: "1px solid",
                    transition: "all 150ms",
                    ...style,
                  }}
                >
                  <Icon sx={{ fontSize: 12 }} />
                  {qf.label}
                  {active && <CloseIcon sx={{ fontSize: 10 }} />}
                </Box>
              );
            })}
            {typeof totalResults === "number" && (
              <Box
                component='span'
                sx={{
                  ml: "auto",
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 700,
                  color: tokens.textDisabled,
                  display: { xs: "none", sm: "block" },
                }}
              >
                {totalResults.toLocaleString()} items
              </Box>
            )}
          </Box>

          {/* Row 4: Active pills */}
          {pills.length > 0 && (
            <Box
              sx={{
                borderTop: `1px dashed ${tokens.borderDefault}`,
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 1.25,
                overflowX: "auto",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              <Box
                component='span'
                sx={{ fontSize: 10, fontWeight: 700, color: tokens.textDisabled, textTransform: "uppercase", letterSpacing: "0.15em", flexShrink: 0 }}
              >
                Active
              </Box>
              <Box sx={{ width: "1px", height: 16, bgcolor: tokens.borderDefault, flexShrink: 0 }} />
              {pills.map((pill) => (
                <ActivePill
                  key={pill.key}
                  label={pill.label}
                  onRemove={() => {
                    if (pill.key.startsWith("quick_")) {
                      toggleQuick(pill.key.replace("quick_", ""));
                    } else {
                      onParamChange(pill.key, pill.resetTo ?? "");
                    }
                  }}
                />
              ))}
              <Box
                component='button'
                type='button'
                onClick={clearAll}
                sx={{
                  ml: 0.5,
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 600,
                  color: tokens.textDisabled,
                  bgcolor: "transparent",
                  border: 0,
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: 2,
                  whiteSpace: "nowrap",
                  transition: "color 150ms",
                  "&:hover": { color: tokens.danger },
                }}
              >
                Clear all
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* ═══ Mobile Filter Drawer ═══ */}
      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              maxWidth: "92vw",
              display: "flex",
              flexDirection: "column",
              bgcolor: tokens.bgPanel,
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 2, borderBottom: `1px solid ${tokens.borderSubtle}` }}
        >
          <Box>
            <Box component='h2' sx={{ fontSize: 16, fontWeight: 900, color: tokens.textPrimary, letterSpacing: "-0.02em", m: 0 }}>
              Filter &amp; Sort
            </Box>
            {pills.length > 0 && (
              <Box component='p' sx={{ fontSize: 12, color: tokens.successText, fontWeight: 600, mt: 0.25, mb: 0 }}>
                {pills.length} filter{pills.length !== 1 ? "s" : ""} active
              </Box>
            )}
          </Box>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{
              width: 36,
              height: 36,
              borderRadius: "12px",
              bgcolor: tokens.bgSubtle,
              color: tokens.textMuted,
              "&:hover": { bgcolor: tokens.borderDefault },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2.5, display: "flex", flexDirection: "column", gap: 3.5 }}>
          {/* Sort */}
          <Box component='section'>
            <Box
              component='p'
              sx={{ fontSize: 10, fontWeight: 700, color: tokens.textDisabled, textTransform: "uppercase", letterSpacing: "0.15em", mb: 1.5, m: 0 }}
            >
              Sort By
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
              {SORT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isActive = sort === opt.id;
                return (
                  <Box
                    key={opt.id}
                    component='button'
                    type='button'
                    onClick={() => onParamChange("sort", opt.id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      height: 44,
                      px: 1.75,
                      borderRadius: "12px",
                      fontSize: 14,
                      fontWeight: 600,
                      border: "1px solid",
                      cursor: "pointer",
                      transition: "all 150ms",
                      bgcolor: isActive ? tokens.textPrimary : tokens.bgCanvas,
                      color: isActive ? tokens.textWhite : tokens.textSecondary,
                      borderColor: isActive ? tokens.textPrimary : tokens.borderDefault,
                      "&:hover": {
                        bgcolor: isActive ? tokens.textPrimary : tokens.bgSubtle,
                        borderColor: isActive ? tokens.textPrimary : tokens.borderElevated,
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 14, color: isActive ? tokens.accent : tokens.textDisabled }} />
                    <Box component='span' sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {opt.label}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Quick filters */}
          <Box component='section'>
            <Box
              component='p'
              sx={{ fontSize: 10, fontWeight: 700, color: tokens.textDisabled, textTransform: "uppercase", letterSpacing: "0.15em", mb: 1.5, m: 0 }}
            >
              Quick Filters
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {QUICK_FILTERS.map((qf) => {
                const Icon = qf.icon;
                const isActive = activeQuick.includes(qf.id);
                return (
                  <Box
                    key={qf.id}
                    component='button'
                    type='button'
                    onClick={() => toggleQuick(qf.id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: 44,
                      px: 2,
                      borderRadius: "12px",
                      fontSize: 14,
                      fontWeight: 600,
                      border: "1px solid",
                      cursor: "pointer",
                      transition: "all 150ms",
                      bgcolor: isActive ? tokens.textPrimary : tokens.bgCanvas,
                      color: isActive ? tokens.textWhite : tokens.textSecondary,
                      borderColor: isActive ? tokens.textPrimary : tokens.borderDefault,
                      "&:hover": { bgcolor: isActive ? tokens.textPrimary : tokens.bgSubtle },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <Icon sx={{ fontSize: 14, color: isActive ? tokens.accent : tokens.textDisabled }} />
                      {qf.label}
                    </Box>
                    {isActive && <CheckCircleIcon sx={{ fontSize: 16, color: tokens.accent, flexShrink: 0 }} />}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Categories */}
          <Box component='section'>
            <Box
              component='p'
              sx={{ fontSize: 10, fontWeight: 700, color: tokens.textDisabled, textTransform: "uppercase", letterSpacing: "0.15em", mb: 1.5, m: 0 }}
            >
              Category
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              {categories.map((cat) => {
                const isActive = category === cat.slug;
                return (
                  <Box
                    key={cat.id}
                    component='button'
                    type='button'
                    onClick={() => onParamChange("category", cat.slug)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: 44,
                      px: 2,
                      borderRadius: "12px",
                      fontSize: 14,
                      fontWeight: 600,
                      border: "1px solid",
                      cursor: "pointer",
                      transition: "all 150ms",
                      bgcolor: isActive ? tokens.textPrimary : tokens.bgCanvas,
                      color: isActive ? tokens.textWhite : tokens.textSecondary,
                      borderColor: isActive ? tokens.textPrimary : tokens.borderDefault,
                      "&:hover": { bgcolor: isActive ? tokens.textPrimary : tokens.bgSubtle },
                    }}
                  >
                    <Box component='span'>{cat.name}</Box>
                    {isActive && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: tokens.accent, flexShrink: 0 }} />}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* View mode */}
          {onViewChange && (
            <Box component='section'>
              <Box
                component='p'
                sx={{ fontSize: 10, fontWeight: 700, color: tokens.textDisabled, textTransform: "uppercase", letterSpacing: "0.15em", mb: 1.5, m: 0 }}
              >
                Display
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1 }}>
                {(["grid", "list"] as const).map((v) => {
                  const Icon = v === "grid" ? GridViewIcon : ViewListIcon;
                  const isActive = viewMode === v;
                  return (
                    <Box
                      key={v}
                      component='button'
                      type='button'
                      onClick={() => onViewChange(v)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        height: 44,
                        borderRadius: "12px",
                        fontSize: 14,
                        fontWeight: 600,
                        border: "1px solid",
                        cursor: "pointer",
                        transition: "all 150ms",
                        bgcolor: isActive ? tokens.textPrimary : tokens.bgCanvas,
                        color: isActive ? tokens.textWhite : tokens.textSecondary,
                        borderColor: isActive ? tokens.textPrimary : tokens.borderDefault,
                        "&:hover": { bgcolor: isActive ? tokens.textPrimary : tokens.bgSubtle },
                      }}
                    >
                      <Icon sx={{ fontSize: 16 }} />
                      {v === "grid" ? "Grid View" : "List View"}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ px: 2.5, py: 2, borderTop: `1px solid ${tokens.borderSubtle}`, display: "flex", gap: 1.5, bgcolor: tokens.bgPanel }}>
          {hasAnyFilter && (
            <Box
              component='button'
              type='button'
              onClick={() => {
                clearAll();
                setDrawerOpen(false);
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                height: 44,
                px: 2,
                borderRadius: "12px",
                border: `1px solid ${tokens.borderDefault}`,
                bgcolor: "transparent",
                color: tokens.textSecondary,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                transition: "background-color 150ms",
                "&:hover": { bgcolor: tokens.bgCanvas },
              }}
            >
              <RefreshIcon sx={{ fontSize: 14 }} />
              Clear
            </Box>
          )}
          <Box
            component='button'
            type='button'
            onClick={() => setDrawerOpen(false)}
            sx={{
              flex: 1,
              height: 44,
              borderRadius: "12px",
              bgcolor: tokens.textPrimary,
              color: tokens.textWhite,
              fontWeight: 700,
              fontSize: 14,
              border: 0,
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
              transition: "background-color 150ms",
              "&:hover": { bgcolor: tokens.textSecondary },
            }}
          >
            Show Results{typeof totalResults === "number" ? ` (${totalResults.toLocaleString()})` : ""}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default FilterBar;
