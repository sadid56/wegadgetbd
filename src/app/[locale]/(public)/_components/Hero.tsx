"use client";

import React, { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { CircularProgress } from "@/components/ui/spinner";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import { SectionContainer } from "@/components/common/SectionContainer";
import { useProducts, useTopPicks } from "@/query-client/products";
import { useDebounce } from "@/hooks/use-debounce";
import { getAssetUrl } from "@/lib/storage";
import { formatPrice } from "@/lib/i18n-utils";

const TRENDING_TAGS = ["Smart Watch", "TWS Earbuds", "Cleaning Kit", "Mini Blower", "Lint Remover"] as const;

const AI_COLLECTION_PROMPTS = [
  {
    emoji: "⌚",
    label: "Smart Wearables",
    prompt: "Suggest the best smart wearables and everyday tech from We Gadget BD.",
  },
  {
    emoji: "🎧",
    label: "Audio & Sound",
    prompt: "Recommend top audio & sound gadgets available right now with prices.",
  },
  {
    emoji: "❄️",
    label: "Winter Essentials",
    prompt: "What are the best winter comfort & fabric care gadgets in your store?",
  },
  {
    emoji: "💻",
    label: "Desk & Cleaning",
    prompt: "Recommend desk setup, blower, or electronics cleaning gadgets.",
  },
  {
    emoji: "💰",
    label: "Best Under ৳1,500",
    prompt: "Show me the best budget gadgets under ৳1500 with prices.",
  },
] as const;

function renderAiLinks(text: string) {
  const linkRegex = /\[([^\]]+)\]\(((?:\/|https?:\/\/)[^\s)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const label = match[1];
    const href = match[2];
    const isExternal = href.startsWith("http");

    parts.push(
      isExternal ? (
        <Box
          key={`${href}-${match.index}`}
          component='a'
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          sx={{ color: "#5B3DF5", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" }}
        >
          {label}
        </Box>
      ) : (
        <Box
          key={`${href}-${match.index}`}
          component={Link}
          href={href}
          sx={{ color: "#5B3DF5", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "2px" }}
        >
          {label}
        </Box>
      ),
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function Hero() {
  const router = useRouter();
  const locale = useLocale();
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<"normal" | "ai">("normal");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNormalExpanded, setIsNormalExpanded] = useState(false);
  const [hasFocusedSearch, setHasFocusedSearch] = useState(false);

  // AI Mode state
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const debouncedQuery = useDebounce(searchQuery.trim(), 250);
  const { data: searchData, isFetching: isSearching } = useProducts(
    { search: debouncedQuery, limit: 5 },
    { enabled: mode === "normal" && isNormalExpanded && debouncedQuery.length > 0 },
  );
  const { data: topPicks, isFetching: isLoadingTopPicks } = useTopPicks(4, {
    enabled: hasFocusedSearch,
  });

  const isDropdownLoading = debouncedQuery.length > 0 ? isSearching : isLoadingTopPicks;
  const normalResults = debouncedQuery.length > 0 ? (searchData?.products ?? []) : (topPicks ?? []);

  // Close normal dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsNormalExpanded(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNormalExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const askAi = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || aiLoading) return;
    setAiLoading(true);
    setAiReply(null);
    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await res.json()) as { reply?: string };
      setAiReply(data.reply || "Sorry, I couldn't find a recommendation right now.");
    } catch {
      setAiReply("Network error! You can also call or WhatsApp us at 01739859756.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "ai") {
      askAi(searchQuery);
    } else {
      const trimmed = searchQuery.trim();
      setIsNormalExpanded(false);
      router.push(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products");
    }
  };

  const handleCollectionClick = (prompt: string, label: string) => {
    setSearchQuery(label);
    askAi(prompt);
  };

  return (
    <Box
      component='section'
      sx={{
        position: "relative",
        width: "100%",
        minHeight: { xs: 560, sm: 600, md: 640, lg: 680 },
        display: "flex",
        alignItems: "center",
        overflow: "visible",
        bgcolor: "#EDF8F6",
        pt: { xs: 12, sm: 13.5, md: 15 },
        pb: { xs: 10, sm: 12, md: 14 },
        "&::after": {
          content: '""',
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: { xs: 110, md: 150 },
          background:
            "linear-gradient(to bottom, rgba(247, 248, 250, 0) 0%, rgba(247, 248, 250, 0.35) 40%, rgba(247, 248, 250, 0.78) 72%, #F7F8FA 100%)",
          pointerEvents: "none",
          zIndex: 1,
        },
      }}
    >
      <NextImage
        src='/images/hero-bg-gadgets.jpg'
        alt=''
        fill
        priority
        quality={95}
        sizes='100vw'
        style={{
          objectFit: "cover",
          objectPosition: "center",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <SectionContainer sx={{ position: "relative", zIndex: 30 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "230px minmax(0, 1fr) 210px",
              xl: "260px minmax(0, 1fr) 240px",
            },
            gap: { xs: 3, lg: 2 },
            alignItems: "center",
          }}
        >
          {/* Left Spacer for 3D Podium Gadgets */}
          <Box sx={{ display: { xs: "none", lg: "block" } }} />

          {/* Center Hero Content + Alibaba-Style Dual-Mode Search */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              maxWidth: 680,
              mx: "auto",
              width: "100%",
            }}
          >
            {/* Top Pill */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.85,
                px: 1.75,
                py: 0.65,
                borderRadius: "9999px",
                bgcolor: "rgba(255, 255, 255, 0.88)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.95)",
                boxShadow: "0 4px 18px rgba(91, 61, 245, 0.08)",
                mb: 2,
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 15, color: "#6D4AFF" }} />
              <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "#1E1B4B" }}>Your AI Gadget Companion</Typography>
            </Box>

            {/* Main Display Heading */}
            <Typography
              component='h1'
              sx={{
                fontSize: { xs: 28, sm: 38, md: 44, xl: 48 },
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: "#0F172A",
                mb: 1.5,
              }}
            >
              Tell us what you need...
              <br />
              Let{" "}
              <Box
                component='span'
                sx={{
                  position: "relative",
                  display: "inline-block",
                  color: "#5B3DF5",
                  pb: "4px",
                }}
              >
                AI
                <Box
                  component='svg'
                  viewBox='0 0 60 10'
                  fill='none'
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    height: 8,
                    pointerEvents: "none",
                  }}
                >
                  <path d='M2 7C18 2 42 2 58 7' stroke='#5B3DF5' strokeWidth='3.5' strokeLinecap='round' />
                </Box>
              </Box>{" "}
              find it for you!
            </Typography>

            {/* Subtitle */}
            <Typography
              sx={{
                fontSize: { xs: 13.5, sm: 15 },
                fontWeight: 500,
                lineHeight: 1.55,
                color: "#475569",
                maxWidth: 480,
                mb: 2.75,
              }}
            >
              From everyday solutions to unique gadgets — smarter, easier, and just for you!
            </Typography>

            {/* Dual-Mode Search Container (Normal + Alibaba-Style Tall AI Mode) */}
            <Box
              ref={searchBoxRef}
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 640,
                mb: 2,
              }}
            >
              <Box
                component='form'
                onSubmit={handleSubmit}
                sx={{
                  width: "100%",
                  bgcolor: "#FFFFFF",
                  borderRadius: mode === "ai" ? "24px" : "28px",
                  border: mode === "ai" ? "1.5px solid #A78BFA" : "1px solid rgba(226, 232, 240, 0.9)",
                  boxShadow: mode === "ai" ? "0 20px 50px rgba(91, 61, 245, 0.16)" : "0 14px 36px rgba(91, 61, 245, 0.11)",
                  px: { xs: 1.5, sm: 2 },
                  py: 1,
                  transition: "border-radius 260ms cubic-bezier(0.22, 1, 0.36, 1), border-color 200ms ease, box-shadow 260ms ease",
                }}
              >
                {/* Top Unified Input Row (Zero Unmount/Remount) */}
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                  {/* Mode Switcher Pill */}
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      bgcolor: "#F1F5F9",
                      borderRadius: "9999px",
                      p: "3px",
                      flexShrink: 0,
                      mt: "2px",
                    }}
                  >
                    <Box
                      component='button'
                      type='button'
                      onClick={() => {
                        setMode("normal");
                        setAiReply(null);
                      }}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1.15,
                        py: 0.5,
                        borderRadius: "9999px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 700,
                        bgcolor: mode === "normal" ? "#FFFFFF" : "transparent",
                        color: mode === "normal" ? "#0F172A" : "#64748B",
                        boxShadow: mode === "normal" ? "0 1px 4px rgba(15, 23, 42, 0.08)" : "none",
                        transition: "background-color 180ms ease, color 180ms ease",
                      }}
                    >
                      <SearchRoundedIcon sx={{ fontSize: 14 }} />
                      <span>Search</span>
                    </Box>
                    <Box
                      component='button'
                      type='button'
                      onClick={() => {
                        setMode("ai");
                        setIsNormalExpanded(false);
                      }}
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        px: 1.15,
                        py: 0.5,
                        borderRadius: "9999px",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 700,
                        bgcolor: mode === "ai" ? "#5B3DF5" : "transparent",
                        color: mode === "ai" ? "#FFFFFF" : "#5B3DF5",
                        boxShadow: mode === "ai" ? "0 2px 8px rgba(91, 61, 245, 0.25)" : "none",
                        transition: "background-color 180ms ease, color 180ms ease",
                      }}
                    >
                      <AutoAwesomeRoundedIcon sx={{ fontSize: 13.5 }} />
                      <span>AI Mode</span>
                    </Box>
                  </Box>

                  {/* Unified Textarea (smooth height transition, zero flicker) */}
                  <Box
                    component='textarea'
                    rows={1}
                    value={searchQuery}
                    onFocus={() => {
                      if (mode === "normal") {
                        setHasFocusedSearch(true);
                        setIsNormalExpanded(true);
                      }
                    }}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setSearchQuery(e.target.value);
                      if (mode === "normal") {
                        if (!hasFocusedSearch) setHasFocusedSearch(true);
                        if (!isNormalExpanded) setIsNormalExpanded(true);
                      }
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (mode === "ai") {
                          askAi(searchQuery);
                        } else {
                          const trimmed = searchQuery.trim();
                          setIsNormalExpanded(false);
                          router.push(trimmed ? `/products?search=${encodeURIComponent(trimmed)}` : "/products");
                        }
                      }
                    }}
                    placeholder={
                      mode === "ai"
                        ? 'Ask AI anything: e.g. "Best winter gadgets under ৳1000"...'
                        : "Search gadgets, earbuds, smartwatches..."
                    }
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      resize: "none",
                      border: "none",
                      outline: "none",
                      bgcolor: "transparent",
                      fontFamily: "inherit",
                      fontSize: { xs: 13, sm: 14 },
                      fontWeight: 500,
                      lineHeight: "22px",
                      color: "#0F172A",
                      px: 0.5,
                      pt: "7px",
                      height: mode === "ai" ? 64 : 36,
                      transition: "height 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                      "&::placeholder": { color: "#64748B", opacity: 1 },
                    }}
                  />

                  {/* Normal Mode Compact Submit Arrow */}
                  {mode === "normal" && (
                    <IconButton
                      type='submit'
                      aria-label='Search products'
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "#5B3DF5",
                        color: "#FFFFFF",
                        flexShrink: 0,
                        "&:hover": { bgcolor: "#4C2EE0" },
                      }}
                    >
                      <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  )}
                </Box>

                {/* Smooth GPU-Friendly Expandable AI Footer (0fr -> 1fr) */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateRows: mode === "ai" ? "1fr" : "0fr",
                    opacity: mode === "ai" ? 1 : 0,
                    transition: "grid-template-rows 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease",
                  }}
                >
                  <Box sx={{ overflow: "hidden" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        pt: 1,
                        mt: 0.75,
                        borderTop: "1px solid #F1F5F9",
                      }}
                    >
                      <Typography sx={{ fontSize: 11.5, color: "#64748B", fontWeight: 500 }}>
                        ✨ Powered by Gemini AI • Press Enter or pick a collection below
                      </Typography>

                      <Box
                        component='button'
                        type='submit'
                        disabled={aiLoading || !searchQuery.trim()}
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.75,
                          px: 2,
                          py: 0.75,
                          borderRadius: "9999px",
                          border: "none",
                          bgcolor: "#5B3DF5",
                          color: "#FFFFFF",
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          flexShrink: 0,
                          transition: "background-color 150ms ease",
                          "&:hover": { bgcolor: "#4C2EE0" },
                          "&:disabled": { opacity: 0.55, cursor: "not-allowed" },
                        }}
                      >
                        {aiLoading ? (
                          <CircularProgress size={14} sx={{ color: "#FFFFFF" }} />
                        ) : (
                          <AutoAwesomeRoundedIcon sx={{ fontSize: 15 }} />
                        )}
                        <span>{aiLoading ? "Thinking..." : "Ask AI"}</span>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* ── NORMAL MODE EXPANDED INLINE DROPDOWN (NOT A MODAL) ── */}
              {mode === "normal" && isNormalExpanded && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    bgcolor: "rgba(255, 255, 255, 0.98)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "20px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.14)",
                    p: 2,
                    textAlign: "left",
                  }}
                >
                  {/* Popular Tags */}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
                    <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", display: "flex", alignItems: "center", gap: 0.5 }}>
                      <TrendingUpRoundedIcon sx={{ fontSize: 14, color: "#5B3DF5" }} />
                      {debouncedQuery ? "Matching Products" : "Popular Searches & Top Picks"}
                    </Typography>
                    <IconButton size='small' onClick={() => setIsNormalExpanded(false)} sx={{ p: 0.25 }}>
                      <CloseRoundedIcon sx={{ fontSize: 16, color: "#64748B" }} />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1.75 }}>
                    {TRENDING_TAGS.map((tag) => (
                      <Box
                        key={tag}
                        component='button'
                        type='button'
                        onClick={() => {
                          setSearchQuery(tag);
                        }}
                        sx={{
                          px: 1.25,
                          py: 0.45,
                          borderRadius: "9999px",
                          border: "1px solid #E2E8F0",
                          bgcolor: "#F8FAFC",
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: "#334155",
                          cursor: "pointer",
                          "&:hover": { borderColor: "#5B3DF5", color: "#5B3DF5", bgcolor: "#F5F3FF" },
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </Box>

                  {/* Live Results */}
                  {isDropdownLoading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 2, justifyContent: "center", color: "#64748B" }}>
                      <CircularProgress size={16} />
                      <Typography sx={{ fontSize: 12.5 }}>Searching...</Typography>
                    </Box>
                  ) : normalResults.length === 0 ? (
                    <Typography sx={{ fontSize: 12.5, color: "#64748B", py: 1.5, textAlign: "center" }}>
                      No matching products found. Try AI Mode to get personalized suggestions!
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, maxHeight: 260, overflowY: "auto" }}>
                      {normalResults.map((item: any) => {
                        const rawImg = item.image || item.thumbnail || item.images?.[0] || "";
                        const imgSrc = (rawImg ? getAssetUrl(rawImg) : null) || "/images/default.png";
                        const effectivePrice = Number(item.discountPrice || item.price || 0);
                        return (
                          <Box
                            key={item.id}
                            component={Link}
                            href={`/products/${item.slug}`}
                            onClick={() => setIsNormalExpanded(false)}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              p: 1,
                              borderRadius: "12px",
                              textDecoration: "none",
                              transition: "background-color 140ms ease",
                              "&:hover": { bgcolor: "#F8FAFC" },
                            }}
                          >
                            <Box
                              component='img'
                              src={imgSrc}
                              alt={item.title}
                              sx={{ width: 44, height: 44, borderRadius: "10px", objectFit: "cover", bgcolor: "#F1F5F9", flexShrink: 0 }}
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: "#0F172A",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.title}
                              </Typography>
                              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#5B3DF5" }}>
                                {formatPrice(effectivePrice, locale)}
                              </Typography>
                            </Box>
                            <ArrowForwardRoundedIcon sx={{ fontSize: 16, color: "#94A3B8" }} />
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              )}

              {/* ── AI MODE RESPONSE PANEL ── */}
              {mode === "ai" && (aiLoading || aiReply) && (
                <Box
                  sx={{
                    mt: 1.5,
                    bgcolor: "rgba(255, 255, 255, 0.96)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "20px",
                    border: "1px solid #DDD6FE",
                    boxShadow: "0 18px 42px rgba(91, 61, 245, 0.14)",
                    p: 2,
                    textAlign: "left",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: "#5B3DF5" }} />
                      <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: "#1E1B4B" }}>AI Recommendation</Typography>
                    </Box>
                    <IconButton size='small' onClick={() => setAiReply(null)} sx={{ p: 0.25 }}>
                      <CloseRoundedIcon sx={{ fontSize: 16, color: "#64748B" }} />
                    </IconButton>
                  </Box>
                  {aiLoading ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, py: 1, color: "#64748B" }}>
                      <CircularProgress size={16} sx={{ color: "#5B3DF5" }} />
                      <Typography sx={{ fontSize: 13 }}>Finding the best gadgets for you...</Typography>
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        fontSize: 13.5,
                        lineHeight: 1.6,
                        color: "#1E293B",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {renderAiLinks(aiReply || "")}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

            {/* Quick Suggestion Pills (Normal -> Filter Links, AI Mode -> Collection Prompts) */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {mode === "ai" ? (
                AI_COLLECTION_PROMPTS.map((item) => (
                  <Box
                    key={item.label}
                    component='button'
                    type='button'
                    onClick={() => handleCollectionClick(item.prompt, item.label)}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.65,
                      px: 1.5,
                      py: 0.6,
                      borderRadius: "9999px",
                      bgcolor: "rgba(255, 255, 255, 0.90)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid #DDD6FE",
                      boxShadow: "0 4px 12px rgba(91, 61, 245, 0.08)",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1E1B4B",
                      cursor: "pointer",
                      transition: "all 150ms ease",
                      "&:hover": {
                        bgcolor: "#F5F3FF",
                        borderColor: "#5B3DF5",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </Box>
                ))
              ) : (
                <>
                  <Box
                    component={Link}
                    href='/products?sort=best-selling'
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: 1.6,
                      py: 0.65,
                      borderRadius: "9999px",
                      bgcolor: "rgba(255, 255, 255, 0.88)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.95)",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#1E293B",
                      textDecoration: "none",
                      "&:hover": { bgcolor: "#FFFFFF", transform: "translateY(-1px)" },
                    }}
                  >
                    <span>🔥</span>
                    <span>Trending</span>
                  </Box>
                  <Box
                    component={Link}
                    href='/products?category=winter-comfort-gadgets'
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: 1.6,
                      py: 0.65,
                      borderRadius: "9999px",
                      bgcolor: "rgba(255, 255, 255, 0.88)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.95)",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#1E293B",
                      textDecoration: "none",
                      "&:hover": { bgcolor: "#FFFFFF", transform: "translateY(-1px)" },
                    }}
                  >
                    <span>❄️</span>
                    <span>Winter Essentials</span>
                  </Box>
                  <Box
                    component={Link}
                    href='/products?sort=price-asc'
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: 1.6,
                      py: 0.65,
                      borderRadius: "9999px",
                      bgcolor: "rgba(255, 255, 255, 0.88)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.95)",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "#1E293B",
                      textDecoration: "none",
                      "&:hover": { bgcolor: "#FFFFFF", transform: "translateY(-1px)" },
                    }}
                  >
                    <span>⭐</span>
                    <span>Best Budget</span>
                  </Box>
                  <IconButton
                    component={Link}
                    href='/products'
                    aria-label='Browse all products'
                    size='small'
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "rgba(255, 255, 255, 0.88)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.95)",
                      boxShadow: "0 4px 12px rgba(15, 23, 42, 0.05)",
                      color: "#1E293B",
                      "&:hover": { bgcolor: "#FFFFFF", color: "#5B3DF5" },
                    }}
                  >
                    <ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>

          {/* Right Spacer */}
          <Box sx={{ display: { xs: "none", lg: "block" } }} />
        </Box>
      </SectionContainer>
    </Box>
  );
}
