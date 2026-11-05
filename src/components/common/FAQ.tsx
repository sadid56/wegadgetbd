"use client";

import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Box, Typography } from "@mui/material";
import { Collapse } from "@/components/ui/modal";
import { tokens } from "@/theme/theme";
import { useTranslations } from "next-intl";

interface FAQProps {
  className?: string;
}

export function FAQ({ className }: FAQProps) {
  const t = useTranslations("home");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = [
    { question: t("faq1Q"), answer: t("faq1A") },
    { question: t("faq2Q"), answer: t("faq2A") },
    { question: t("faq3Q"), answer: t("faq3A") },
    { question: t("faq4Q"), answer: t("faq4A") },
    { question: t("faq5Q"), answer: t("faq5A") },
  ];

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 10 }, position: "relative" }} className={className}>
      <Box sx={{ maxWidth: 840, mx: "auto", px: 2 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 3,
              bgcolor: tokens.primarySubtle,
              color: tokens.primary,
              mb: 2,
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 28 }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, color: tokens.textPrimary }}>
            {t("faqTitlePart1")}{" "}
            <Typography component="span" variant="inherit" sx={{ color: tokens.primary }}>
              {t("faqTitleHighlight")}
            </Typography>
          </Typography>

          <Typography variant="body1" sx={{ color: tokens.textMuted }}>
            {t("faqSubtitle")}
          </Typography>
        </Box>

        {/* FAQ list */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <Box
                key={index}
                sx={{
                  borderRadius: `${tokens.radiusLg}px`,
                  border: `1px solid ${isOpen ? tokens.primaryBorder : tokens.borderDefault}`,
                  bgcolor: isOpen ? tokens.bgElevated : tokens.bgPanel,
                  overflow: "hidden",
                  transition: "all 0.25s ease",
                  boxShadow: isOpen ? tokens.shadowMd : "none",
                }}
              >
                {/* Question */}
                <button
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: "100%",
                    padding: "18px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "inherit",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        bgcolor: isOpen ? tokens.primary : tokens.bgSubtle,
                        color: isOpen ? tokens.textWhite : tokens.textMuted,
                      }}
                    >
                      {(index + 1).toString().padStart(2, "0")}
                    </Box>

                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: isOpen ? tokens.textPrimary : tokens.textSecondary,
                      }}
                    >
                      {item.question}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: isOpen ? tokens.primarySubtle : tokens.bgSubtle,
                      color: isOpen ? tokens.primary : tokens.textMuted,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease",
                    }}
                  >
                    <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
                  </Box>
                </button>

                {/* Answer */}
                <Collapse in={isOpen} timeout={250} unmountOnExit>
                  <Box sx={{ px: 2.5, pb: 2.5, pl: { xs: 2.5, sm: 8 } }}>
                    <Typography variant="body2" sx={{ color: tokens.textSecondary, lineHeight: 1.7 }}>
                      {item.answer}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default FAQ;
