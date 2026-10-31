"use client";

import * as React from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { tokens } from "@/theme/theme";
import { Tooltip } from "@/components/ui/tooltip";
import { IconButton } from "@/components/ui/icon-button";
import { SectionContainer } from "@/components/common/SectionContainer";
import { useCategories } from "@/query-client/categories";
import { getAssetUrl } from "@/lib/storage";

export function CategoryRibbon() {
  const { data: categories, isLoading } = useCategories();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    // Initial check after images/content settle
    const timer = setTimeout(checkScroll, 150);

    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories, checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = Math.max(el.clientWidth * 0.55, 240);
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const showRightArrow = canScrollRight || (isLoading && !categories);
  const showRightFade = canScrollRight || (isLoading && !categories);

  if (!isLoading && (!categories || categories.length === 0)) {
    return null;
  }

  return (
    <SectionContainer
      sx={{
        position: "relative",
        zIndex: 10,
        mt: { xs: -4.5, md: -6.5 },
        mb: { xs: 3, md: 4 },
      }}
    >
      {/* Outer Wrapper with overflow visible so circular arrows can sit halfway outside on the border */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: { xs: "100%", sm: "640px", md: "840px", lg: "960px", xl: "1020px" },
          mx: "auto",
        }}
      >
        {/* Main Floating Rounded Bar */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            bgcolor: tokens.bgPanel,
            borderRadius: { xs: "22px", md: "28px" },
            border: `1px solid ${tokens.borderDefault}`,
            boxShadow: tokens.shadowLg,
            p: { xs: 1.25, sm: "12px 16px" },
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          {/* Left Smooth Fade Gradient */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: { xs: 44, sm: 68 },
              background: `linear-gradient(to right, ${tokens.bgPanel} 35%, rgba(255, 255, 255, 0) 100%)`,
              zIndex: 2,
              pointerEvents: "none",
              opacity: canScrollLeft ? 1 : 0,
              transition: "opacity 0.25s ease",
            }}
          />

          {/* Right Smooth Fade Gradient */}
          <Box
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: { xs: 44, sm: 68 },
              background: `linear-gradient(to left, ${tokens.bgPanel} 35%, rgba(255, 255, 255, 0) 100%)`,
              zIndex: 2,
              pointerEvents: "none",
              opacity: showRightFade ? 1 : 0,
              transition: "opacity 0.25s ease",
            }}
          />

          {/* Categories Horizontal Scroll Track */}
          <Box
            ref={scrollContainerRef}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2, md: 2.25 },
              overflowX: "auto",
              width: "100%",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              py: 0.5,
              px: { xs: 0.5, sm: 1 },
            }}
          >
            {isLoading && !categories ? (
              [...Array(9)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: { xs: 72, sm: 84, md: 92 },
                    height: { xs: 72, sm: 84, md: 92 },
                    borderRadius: { xs: "18px", sm: "22px" },
                    bgcolor: tokens.bgSubtle,
                    border: `1px solid ${tokens.borderSubtle}`,
                    p: { xs: 1.25, sm: 1.6 },
                    flexShrink: 0,
                    overflow: "hidden",
                  }}
                >
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    sx={{
                      width: "65%",
                      height: "65%",
                      borderRadius: "12px",
                      bgcolor: "rgba(15, 23, 42, 0.05)",
                    }}
                  />
                </Box>
              ))
            ) : (
              categories?.map((cat) => (
                <Tooltip key={cat.slug} title={cat.name} arrow>
                  <Box
                    component={NextLink}
                    href={`/products?category=${cat.slug}`}
                    aria-label={cat.name}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: { xs: 72, sm: 84, md: 92 },
                      height: { xs: 72, sm: 84, md: 92 },
                      borderRadius: { xs: "18px", sm: "22px" },
                      bgcolor: tokens.bgSubtle,
                      border: `1px solid ${tokens.borderSubtle}`,
                      transition: "background-color 0.2s ease, border-color 0.2s ease",
                      p: { xs: 1.25, sm: 1.6 },
                      flexShrink: 0,
                      textDecoration: "none",
                      overflow: "hidden",
                      // No bounce effect on hover
                      "&:hover": {
                        bgcolor: tokens.primaryLight,
                        borderColor: tokens.primaryBorder,
                      },
                    }}
                  >
                    {cat.icon && (
                      <Box
                        component="img"
                        src={getAssetUrl(cat.icon)}
                        alt={cat.name}
                        loading="eager"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          display: "block",
                        }}
                      />
                    )}
                  </Box>
                </Tooltip>
              ))
            )}
          </Box>
        </Box>

        {/* Circular Left Arrow sitting halfway on the border */}
        {canScrollLeft && (
          <IconButton
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            size="small"
            sx={{
              position: "absolute",
              top: "50%",
              left: { xs: -14, sm: -18 },
              transform: "translateY(-50%)",
              zIndex: 10,
              bgcolor: tokens.bgPanel,
              border: `1px solid ${tokens.borderDefault}`,
              boxShadow: "0 4px 14px rgba(15, 23, 42, 0.14)",
              color: tokens.textPrimary,
              width: { xs: 34, sm: 38 },
              height: { xs: 34, sm: 38 },
              borderRadius: "50%",
              "&:hover": {
                bgcolor: tokens.bgSubtle,
                borderColor: tokens.borderHover,
              },
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
          </IconButton>
        )}

        {/* Circular Right Arrow sitting halfway on the border */}
        {showRightArrow && (
          <IconButton
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            size="small"
            sx={{
              position: "absolute",
              top: "50%",
              right: { xs: -14, sm: -18 },
              transform: "translateY(-50%)",
              zIndex: 10,
              bgcolor: tokens.bgPanel,
              border: `1px solid ${tokens.borderDefault}`,
              boxShadow: "0 4px 14px rgba(15, 23, 42, 0.14)",
              color: tokens.textPrimary,
              width: { xs: 34, sm: 38 },
              height: { xs: 34, sm: 38 },
              borderRadius: "50%",
              "&:hover": {
                bgcolor: tokens.bgSubtle,
                borderColor: tokens.borderHover,
              },
            }}
          >
            <ChevronRightIcon sx={{ fontSize: { xs: 18, sm: 22 } }} />
          </IconButton>
        )}
      </Box>
    </SectionContainer>
  );
}

export default CategoryRibbon;
