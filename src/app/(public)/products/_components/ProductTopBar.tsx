"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import { tokens } from "@/theme/theme";
import { Select, MenuItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

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
}

const SORT_OPTIONS = [
  { value: "best-selling", label: "Most Popular" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "discount", label: "Biggest Discount" },
] as const;

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
}: ProductTopBarProps) {
  const safeTotal = Math.max(totalProducts, 0);
  const safeLimit = Math.max(limit, 1);
  const effectiveTotalPages = Math.max(totalPages, 1);
  const safePage = Math.min(Math.max(currentPage, 1), effectiveTotalPages);

  const startItem = safeTotal === 0 ? 0 : (safePage - 1) * safeLimit + 1;
  const endItem = Math.min(safePage * safeLimit, safeTotal);

  const filtersLabel = activeFilterCount > 0 ? `Filters (${activeFilterCount})` : "Filters";

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF",
        borderRadius: "16px",
        border: `1px solid ${tokens.borderDefault}`,
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.03)",
        px: { xs: 1.5, sm: 2.5 },
        py: { xs: 1, sm: 1.25 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: { xs: 1.25, sm: 2 },
        mb: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, sm: 1.5 },
          width: { xs: "100%", md: "auto" },
          justifyContent: { xs: "space-between", md: "flex-start" },
        }}
      >
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <Button variant='outline' size='sm' onClick={onOpenMobileFilters} startIcon={<FilterListRoundedIcon sx={{ fontSize: 18 }} />}>
            {filtersLabel}
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Typography
            id='sort-label'
            sx={{
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              color: tokens.textSecondary,
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            Sort:
          </Typography>
          <Select
            size='small'
            value={sort || "best-selling"}
            onChange={(e) => onSortChange(e.target.value)}
            IconComponent={KeyboardArrowDownRoundedIcon}
            labelId='sort-label'
          >
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: { xs: "100%", md: "auto" },
          justifyContent: { xs: "center", md: "flex-end" },
          ml: { xs: 0, md: "auto" },
          flexWrap: "wrap",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            color: tokens.textSecondary,
          }}
        >
          Showing{" "}
          <strong>
            {startItem}–{endItem}
          </strong>{" "}
          of <strong>{safeTotal.toLocaleString()}</strong> products
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
