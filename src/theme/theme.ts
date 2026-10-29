import { createTheme } from "@mui/material";

export const tokens = {
  // Surfaces & Backgrounds - Clean, crisp e-commerce canvas with deep dark obsidian surfaces
  bgCanvas: "#f8fafc", // Clean cool page canvas
  bgPanel: "#ffffff", // Pure crisp white panels & cards
  bgInput: "#ffffff", // Pure white form controls
  bgElevated: "#ffffff", // Elevated menus, popovers, modals
  bgSubtle: "#f1f5f9", // Slate 100 - tags, soft hover states
  bgOverlay: "rgba(8, 18, 14, 0.75)",
  bgBackdrop: "rgba(8, 18, 14, 0.5)",
  bgBlack: "#08120e",

  // Dark obsidian & forest green surfaces (Hero, banners, footer)
  bgDark: "#08120e",
  bgDarkSurface: "#0c1a14",
  bgDarkElevated: "#11241c",
  bgDarkSubtle: "rgba(255, 255, 255, 0.05)",

  // Borders - Crisp modern lines
  borderDefault: "#e2e8f0", // Slate 200
  borderSubtle: "#f1f5f9", // Slate 100
  borderElevated: "#cbd5e1", // Slate 300
  borderHover: "#94a3b8", // Slate 400
  borderActive: "#10b981", // Brand Emerald
  borderDisabled: "#f1f5f9",
  borderDark: "rgba(255, 255, 255, 0.08)",
  borderDarkSubtle: "rgba(16, 185, 129, 0.18)",

  // Primary / Brand (Emerald Green Tech Theme matching We Gadget BD)
  primary: "#10b981", // Emerald 500
  primaryHover: "#059669", // Emerald 600
  primaryLight: "#ecfdf5", // Emerald 50 soft tint
  primarySubtle: "rgba(16, 185, 129, 0.08)",
  primaryDisabled: "rgba(16, 185, 129, 0.3)",
  primaryBorder: "rgba(16, 185, 129, 0.28)",

  // Secondary / Accent (Mint / Cyan Highlight)
  accent: "#34d399", // Mint 400
  accentHover: "#10b981",
  accentLight: "#f0fdf4",
  accentSubtle: "rgba(52, 211, 153, 0.12)",

  // Badge specific tags
  badgeNew: "#0ea5e9",
  badgeNewSubtle: "rgba(14, 165, 233, 0.12)",
  badgeSale: "#f97316",
  badgeSaleSubtle: "rgba(249, 115, 22, 0.12)",
  badgeGaming: "#8b5cf6",
  badgeGamingSubtle: "rgba(139, 92, 246, 0.12)",

  // Typography Colors - High readability, professional contrast
  textPrimary: "#0f172a", // Slate 900
  textSecondary: "#475569", // Slate 600
  textMuted: "#64748b", // Slate 500
  textDisabled: "#94a3b8", // Slate 400
  textWhite: "#ffffff",
  textDarkMuted: "#94a3b8",

  // Status: Success
  success: "#10b981",
  successText: "#059669",
  successSubtle: "rgba(16, 185, 129, 0.10)",
  successBorder: "rgba(16, 185, 129, 0.25)",

  // Status: Warning
  warning: "#f59e0b",
  warningHover: "#d97706",
  warningSubtle: "rgba(245, 158, 11, 0.10)",
  warningBorder: "rgba(245, 158, 11, 0.25)",

  // Status: Error / Danger
  error: "#ef4444",
  errorSubtle: "rgba(239, 68, 68, 0.10)",
  danger: "#ef4444",
  dangerHover: "#dc2626",
  dangerSubtle: "rgba(239, 68, 68, 0.10)",
  dangerBorder: "rgba(239, 68, 68, 0.25)",

  // Shadows - Soft modern elevations
  shadowSm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  shadowMd: "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
  shadowLg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
  shadowElevated: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)",
  shadowPopover: "0 12px 28px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.08)",
  shadowDrawerRight: "-10px 0 30px rgba(15, 23, 42, 0.08)",
  shadowDrawerLeft: "10px 0 30px rgba(15, 23, 42, 0.08)",
  shadowPrimary: "0 4px 14px rgba(16, 185, 129, 0.25)",
  shadowPrimaryHover: "0 6px 20px rgba(16, 185, 129, 0.35)",

  // Border Radii
  radiusSm: 6,
  radiusMd: 10,
  radiusLg: 14,
  radiusXl: 20,
  radiusPill: 9999,
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: tokens.primary,
      light: "#34d399",
      dark: tokens.primaryHover,
      contrastText: "#ffffff",
    },
    secondary: {
      main: tokens.accent,
      light: "#6ee7b7",
      dark: tokens.accentHover,
      contrastText: "#ffffff",
    },
    background: {
      default: tokens.bgCanvas,
      paper: tokens.bgPanel,
    },
    text: {
      primary: tokens.textPrimary,
      secondary: tokens.textSecondary,
    },
    divider: tokens.borderDefault,
    action: {
      hover: tokens.bgSubtle,
      selected: "rgba(16, 185, 129, 0.08)",
      disabled: tokens.textDisabled,
    },
    success: {
      main: tokens.success,
    },
    warning: {
      main: tokens.warning,
    },
    error: {
      main: tokens.error,
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.025em", color: tokens.textPrimary },
    h2: { fontWeight: 700, letterSpacing: "-0.02em", color: tokens.textPrimary },
    h3: { fontWeight: 700, letterSpacing: "-0.02em", color: tokens.textPrimary },
    h4: { fontWeight: 700, letterSpacing: "-0.015em", color: tokens.textPrimary },
    h5: { fontWeight: 700, letterSpacing: "-0.01em", color: tokens.textPrimary },
    h6: { fontWeight: 600, letterSpacing: "-0.01em", color: tokens.textPrimary },
    subtitle1: { fontWeight: 600, letterSpacing: "-0.01em" },
    subtitle2: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: tokens.radiusMd,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: tokens.bgCanvas,
          color: tokens.textPrimary,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none !important",
          backgroundColor: tokens.bgPanel,
          color: tokens.textPrimary,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none !important",
          backgroundColor: tokens.bgPanel,
          borderRight: `1px solid ${tokens.borderDefault}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none !important",
          backgroundColor: tokens.bgPanel,
          border: `1px solid ${tokens.borderDefault}`,
          borderRadius: tokens.radiusLg,
          boxShadow: tokens.shadowSm,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundImage: "none !important",
          backgroundColor: `${tokens.bgElevated} !important`,
          border: `1px solid ${tokens.borderDefault} !important`,
          boxShadow: `${tokens.shadowPopover} !important`,
          borderRadius: `${tokens.radiusLg}px !important`,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: `${tokens.bgElevated} !important`,
          backgroundImage: "none !important",
          border: `1px solid ${tokens.borderDefault} !important`,
          boxShadow: `${tokens.shadowPopover} !important`,
          borderRadius: `${tokens.radiusLg}px !important`,
          marginTop: "6px",
        },
        list: {
          padding: "6px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          borderRadius: tokens.radiusSm,
          margin: "2px 4px",
          color: tokens.textPrimary,
          "&:hover": {
            backgroundColor: tokens.bgSubtle,
          },
          "&.Mui-selected": {
            backgroundColor: `${tokens.primarySubtle} !important`,
            color: `${tokens.primary} !important`,
            fontWeight: 600,
            border: `1px solid ${tokens.primaryBorder}`,
            "&:hover": {
              backgroundColor: `${tokens.primarySubtle} !important`,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radiusMd,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radiusSm,
          fontWeight: 500,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.bgInput,
          borderRadius: tokens.radiusMd,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.borderDefault,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.borderHover,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.primary,
          },
        },
      },
    },
  },
});

export const darkTheme = theme;
export default theme;
