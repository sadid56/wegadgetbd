"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useLocale, useTranslations } from "next-intl";

import { tokens } from "@/theme/theme";
import { Select, MenuItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { toBengaliNumber } from "@/lib/i18n-utils";

export interface ProductTopBarProps {
  sort: string;
  onSortChange: (val: string) => void;
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onOpenMobileFilters: () => void;
  activeFilterCount: number;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export function ProductTopBar({
  sort,
  onSortChange,
  totalProducts,
  currentPage,
  totalPages,
  onPageChange,
  limit,
  onOpenMobileFilters,
  activeFilterCount,
  searchValue = "",
  onSearchChange,
}: ProductTopBarProps) {
  const t = useTranslations("products");
  const locale = useLocale();
  const safeTotal = Math.max(totalProducts, 0);
  const safeLimit = Math.max(limit, 1);
  const effectiveTotalPages = Math.max(totalPages, 1);
  const safePage = Math.min(Math.max(currentPage, 1), effectiveTotalPages);

  const startItem = safeTotal === 0 ? 0 : (safePage - 1) * safeLimit + 1;
  const endItem = Math.min(safePage * safeLimit, safeTotal);

  const formattedStart = locale === "bn" ? toBengaliNumber(startItem) : startItem;
  const formattedEnd = locale === "bn" ? toBengaliNumber(endItem) : endItem;
  const formattedTotal = locale === "bn" ? toBengaliNumber(safeTotal) : safeTotal.toLocaleString();

  const sortOptions = [
    { value: "best-selling", label: t("mostPopular") },
    { value: "newest", label: t("newestArrivals") },
    { value: "price-asc", label: t("priceLowToHigh") },
    { value: "price-desc", label: t("priceHighToLow") },
    { value: "rating", label: t("highestRated") },
    { value: "discount", label: t("biggestDiscount") },
  ] as const;

  const countText = activeFilterCount > 0 ? ` (${locale === "bn" ? toBengaliNumber(activeFilterCount) : activeFilterCount})` : "";
  const filtersLabel = `${t("filterProducts")}${countText}`;
  const mobileFiltersLabel = `${locale === "bn" ? "ফিল্টার" : "Filters"}${countText}`;

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        border: "none",
        boxShadow: "none",
        px: { xs: 1.5, sm: 2.5 },
        py: { xs: 1.5, sm: 1.5 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: { xs: 1.25, sm: 2 },
        mb: { xs: 2, sm: 3 },
      }}
    >
      {/* Filters (mobile) + Sort */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
          width: { xs: "100%", md: "auto" },
          justifyContent: { xs: "space-between", md: "flex-start" },
          order: { xs: 2, md: 1 },
        }}
      >
        <Box sx={{ display: { xs: "block", md: "none" }, flexShrink: 0 }}>
          <Button
            variant='outline'
            size='sm'
            onClick={onOpenMobileFilters}
            startIcon={<FilterListRoundedIcon sx={{ fontSize: 17 }} />}
            sx={{
              whiteSpace: "nowrap",
              px: 1.5,
              py: 0.65,
              minHeight: 36,
              fontSize: "0.8125rem",
            }}
          >
            <Box component='span' sx={{ display: { xs: "inline", sm: "none" } }}>
              {mobileFiltersLabel}
            </Box>
            <Box component='span' sx={{ display: { xs: "none", sm: "inline" } }}>
              {filtersLabel}
            </Box>
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
          <Typography
            id='sort-label'
            sx={{
              display: { xs: "none", sm: "block" },
              fontSize: "0.875rem",
              color: tokens.textSecondary,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {t("sortBy")}
          </Typography>
          <Select
            size='small'
            value={sort || "best-selling"}
            onChange={(e) => onSortChange(e.target.value)}
            IconComponent={KeyboardArrowDownRoundedIcon}
            labelId='sort-label'
            sx={{
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              "& .MuiSelect-select": {
                py: { xs: 0.75, sm: 0.9 },
              },
            }}
          >
            {sortOptions.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Catalog Search Input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: 42,
          bgcolor: "#F8FAFC",
          borderRadius: "999px",
          px: 2,
          width: { xs: "100%", md: "auto" },
          flex: { md: 1 },
          maxWidth: { md: 420, lg: 480 },
          order: { xs: 1, md: 2 },
          border: `1px solid ${tokens.borderDefault}`,
          transition: "border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            borderColor: "#CBD5E1",
          },
          "&:focus-within": {
            bgcolor: "#FFFFFF",
            borderColor: tokens.primary,
            boxShadow: `0 0 0 3px ${tokens.primary}1F`,
          },
          "&:focus-within .catalog-search-icon": {
            color: tokens.primary,
          },
        }}
      >
        <SearchRoundedIcon
          className='catalog-search-icon'
          sx={{
            fontSize: 20,
            color: tokens.textMuted,
            mr: 1.15,
            flexShrink: 0,
            transition: "color 0.2s ease",
          }}
        />
        <Box
          component='input'
          type='text'
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange?.(e.target.value)}
          placeholder={t("searchPlaceholder")}
          sx={{
            border: "none",
            outline: "none",
            bgcolor: "transparent",
            width: "100%",
            fontSize: "0.875rem",
            color: tokens.textPrimary,
            fontWeight: 500,
            fontFamily: "inherit",
            p: 0,
            "&::placeholder": {
              color: tokens.textSecondary,
              opacity: 0.75,
            },
          }}
        />
        {searchValue && (
          <Box
            component='button'
            type='button'
            onClick={() => onSearchChange?.("")}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              bgcolor: "transparent",
              cursor: "pointer",
              p: 0.25,
              ml: 0.5,
              color: tokens.textSecondary,
              borderRadius: "50%",
              "&:hover": { color: tokens.textPrimary, bgcolor: "rgba(0,0,0,0.05)" },
            }}
            aria-label='Clear search'
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </Box>
        )}
      </Box>

      {/* Showing count + Pagination */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          gap: 2,
          width: { sm: "100%", md: "auto" },
          justifyContent: { sm: "center", md: "flex-end" },
          ml: { sm: 0, md: "auto" },
          flexWrap: "wrap",
          order: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            color: tokens.textSecondary,
          }}
        >
          {t("showingResults", { start: `${formattedStart}`, end: `${formattedEnd}`, total: `${formattedTotal}` })}
        </Typography>

        {effectiveTotalPages > 1 && (
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
            <Pagination
              count={effectiveTotalPages}
              page={safePage}
              onChange={(_, newPage) => {
                if (newPage !== safePage) onPageChange(newPage);
              }}
              size='small'
              shape='circular'
              siblingCount={1}
              boundaryCount={1}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default ProductTopBar;
