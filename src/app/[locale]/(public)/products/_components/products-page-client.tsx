"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useQueryState, parseAsString, parseAsInteger, parseAsBoolean } from "nuqs";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { tokens } from "@/theme/theme";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";

import { useProducts, useBrands } from "@/query-client/products";
import { useCategories } from "@/query-client/categories";
import { useDebounce } from "@/hooks/use-debounce";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { ProductCard } from "../../_components/ProductCard";
import { ProductFilterSidebar, type CategoryItem } from "./ProductFilterSidebar";
import { ProductTopBar } from "./ProductTopBar";

const ITEMS_PER_PAGE = 12;
const SKELETON_COUNT = 8;
const SCROLL_TOP_OFFSET = 100;
const SEARCH_DEBOUNCE_MS = 300;

const SHALLOW = { shallow: false } as const;

const PRODUCT_GRID_SX = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(2, minmax(0, 1fr))",
    sm: "repeat(2, minmax(0, 1fr))",
    md: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(3, minmax(0, 1fr))",
    xl: "repeat(4, minmax(0, 1fr))",
  },
  gap: { xs: 1.5, sm: 2, md: 2.5 },
} as const;

function ProductSkeleton() {
  return (
    <Box
      sx={{
        bgcolor: tokens.bgPanel,
        borderRadius: "20px",
        border: `1px solid ${tokens.borderDefault}`,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Skeleton variant='rectangular' height={180} sx={{ borderRadius: "16px" }} />
      <Skeleton variant='text' width='40%' height={16} />
      <Skeleton variant='text' width='85%' height={22} />
      <Skeleton variant='text' width='50%' height={18} />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
        <Skeleton variant='rectangular' width='70%' height={38} sx={{ borderRadius: "999px" }} />
        <Skeleton variant='circular' width={38} height={38} />
      </Box>
    </Box>
  );
}

function ProductSkeletonGrid() {
  return (
    <Box sx={PRODUCT_GRID_SX}>
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </Box>
  );
}

function PageFallback() {
  return (
    <Box
      sx={{
        bgcolor: tokens.bgCanvas,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Skeleton variant='rectangular' width={280} height={40} />
        <Skeleton variant='rectangular' width={600} height={300} />
      </Box>
    </Box>
  );
}

function ShopPageContent() {
  const t = useTranslations("products");
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault("").withOptions(SHALLOW));
  const [category, setCategory] = useQueryState("category", parseAsString.withDefault("all").withOptions(SHALLOW));
  const [brand, setBrand] = useQueryState("brand", parseAsString.withDefault("").withOptions(SHALLOW));
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("best-selling").withOptions(SHALLOW));
  const [minPrice, setMinPrice] = useQueryState("minPrice", parseAsInteger.withOptions(SHALLOW));
  const [maxPrice, setMaxPrice] = useQueryState("maxPrice", parseAsInteger.withOptions(SHALLOW));
  const [inStock, setInStock] = useQueryState("inStock", parseAsBoolean.withOptions(SHALLOW));
  const [onSale, setOnSale] = useQueryState("onSale", parseAsBoolean.withOptions(SHALLOW));
  const [filter, setFilter] = useQueryState("filter", parseAsString.withOptions(SHALLOW));
  const [featured, setFeatured] = useQueryState("featured", parseAsBoolean.withOptions(SHALLOW));
  const [rating, setRating] = useQueryState("rating", parseAsInteger.withOptions(SHALLOW));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1).withOptions(SHALLOW));

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  useBodyScrollLock(mobileDrawerOpen);

  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const { data: categoriesData } = useCategories();
  const { data: brandsData = [] } = useBrands();

  const isSaleActive = Boolean(onSale || filter === "offers");

  const { data: productsData, isLoading } = useProducts({
    search: debouncedSearch || undefined,
    category: category === "all" ? undefined : category,
    brand: brand || undefined,
    sort: (sort || undefined) as any,
    minPrice: minPrice !== null && minPrice >= 0 ? minPrice : undefined,
    maxPrice: maxPrice !== null && maxPrice >= 0 ? maxPrice : undefined,
    inStock: inStock || undefined,
    onSale: isSaleActive || undefined,
    featured: featured || undefined,
    rating: rating || undefined,
    page: page || 1,
    limit: ITEMS_PER_PAGE,
  });

  const totalProducts = productsData?.total ?? 0;
  const totalPages = productsData?.totalPages ?? 1;
  const products = productsData?.products ?? [];
  const currentPage = page || 1;

  const categories: CategoryItem[] = useMemo(
    () => [
      { id: "all", name: "All Products", slug: "all", count: productsData?.total },
      ...(categoriesData ?? []).map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        count: c.productCount || undefined,
      })),
    ],
    [categoriesData, productsData?.total],
  );

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (search.trim()) n++;
    if (category && category !== "all") n++;
    if (brand.trim()) n++;
    if (minPrice !== null || maxPrice !== null) n++;
    if (inStock) n++;
    if (isSaleActive) n++;
    if (featured) n++;
    if (rating !== null) n++;
    return n;
  }, [search, category, brand, minPrice, maxPrice, inStock, isSaleActive, featured, rating]);

  const hasActiveFilters = activeFilterCount > 0;

  const resetPage = useCallback(() => setPage(null), [setPage]);

  const handleClearAll = useCallback(() => {
    setSearch(null);
    setCategory(null);
    setBrand(null);
    setMinPrice(null);
    setMaxPrice(null);
    setInStock(null);
    setOnSale(null);
    setFilter(null);
    setFeatured(null);
    setRating(null);
    setPage(null);
  }, [setSearch, setCategory, setBrand, setMinPrice, setMaxPrice, setInStock, setOnSale, setFilter, setFeatured, setRating, setPage]);

  const handlePriceChange = useCallback(
    (min: number | null, max: number | null) => {
      setMinPrice(min !== null ? Math.max(0, min) : null);
      setMaxPrice(max !== null ? Math.max(0, max) : null);
      resetPage();
    },
    [setMinPrice, setMaxPrice, resetPage],
  );

  const handleSelectCategory = useCallback(
    (slug: string) => {
      setCategory(slug === "all" ? null : slug);
      resetPage();
    },
    [setCategory, resetPage],
  );

  const handleBrandChange = useCallback(
    (val: string) => {
      setBrand(val || null);
      resetPage();
    },
    [setBrand, resetPage],
  );

  const handleInStockChange = useCallback(
    (val: boolean | null) => {
      setInStock(val);
      resetPage();
    },
    [setInStock, resetPage],
  );

  const handleOnSaleChange = useCallback(
    (val: boolean | null) => {
      setOnSale(val);
      setFilter(null);
      resetPage();
    },
    [setOnSale, setFilter, resetPage],
  );

  const handleFeaturedChange = useCallback(
    (val: boolean | null) => {
      setFeatured(val);
      resetPage();
    },
    [setFeatured, resetPage],
  );

  const handleRatingChange = useCallback(
    (val: number | null) => {
      setRating(val);
      resetPage();
    },
    [setRating, resetPage],
  );

  const handleSortChange = useCallback(
    (val: string) => {
      setSort(val === "best-selling" ? null : val);
      resetPage();
    },
    [setSort, resetPage],
  );

  const handlePageSelect = useCallback(
    (newPage: number) => {
      setPage(newPage === 1 ? null : newPage);
      window.scrollTo({ top: SCROLL_TOP_OFFSET, behavior: "smooth" });
    },
    [setPage],
  );

  const handleOpenMobileFilters = useCallback(() => setMobileDrawerOpen(true), []);
  const handleCloseMobileFilters = useCallback(() => setMobileDrawerOpen(false), []);

  const filterSidebarProps = useMemo(
    () => ({
      categories,
      activeCategory: category,
      onSelectCategory: handleSelectCategory,
      minPrice,
      maxPrice,
      onPriceChange: handlePriceChange,
      brand,
      onBrandChange: handleBrandChange,
      brands: brandsData,
      inStock,
      onInStockChange: handleInStockChange,
      onSale: isSaleActive,
      onOnSaleChange: handleOnSaleChange,
      featured,
      onFeaturedChange: handleFeaturedChange,
      rating,
      onRatingChange: handleRatingChange,
      hasActiveFilters,
      activeFilterCount,
      onClearAll: handleClearAll,
      totalProductsCount: totalProducts,
    }),
    [
      categories,
      category,
      handleSelectCategory,
      minPrice,
      maxPrice,
      handlePriceChange,
      brand,
      handleBrandChange,
      brandsData,
      inStock,
      handleInStockChange,
      isSaleActive,
      handleOnSaleChange,
      featured,
      handleFeaturedChange,
      rating,
      handleRatingChange,
      hasActiveFilters,
      activeFilterCount,
      handleClearAll,
      totalProducts,
    ],
  );

  return (
    <Box sx={{ bgcolor: tokens.bgCanvas, minHeight: "100vh", color: tokens.textPrimary }}>
      <Container
        maxWidth='xl'
        sx={{
          py: { xs: 2.5, sm: 3, md: 3.5 },
          pb: { xs: 6, md: 10 },
          px: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: { md: 3, lg: 3.5 } }}>
          <Box
            component='aside'
            sx={{
              display: { xs: "none", md: "block" },
              width: { md: 280, lg: 300 },
              flexShrink: 0,
              position: "sticky",
              top: 84,
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
              overscrollBehavior: "contain",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none" },
              pb: 4,
            }}
          >
            <ProductFilterSidebar {...filterSidebarProps} />
          </Box>

          <Box component='main' sx={{ flex: 1, minWidth: 0 }}>
            <ProductTopBar
              sort={sort}
              onSortChange={handleSortChange}
              totalProducts={totalProducts}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageSelect}
              limit={ITEMS_PER_PAGE}
              onOpenMobileFilters={handleOpenMobileFilters}
              activeFilterCount={activeFilterCount}
            />

            {isLoading ? (
              <ProductSkeletonGrid />
            ) : products.length === 0 ? (
              <EmptyState
                title={t("emptyTitle")}
                description={t("emptyDesc")}
                actionText={t("clearAll")}
                onAction={handleClearAll}
              />
            ) : (
              <Box sx={PRODUCT_GRID_SX}>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Box>
            )}

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Pagination count={totalPages} page={currentPage} onChange={(_, newPage) => handlePageSelect(newPage)} />
              </Box>
            )}
          </Box>
        </Box>
      </Container>

      <Drawer
        anchor='left'
        open={mobileDrawerOpen}
        onClose={handleCloseMobileFilters}
        disableScrollLock={true}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "86vw", sm: 360 },
              maxWidth: 380,
              bgcolor: tokens.bgCanvas,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              maxHeight: "100%",
              overflow: "hidden",
              overscrollBehavior: "contain",
            },
          },
          backdrop: { sx: { overscrollBehavior: "contain" } },
        }}
      >
        <ProductFilterSidebar {...filterSidebarProps} isMobileDrawer onCloseMobileDrawer={handleCloseMobileFilters} />
      </Drawer>
    </Box>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ShopPageContent />
    </Suspense>
  );
}