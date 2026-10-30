"use client";

import { useRef } from "react";
import Box from "@mui/material/Box";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { tokens } from "@/theme/theme";

interface TagTabsProps {
  search: string;
  activeTag: string | null;
  availableTags: string[];
  onTagClick: (tag: string) => void;
}

const SCROLL_STEP = 240;

export function TagTabs({ search, activeTag, availableTags, onTagClick }: TagTabsProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (!search || availableTags.length === 0) return null;

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({
      left: dir * SCROLL_STEP,
      behavior: "smooth",
    });
  };

  const tabSx = (active: boolean) => ({
    borderRadius: "6px",
    px: 3,
    py: 0.75,
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    whiteSpace: "nowrap" as const,
    lineHeight: 1.3,
    minWidth: 0,
    ...(active
      ? {
          bgcolor: tokens.textPrimary,
          color: tokens.textWhite,
          "&:hover": { bgcolor: tokens.textPrimary, opacity: 0.9 },
        }
      : {
          bgcolor: tokens.bgPanel,
          color: tokens.textPrimary,
          border: "1px solid",
          borderColor: tokens.borderDefault,
          "&:hover": { bgcolor: tokens.bgSubtle, borderColor: tokens.borderDefault },
        }),
  });

  return (
    <Box
      sx={{
        my: 2,
        pt: 2,
        borderTop: "1px solid",
        borderColor: tokens.borderDefault,
        display: "flex",
        alignItems: "center",
        gap: 1,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <IconButton
        onClick={() => scrollBy(-1)}
        aria-label='Scroll tags left'
        sx={{
          height: 32,
          width: 32,
          flexShrink: 0,
          borderRadius: "50%",
          border: "1px solid",
          borderColor: tokens.borderDefault,
          bgcolor: tokens.bgPanel,
          boxShadow: tokens.shadowSm,
          "&:hover": { bgcolor: tokens.bgSubtle, borderColor: tokens.borderDefault },
        }}
      >
        <ChevronLeftIcon sx={{ fontSize: 16 }} />
      </IconButton>

      <Box
        ref={trackRef}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          overflowX: "auto",
          pb: 1,
          pt: 0.5,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Button onClick={() => onTagClick(search)} disableElevation sx={tabSx(!activeTag)}>
          All
        </Button>
        {availableTags.map((tag) => (
          <Button key={tag} onClick={() => onTagClick(tag)} disableElevation sx={tabSx(activeTag === tag)}>
            {tag}
          </Button>
        ))}
      </Box>

      <IconButton
        onClick={() => scrollBy(1)}
        aria-label='Scroll tags right'
        sx={{
          height: 32,
          width: 32,
          flexShrink: 0,
          ml: "auto",
          borderRadius: "50%",
          border: "1px solid",
          borderColor: tokens.borderDefault,
          bgcolor: tokens.bgPanel,
          boxShadow: tokens.shadowSm,
          "&:hover": { bgcolor: tokens.bgSubtle, borderColor: tokens.borderDefault },
        }}
      >
        <ChevronRightIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}
