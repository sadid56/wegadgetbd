"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const HELP_PROMPTS = [
  {
    label: "Recommend a gadget",
    prompt: "Recommend the best popular gadgets available right now.",
    icon: ShoppingBagOutlinedIcon,
  },
  {
    label: "Delivery & COD info",
    prompt: "What are the delivery charges and Cash on Delivery policy?",
    icon: LocalShippingOutlinedIcon,
  },
  {
    label: "Best budget options",
    prompt: "What are your best budget gadgets under ৳1500?",
    icon: SavingsOutlinedIcon,
  },
  {
    label: "Contact support",
    prompt: "How can I contact We Gadget BD directly for order help?",
    icon: SupportAgentRoundedIcon,
  },
] as const;

function MiniBotIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 88 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="floatBotHead" x1="16" y1="8" x2="72" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#DDE2FF" />
        </linearGradient>
        <linearGradient id="floatBotEar" x1="0" y1="24" x2="0" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#5B3DF5" />
        </linearGradient>
        <linearGradient id="floatBotVisor" x1="22" y1="26" x2="66" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#141936" />
          <stop offset="100%" stopColor="#090D21" />
        </linearGradient>
      </defs>
      <line x1="44" y1="14" x2="44" y2="6" stroke="#7C5CFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="5" r="4" fill="#6D4AFF" />
      <rect x="7" y="28" width="11" height="24" rx="5.5" fill="url(#floatBotEar)" />
      <rect x="70" y="28" width="11" height="24" rx="5.5" fill="url(#floatBotEar)" />
      <rect x="15" y="14" width="58" height="50" rx="24" fill="url(#floatBotHead)" stroke="#C7D2FE" strokeWidth="1.5" />
      <rect x="23" y="26" width="42" height="25" rx="12" fill="url(#floatBotVisor)" />
      <rect x="31" y="34" width="7" height="9" rx="3.5" fill="#67E8F9" />
      <rect x="50" y="34" width="7" height="9" rx="3.5" fill="#67E8F9" />
      <path d="M39 45.5C41 47.5 47 47.5 49 45.5" stroke="#67E8F9" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function renderMessageWithLinks(text: string) {
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
          component="a"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: "#5B3DF5",
            fontWeight: 700,
            textDecoration: "underline",
            textUnderlineOffset: "2px",
          }}
        >
          {label}
        </Box>
      ) : (
        <Box
          key={`${href}-${match.index}`}
          component={Link}
          href={href}
          sx={{
            color: "#5B3DF5",
            fontWeight: 700,
            textDecoration: "underline",
            textUnderlineOffset: "2px",
          }}
        >
          {label}
        </Box>
      )
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function FloatingAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: messages }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        { role: "model", text: data.reply || "Sorry, I couldn't get a response right now." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Network error! You can also reach us directly at 01739859756." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "fixed",
        bottom: { xs: 16, sm: 22 },
        right: { xs: 16, sm: 22 },
        zIndex: 1300,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      {/* Smooth Expanding Popup Card */}
      <Box
        sx={{
          width: { xs: "calc(100vw - 32px)", sm: 360 },
          maxWidth: 360,
          bgcolor: "#FFFFFF",
          borderRadius: "22px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
          overflow: "hidden",
          display: isOpen ? "flex" : "flex",
          flexDirection: "column",
          transformOrigin: "bottom right",
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.85) translateY(16px)",
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          pointerEvents: isOpen ? "auto" : "none",
          mb: isOpen ? 1.5 : 0,
          position: isOpen ? "relative" : "absolute",
          bottom: isOpen ? "auto" : 68,
          right: isOpen ? "auto" : 0,
          transition:
            "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, visibility 220ms ease",
        }}
      >
          {/* Header */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #5B3DF5 0%, #7C5CFF 100%)",
              color: "#FFFFFF",
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "12px",
                  bgcolor: "rgba(255, 255, 255, 0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MiniBotIcon size={30} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 13.5, fontWeight: 800, lineHeight: 1.2 }}>
                  We Gadget BD Help
                </Typography>
                <Typography sx={{ fontSize: 11, color: "rgba(255, 255, 255, 0.85)", mt: 0.2 }}>
                  AI Assistant & Direct Support
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
              {messages.length > 0 && (
                <IconButton
                  size="small"
                  onClick={() => setMessages([])}
                  title="Reset chat"
                  sx={{ color: "rgba(255,255,255,0.85)", "&:hover": { color: "#FFFFFF" } }}
                >
                  <RestartAltRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                aria-label="Close help chat"
                sx={{ color: "rgba(255,255,255,0.85)", "&:hover": { color: "#FFFFFF" } }}
              >
                <CloseRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>

          {/* Direct Contact Strip */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              px: 1.75,
              py: 1,
              bgcolor: "#F8FAFC",
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            <Box
              component="a"
              href="tel:01739859756"
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.6,
                py: 0.65,
                px: 1,
                borderRadius: "8px",
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                color: "#0F172A",
                fontSize: 11.5,
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { borderColor: "#5B3DF5", color: "#5B3DF5" },
              }}
            >
              <CallRoundedIcon sx={{ fontSize: 14, color: "#5B3DF5" }} />
              <span>01739859756</span>
            </Box>
            <Box
              component="a"
              href="https://wa.me/8801739859756"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.6,
                py: 0.65,
                px: 1,
                borderRadius: "8px",
                bgcolor: "#ECFDF5",
                border: "1px solid #A7F3D0",
                color: "#047857",
                fontSize: 11.5,
                fontWeight: 700,
                textDecoration: "none",
                "&:hover": { bgcolor: "#D1FAE5" },
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 15 }} />
              <span>WhatsApp</span>
            </Box>
          </Box>

          {/* Body */}
          <Box sx={{ p: 1.75 }}>
            {messages.length === 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.9, mb: 1.5 }}>
                <Typography sx={{ fontSize: 12, color: "#64748B", mb: 0.25 }}>
                  Hello! 👋 Ask anything about gadgets, orders, or contact us directly above:
                </Typography>
                {HELP_PROMPTS.map((item) => {
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
                        py: 0.95,
                        borderRadius: "12px",
                        bgcolor: "#FFFFFF",
                        border: "1px solid #E8ECFF",
                        cursor: "pointer",
                        color: "#1E293B",
                        transition: "all 150ms ease",
                        "&:hover": {
                          bgcolor: "#F5F3FF",
                          borderColor: "#C4B5FD",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconComp sx={{ fontSize: 16, color: "#5B3DF5" }} />
                        <Typography sx={{ fontSize: 12.2, fontWeight: 600, color: "#1E293B" }}>
                          {item.label}
                        </Typography>
                      </Box>
                      <ArrowForwardRoundedIcon sx={{ fontSize: 14, color: "#5B3DF5" }} />
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Box
                ref={scrollRef}
                sx={{
                  height: 240,
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mb: 1.5,
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
                      maxWidth: "88%",
                      px: 1.4,
                      py: 0.95,
                      borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      bgcolor: msg.role === "user" ? "#5B3DF5" : "#F1F5F9",
                      color: msg.role === "user" ? "#FFFFFF" : "#0F172A",
                      fontSize: 12.5,
                      lineHeight: 1.5,
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
                      px: 1.4,
                      py: 0.85,
                      borderRadius: "14px 14px 14px 4px",
                      bgcolor: "#F1F5F9",
                      color: "#64748B",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    Thinking...
                  </Box>
                )}
              </Box>
            )}

            {/* Input */}
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
                bgcolor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "9999px",
                pl: 1.5,
                pr: 0.5,
                py: 0.45,
                "&:focus-within": { borderColor: "#5B3DF5", bgcolor: "#FFFFFF" },
              }}
            >
              <Box
                component="input"
                type="text"
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                placeholder="Ask anything or get help..."
                disabled={isLoading}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  border: "none",
                  outline: "none",
                  bgcolor: "transparent",
                  fontSize: 12.5,
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
                  width: 30,
                  height: 30,
                  bgcolor: "#5B3DF5",
                  color: "#FFFFFF",
                  "&:hover": { bgcolor: "#4C2EE0" },
                  "&.Mui-disabled": { bgcolor: "#C7D2FE", color: "#FFFFFF" },
                }}
              >
                <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

      {/* Circular Floating Help Button (No Phone Number by Default) */}
      <Box
        component="button"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close AI Help" : "Open AI Help"}
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #5B3DF5 0%, #7C5CFF 100%)",
          color: "#FFFFFF",
          border: "2.5px solid rgba(255, 255, 255, 0.95)",
          boxShadow: "0 12px 30px rgba(91, 61, 245, 0.34)",
          cursor: "pointer",
          transition: "transform 180ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 180ms ease",
          "&:hover": {
            transform: "translateY(-2px) scale(1.06)",
            boxShadow: "0 16px 38px rgba(91, 61, 245, 0.44)",
          },
          "&:active": {
            transform: "scale(0.96)",
          },
        }}
      >
        {isOpen ? <CloseRoundedIcon sx={{ fontSize: 24 }} /> : <MiniBotIcon size={34} />}
      </Box>
    </Box>
  );
}
