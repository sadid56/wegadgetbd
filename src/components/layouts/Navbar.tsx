"use client";

import NextLink from "next/link";
import { FormEvent, useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Drawer from "@mui/material/Drawer";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";

import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useSession, signOut } from "@/lib/auth-client";
import { useCart } from "@/hooks/useCart";
import { tokens } from "@/theme/theme";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "All Categories", href: "/products" },
  { name: "Laptops", href: "/products?category=laptops" },
  { name: "Smartphones", href: "/products?category=smartphones" },
  { name: "Accessories", href: "/products?category=accessories" },
  { name: "Audio", href: "/products?category=audio" },
  { name: "Gaming", href: "/products?category=gaming" },
];

function NavbarContent() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [avatarAnchor, setAvatarAnchor] = useState<HTMLElement | null>(null);
  const [moreAnchor, setMoreAnchor] = useState<null | HTMLElement>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  const { data: sessionData } = useSession();
  const { totalCount } = useCart();

  const session = sessionData?.user ?? null;
  const userName = session?.name || "";
  const userEmail = session?.email || "";
  const userImage = session?.image || "";
  const userRole = (session as any)?.role || "";
  const userInitial = userName.charAt(0).toUpperCase() || "U";

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 80);
      }
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("search");
    if (q) {
      router.push(`/products?search=${q}`);
      setSearchOpen(false);
    }
  };

  const handleSignOut = async () => {
    setAvatarAnchor(null);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        width: "100%",
        mb: isHome ? { xs: "-64px", md: "-70px" } : 0,
        bgcolor: scrolled
          ? "rgba(8, 18, 14, 0.94)"
          : isHome
          ? "transparent"
          : tokens.bgDark,
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? `1px solid ${tokens.borderDark}` : "none",
        boxShadow: scrolled ? "0 10px 30px -10px rgba(0, 0, 0, 0.5)" : "none",
        transition: "all 0.25s ease",
      }}
    >
      <Box
        sx={{
          maxWidth: 1440,
          mx: "auto",
          px: { xs: 2, md: 3 },
          height: { xs: 64, md: 70 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* ═══ 1. LOGO: We Gadget BD (with green sparkle icon) ═══ */}
        <Box
          component={NextLink}
          href="/"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          {/* Clover / Sparkle icon */}
          <Box
            sx={{
              width: 32,
              height: 32,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3px",
              p: "4px",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <Box sx={{ width: 10, height: 10, bgcolor: tokens.accent, borderRadius: "50% 50% 0 50%" }} />
            <Box sx={{ width: 10, height: 10, bgcolor: tokens.primary, borderRadius: "50% 50% 50% 0" }} />
            <Box sx={{ width: 10, height: 10, bgcolor: tokens.primary, borderRadius: "50% 0 50% 50%" }} />
            <Box sx={{ width: 10, height: 10, bgcolor: tokens.accent, borderRadius: "0 50% 50% 50%" }} />
          </Box>

          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: 17, md: 19 },
              color: tokens.textWhite,
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            We Gadget BD
          </Typography>
        </Box>

        {/* ═══ 2. CENTER: NAV LINKS ═══ */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: { md: 2.5, lg: 3.5 },
          }}
        >
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
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
                  "&:hover": {
                    color: tokens.textWhite,
                  },
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
                    : {},
                }}
              >
                {link.name}
              </Box>
            );
          })}

          {/* More Dropdown */}
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
            slotProps={{
              paper: {
                sx: {
                  bgcolor: tokens.bgDarkSurface,
                  color: tokens.textWhite,
                  border: `1px solid ${tokens.borderDark}`,
                  borderRadius: `${tokens.radiusMd}px`,
                  mt: 1,
                  minWidth: 160,
                },
              },
            }}
          >
            <MenuItem onClick={() => { setMoreAnchor(null); router.push("/about"); }} sx={{ fontSize: 13 }}>
              About Us
            </MenuItem>
            <MenuItem onClick={() => { setMoreAnchor(null); router.push("/contact-us"); }} sx={{ fontSize: 13 }}>
              Contact
            </MenuItem>
            <MenuItem onClick={() => { setMoreAnchor(null); router.push("/products"); }} sx={{ fontSize: 13 }}>
              All Products
            </MenuItem>
          </Menu>
        </Box>

        {/* ═══ 3. RIGHT ICONS: Search, Account, Wishlist, Cart ═══ */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1.2 } }}>
          {/* Search Icon */}
          <IconButton
            onClick={() => setSearchOpen(true)}
            sx={{
              color: "rgba(255, 255, 255, 0.85)",
              p: 1,
              "&:hover": { color: tokens.textWhite, bgcolor: "rgba(255, 255, 255, 0.08)" },
            }}
            aria-label="Search"
          >
            <SearchIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Account Icon / Avatar */}
          {session ? (
            <>
              <IconButton
                onClick={(e) => setAvatarAnchor(e.currentTarget)}
                sx={{ p: 0.5 }}
                aria-label="User profile"
              >
                <Avatar
                  src={userImage}
                  alt={userName}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: tokens.primary,
                    color: tokens.textWhite,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {userInitial}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={avatarAnchor}
                open={Boolean(avatarAnchor)}
                onClose={() => setAvatarAnchor(null)}
                slotProps={{
                  paper: {
                    sx: {
                      bgcolor: tokens.bgDarkSurface,
                      color: tokens.textWhite,
                      border: `1px solid ${tokens.borderDark}`,
                      borderRadius: `${tokens.radiusMd}px`,
                      mt: 1,
                      minWidth: 200,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{userName}</Typography>
                  <Typography sx={{ fontSize: 12, color: tokens.textDarkMuted }}>{userEmail}</Typography>
                </Box>
                <Divider sx={{ borderColor: tokens.borderDark }} />
                {userRole === "ADMIN" && (
                  <MenuItem onClick={() => { setAvatarAnchor(null); router.push("/admin"); }}>
                    <DashboardIcon sx={{ fontSize: 16, mr: 1, color: tokens.primary }} /> Admin Dashboard
                  </MenuItem>
                )}
                <MenuItem onClick={handleSignOut} sx={{ color: tokens.danger }}>
                  <LogoutIcon sx={{ fontSize: 16, mr: 1 }} /> Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <IconButton
              component={NextLink}
              href="/auth/sign-in"
              sx={{
                color: "rgba(255, 255, 255, 0.85)",
                p: 1,
                "&:hover": { color: tokens.textWhite, bgcolor: "rgba(255, 255, 255, 0.08)" },
              }}
              aria-label="Account"
            >
              <PersonOutlineOutlinedIcon sx={{ fontSize: 22 }} />
            </IconButton>
          )}

          {/* Wishlist Icon */}
          <IconButton
            component={NextLink}
            href="/cart"
            sx={{
              color: "rgba(255, 255, 255, 0.85)",
              p: 1,
              display: { xs: "none", sm: "inline-flex" },
              "&:hover": { color: tokens.textWhite, bgcolor: "rgba(255, 255, 255, 0.08)" },
            }}
            aria-label="Wishlist"
          >
            <FavoriteBorderOutlinedIcon sx={{ fontSize: 21 }} />
          </IconButton>

          {/* Cart Icon with Mint Badge Counter */}
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
              badgeContent={mounted ? totalCount : 0}
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

          {/* Mobile Menu Button */}
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
      </Box>

      {/* ═══ SEARCH MODAL ═══ */}
      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} closeAfterTransition>
        <Fade in={searchOpen}>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              bgcolor: "rgba(8, 18, 14, 0.85)",
              backdropFilter: "blur(12px)",
              display: "flex",
              justifyContent: "center",
              p: { xs: 2, sm: 4, md: 8 },
              zIndex: 1300,
            }}
            onClick={() => setSearchOpen(false)}
          >
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{
                width: "100%",
                maxWidth: 640,
                bgcolor: tokens.bgDarkSurface,
                borderRadius: `${tokens.radiusLg}px`,
                p: 2.5,
                border: `1px solid ${tokens.borderDark}`,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
                alignSelf: "flex-start",
              }}
            >
              <form onSubmit={handleSearchSubmit}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    border: `1px solid ${tokens.borderDarkSubtle}`,
                    borderRadius: `${tokens.radiusPill}px`,
                    px: 2,
                    py: 1,
                  }}
                >
                  <SearchIcon sx={{ color: tokens.primary }} />
                  <InputBase
                    inputRef={searchRef}
                    name="search"
                    placeholder="Search gadgets, brands, or accessories..."
                    fullWidth
                    autoFocus
                    sx={{ color: tokens.textWhite, fontSize: 15 }}
                  />
                  <IconButton
                    type="submit"
                    sx={{
                      bgcolor: tokens.primary,
                      color: tokens.textWhite,
                      p: 0.75,
                      "&:hover": { bgcolor: tokens.primaryHover },
                    }}
                  >
                    <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </form>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* ═══ MOBILE DRAWER ═══ */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: "82%",
              maxWidth: 320,
              bgcolor: tokens.bgDark,
              color: tokens.textWhite,
              p: 3,
              borderLeft: `1px solid ${tokens.borderDark}`,
            },
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography sx={{ fontWeight: 800, fontSize: 18, color: tokens.textWhite }}>We Gadget BD</Typography>
          <IconButton onClick={() => setMenuOpen(false)} sx={{ color: tokens.textWhite }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: tokens.borderDark, mb: 2 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {NAV_LINKS.map((link) => (
            <Box
              key={link.name}
              component={NextLink}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              sx={{
                textDecoration: "none",
                color: tokens.textWhite,
                fontSize: 16,
                fontWeight: 500,
                py: 1,
                borderBottom: `1px solid ${tokens.borderDark}`,
              }}
            >
              {link.name}
            </Box>
          ))}
        </Box>
      </Drawer>
    </Box>
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<Box sx={{ height: 68, bgcolor: tokens.bgDark }} />}>
      <NavbarContent />
    </Suspense>
  );
}

export default Navbar;
