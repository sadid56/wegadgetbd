"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { CircularProgress } from "@/components/ui/spinner";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import HeadphonesRoundedIcon from "@mui/icons-material/HeadphonesRounded";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";

import { AiMiniProductCard } from "@/components/common/AiMiniProductCard";
import {
  AI_DRAWER_EVENT,
  type AiProductCardData,
  type AiProductContext,
  type OpenAiDrawerDetail,
} from "@/lib/ai-drawer";
import { CONTACT_PHONE, getTelUrl, getWhatsAppUrl } from "@/lib/contact";
import { tokens } from "@/theme/theme";

interface ChatMessage {
  role: "user" | "model";
  text: string;
  products?: AiProductCardData[];
  followUps?: string[];
}

const QUICK_QUESTIONS = [
  {
    icon: HeadphonesRoundedIcon,
    label: "Gaming earbuds under ৳2,000",
    sub: "Low latency & deep bass",
    prompt: "Show the best gaming earbuds under ৳2,000",
  },
  {
    icon: CardGiftcardRoundedIcon,
    label: "Gift ideas for brother",
    sub: "Smart & useful tech picks",
    prompt: "Suggest the best gadgets to gift my brother",
  },
  {
    icon: SavingsRoundedIcon,
    label: "Best gadgets under ৳1,500",
    sub: "Top rated budget gear",
    prompt: "What are your best budget gadgets under ৳1,500?",
  },
  {
    icon: LocalShippingRoundedIcon,
    label: "Delivery & COD policy",
    sub: "Charges, warranty & timing",
    prompt: "What are the delivery charges, warranty, and Cash on Delivery policy?",
  },
] as const;

function getProductQuickQuestions(isBn: boolean) {
  return [
    {
      icon: Inventory2RoundedIcon,
      label: isBn ? "বক্সে কী থাকছে ও স্পেকস" : "Box contents & key specs",
      sub: isBn ? "ফিচার ও বিল্ড কোয়ালিটি" : "Features, build & included items",
      prompt: isBn
        ? "এই প্রোডাক্টের বক্সে কী কী থাকছে এবং মূল স্পেসিফিকেশনগুলো কী?"
        : "What's included in the box and what are the key specifications?",
    },
    {
      icon: AutoAwesomeRoundedIcon,
      label: isBn ? "আমার ব্যবহারের জন্য সেরা?" : "Is it right for my use?",
      sub: isBn ? "সুবিধা ও কার জন্য উপযোগী" : "Pros, cons & ideal use cases",
      prompt: isBn
        ? "এই প্রোডাক্টটি কাদের জন্য ভালো এবং এর মূল সুবিধা কী?"
        : "Who is this product best for, and what are its main pros and limitations?",
    },
    {
      icon: VerifiedUserRoundedIcon,
      label: isBn ? "ওয়ারেন্টি ও অরিজিনালিটি" : "Warranty & authenticity",
      sub: isBn ? "গ্যারান্টি ও রিপ্লেসমেন্ট পলিসি" : "Original guarantee & replacement",
      prompt: isBn
        ? "এই প্রোডাক্টটি কি অরিজিনাল এবং এতে কী ধরনের ওয়ারেন্টি থাকছে?"
        : "Is this product original and what warranty or replacement policy applies?",
    },
    {
      icon: LocalShippingRoundedIcon,
      label: isBn ? "ডেলিভারি ও বিকল্প অপশন" : "Delivery & alternatives",
      sub: isBn ? "চার্জ, সময় ও কাছাকাছি প্রোডাক্ট" : "Shipping time, COD & similar picks",
      prompt: isBn
        ? "এটার ডেলিভারি চার্জ ও সময় কতদিন, আর একই বাজেটে ভালো বিকল্প আছে কি?"
        : "What is the delivery charge and timing, and are there better alternatives around this price?",
    },
  ];
}

const FLOATING_HINTS_EN = [
  "How can we help you today?",
  "Find the best gadget for your budget",
  "Need gaming earbuds under ৳2,000?",
  "Ask about warranty & COD delivery",
  "Looking for a tech gift idea?",
] as const;

const FLOATING_HINTS_BN = [
  "আমরা কীভাবে সাহায্য করতে পারি?",
  "বাজেট অনুযায়ী সেরা গ্যাজেট খুঁজুন",
  "২,০০০ টাকার মধ্যে গেমিং ইয়ারবাডস?",
  "ডেলিভারি চার্জ ও ওয়ারেন্টি জানুন",
  "গিফটের জন্য ইউনিক গ্যাজেট খুঁজছেন?",
] as const;

