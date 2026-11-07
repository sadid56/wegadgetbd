"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { AlertColor } from "@mui/material";
import { tokens } from "../theme/theme";

export interface ToastMethods {
  (message: string, severity?: AlertColor): void;
  error: (message: string) => void;
  success: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

interface ToastItem {
  id: string;
  message: string;
  severity: AlertColor;
  createdAt: number;
}

const ToastContext = createContext<ToastMethods | null>(null);

const TOAST_DURATION = 4200;

const ICONS: Record<AlertColor, { icon: React.ReactNode; color: string; bg: string }> = {
  success: {
    icon: <CheckCircleRoundedIcon sx={{ fontSize: 20 }} />,
    color: tokens.success,
    bg: "rgba(16, 185, 129, 0.12)",
  },
  error: {
    icon: <ErrorRoundedIcon sx={{ fontSize: 20 }} />,
    color: tokens.error,
    bg: "rgba(239, 68, 68, 0.12)",
  },
  warning: {
    icon: <WarningRoundedIcon sx={{ fontSize: 20 }} />,
    color: tokens.warning,
    bg: "rgba(245, 158, 11, 0.12)",
  },
  info: {
    icon: <InfoRoundedIcon sx={{ fontSize: 20 }} />,
    color: tokens.info,
    bg: "rgba(14, 165, 233, 0.12)",
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const hoverRef = useRef(false);
  hoverRef.current = isHovered;

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message: string, severity: AlertColor = "info") => {
    const id = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    setToasts((prev) => [{ id, message, severity, createdAt: Date.now() }, ...prev.slice(0, 5)]);
  }, []);

  // Auto-dismiss timers per toast when not hovered
  useEffect(() => {
    if (toasts.length === 0 || isHovered) return;

    const timer = setInterval(() => {
      if (hoverRef.current) return;
      const now = Date.now();
      setToasts((prev) => prev.filter((t) => now - t.createdAt < TOAST_DURATION));
    }, 500);

    return () => clearInterval(timer);
  }, [toasts.length, isHovered]);

  const toastMethods: ToastMethods = Object.assign(
    (message: string, severity: AlertColor = "info") => show(message, severity),
    {
      error: (message: string) => show(message, "error"),
      success: (message: string) => show(message, "success"),
      info: (message: string) => show(message, "info"),
      warning: (message: string) => show(message, "warning"),
    }
  );

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}

      {/* Sonner-style Floating Stack Container */}
      {toasts.length > 0 && (
        <Box
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            zIndex: 1400,
            width: { xs: "calc(100vw - 32px)", sm: "380px" },
            maxWidth: "400px",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              minHeight: 56,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            {toasts.map((toast, index) => {
              const meta = ICONS[toast.severity] || ICONS.info;
              const isVisible = index < 3 || isHovered;

              // Sonner Stacking calculations:
              // Index 0: front toast
              // Index 1: sits 14px above, slightly scaled down
              // Index 2: sits 28px above, slightly scaled down further
              // When hovered: expands vertically into stacked list with clear gap
              const translateY = isHovered ? -(index * 68) : -(index * 14);
              const scale = isHovered ? 1 : 1 - index * 0.05;
              const opacity = !isVisible ? 0 : isHovered ? 1 : Math.max(0, 1 - index * 0.15);
              const zIndex = 100 - index;

              return (
                <Box
                  key={toast.id}
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "100%",
                    maxWidth: "100%",
                    pointerEvents: isVisible ? "auto" : "none",
                    bgcolor: tokens.bgPanel,
                    color: tokens.textPrimary,
                    borderRadius: `${tokens.radiusLg}px`,
                    border: `1px solid ${tokens.borderDefault}`,
                    boxShadow: isHovered ? tokens.elevation3 : tokens.elevation2,
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                    transformOrigin: "bottom center",
                    opacity,
                    zIndex,
                    transition:
                      "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease, box-shadow 0.25s ease",
                    willChange: "transform, opacity",
                  }}
                >
                  {/* Status Indicator Icon */}
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: `${tokens.radiusPill}px`,
                      bgcolor: meta.bg,
                      color: meta.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {meta.icon}
                  </Box>

                  {/* Toast Message Body */}
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: tokens.textPrimary,
                      lineHeight: 1.35,
                      flex: 1,
                      wordBreak: "break-word",
                      display: "-webkit-box",
                      WebkitLineClamp: isHovered ? 4 : 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {toast.message}
                  </Typography>

                  {/* Dismiss Close Icon */}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeToast(toast.id);
                    }}
                    sx={{
                      color: tokens.textSecondary,
                      p: 0.5,
                      flexShrink: 0,
                      borderRadius: `${tokens.radiusPill}px`,
                      "&:hover": {
                        bgcolor: tokens.bgSubtle,
                        color: tokens.textPrimary,
                      },
                    }}
                    aria-label="Dismiss toast"
                  >
                    <CloseRoundedIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastMethods => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
