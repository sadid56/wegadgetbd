"use client";

import NextLink from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import { IconButton } from "@/components/ui/icon-button";
import { Menu, MenuItem } from "@/components/ui/menu";
import { CountBadge as Badge } from "@/components/ui/badge";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useCart } from "@/hooks/useCart";
import { tokens } from "@/theme/theme";
import { SectionContainer } from "@/components/common/SectionContainer";
import { BrandLogo } from "@/components/common/BrandLogo";
import { NavbarUserDropdown } from "./navbar-user-dropdown";
import { NavbarMobile, type NavLinkItem } from "./navbar-mobile";

const NAV_LINKS: NavLinkItem[] = [
  { name: "Home", href: "/" },
  { name: "All Categories", href: "/products" },
  { name: "Laptops", href: "/products?category=laptops" },
  { name: "Smartphones", href: "/products?category=smartphones" },
  { name: "Accessories", href: "/products?category=accessories" },
  { name: "Audio", href: "/products?category=audio" },
  { name: "Gaming", href: "/products?category=gaming" },
];

const MORE_LINKS = [
  { label: "All Products", href: "/products", Icon: StorefrontOutlinedIcon },
  { label: "About Us", href: "/about", Icon: InfoOutlinedIcon },
  { label: "Contact & Support", href: "/contact-us", Icon: SupportAgentOutlinedIcon },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  const [navState, setNavState] = useState<"top" | "visible" | "hidden">("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null);

  const { totalCount } = useCart();

  useEffect(() => {
    let lastY =
      window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY =
          window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

        if (currentY <= 15) {
          setNavState("top");
        } else if (currentY > lastY && currentY > 80) {
          setNavState("visible");
        } else if (currentY < lastY) {
          setNavState("hidden");
        }

        lastY = currentY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, []);

  return (
    <>
      {!isHome && <Box sx={{ height: { xs: 64, md: 70 } }} />}

      <Box
        component="header"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          width: "100%",
          bgcolor: navState === "top" && isHome ? "transparent" : tokens.bgDark,
          borderBottom:
            navState === "visible" ? `1px solid ${tokens.borderDarkSubtle}` : "1px solid transparent",
          boxShadow: navState === "visible" ? "0 10px 30px -10px rgba(0, 0, 0, 0.5)" : "none",
          "@keyframes navSlideDown": {
            from: { transform: "translateY(-100%)" },
            to: { transform: "translateY(0)" },
          },
          "@keyframes navSlideUp": {
            from: { transform: "translateY(0)" },
            to: { transform: "translateY(-100%)" },
          },
          transform: navState === "hidden" ? "translateY(-100%)" : "translateY(0)",
          animation:
            navState === "visible"
              ? "navSlideDown 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards"
              : navState === "hidden"
                ? "navSlideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards"
                : "none",
          transition: "background-color 0.25s ease",
        }}
      >
        <SectionContainer
          component="div"
          sx={{
            height: { xs: 64, md: 70 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <BrandLogo variant="dark" size="md" href="/" />

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: { md: 2.5, lg: 3.5 },
            }}
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Box
                  key={link.name}
                  component={NextLink}
                  href={link.href}
                  sx={{
                    position: "relative",
                    textDecoration: "none",
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? tokens.textWhite : "rgba(255, 255, 255, 0.75)",
                    py: 1,
                    transition: "color 0.2s ease",
                    "&:hover": { color: tokens.textWhite },
                    "&::after": isActive
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "2px",
                          bgcolor: tokens.primary,
                          borderRadius: "2px",
                        }
                      : undefined,
                  }}
                >
                  {link.name}
                </Box>
              );
            })}

            <Box
              onClick={(e) => setMoreAnchor(e.currentTarget)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.25,
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.75)",
                cursor: "pointer",
                py: 1,
                "&:hover": { color: tokens.textWhite },
              }}
            >
              More
              <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
            </Box>

            <Menu
              anchorEl={moreAnchor}
              open={Boolean(moreAnchor)}
              onClose={() => setMoreAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: { sx: { minWidth: 185 } },
              }}
            >
              {MORE_LINKS.map(({ label, href, Icon }) => (
                <MenuItem
                  key={label}
                  onClick={() => {
                    setMoreAnchor(null);
                    router.push(href);
                  }}
                >
                  <Icon />
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 } }}>
            <IconButton
              component={NextLink}
              href="/cart"
              sx={{
                color: "rgba(255, 255, 255, 0.85)",
                p: 1,
                "&:hover": { color: tokens.textWhite, bgcolor: "rgba(255, 255, 255, 0.08)" },
              }}
              aria-label="Shopping Cart"
            >
              <Badge
                badgeContent={totalCount}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: tokens.primary,
                    color: tokens.textWhite,
                    fontSize: 10,
                    height: 17,
                    minWidth: 17,
                    borderRadius: "999px",
                    fontWeight: 700,
                  },
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 21 }} />
              </Badge>
            </IconButton>

            <NavbarUserDropdown />

            <IconButton
              onClick={() => setMenuOpen(true)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                color: tokens.textWhite,
                p: 1,
              }}
              aria-label="Menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </SectionContainer>

        <NavbarMobile open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} />
      </Box>
    </>
  );
}

export default Navbar;