export function FloatingAiChat() {
  const locale = useLocale();
  const isBn = locale === "bn";

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);
  const [hintVisible, setHintVisible] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  const [activeProductContext, setActiveProductContext] = useState<AiProductContext | null>(null);
  const activeProductContextRef = useRef<AiProductContext | null>(null);
  activeProductContextRef.current = activeProductContext;

  const isLoadingRef = useRef(false);
  isLoadingRef.current = isLoading;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Prevent main page scrolling (both html & body) while the drawer is open without adding scrollbar padding
  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.classList.add("concierge-open");
    const prevBodyPadding = document.body.style.paddingRight;
    document.body.style.paddingRight = "0px";
    return () => {
      document.documentElement.classList.remove("concierge-open");
      document.body.style.paddingRight = prevBodyPadding;
    };
  }, [isOpen]);

  const sendMessage = useCallback(
    async (textToSend: string, overrideProductContext?: AiProductContext | null) => {
      const trimmed = textToSend.trim();
      if (!trimmed || isLoadingRef.current) return;

      const historySnapshot = messagesRef.current.map((m) => ({
        role: m.role,
        text: m.text,
      }));
      const productContextToSend = overrideProductContext ?? activeProductContextRef.current;

      setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/ai-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            history: historySnapshot.slice(-6),
            ...(productContextToSend ? { productContext: productContextToSend } : {}),
          }),
          signal: AbortSignal.timeout(30000),
        });

        const data = (await res.json()) as {
          reply?: string;
          error?: string;
          products?: AiProductCardData[];
          followUps?: string[];
        };

        const replyText = data.reply || data.error || `I'm having trouble right now. Please contact us on WhatsApp at ${CONTACT_PHONE}.`;

        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: replyText,
            products: Array.isArray(data.products) ? data.products : [],
            followUps: Array.isArray(data.followUps) ? data.followUps : [],
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            text: isBn
              ? `নেটওয়ার্ক সমস্যা হচ্ছে! প্রয়োজনে কল বা হোয়াটসঅ্যাপ করুন: ${CONTACT_PHONE}`
              : `Network error! You can also call or WhatsApp us at ${CONTACT_PHONE}.`,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isBn],
  );

  // Listen for Hero AI, Product Ask AI, or external triggers to open the AI Shopping Drawer
  useEffect(() => {
    const handleOpenDrawer = (e: Event) => {
      const custom = e as CustomEvent<OpenAiDrawerDetail>;
      const nextContext = custom.detail?.productContext;
      if (nextContext) {
        activeProductContextRef.current = nextContext;
        setActiveProductContext(nextContext);
      }
      setIsOpen(true);
      if (custom.detail?.prompt) {
        sendMessage(custom.detail.prompt, nextContext ?? activeProductContextRef.current);
      }
    };
    window.addEventListener(AI_DRAWER_EVENT, handleOpenDrawer);
    return () => window.removeEventListener(AI_DRAWER_EVENT, handleOpenDrawer);
  }, [sendMessage]);

  // Periodic locale-aware floating hint bubble when drawer is closed
  useEffect(() => {
    if (isOpen) {
      setHintVisible(false);
      return;
    }

    const pool = isBn ? FLOATING_HINTS_BN : FLOATING_HINTS_EN;
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;
    let lastIndex = -1;

    const scheduleNext = (delayMs: number) => {
      showTimer = setTimeout(() => {
        let nextIdx = Math.floor(Math.random() * pool.length);
        if (nextIdx === lastIndex && pool.length > 1) {
          nextIdx = (nextIdx + 1) % pool.length;
        }
        lastIndex = nextIdx;
        setHintText(pool[nextIdx]);
        setHintVisible(true);

        hideTimer = setTimeout(() => {
          setHintVisible(false);
          const nextDelay = 9000 + Math.floor(Math.random() * 8000);
          scheduleNext(nextDelay);
        }, 5500);
      }, delayMs);
    };

    scheduleNext(3500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isOpen, isBn]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* ── FLOATING LAUNCHER BUTTON (hidden when drawer is open so it never overlaps the send button) ── */}
      {/* ── FLOATING AI LAUNCHER + PERIODIC HELPFUL HINT (hidden when drawer is open) ── */}
      {!isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: {
              xs: "calc(76px + var(--product-sticky-bar-height, 0px))",
              sm: "calc(76px + var(--product-sticky-bar-height, 0px))",
              md: "calc(22px + var(--product-sticky-bar-height, 0px))",
            },
            right: { xs: 14, sm: 22 },
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            transition: "bottom 220ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* Periodic Random Helpful Prompt Pill */}
          {hintText && (
            <Box
              component='button'
              type='button'
              onClick={() => {
                setHintVisible(false);
                setIsOpen(true);
              }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                maxWidth: { xs: 215, sm: 265 },
                px: 1.5,
                py: 0.9,
                borderRadius: "18px 18px 4px 18px",
                bgcolor: tokens.bgPanel,
                border: `1px solid ${tokens.primaryBorder}`,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
                color: tokens.textPrimary,
                fontSize: 12,
                fontWeight: 600,
                lineHeight: 1.35,
                textAlign: "left",
                cursor: "pointer",
                opacity: hintVisible ? 1 : 0,
                transform: hintVisible ? "translateX(0)" : "translateX(10px)",
                pointerEvents: hintVisible ? "auto" : "none",
                transition: "opacity 240ms ease, transform 240ms ease",
              }}
            >
              <AutoAwesomeRoundedIcon sx={{ fontSize: 15, color: tokens.primary, flexShrink: 0 }} />
              <span>{hintText}</span>
            </Box>
          )}

          {/* Unique Minimal M3 AI Squircle FAB */}
          <Box
            component='button'
            type='button'
            onClick={() => setIsOpen(true)}
            aria-label={isBn ? "AI শপিং অ্যাসিস্ট্যান্ট" : "Open AI Assistant"}
            sx={{
              position: "relative",
              width: 50,
              height: 50,
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${tokens.bgDark} 0%, #16302B 100%)`,
              color: "#5EEAD4",
              border: "1.5px solid rgba(0, 191, 166, 0.45)",
              boxShadow: "0 8px 24px rgba(0, 191, 166, 0.24), 0 4px 12px rgba(15, 23, 42, 0.18)",
              cursor: "pointer",
              flexShrink: 0,
              transition: "border-color 160ms ease, color 160ms ease",
              "&:hover": {
                borderColor: tokens.primary,
                color: "#FFFFFF",
              },
            }}
          >
            <AutoAwesomeRoundedIcon sx={{ fontSize: 22 }} />
            <Box
              component='span'
              sx={{
                position: "absolute",
                top: -3,
                right: -3,
                width: 11,
                height: 11,
                borderRadius: "50%",
                bgcolor: tokens.primary,
                border: `2px solid ${tokens.bgPanel}`,
              }}
            />
          </Box>
        </Box>
      )}

      {/* ── AI SHOPPING DRAWER (ZERO OVERLAP, GENERATIVE MINI PRODUCT CARDS & FOLLOW-UPS) ── */}
      <Drawer
        anchor='right'
        open={isOpen}
        onClose={() => setIsOpen(false)}
        disableScrollLock
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100%", sm: 420 },
              maxWidth: "100vw",
              height: "100dvh",
              overflow: "hidden !important",
              overflowY: "hidden !important",
              borderRadius: { xs: 0, sm: "24px 0 0 24px" },
              display: "flex",
              flexDirection: "column",
              bgcolor: tokens.bgSurfaceContainerLow,
              border: "none",
              boxShadow: "-16px 0 48px rgba(15, 23, 42, 0.12)",
            },
          },
        }}
      >
        {/* Minimal M3 Side Sheet Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            pt: 2.25,
            pb: 1.5,
            bgcolor: tokens.bgSurfaceContainerLow,
            flexShrink: 0,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: tokens.textPrimary,
                lineHeight: 1.2,
              }}
            >
              {isBn ? "উই গ্যাজেট AI" : "We Gadget AI"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.65, mt: 0.4 }}>
              <Typography sx={{ fontSize: 11.5, color: tokens.textMuted, lineHeight: 1 }}>
                {isBn ? "তাৎক্ষণিক স্টোর সহায়তা" : "Instant store assistance"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <IconButton
              component='a'
              href={getWhatsAppUrl()}
              target='_blank'
              rel='noopener noreferrer'
              size='small'
              title='WhatsApp'
              sx={{ color: "#16A34A", "&:hover": { bgcolor: "rgba(22, 163, 74, 0.08)" } }}
            >
              <WhatsAppIcon sx={{ fontSize: 17 }} />
            </IconButton>
            <IconButton
              component='a'
              href={getTelUrl()}
              size='small'
              title={`Call ${CONTACT_PHONE}`}
              sx={{ color: tokens.textSecondary, "&:hover": { bgcolor: tokens.bgSubtle } }}
            >
              <CallRoundedIcon sx={{ fontSize: 17 }} />
            </IconButton>
            {messages.length > 0 && (
              <IconButton
                size='small'
                onClick={() => {
                  setMessages([]);
                  setActiveProductContext(null);
                  activeProductContextRef.current = null;
                }}
                title={isBn ? "নতুন চ্যাট" : "New chat"}
                sx={{ color: tokens.textSecondary, "&:hover": { bgcolor: tokens.bgSubtle } }}
              >
                <RestartAltRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            )}
            <IconButton
              size='small'
              onClick={() => setIsOpen(false)}
              title={isBn ? "বন্ধ করুন" : "Close"}
              sx={{ color: tokens.textSecondary, "&:hover": { bgcolor: tokens.bgSubtle } }}
            >
              <CloseRoundedIcon sx={{ fontSize: 19 }} />
            </IconButton>
          </Box>
        </Box>

        {activeProductContext && (
          <Box
            sx={{
              mx: 2.5,
              mb: 1,
              px: 1.25,
              py: 0.75,
              borderRadius: "12px",
              bgcolor: tokens.primaryLight,
              border: `1px solid ${tokens.primaryBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              flexShrink: 0,
            }}
          >
            <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: 0.75 }}>
              <AutoAwesomeRoundedIcon sx={{ fontSize: 14, color: tokens.primaryDark, flexShrink: 0 }} />
              <Typography
                sx={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  color: tokens.primaryDark,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {activeProductContext.title}
              </Typography>
            </Box>
            <IconButton
              size='small'
              onClick={() => {
                setActiveProductContext(null);
                activeProductContextRef.current = null;
              }}
              aria-label={isBn ? "প্রোডাক্ট কনটেক্সট সরান" : "Clear product context"}
              sx={{ p: 0.25, color: tokens.primaryDark }}
            >
              <CloseRoundedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        )}

        {/* Scrollable Chat Body */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
            px: 2.5,
            py: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          {messages.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", pt: 1 }}>
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: tokens.textPrimary,
                    lineHeight: 1.2,
                    mb: 0.85,
                  }}
                >
                  {activeProductContext
                    ? isBn
                      ? "এই প্রোডাক্ট সম্পর্কে জানতে চান?"
                      : "Questions about this product?"
                    : isBn
                      ? "আজ কী ধরনের গ্যাজেট খুঁজছেন?"
                      : "How can we help you shop?"}
                </Typography>
                <Typography sx={{ fontSize: 13, color: tokens.textSecondary, lineHeight: 1.55 }}>
                  {activeProductContext
                    ? isBn
                      ? `${activeProductContext.title} সম্পর্কে স্পেকস, ওয়ারেন্টি বা ডেলিভারি নিয়ে জিজ্ঞেস করুন।`
                      : `Ask anything about ${activeProductContext.title} — specs, warranty, or alternatives.`
                    : isBn
                      ? "বাজেট, প্রয়োজন বা ডেলিভারি সম্পর্কে বাংলা, ইংরেজি বা বাংলিশে লিখুন।"
                      : "Ask by budget, use-case, or delivery policy in English, বাংলা, or Banglish."}
                </Typography>
              </Box>

              {/* M3 2x2 Tonal Bento Prompt Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1.25,
                }}
              >
                {(activeProductContext ? getProductQuickQuestions(isBn) : QUICK_QUESTIONS).map((item) => {
                  const IconComp = item.icon;
                  return (
                    <Box
                      key={item.label}
                      component='button'
                      type='button'
                      onClick={() => sendMessage(item.prompt)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 1.5,
                        p: 1.75,
                        borderRadius: "20px",
                        bgcolor: tokens.bgPanel,
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "12px",
                          bgcolor: tokens.bgSurfaceContainerLow,
                          color: tokens.primaryDark,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconComp sx={{ fontSize: 18 }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: tokens.textPrimary, lineHeight: 1.3, mb: 0.35 }}>
                          {item.label}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: tokens.textMuted, lineHeight: 1.3 }}>{item.sub}</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ) : (
            messages.map((msg, idx) => {
              const isLastModel = msg.role === "model" && idx === messages.length - 1;
              return (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: msg.role === "user" ? "84%" : "100%",
                      px: 1.85,
                      py: 1.25,
                      borderRadius: "20px",
                      bgcolor: msg.role === "user" ? tokens.bgDark : tokens.bgPanel,
                      color: msg.role === "user" ? tokens.textWhite : tokens.textPrimary,
                      border: "none",
                      fontSize: 13,
                      lineHeight: 1.55,
                      wordBreak: "break-word",
                      "& p": { m: 0, mb: 0.75, "&:last-child": { mb: 0 } },
                      "& ul, & ol": { m: 0, mb: 0.75, pl: 2.25, "&:last-child": { mb: 0 } },
                      "& li": { mb: 0.35, "&:last-child": { mb: 0 } },
                      "& strong": { fontWeight: 700 },
                    }}
                  >
                    {msg.role === "model" ? (
                      <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          a: ({ href = "", children }) => {
                            const isExternal = href.startsWith("http");
                            return isExternal ? (
                              <Box
                                component='a'
                                href={href}
                                target='_blank'
                                rel='noopener noreferrer'
                                sx={{
                                  color: tokens.primaryDark,
                                  fontWeight: 700,
                                  textDecoration: "underline",
                                  textUnderlineOffset: "2px",
                                }}
                              >
                                {children}
                              </Box>
                            ) : (
                              <Box
                                component={Link}
                                href={href || "/products"}
                                onClick={() => setIsOpen(false)}
                                sx={{
                                  color: tokens.primaryDark,
                                  fontWeight: 700,
                                  textDecoration: "underline",
                                  textUnderlineOffset: "2px",
                                }}
                              >
                                {children}
                              </Box>
                            );
                          },
                        }}
                      >
                        {msg.text}
                      </Markdown>
                    ) : (
                      msg.text
                    )}
                  </Box>

                  {/* Rich Mini Product Cards (Generative UI from tool calling) */}
                  {msg.role === "model" && msg.products && msg.products.length > 0 && (
                    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 0.85 }}>
                      {msg.products.map((p) => (
                        <AiMiniProductCard key={p.id} product={p} onNavigate={() => setIsOpen(false)} />
                      ))}
                    </Box>
                  )}

                  {/* Smart M3 Tonal Follow-up Chips */}
                  {isLastModel && !isLoading && msg.followUps && msg.followUps.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, pt: 0.5 }}>
                      {msg.followUps.map((chip) => (
                        <Box
                          key={chip}
                          component='button'
                          type='button'
                          onClick={() => sendMessage(chip)}
                          sx={{
                            px: 1.4,
                            py: 0.65,
                            borderRadius: "999px",
                            border: "none",
                            bgcolor: tokens.bgPanel,
                            color: tokens.textPrimary,
                            fontSize: 11.5,
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "background-color 150ms ease, color 150ms ease",
                            "&:hover": {
                              bgcolor: tokens.primaryLight,
                              color: tokens.primaryDark,
                            },
                          }}
                        >
                          {chip}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              );
            })
          )}

          {isLoading && (
            <Box
              sx={{
                alignSelf: "flex-start",
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.9,
                borderRadius: "14px 14px 14px 4px",
                bgcolor: tokens.bgPanel,
                border: `1px solid ${tokens.borderSubtle}`,
                color: tokens.textMuted,
                fontSize: 12.5,
                fontWeight: 500,
              }}
            >
              <CircularProgress size={14} sx={{ color: tokens.primary }} />
              <span>{isBn ? "গ্যাজেট খোঁজা হচ্ছে..." : "Searching catalog..."}</span>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* M3 Floating Pill Input Bar */}
        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{
            px: 2,
            pb: 2,
            pt: 1,
            bgcolor: tokens.bgSurfaceContainerLow,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pl: 2,
              pr: 0.75,
              py: 0.65,
              borderRadius: "28px",
              bgcolor: tokens.bgPanel,
              boxShadow: "0 2px 12px rgba(15, 23, 42, 0.05)",
            }}
          >
            <Box
              component='input'
              type='text'
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder={isBn ? "বাজেট বা গ্যাজেটের নাম লিখুন..." : "Ask in English, বাংলা, or Banglish..."}
              sx={{
                flex: 1,
                minWidth: 0,
                height: 36,
                border: "none",
                bgcolor: "transparent",
                outline: "none",
                fontSize: 13,
                fontFamily: "inherit",
                color: tokens.textPrimary,
                "&::placeholder": { color: tokens.textMuted, opacity: 1 },
              }}
            />
            <IconButton
              type='submit'
              disabled={isLoading || !input.trim()}
              aria-label='Send message'
              sx={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                bgcolor: tokens.bgDark,
                color: tokens.textWhite,
                flexShrink: 0,
                "&:hover": { bgcolor: tokens.primaryDark },
                "&.Mui-disabled": { bgcolor: tokens.bgSurfaceContainerHigh, color: tokens.textDisabled },
              }}
            >
              <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export default FloatingAiChat;
