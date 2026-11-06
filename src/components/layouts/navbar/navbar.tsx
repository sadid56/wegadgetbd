"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Box from "@mui/material/Box";
import { IconButton } from "@/components/ui/icon-button";
import { CountBadge as Badge } from "@/components/ui/badge";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MenuIcon from "@mui/icons-material/Menu";
import { useCart } from "@/hooks/useCart";
import { useCategories } from "@/query-client/categories";
import { tokens } from "@/theme/theme";
import { SectionContainer } from "@/components/common/SectionContainer";
import { BrandLogo } from "@/components/common/BrandLogo";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { Dropdown } from "@/components/ui/dropdown";
import { NavbarUserDropdown } from "./navbar-user-dropdown";
import { NavbarMobile } from "./navbar-mobile";
import { NAV_CATEGORIES } from "./nav-data";

export function Navbar() {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/en" || pathname === "/bn";

  const [navState, setNavState] = useState<"top" | "visible" | "hidden">("top");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerContainerRef = useRef<HTMLDivElement | null>(null);

  const { totalCount } = useCart();
  const { data: categories = [] } = useCategories();

  // Scroll visibility
  useEffect(() => {
    let lastY = window.scrollY || document.documentElement.scrollTop || 0;
    let ticking = false;
    const SCROLL_THRESHOLD = 8;

    if (lastY > 20) {
      setNavState("visible");
    }

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY || document.documentElement.scrollTop || 0;
        const clampedY = Math.max(0, currentY);

        if (clampedY <= 20) {
          setNavState("top");
          lastY = clampedY;
          ticking = false;
          return;
        }

        const diff = clampedY - lastY;

        if (Math.abs(diff) >= SCROLL_THRESHOLD) {
          if (diff > 0 && clampedY > 80) {
            // Scrolling down -> hide navbar
            setNavState("hidden");
          } else if (diff < 0) {
            // Scrolling up -> show navbar
            setNavState("visible");
          }
          lastY = clampedY;
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Spacer for non-home pages so page content isn't covered */}
      {!isHome && <Box sx={{ height: { xs: 64, md: 72 } }} />}

      <Box
        ref={headerContainerRef}
        component='header'
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1100,
          bgcolor: navState === "top" && isHome ? "transparent" : "rgba(16, 24, 32, 0.95)",
          backdropFilter: navState === "top" && isHome ? "none" : "blur(12px)",
          WebkitBackdropFilter: navState === "top" && isHome ? "none" : "blur(12px)",
          borderBottom:
            navState === "top" && isHome ? "1px solid transparent" : "1px solid rgba(0, 191, 166, 0.22)",
          boxShadow: "none",
          transform: navState === "hidden" ? "translateY(-100%)" : "translateY(0)",
          transition:
            "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          willChange: "transform",
        }}
      >
        <SectionContainer
          component='div'
          sx={{
            height: { xs: 64, md: 72 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Left: Brand Logo */}
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <BrandLogo variant='dark' size='md' href='/' />
          </Box>

          {/* Center: Gadgets Categories with Dropdown */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
              gap: { lg: 1.25, xl: 2 },
            }}
          >
            {NAV_CATEGORIES.map((category, index) => {
              const displayName = locale === "bn" ? category.nameBn : category.name;
              const isNearRight = index >= NAV_CATEGORIES.length - 2;

              return (
                <Dropdown
                  key={category.id}
                  triggerOn="hover"
                  align={isNearRight ? "right" : "left"}
                  trigger={
                    <Box
                      component="button"
                      type="button"
                      sx={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.35,
                        fontFamily: "inherit",
                        fontSize: { lg: "12.5px", xl: "13.5px" },
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.85)",
                        py: 0.75,
                        px: { lg: 0.5, xl: 0.75 },
                        borderRadius: "6px",
                        whiteSpace: "nowrap",
                        transition: "color 0.15s ease",
                        "&:hover": {
                          color: tokens.textWhite,
                        },
                      }}
                    >
                      <span>{displayName}</span>
                      <KeyboardArrowDownRoundedIcon
                        sx={{
                          fontSize: 15,
                          color: "rgba(255, 255, 255, 0.5)",
                        }}
                      />
                    </Box>
                  }
                  items={category.subCategories.map((sub) => ({
                    label: locale === "bn" && sub.nameBn ? sub.nameBn : sub.name,
                    children: sub.items?.map((item) => ({
                      label: item.title,
                      href: item.href,
                    })),
                  }))}
                />
              );
            })}
          </Box>

          {/* Right: Actions (Language Switcher, User Dropdown, Cart, Mobile Menu) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1.25 }, flexShrink: 0 }}>
            {/* Language Switcher */}
            <Box sx={{ display: { xs: "none", sm: "flex" } }}>
              <LanguageSwitcher variant="navbar" />
            </Box>

            {/* User Profile */}
            <NavbarUserDropdown />

            {/* Shopping Cart Button */}
            <IconButton
              component={Link}
              href='/cart'
              aria-label={t("cart")}
              sx={{
                color: "rgba(255, 255, 255, 0.85)",
                p: 1,
                borderRadius: "50%",
                bgcolor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: tokens.textWhite,
                  bgcolor: "rgba(0, 191, 166, 0.15)",
                  borderColor: "rgba(0, 191, 166, 0.35)",
                  boxShadow: "0 0 12px rgba(0, 191, 166, 0.3)",
                },
              }}
            >
              <Badge
                badgeContent={totalCount}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: tokens.primary,
                    color: tokens.textWhite,
                    fontSize: 10,
                    height: 18,
                    minWidth: 18,
                    borderRadius: "999px",
                    fontWeight: 700,
                    boxShadow: "0 0 8px rgba(0, 191, 166, 0.6)",
                  },
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>

            {/* Hamburger Menu Icon (visible on mobile and tablet < 1200px) */}
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={{
                display: { xs: "inline-flex", lg: "none" },
                color: tokens.textWhite,
                p: 1,
              }}
              aria-label='Open Menu'
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </SectionContainer>
      </Box>

      {/* Mobile Drawer */}
      <NavbarMobile
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
      />
    </>
  );
}

export default Navbar;