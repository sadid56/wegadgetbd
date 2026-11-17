"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CompareArrowsRoundedIcon from "@mui/icons-material/CompareArrowsRounded";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const QUICK_PROMPTS = [
  {
    label: "Recommend a gadget",
    prompt: "Recommend the best popular gadgets for everyday use from your store.",
    icon: ShoppingBagOutlinedIcon,
  },
  {
    label: "Compare products",
    prompt: "Compare your top cleaning or power gadgets and help me choose.",
    icon: CompareArrowsRoundedIcon,
  },
  {
    label: "Find budget options",
    prompt: "What are the best budget gadgets under ৳1500 right now?",
    icon: SavingsOutlinedIcon,
  },
  {
    label: "Best for winter",
    prompt: "Which gadgets are best for winter comfort or lint removal?",
    icon: AcUnitRoundedIcon,
  },
] as const;

function RobotAvatarSvg() {
  return (
    <svg width="78" height="72" viewBox="0 0 88 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="botHeadGrad" x1="16" y1="8" x2="72" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DDE2FF" />
        </linearGradient>
        <linearGradient id="botEarGrad" x1="0" y1="24" x2="0" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#5B3DF5" />
        </linearGradient>
        <linearGradient id="botVisorGrad" x1="22" y1="26" x2="66" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#141936" />
          <stop offset="100%" stopColor="#090D21" />
        </linearGradient>
      </defs>

      {/* Top Antenna */}
      <line x1="44" y1="14" x2="44" y2="6" stroke="#7C5CFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="5" r="4" fill="#6D4AFF" />

      {/* Left & Right Headphones */}
      <rect x="7" y="28" width="11" height="24" rx="5.5" fill="url(#botEarGrad)" />
      <rect x="70" y="28" width="11" height="24" rx="5.5" fill="url(#botEarGrad)" />

      {/* Main Head */}
      <rect x="15" y="14" width="58" height="50" rx="24" fill="url(#botHeadGrad)" stroke="#C7D2FE" strokeWidth="1.5" />

      {/* Dark Visor */}
      <rect x="23" y="26" width="42" height="25" rx="12" fill="url(#botVisorGrad)" />

      {/* Cute Glowing Eyes */}
      <rect x="31" y="34" width="7" height="9" rx="3.5" fill="#67E8F9" />
      <rect x="50" y="34" width="7" height="9" rx="3.5" fill="#67E8F9" />
      <circle cx="33.5" cy="36.5" r="1.4" fill="#FFFFFF" />
      <circle cx="52.5" cy="36.5" r="1.4" fill="#FFFFFF" />

      {/* Cute Smile */}
      <path d="M39 45.5C41 47.5 47 47.5 49 45.5" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" />

      {/* Subtle Shoulder */}
      <path d="M26 66C26 61.5 34 59 44 59C54 59 62 61.5 62 66V74H26V66Z" fill="url(#botHeadGrad)" />
    </svg>
  );
}

