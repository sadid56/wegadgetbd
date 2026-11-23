"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { openAiShoppingDrawer, type AiProductContext } from "@/lib/ai-drawer";
import { tokens } from "@/theme/theme";

interface ProductAskAiBoxProps {
  productContext: AiProductContext;
}

export function ProductAskAiBox({ productContext }: ProductAskAiBoxProps) {
  const locale = useLocale();
  const isBn = locale === "bn";

  const recommendations = isBn
    ? ["বক্সে কী কী থাকছে?", "ওয়ারেন্টি ও ডেলিভারি?", "অরিজিনাল নাকি?", "আমার জন্য কি ভালো হবে?"]
    : ["What's in the box?", "Warranty & delivery?", "Is it original?", "Is it right for me?"];

  const handleOpen = (prompt?: string) => {
    openAiShoppingDrawer(prompt, productContext);
  };

  return (
    <Box
      sx={{
        p: 1.75,
        borderRadius: "16px",
        bgcolor: tokens.bgSurfaceContainerLow,
        border: `1px solid ${tokens.borderSubtle}`,
        transition: "border-color 180ms ease",
        "&:hover": {
          borderColor: tokens.primaryBorder,
        },
      }}
    >
      {/* Header Row with Ask AI CTA */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 1.25 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: tokens.primaryLight,
              color: tokens.primaryDark,
              flexShrink: 0,
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 17 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: tokens.textPrimary, lineHeight: 1.25 }}>
              {isBn ? "এই গ্যাজেট নিয়ে প্রশ্ন আছে?" : "Questions about this gadget?"}
            </Typography>
            <Typography sx={{ fontSize: 11, color: tokens.textMuted, lineHeight: 1.25, mt: 0.2 }}>
              {isBn ? "তাৎক্ষণিক সাহায্য পেতে AI-কে জিজ্ঞেস করুন" : "Get instant answers from our AI assistant"}
            </Typography>
          </Box>
        </Box>

        <Button
          variant='tonal'
          size='sm'
          onClick={() => handleOpen()}
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />}
          sx={{
            borderRadius: "999px",
            fontWeight: 700,
            fontSize: 12,
            px: 1.5,
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {isBn ? "Ask AI" : "Ask AI"}
        </Button>
      </Box>

      {/* Recommended Quick Questions */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
        {recommendations.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            size='small'
            variant='outlined'
            clickable
            onClick={() => handleOpen(chip)}
            sx={{
              height: 28,
              borderRadius: "999px",
              fontSize: 11.5,
              fontWeight: 600,
              borderColor: tokens.borderDefault,
              bgcolor: tokens.bgPanel,
              color: tokens.textSecondary,
              transition: "all 150ms ease",
              "& .MuiChip-label": { px: 1.25 },
              "&:hover": {
                borderColor: tokens.primary,
                bgcolor: tokens.primaryLight,
                color: tokens.primaryDark,
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
