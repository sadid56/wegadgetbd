"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Box from "@mui/material/Box";
import { IconButton } from "@/components/ui/icon-button";
import { CountBadge as Badge } from "@/components/ui/badge";

import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import MenuIcon from "@mui/icons-material/Menu";
import { useCart } from "@/hooks/useCart";
import { useCategories } from "@/query-client/categories";
import { tokens } from "@/theme/theme";
import { SectionContainer } from "@/components/common/SectionContainer";
import { BrandLogo } from "@/components/common/BrandLogo";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { NavbarUserDropdown } from "./navbar-user-dropdown";
import { NavbarMegaMenu } from "./navbar-mega-menu";
import { NavbarMobile, type NavLinkItem } from "./navbar-mobile";

interface ExtendedNavItem extends NavLinkItem {
  badge?: string;
  hasDropdown?: boolean;
}

export function Navbar() {
  const t = useTranslations("navbar");
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/en" || pathname === "/bn";

  const navItems: ExtendedNavItem[] = [
    {
      name: t("products"),
      href: "/products",
      Icon: StorefrontOutlinedIcon,
      hasDropdown: true,
    },
    {
      name: t("deals"),
      href: "/products?sort=discount",
      Icon: WhatshotOutlinedIcon,
      badge: "HOT",
    },
    { name: t("offers"), href: "/products?filter=offers", Icon: LocalOfferOutlinedIcon },
    { name: t("about"), href: "/about", Icon: ArticleOutlinedIcon },
  ];

  const [navState, setNavState] = useState<"top" | "visible" | "hidden">("top");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);

  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
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
            setProductsMenuOpen(false);
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

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerContainerRef.current && !headerContainerRef.current.contains(e.target as Node)) {
        setProductsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProductsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setProductsMenuOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setProductsMenuOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setProductsMenuOpen(false);
    }, 200);
  };

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
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <BrandLogo variant='dark' size='md' href='/' />
          </Box>

          {/* Center: Sleek Cyber Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: { md: 1, lg: 1.5 },
            }}
          >
            {navItems.map((item) => {
              const Icon = item.Icon;
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              const isProducts = item.hasDropdown;

              return (
                <Box
                  key={item.href}
                  component={Link}
                  href={item.href}
                  onMouseEnter={isProducts ? handleMouseEnter : undefined}
                  onMouseLeave={isProducts ? handleMouseLeave : undefined}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: isActive || (isProducts && productsMenuOpen) ? 600 : 500,
                    color: isActive || (isProducts && productsMenuOpen) ? tokens.primary : "rgba(255, 255, 255, 0.78)",
                    px: 1.6,
                    py: 0.65,
                    borderRadius: "999px",
                    bgcolor: isActive || (isProducts && productsMenuOpen) ? "rgba(0, 191, 166, 0.15)" : "transparent",
                    border: isActive || (isProducts && productsMenuOpen) ? "1px solid rgba(0, 191, 166, 0.35)" : "1px solid transparent",
                    boxShadow: isActive || (isProducts && productsMenuOpen) ? "0 0 12px rgba(0, 191, 166, 0.25)" : "none",
                    position: "relative",
                    transition: "color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease",
                    "&:hover": {
                      color: tokens.textWhite,
                      bgcolor: isActive || (isProducts && productsMenuOpen) ? "rgba(0, 191, 166, 0.2)" : "rgba(255, 255, 255, 0.08)",
                      "& .nav-icon": {
                        color: tokens.primary,
                      },
                    },
                  }}
                >
                  {Icon && (
                    <Icon
                      className='nav-icon'
                      sx={{
                        fontSize: 17,
                        color: isActive || (isProducts && productsMenuOpen) ? tokens.primary : "rgba(255, 255, 255, 0.65)",
                        transition: "color 0.2s ease",
                      }}
                    />
                  )}
                  {item.name}

                  {/* Dropdown Chevron for Products */}
                  {isProducts && (
                    <KeyboardArrowDownRoundedIcon
                      sx={{
                        fontSize: 15,
                        color: productsMenuOpen ? tokens.primary : "rgba(255, 255, 255, 0.5)",
                        transition: "transform 0.2s ease, color 0.2s ease",
                        transform: productsMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  )}

                  {/* Micro Badge (e.g. HOT on Deals) */}
                  {item.badge && (
                    <Box
                      component='span'
                      sx={{
                        fontSize: 9,
                        fontWeight: 800,
                        px: 0.75,
                        py: 0.15,
                        borderRadius: "999px",
                        bgcolor: "#ff4d4f",
                        color: "#ffffff",
                        letterSpacing: "0.04em",
                        boxShadow: "0 0 8px rgba(255, 77, 79, 0.6)",
                      }}
                    >
                      {item.badge}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Right: Actions (Language Switcher, User Dropdown, Cart, Mobile Menu) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1.25 } }}>
            {/* Desktop Language Switcher */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
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

            {/* Mobile Hamburger Menu Icon */}
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                color: tokens.textWhite,
                p: 1,
              }}
              aria-label='Open Menu'
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </SectionContainer>

        {/* Clean Products Mega Menu on Hover */}
        <NavbarMegaMenu
          open={productsMenuOpen}
          onClose={() => setProductsMenuOpen(false)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      </Box>

      {/* Mobile Drawer */}
      <NavbarMobile open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} links={navItems} categories={categories} />
    </>
  );
}

export default Navbar;