function renderMessageWithLinks(text: string) {
  const linkRegex = /\[([^\]]+)\]\((\/[^\s)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const label = match[1];
    const href = match[2];
    parts.push(
      <Box
        key={`${href}-${match.index}`}
        component={Link}
        href={href}
        sx={{
          color: "#5B3DF5",
          fontWeight: 700,
          textDecoration: "underline",
          textUnderlineOffset: "2px",
          "&:hover": { color: "#4328D4" },
        }}
      >
        {label}
      </Box>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function HeroAiBot() {
  const [isOpen, setIsOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const nextHistory = [...messages, { role: "user" as const, text: trimmed }];
    setMessages(nextHistory);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages,
        }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: data.reply || "Sorry, I couldn't get a response right now.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Network error! Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Box sx={{ display: "flex", justifyContent: { xs: "center", lg: "flex-end" } }}>
        <Box
          component="button"
          type="button"
          onClick={() => setIsOpen(true)}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1.25,
            px: 2.25,
            py: 1.25,
            borderRadius: "9999px",
            bgcolor: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.95)",
            boxShadow: "0 14px 35px rgba(91, 61, 245, 0.16)",
            cursor: "pointer",
            color: "#1E1B4B",
            fontWeight: 700,
            fontSize: 13.5,
            transition: "transform 160ms ease, box-shadow 160ms ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 18px 40px rgba(91, 61, 245, 0.22)",
            },
          }}
        >
          <AutoAwesomeRoundedIcon sx={{ fontSize: 18, color: "#5B3DF5" }} />
          <span>Ask AI Companion</span>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: { xs: 340, sm: 320, lg: 285 },
        mx: { xs: "auto", lg: 0 },
        ml: { lg: "auto" },
        pt: 5.5,
      }}
    >
      {/* Speech Bubble + Cute Robot Head peeking at top */}
      <Box
        sx={{
          position: "absolute",
          top: -12,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          px: 1,
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        <Box
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.96)",
            backdropFilter: "blur(12px)",
            borderRadius: "14px",
            px: 1.5,
            py: 0.9,
            boxShadow: "0 8px 24px rgba(79, 70, 229, 0.12)",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            maxWidth: 168,
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#1E1B4B", lineHeight: 1.2 }}>
            Hello! 👋
          </Typography>
          <Typography sx={{ fontSize: 10.5, fontWeight: 500, color: "#64748B", lineHeight: 1.3, mt: 0.2 }}>
            How can I help you today?
          </Typography>
        </Box>

        <Box sx={{ mr: 2.5, mt: -0.5, filter: "drop-shadow(0 10px 18px rgba(91, 61, 245, 0.2))" }}>
          <RobotAvatarSvg />
        </Box>
      </Box>

      {/* Main Glassmorphic Bot Card */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          bgcolor: "rgba(255, 255, 255, 0.90)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "22px",
          border: "1px solid rgba(255, 255, 255, 0.95)",
          boxShadow: "0 22px 50px rgba(79, 70, 229, 0.14)",
          p: 1.75,
          pt: 2.75,
        }}
      >
        {/* Top Controls (Reset when chatting + Close X) */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            alignItems: "center",
            gap: 0.25,
          }}
        >
          {messages.length > 0 && (
            <IconButton
              size="small"
              onClick={() => setMessages([])}
              title="Reset chat"
              sx={{ color: "#64748B", p: 0.5, "&:hover": { color: "#5B3DF5" } }}
            >
              <RestartAltRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => setIsOpen(false)}
            aria-label="Close AI assistant"
            sx={{ color: "#64748B", p: 0.5, "&:hover": { color: "#0F172A" } }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {/* Body: Quick Prompts OR Live Gemini Chat */}
        {messages.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.9, mb: 1.5, mt: 0.5 }}>
            {QUICK_PROMPTS.map((item) => {
              const IconComp = item.icon;
              return (
                <Box
                  key={item.label}
                  component="button"
                  type="button"
                  onClick={() => sendMessage(item.prompt)}
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    px: 1.35,
                    py: 1,
                    borderRadius: "12px",
                    bgcolor: "rgba(255, 255, 255, 0.85)",
                    border: "1px solid #E8ECFF",
                    cursor: "pointer",
                    color: "#1E293B",
                    transition: "all 150ms ease",
                    "&:hover": {
                      bgcolor: "#F5F3FF",
                      borderColor: "#C4B5FD",
                      transform: "translateX(2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                    <IconComp sx={{ fontSize: 16, color: "#475569", flexShrink: 0 }} />
                    <Typography
                      sx={{
                        fontSize: 12.2,
                        fontWeight: 600,
                        color: "#1E293B",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                  <ArrowForwardRoundedIcon sx={{ fontSize: 14, color: "#5B3DF5", flexShrink: 0 }} />
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box
            ref={scrollRef}
            sx={{
              height: 196,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mb: 1.5,
              mt: 0.75,
              pr: 0.5,
              "&::-webkit-scrollbar": { width: 4 },
              "&::-webkit-scrollbar-thumb": { bgcolor: "#CBD5E1", borderRadius: 2 },
            }}
          >
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "90%",
                  px: 1.35,
                  py: 0.9,
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  bgcolor: msg.role === "user" ? "#5B3DF5" : "#F1F5F9",
                  color: msg.role === "user" ? "#FFFFFF" : "#0F172A",
                  fontSize: 12,
                  lineHeight: 1.45,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {msg.role === "model" ? renderMessageWithLinks(msg.text) : msg.text}
              </Box>
            ))}
            {isLoading && (
              <Box
                sx={{
                  alignSelf: "flex-start",
                  px: 1.35,
                  py: 0.8,
                  borderRadius: "14px 14px 14px 4px",
                  bgcolor: "#F1F5F9",
                  color: "#64748B",
                  fontSize: 11.5,
                  fontWeight: 600,
                }}
              >
                Thinking...
              </Box>
            )}
          </Box>
        )}

        {/* Bottom Input Bar */}
        <Box
          component="form"
          onSubmit={(e: React.FormEvent) => {
            e.preventDefault();
            sendMessage(input);
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            bgcolor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "9999px",
            pl: 1.5,
            pr: 0.5,
            py: 0.45,
            boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
          }}
        >
          <Box
            component="input"
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={isLoading}
            sx={{
              flex: 1,
              minWidth: 0,
              border: "none",
              outline: "none",
              bgcolor: "transparent",
              fontSize: 12.2,
              fontWeight: 500,
              color: "#0F172A",
              "&::placeholder": { color: "#94A3B8" },
            }}
          />
          <IconButton
            type="submit"
            disabled={isLoading || !input.trim()}
            size="small"
            sx={{
              width: 28,
              height: 28,
              bgcolor: "#5B3DF5",
              color: "#FFFFFF",
              flexShrink: 0,
              "&:hover": { bgcolor: "#4C2EE0" },
              "&.Mui-disabled": { bgcolor: "#C7D2FE", color: "#FFFFFF" },
            }}
          >
            <ArrowForwardRoundedIcon sx={{ fontSize: 15 }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
