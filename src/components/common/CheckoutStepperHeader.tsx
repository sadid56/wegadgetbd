"use client";

import React from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { tokens } from "@/theme/theme";

export type CheckoutStep = "cart" | "checkout" | "done";

interface CheckoutStepperHeaderProps {
  currentStep: CheckoutStep;
  backHref: string;
  backLabel: string;
  rightAction?: React.ReactNode;
}

const steps: { key: CheckoutStep; label: string; href?: string }[] = [
  { key: "cart", label: "1. Cart", href: "/cart" },
  { key: "checkout", label: "2. Checkout", href: "/checkout" },
  { key: "done", label: "3. Done" },
];

export function CheckoutStepperHeader({
  currentStep,
  backHref,
  backLabel,
  rightAction,
}: CheckoutStepperHeaderProps) {
  const stepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <Box
      component="header"
      sx={{
        borderBottom: `1px solid ${tokens.borderDefault}`,
        bgcolor: tokens.bgPanel,
        py: 1.75,
        px: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Back Link */}
        <Box
          component={NextLink}
          href={backHref}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: 13,
            fontWeight: 600,
            color: tokens.textSecondary,
            textDecoration: "none",
            transition: "color 150ms ease",
            flexShrink: 0,
            "&:hover": { color: tokens.textPrimary },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          <span>{backLabel}</span>
        </Box>

        {/* Desktop Stepper */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 1.5,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {steps.map((step, idx) => {
            const isActive = step.key === currentStep;
            const isCompleted = idx < stepIndex;

            return (
              <React.Fragment key={step.key}>
                {idx > 0 && (
                  <ChevronRightIcon
                    sx={{
                      fontSize: 14,
                      color: isCompleted ? tokens.primary : tokens.textDisabled,
                    }}
                  />
                )}
                {isCompleted && step.href ? (
                  <Box
                    component={NextLink}
                    href={step.href}
                    sx={{
                      color: tokens.textSecondary,
                      textDecoration: "none",
                      fontWeight: 600,
                      transition: "color 150ms ease",
                      "&:hover": { color: tokens.primary },
                    }}
                  >
                    {step.label}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      color: isActive
                        ? tokens.primary
                        : tokens.textDisabled,
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {step.label}
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </Box>

        {/* Mobile Step Badge */}
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            alignItems: "center",
            gap: 0.5,
            fontSize: 12,
            fontWeight: 700,
            color: tokens.primary,
          }}
        >
          <span>Step {stepIndex + 1}/3:</span>
          <span style={{ textTransform: "capitalize" }}>{currentStep}</span>
        </Box>

        {/* Right Action / Trust Badge */}
        <Box sx={{ flexShrink: 0 }}>
          {rightAction ? (
            rightAction
          ) : (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                fontSize: 12,
                fontWeight: 600,
                color: tokens.textSecondary,
              }}
            >
              <SecurityOutlinedIcon sx={{ fontSize: 16, color: tokens.primary }} />
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                Secure Checkout
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

