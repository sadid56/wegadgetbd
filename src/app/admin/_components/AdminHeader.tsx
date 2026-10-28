"use client";

import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import InputBase from "@mui/material/InputBase";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CloseIcon from "@mui/icons-material/Close";

import { authClient } from "@/lib/auth-client";
import { sidebarItems, SidebarContent } from "./Sidebar";
import { IMAGES } from "@/constant/images";

interface AdminHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarAnchor, setAvatarAnchor] = useState<HTMLElement | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchAnchorRef = useRef<HTMLDivElement>(null);

  const filteredItems = sidebarItems.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()));

  const isSearchOpen = Boolean(searchQuery.length > 0 && searchAnchorRef.current);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    setAvatarAnchor(null);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/sign-in");
        },
      },
    });
  };

  const userInitial = user.name.charAt(0).toUpperCase();

  return (
    <Box
      component='header'
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        gap: 2,
        height: 64,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "rgba(var(--mui-palette-background-defaultChannel) / 0.6)",
        backdropFilter: "blur(20px)",
        px: { xs: 2, md: 3 },
      }}
    >
      <Box sx={{ display: "flex", flex: 1, alignItems: "center", gap: { xs: 1, md: 4 } }}>
        {/* Mobile menu trigger */}
        <IconButton
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label='Toggle menu'
          sx={{
            display: { md: "none" },
            borderRadius: "12px",
            color: "text.primary",
          }}
        >
          <MenuIcon sx={{ fontSize: 20 }} />
        </IconButton>

        {/* Search with popover */}
        <Box sx={{ position: "relative", width: "100%", maxWidth: 448, display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          <Box ref={searchAnchorRef} sx={{ position: "relative", width: "100%" }}>
            <SearchIcon
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 16,
                color: "text.secondary",
                pointerEvents: "none",
                zIndex: 1,
              }}
            />
            <InputBase
              inputRef={searchInputRef}
              type='text'
              placeholder='Search dashboard...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {}}
              sx={{
                width: "100%",
                height: 40,
                pl: "40px",
                pr: "48px",
                borderRadius: "12px",
                bgcolor: "action.hover",
                fontSize: 14,
                color: "text.primary",
                transition: "box-shadow 200ms",
                "& input::placeholder": { color: "text.secondary", opacity: 1 },
                "&.Mui-focused": { boxShadow: "0 0 0 4px rgba(59,130,246,0.2)" },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <Box
                component='kbd'
                sx={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  bgcolor: "rgba(var(--mui-palette-background-defaultChannel) / 0.5)",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "4px",
                  px: 0.75,
                  py: 0.25,
                  color: "text.secondary",
                  lineHeight: 1.2,
                }}
              >
                ⌘K
              </Box>
            </Box>
          </Box>

          <Popper open={isSearchOpen} anchorEl={searchAnchorRef.current} placement='bottom-start' sx={{ zIndex: 1400 }}>
            <ClickAwayListener onClickAway={() => setSearchQuery("")}>
              <Paper
                elevation={0}
                sx={{
                  mt: 0.5,
                  p: 0.5,
                  width: 400,
                  maxHeight: 300,
                  overflowY: "auto",
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 8px 10px -6px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(20px)",
                  bgcolor: "rgba(var(--mui-palette-background-paperChannel) / 0.95)",
                }}
              >
                {filteredItems.length > 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    {filteredItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Box
                          key={item.href}
                          component={NextLink}
                          href={item.href}
                          onClick={() => {
                            setSearchQuery("");
                          }}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            px: 1.5,
                            py: 1.25,
                            borderRadius: "8px",
                            textDecoration: "none",
                            color: "text.primary",
                            transition: "all 150ms",
                            "&:hover": {
                              bgcolor: "rgba(59,130,246,0.1)",
                              color: "primary.main",
                              "& .search-item-icon": { bgcolor: "rgba(59,130,246,0.2)" },
                            },
                          }}
                        >
                          <Box
                            className='search-item-icon'
                            sx={{
                              p: 1,
                              borderRadius: "6px",
                              bgcolor: "action.hover",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "background-color 150ms",
                            }}
                          >
                            <Icon sx={{ fontSize: 16 }} />
                          </Box>
                          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                            <Box component='span' sx={{ fontSize: 14, fontWeight: 700 }}>
                              {item.label}
                            </Box>
                            <Box
                              component='span'
                              sx={{
                                fontSize: 10,
                                color: "text.secondary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.href}
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                ) : (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Box component='p' sx={{ fontSize: 14, color: "text.secondary", m: 0 }}>
                      No results found for &quot;{searchQuery}&quot;
                    </Box>
                  </Box>
                )}
              </Paper>
            </ClickAwayListener>
          </Popper>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 } }}>
        {/* Theme toggle */}
        <IconButton
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label='Toggle theme'
          sx={{
            borderRadius: "12px",
            color: "text.primary",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          {theme === "dark" ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
        </IconButton>

        {/* Avatar dropdown */}
        <IconButton
          onClick={(e) => setAvatarAnchor(e.currentTarget)}
          aria-label='User menu'
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            p: 0,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            transition: "border-color 200ms",
            "&:hover": { borderColor: "rgba(59,130,246,0.3)" },
          }}
        >
          <Avatar
            src={user.image || IMAGES?.default_avatar}
            alt={user.name}
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: 0,
              bgcolor: "rgba(59,130,246,0.1)",
              color: "primary.main",
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            {userInitial}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={avatarAnchor}
          open={Boolean(avatarAnchor)}
          onClose={() => setAvatarAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                width: 256,
                mt: 1.25,
                borderRadius: "16px",
                p: 1,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 8px 10px -6px rgba(0,0,0,0.1)",
              },
            },
          }}
        >
          <Box sx={{ px: 1.5, py: 1.5 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                lineHeight: 1.2,
                color: "text.primary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: "text.secondary",
                lineHeight: 1.4,
                mt: 0.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </Typography>
          </Box>

          <Divider sx={{ bgcolor: "action.hover" }} />

          <MenuItem
            onClick={handleSignOut}
            sx={{
              borderRadius: "12px",
              p: 1.5,
              mt: 0.5,
              color: "error.main",
              "&:hover": { bgcolor: "rgba(239,68,68,0.1)", color: "error.main" },
            }}
          >
            <LogoutIcon sx={{ fontSize: 16, mr: 1 }} />
            <Box component='span' sx={{ fontSize: 14 }}>
              Log out
            </Box>
          </MenuItem>
        </Menu>
      </Box>

      {/* Mobile sidebar drawer */}
      <Drawer
        anchor='left'
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 256,
              p: 0,
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            component={NextLink}
            href='/'
            onClick={() => setIsMobileMenuOpen(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "text.primary",
            }}
          >
            <Inventory2OutlinedIcon sx={{ fontSize: 20 }} />
            <Box component='span' sx={{ fontSize: 16, fontWeight: 700 }}>
              Bongo Admin
            </Box>
          </Box>
          <IconButton onClick={() => setIsMobileMenuOpen(false)} size='small' aria-label='Close menu' sx={{ borderRadius: "8px" }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Box sx={{ py: 2 }}>
          <SidebarContent onItemClick={() => setIsMobileMenuOpen(false)} />
        </Box>
      </Drawer>
    </Box>
  );
}
