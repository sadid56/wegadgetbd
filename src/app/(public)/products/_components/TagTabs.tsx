"use client";

import { useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
          bgcolor: "text.primary",
          color: "background.default",
          "&:hover": { bgcolor: "text.primary", opacity: 0.9 },
        }
      : {
          bgcolor: "background.paper",
          color: "text.primary",
          border: "1px solid",
          borderColor: "divider",
          "&:hover": { bgcolor: "action.hover", borderColor: "divider" },
        }),
  });

  return (
    <Box
      sx={{
        my: 2,
        pt: 2,
        borderTop: "1px solid",
        borderColor: "divider",
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
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          "&:hover": { bgcolor: "action.hover", borderColor: "divider" },
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
          borderColor: "divider",
          bgcolor: "background.paper",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          "&:hover": { bgcolor: "action.hover", borderColor: "divider" },
        }}
      >
        <ChevronRightIcon sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}
