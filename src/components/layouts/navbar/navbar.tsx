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
      {!isHome && <Box sx={{ height: { xs: 66, sm: 76, md: 84 } }} />}

      {/* Outer Fixed Centered Wrapper */}
      <Box
        ref={headerContainerRef}
        component='nav'
        sx={{
          position: "fixed",
          top: { xs: 8, sm: 12, md: 16 },
          left: 0,
          right: 0,
          zIndex: 1100,
          width: "100%",
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
          pointerEvents: "none",
          transform: navState === "hidden" ? "translateY(-130%)" : "translateY(0)",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
      >
        {/* Floating Pill Bar */}
        <Box
          sx={{
            pointerEvents: "auto",
            width: "100%",
            height: { xs: 54, sm: 58, md: 64 },
            bgcolor: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "9999px",
            // border: "1px solid #E2E8F0",
            boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
            px: { xs: 1.5, sm: 2, md: 2.75 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* Left: Brand Logo */}
          <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0, mr: { xs: 1, md: 2 } }}>
            <BrandLogo variant='light' size='md' href='/' showText={false} />
          </Box>

          {/* Center: Gadgets Categories with Dropdown */}
          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              gap: { lg: 0.75, xl: 1.5 },
              flexShrink: 1,
              minWidth: 0,
              overflow: "hidden",
            }}
          >
            {NAV_CATEGORIES.map((category, index) => {
              const displayName = locale === "bn" ? category.nameBn : category.name;
              const isNearRight = index >= NAV_CATEGORIES.length - 2;

              return (
                <Dropdown
                  key={category.id}
                  triggerOn='hover'
                  align={isNearRight ? "right" : "left"}
                  trigger={
                    <Box
                      component='button'
                      type='button'
                      sx={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.3,
                        fontFamily: "inherit",
                        fontSize: { lg: "12px", xl: "13px" },
                        fontWeight: 600,
                        color: "#1E293B",
                        py: 0.6,
                        px: { lg: 0.75, xl: 1.1 },
                        borderRadius: "9999px",
                        whiteSpace: "nowrap",
                        transition: "color 0.15s ease, background-color 0.15s ease",
                        "&:hover": {
                          color: tokens.primary,
                          bgcolor: "rgba(0, 191, 166, 0.08)",
                        },
                      }}
                    >
                      <span>{displayName}</span>
                      <KeyboardArrowDownRoundedIcon
                        sx={{
                          fontSize: 15,
                          color: "#64748B",
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

          {/* Right: Actions (Language Switcher, User Profile, Cart, Mobile Menu) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.75, sm: 1.25 },
              flexShrink: 0,
              ml: { xs: "auto", lg: 0 },
            }}
          >
            {/* Language Switcher */}
            <Box sx={{ display: { xs: "none", sm: "flex" }, flexShrink: 0 }}>
              <LanguageSwitcher variant='navbar' />
            </Box>

            {/* User Profile (stays securely inside navbar) */}
            <Box sx={{ flexShrink: 0 }}>
              <NavbarUserDropdown />
            </Box>

            {/* Shopping Cart Button (stays securely inside navbar) */}
            <Box sx={{ flexShrink: 0 }}>
              <IconButton
                component={Link}
                href='/cart'
                aria-label={`${t("cart")} (${totalCount})`}
                sx={{
                  color: "#0F172A",
                  p: 1,
                  borderRadius: "50%",
                  bgcolor: "rgba(15, 23, 42, 0.04)",
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: tokens.primary,
                    bgcolor: "rgba(0, 191, 166, 0.1)",
                    borderColor: "rgba(0, 191, 166, 0.25)",
                  },
                }}
              >
                <Badge
                  aria-hidden='true'
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
                    },
                  }}
                >
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 20 }} />
                </Badge>
              </IconButton>
            </Box>

            {/* Hamburger Menu Icon (visible on mobile and tablet < 1200px) */}
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={{
                display: { xs: "inline-flex", lg: "none" },
                color: "#0F172A",
                p: 1,
                borderRadius: "50%",
                bgcolor: "rgba(15, 23, 42, 0.04)",
                flexShrink: 0,
              }}
              aria-label='Open Menu'
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <NavbarMobile open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} categories={categories} />
    </>
  );
}

export default Navbar;
