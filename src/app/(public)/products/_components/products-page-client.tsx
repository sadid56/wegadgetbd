"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { keyframes } from "@emotion/react";

import { useProducts } from "@/query-client/products";
import { useCategories } from "@/query-client/categories";
import { ProductCard } from "../../_components/ProductCard";
import { ProductHero } from "./ProductHero";
import { FilterBar } from "./FilterBar";
import { TagTabs } from "./TagTabs";
import { FAQ } from "@/components/common/FAQ";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.5; }
`;

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "newest";
  const debouncedSearch = useDebouncedValue(search, 300);

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      const isDefault =
        (key === "category" && value === "all") || (key === "sort" && value === "newest") || (key === "search" && value === "");

      if (isDefault) params.delete(key);
      else params.set(key, value);

      const next = `${pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      const current = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

      if (next !== current) router.replace(next, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const { data: categoriesData } = useCategories();

  const { data: productsData, isLoading } = useProducts({
    search: debouncedSearch,
    category: category === "all" ? undefined : category,
    sort,
    limit: 20,
  });

  const availableTags = useMemo(() => {
    if (!productsData?.products) return [];
    const tags = new Set<string>();
    productsData.products.forEach((p) => {
      p.tags?.forEach((t) => tags.add(t));
    });
    return Array.from(tags).slice(0, 10);
  }, [productsData]);

  const hasActiveFilters = !!search || category !== "all";

  const handleClearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const categories = useMemo(() => {
    return [{ id: "all", name: "All Products", slug: "all" }, ...(categoriesData || [])];
  }, [categoriesData]);

  return (
    <Box sx={{ bgcolor: "rgba(249,250,251,0.3)", minHeight: "100vh", color: "#111827" }}>
      <ProductHero search={search} totalProducts={productsData?.total || 0} />

      <Container maxWidth='xl' sx={{ py: 1, pb: { xs: 4, md: 8 }, px: { xs: 0, md: 2 } }}>
        <FilterBar
          search={search}
          category={category}
          sort={sort}
          categories={categories}
          hasActiveFilters={hasActiveFilters}
          onParamChange={setParam}
          onClearFilters={handleClearFilters}
        />

        <TagTabs
          search={search}
          activeTag={searchParams.get("tag") as string | null}
          availableTags={availableTags}
          onTagClick={(tag) => setParam("search", tag)}
        />

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 16,
            }}
          >
            <CircularProgress size={48} sx={{ color: "#ff7319", mb: 3 }} />
            <Box
              className='bricolage'
              sx={{
                fontSize: 10,
                fontWeight: 900,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#9ca3af",
                animation: `${pulse} 1.5s ease-in-out infinite`,
              }}
            >
              Curating your tech universe
            </Box>
          </Box>
        ) : productsData?.products.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 12,
              borderRadius: "32px",
              border: "1px dashed #e5e7eb",
              bgcolor: "#fff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              className='bricolage'
              sx={{
                color: "#6b7280",
                fontWeight: 500,
                fontSize: 18,
                mb: 3,
              }}
            >
              No products match your criteria
            </Typography>
            <Button
              variant='outlined'
              onClick={() => {
                setParam("search", "");
                setParam("category", "all");
              }}
              disableElevation
              sx={{
                borderColor: "#ff7319",
                color: "#ff7319",
                fontWeight: 700,
                px: 4,
                borderRadius: 999,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#ff7319",
                  bgcolor: "#fff7ed",
                },
              }}
            >
              Reset filters
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
                xl: "repeat(4, minmax(0, 1fr))",
              },
              gap: { xs: 1, md: 3 },
              mx: 0.5,
            }}
          >
            {productsData?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Box>
        )}
      </Container>

      <FAQ />
    </Box>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            bgcolor: "background.default",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={48} sx={{ color: "primary.main" }} />
        </Box>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}
