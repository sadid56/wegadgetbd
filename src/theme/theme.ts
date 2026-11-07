import { createTheme } from "@mui/material";

export const APP_FONT_FAMILY = "var(--font-app), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export const tokens = {
  fontFamily: APP_FONT_FAMILY,

  // =========================================================================
  // MATERIAL YOU 3 (M3) TONAL SURFACES & CONTAINERS
  // =========================================================================
  bgCanvas: "#F8FAF9", // M3 Surface - clean, calm modern tone with subtle neutral tint
  bgSurface: "#F8FAF9",
  bgPanel: "#ffffff", // M3 Surface Container Lowest - crisp, pure clean card face
  bgInput: "#ffffff",
  bgElevated: "#ffffff",
  bgSubtle: "#EEF3F2", // M3 Surface Container Low / Muted hover state
  bgSurfaceContainerLowest: "#ffffff",
  bgSurfaceContainerLow: "#F2F5F4",
  bgSurfaceContainer: "#ECEFEF",
  bgSurfaceContainerHigh: "#E6EAE9",
  bgSurfaceContainerHighest: "#E0E4E3",
  bgOverlay: "rgba(17, 24, 23, 0.70)",
  bgBackdrop: "rgba(17, 24, 23, 0.45)",
  bgBlack: "#0B1110",

  // Dark obsidian & deep midnight surfaces (Hero, banners, footer)
  bgDark: "#101820", // Brand Midnight (#101820)
  bgDarkSurface: "#18232e", // Deep midnight surface
  bgDarkElevated: "#1f2c3a", // Elevated midnight card
  bgDarkSubtle: "rgba(255, 255, 255, 0.05)",

  // =========================================================================
  // MATERIAL YOU 3 (M3) OUTLINES & BORDERS
  // =========================================================================
  outline: "#6F7978",
  outlineVariant: "#DDE3E2",
  borderDefault: "#E2E7E6", // M3 Outline Variant - subtle, crisp, modern
  borderSubtle: "#EDF2F1",
  borderElevated: "#CFD6D5",
  borderHover: "#8E9897",
  borderActive: "#00BFA6", // Brand Teal Seed (#00BFA6)
  borderDisabled: "#EDF2F1",
  borderDark: "rgba(255, 255, 255, 0.08)",
  borderDarkSubtle: "rgba(0, 191, 166, 0.22)",

  // =========================================================================
  // MATERIAL YOU 3 (M3) PRIMARY & TONAL ROLES
  // =========================================================================
  primary: "#00BFA6", // Brand Seed Teal
  primaryDark: "#008A77",
  primaryHover: "#00A892",
  primaryContainer: "#CCF6EE", // M3 Primary Container - soothing tonal pill background
  onPrimaryContainer: "#003831", // M3 On-Primary Container text
  primaryLight: "#E6FAF6",
  primarySubtle: "rgba(0, 191, 166, 0.12)",
  primaryDisabled: "rgba(0, 191, 166, 0.35)",
  primaryBorder: "rgba(0, 191, 166, 0.28)",
  onPrimary: "#ffffff",

  // =========================================================================
  // MATERIAL YOU 3 (M3) SECONDARY & TERTIARY / ACCENT
  // =========================================================================
  secondary: "#3B5A54",
  secondaryContainer: "#D5E7E3",
  onSecondaryContainer: "#07201C",
  accent: "#FFB547", // Brand Accent / Tertiary Warm Amber
  accentHover: "#F5A631",
  accentLight: "#FFF7EB",
  accentSubtle: "rgba(255, 181, 71, 0.16)",
  tertiaryContainer: "#FFE5C2",
  onTertiaryContainer: "#341E00",

  // Badge specific tags
  badgeNew: "#00BFA6",
  badgeNewSubtle: "rgba(0, 191, 166, 0.12)",
  badgeSale: "#FFB547",
  badgeSaleSubtle: "rgba(255, 181, 71, 0.16)",
  badgeGaming: "#8B5CF6",
  badgeGamingSubtle: "rgba(139, 92, 246, 0.12)",

  // =========================================================================
  // MATERIAL YOU 3 (M3) TYPOGRAPHY / ON-SURFACE COLORS
  // =========================================================================
  textPrimary: "#111817", // M3 High-contrast Neutral-10
  textSecondary: "#424D4C", // M3 Neutral Variant 30
  textMuted: "#6B7776", // M3 Neutral Variant 50
  textDisabled: "#9EA7A6",
  textWhite: "#ffffff",
  textDarkMuted: "#94a3b8",

  // Status Colors
  success: "#10b981",
  successText: "#059669",
  successContainer: "#D1FAE5",
  onSuccessContainer: "#064E3B",
  successSubtle: "rgba(16, 185, 129, 0.12)",
  successBorder: "rgba(16, 185, 129, 0.28)",

  warning: "#f59e0b",
  warningHover: "#d97706",
  warningContainer: "#FEF3C7",
  onWarningContainer: "#78350F",
  warningSubtle: "rgba(245, 158, 11, 0.12)",
  warningBorder: "rgba(245, 158, 11, 0.28)",

  error: "#ef4444",
  errorContainer: "#FEE2E2",
  onErrorContainer: "#7F1D1D",
  errorSubtle: "rgba(239, 68, 68, 0.12)",
  danger: "#ef4444",
  dangerHover: "#dc2626",
  dangerSubtle: "rgba(239, 68, 68, 0.12)",
  dangerBorder: "rgba(239, 68, 68, 0.28)",

  info: "#0ea5e9",
  infoHover: "#0284c7",
  infoContainer: "#E0F2FE",
  onInfoContainer: "#0C4A6E",
  infoSubtle: "rgba(14, 165, 233, 0.12)",
  infoBorder: "rgba(14, 165, 233, 0.28)",

  // =========================================================================
  // MATERIAL YOU 3 (M3) ELEVATION & SHADOWS
  // =========================================================================
  elevation0: "none",
  elevation1: "0 1px 3px 1px rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.07)",
  elevation2: "0 2px 6px 2px rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.07)",
  elevation3: "0 4px 8px 3px rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.08)",
  elevation4: "0 6px 10px 4px rgba(0, 0, 0, 0.06), 0 2px 3px 0 rgba(0, 0, 0, 0.09)",
  elevation5: "0 8px 12px 6px rgba(0, 0, 0, 0.07), 0 4px 4px 0 rgba(0, 0, 0, 0.10)",

  shadowSm: "0 1px 3px 1px rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.07)",
  shadowMd: "0 2px 6px 2px rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.07)",
  shadowLg: "0 4px 8px 3px rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.08)",
  shadowElevated: "0 6px 12px 4px rgba(0, 0, 0, 0.06), 0 2px 4px 0 rgba(0, 0, 0, 0.08)",
  shadowPopover: "0 10px 24px -2px rgba(17, 24, 23, 0.10), 0 4px 10px -2px rgba(17, 24, 23, 0.06)",
  shadowDrawerRight: "-8px 0 24px rgba(17, 24, 23, 0.07)",
  shadowDrawerLeft: "8px 0 24px rgba(17, 24, 23, 0.07)",
  shadowPrimary: "0 4px 16px rgba(0, 191, 166, 0.28)",
  shadowPrimaryHover: "0 6px 22px rgba(0, 191, 166, 0.38)",

  // =========================================================================
  // MATERIAL YOU 3 (M3) SHAPE TOKENS (CORNER RADII)
  // =========================================================================
  radiusXs: 4, // M3 Extra Small
  radiusSm: 8, // M3 Small (Tooltips, Inner chips)
  radiusMd: 12, // M3 Medium (Inputs, Small cards)
  radiusLg: 16, // M3 Large (Standard Cards, Menus, Popovers)
  radiusXl: 24, // M3 Extra Large (Feature cards, Drawers)
  radiusXxl: 28, // M3 Dialogs & Sheets
  radiusPill: 9999, // M3 Full / Pill (Buttons, Search bars, Badges)
  radiusFull: 9999,
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: tokens.primary,
      light: "#33ccb8",
      dark: tokens.primaryHover,
      contrastText: "#ffffff",
    },
    secondary: {
      main: tokens.accent,
      light: "#ffc46b",
      dark: tokens.accentHover,
      contrastText: "#101820",
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
      selected: "rgba(0, 191, 166, 0.10)",
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
    fontFamily: APP_FONT_FAMILY,
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
    borderRadius: tokens.radiusLg,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontFamily: APP_FONT_FAMILY,
        },
        body: {
          fontFamily: APP_FONT_FAMILY,
          backgroundColor: tokens.bgCanvas,
          color: tokens.textPrimary,
        },
        "input, button, textarea, select": {
          fontFamily: "inherit",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none !important",
          backgroundColor: tokens.bgPanel,
          color: tokens.textPrimary,
          borderRadius: tokens.radiusLg,
          boxShadow: tokens.elevation1,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: "none !important",
          backgroundColor: tokens.bgPanel,
          borderRight: `1px solid ${tokens.borderDefault}`,
          borderTopRightRadius: tokens.radiusXl,
          borderBottomRightRadius: tokens.radiusXl,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none !important",
          backgroundColor: tokens.bgPanel,
          border: `1px solid ${tokens.borderDefault}`,
          borderRadius: tokens.radiusXl,
          boxShadow: tokens.elevation1,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundImage: "none !important",
          backgroundColor: tokens.bgPanel,
          borderRadius: `${tokens.radiusXxl}px !important`,
          boxShadow: `${tokens.elevation3} !important`,
          border: `1px solid ${tokens.borderDefault}`,
          padding: "8px",
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
          backgroundColor: `${tokens.bgPanel} !important`,
          backgroundImage: "none !important",
          border: `1px solid ${tokens.borderDefault} !important`,
          boxShadow: `${tokens.shadowPopover} !important`,
          borderRadius: `${tokens.radiusLg}px !important`,
          marginTop: "6px",
        },
        list: {
          padding: "8px",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 13.5,
          fontWeight: 500,
          borderRadius: tokens.radiusPill,
          padding: "8px 14px",
          margin: "2px 0",
          gap: "12px",
          color: tokens.textPrimary,
          textDecoration: "none",
          transition: "all 0.15s ease",
          "& svg": {
            fontSize: 19,
            color: tokens.textSecondary,
            flexShrink: 0,
          },
          "&:hover": {
            backgroundColor: tokens.bgSubtle,
          },
          "&.Mui-selected": {
            backgroundColor: `${tokens.primaryContainer} !important`,
            color: `${tokens.onPrimaryContainer} !important`,
            fontWeight: 600,
            "& svg": {
              color: tokens.onPrimaryContainer,
            },
            "&:hover": {
              backgroundColor: `${tokens.primaryContainer} !important`,
            },
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radiusPill, // Authentic M3 Navigation item highlight
          margin: "2px 8px",
          padding: "8px 16px",
          transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
          "&:hover": {
            backgroundColor: tokens.bgSubtle,
          },
          "&.Mui-selected": {
            backgroundColor: `${tokens.primaryContainer} !important`,
            color: `${tokens.onPrimaryContainer} !important`,
            fontWeight: 700,
            "& .MuiListItemIcon-root": {
              color: tokens.onPrimaryContainer,
            },
            "&:hover": {
              backgroundColor: `${tokens.primaryContainer} !important`,
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radiusPill, // Authentic Material You Pill Button
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "none",
          transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
          "&:hover": {
            boxShadow: tokens.elevation1,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: tokens.radiusPill, // M3 Pill chip
          fontWeight: 500,
          border: `1px solid ${tokens.borderDefault}`,
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
            transition: "border-color 0.15s ease",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.borderHover,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: tokens.primary,
            borderWidth: "2px",
          },
        },
      },
    },
  },
});

export const darkTheme = theme;
export default theme;
